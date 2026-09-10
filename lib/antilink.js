const config = require('../config');

const DEBUG = true;

function log(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

function errorLog(...args) {
    if (DEBUG) {
        console.error(...args);
    }
}

async function getGroupMetadataSafe(conn, groupId) {
    try {
        if (!conn || !groupId) return null;
        if (!groupId.endsWith("@g.us")) return null;
        const metadata = await conn.groupMetadata(groupId);
        return metadata;
    } catch (err) {
        errorLog("Error in getGroupMetadataSafe:", err.message);
        return null;
    }
}

const containsHttpLink = (text) => {
    if (!text || typeof text !== 'string') return false;
    const patterns = [ 
        /(https?:\/\/)?(www\.)?chat\.whatsapp\.com\/[a-zA-Z0-9]+/gi,
        /(https?:\/\/)?(www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9/]+/gi
    ];
    return patterns.some(pattern => pattern.test(text));
};

const getCleanJid = (jid) => {
    if (!jid) return "";
    return jid.split(":")[0].split("@")[0] + "@s.whatsapp.net";
};

let warnDB = {};

setInterval(() => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    for (const group in warnDB) {
        for (const user in warnDB[group]) {
            if (warnDB[group][user].timestamp < oneDayAgo) {
                delete warnDB[group][user];
            }
        }
        if (Object.keys(warnDB[group]).length === 0) {
            delete warnDB[group];
        }
    }
}, 60 * 60 * 1000);

module.exports = async function AntiLink(conn, mek, userConfig) {
    try {
        if (!conn || !conn.user || !mek || !mek.message || !mek.key) return;

        const from = mek.key.remoteJid;
        if (!from || !from.endsWith("@g.us")) return;

        log(`[AntiLink] Triggered for group: ${from}`);

        if (userConfig.ANTI_LINK !== "true") {
            log("[AntiLink] ANTI_LINK is not enabled in config.");
            return;
        }

        const body = (() => {
            try {
                if (mek.message?.conversation) return mek.message.conversation;
                if (mek.message?.extendedTextMessage?.text) return mek.message.extendedTextMessage.text;
                if (mek.message?.imageMessage?.caption) return mek.message.imageMessage.caption;
                if (mek.message?.videoMessage?.caption) return mek.message.videoMessage.caption;
                if (mek.message?.documentMessage?.caption) return mek.message.documentMessage.caption;
                const msgType = Object.keys(mek.message)[0];
                if (msgType && mek.message[msgType]?.text) return mek.message[msgType].text;
                if (msgType && mek.message[msgType]?.caption) return mek.message[msgType].caption;
            } catch (e) { return ""; }
            return "";
        })();

        log(`[AntiLink] Message body: "${body}"`);

        if (!containsHttpLink(body)) {
            log("[AntiLink] No link detected in message.");
            return;
        }

        log("[AntiLink] Link detected! Checking permissions...");

        const groupMetadata = await getGroupMetadataSafe(conn, from);
        if (!groupMetadata) {
            log("[AntiLink] Failed to fetch group metadata.");
            return;
        }

        const rawSender = mek.key.participantAlt || mek.participant || (mek.key.fromMe ? conn.user.id : "") || "";
        if (!rawSender) {
            log("[AntiLink] Could not determine sender.");
            return;
        }
        const sender = getCleanJid(rawSender);
        const senderPN = sender.split("@")[0];

        const botNumber = getCleanJid(conn.user.id);
        const botPN = botNumber.split("@")[0];

        const groupAdmins = groupMetadata.participants
            .filter(p => p.admin === "admin" || p.admin === "superadmin")
            .map(p => getCleanJid(p.phoneNumber).split("@")[0]);

        log(`[AntiLink] Sender: ${sender} (PN: ${senderPN})`);
        log(`[AntiLink] Bot Number: ${botNumber} (PN: ${botPN})`);
        log(`[AntiLink] Group Admins:`, groupAdmins);

        const isBotAdmin = groupAdmins.includes(botPN);
        const isSenderAdmin = groupAdmins.includes(senderPN);

        log(`[AntiLink] Is Bot Admin? ${isBotAdmin}`);
        log(`[AntiLink] Is Sender Admin? ${isSenderAdmin}`);

        if (!isBotAdmin) {
            log("[AntiLink] Bot is not an admin. Cannot take action.");
            return;
        }

        if (isSenderAdmin) {
            log("[AntiLink] Sender is an admin. Skipping action.");
            return;
        }

        const action = "kick"; //(userConfig.ANTI_LINK_ACTION || //"warn").toLowerCase();
        log(`[AntiLink] Action configured: ${action}`);

        const deleteMessage = async () => {
            try {
                log("[AntiLink] Attempting to delete message...");
                await conn.sendMessage(from, { delete: mek.key });
                log("[AntiLink] Message deleted successfully.");
            } catch (err) { errorLog("❌ Delete failed:", err); }
        };

        const sendNotification = async (text) => {
            try {
                await conn.sendMessage(from, { text: text, mentions: [sender] });
            } catch (err) { errorLog("❌ Notification send failed:", err); }
        };

        switch(action) {
            case "kick":
                await deleteMessage();
                try {
                    log(`[AntiLink] Attempting to kick user: ${sender}`);
                    await conn.groupParticipantsUpdate(from, [sender], "remove");
                    await sendNotification(`🚫 @${senderPN} Links are not allowed! User removed.`);
                    log(`[AntiLink] User ${sender} kicked successfully.`);
                } catch (err) { 
                    errorLog(`[AntiLink] Kick failed:`, err);
                    await sendNotification(`❌ Failed to remove @${senderPN}.`); 
                }
                break;
            case "warn":
                if (!warnDB[from]) warnDB[from] = {};
                if (!warnDB[from][sender]) warnDB[from][sender] = { count: 0, timestamp: Date.now() };
                warnDB[from][sender].count += 1;
                warnDB[from][sender].timestamp = Date.now();
                const warns = warnDB[from][sender].count;
                log(`[AntiLink] Warning count for ${sender}: ${warns}/3`);
                await deleteMessage();
                if (warns < 3) {
                    await sendNotification(`⚠️ @${senderPN} Links are not allowed! Warning ${warns}/3`);
                } else {
                    try {
                        log(`[AntiLink] Max warnings reached. Attempting to kick user: ${sender}`);
                        await conn.groupParticipantsUpdate(from, [sender], "remove");
                        await sendNotification(`🚫 @${senderPN} Max warnings reached. User removed.`);
                        warnDB[from][sender].count = 0;
                        log(`[AntiLink] User ${sender} kicked successfully after max warnings.`);
                    } catch (err) { 
                        errorLog(`[AntiLink] Kick failed after max warnings:`, err);
                        await sendNotification(`❌ Failed to remove @${senderPN}.`); 
                    }
                }
                break;
            default:
                await deleteMessage();
                await sendNotification(`⚠️ @${senderPN} Links are not allowed in this group!`);
        }
    } catch (err) {
        errorLog("❌ AntiLink System Error:", err);
    }
};