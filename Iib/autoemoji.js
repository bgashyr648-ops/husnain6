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

function getFirstEmoji(text) {
    if (!text || typeof text !== 'string') return null;
    try {
        const allMatches = text.match(/\p{Emoji_Presentation}/gu) || text.match(/\p{Emoji}/gu);
        if (allMatches) {
            for (const char of allMatches) {
                if (!/^[0-9#*+-\s\w$,.?!@%^&*()]+$/.test(char)) {
                    return char;
                }
            }
        }
    } catch (e) {
        const fallbackRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
        const fallbackMatches = text.match(fallbackRegex);
        if (fallbackMatches) return fallbackMatches[0];
    }
    return null;
}

module.exports = async function AutoEmoji(conn, mek, userConfig) {
    try {
        if (!conn || !conn.user || !mek || !mek.message || !mek.key) return;

        const from = mek.key.remoteJid;
        if (!from) return;

        const isGroup = from.endsWith("@g.us");
        const isPrivate = from.endsWith("@s.whatsapp.net");
        if (!isGroup && !isPrivate) return;

        log(`[AutoEmoji] Triggered for chat: ${from}`);

      /*  if (userConfig.AUTO_EMOJI !== "true") {
            log("[AutoEmoji] AUTO_EMOJI is not enabled in config.");
            return;
        }

        if (mek.key.fromMe) {
            log("[AutoEmoji] Message is from self. Skipping.");
            return;
        }
*/
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

        if (!body) {
            log("[AutoEmoji] Message body is empty.");
            return;
        }

        log(`[AutoEmoji] Message body: "${body}"`);

        const detectedEmoji = getFirstEmoji(body);
        if (!detectedEmoji) {
            log("[AutoEmoji] No emoji detected in the message.");
            return;
        }

        log(`[AutoEmoji] Detected emoji: "${detectedEmoji}". Reacting to message...`);

        await conn.sendMessage(from, {
            react: {
                text: detectedEmoji,
                key: mek.key
            }
        });

        log(`[AutoEmoji] Successfully reacted with "${detectedEmoji}".`);
    } catch (err) {
        errorLog("❌ AutoEmoji System Error:", err);
    }
};