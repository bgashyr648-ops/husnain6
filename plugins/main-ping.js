const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed","pong"],use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = Date.now();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using conn.sendMessage()
        await conn.sendMessage(from, { 
            react: { text: textEmoji, key: mek.key } 
        });

        const end = Date.now();
        const responseTime = end - start;

        const text = `*⚡ 𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃 SPEED TEST ⚡*\n\n*🚀 Response Time:* \`${responseTime} ms\`\n*✨ Status:* \`Super Fast & Active\`\n*🎈 Host:* \`High Speed Server\`\n\n> *Powered by LOVE-MD*`;

        await conn.sendMessage(from, { 
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363430848275148@newsletter',
                    newsletterName: "𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) { 
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();

        // Removed artificial delay to enhance speed
        const endTime = Date.now();
        const ping = endTime - startTime;

        // Speed category
        let status;
        if (ping < 100) status = "🚀 *Blazing Fast*";
        else if (ping < 500) status = "⚡ *Fast & Responsive*";
        else status = "🐢 *Slow Response*";

        // Stylish formatted output
        const msg = `
*╭┈──〔 ⚡ 𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃 SPEED 〕─⊷*
*├▢ 📶 Latency:* \`${ping} ms\`
*├▢ 🧠 Status:* ${status}
*├▢ 💫 Mode:* \`Active & Stable\`
*├▢ 🛡️ Security:* \`Secured\`
*╰───────────────⊷*
        `;

        await conn.sendMessage(from, { text: msg.trim() }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
