const { cmd } = require('../command');
const util = require('util');
const axios = require('axios');
const fs = require('fs');

cmd({
    pattern: "eval",
    desc: "Execute JavaScript code (Developer only)",
    category: "owner",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, {
    from, args, q, reply, react,
    isGroup, isOwner, isSudo, isMe, isCreator,
    isAdmins, isBotAdmins, sender, senderNumber,
    botNumber, botNumber2, pushname, groupName,
    groupAdmins, participants, userConfig, updateUserConfig
}) => {
    try {
        if (!q) return reply("Please provide JavaScript code to evaluate.\nExample: `.eval 1 + 2` or `.eval conn`");

        // Local variables to make them accessible in eval scope
        const text = q;
        const quoted = m.quoted || null;
        const mentioned = m.mentionedJid || [];
        const mentionedJid = m.mentionedJid || [];
        const isAdmin = isAdmins;
        const isBotAdmin = isBotAdmins;
        const botJid = botNumber;
        const number = botNumber2;
        const pushName = pushname || m.pushName || 'User';

        let evaled;
        const code = q.trim();
        
        if (code.includes('await')) {
            evaled = await eval(`(async () => { ${code} })()`);
        } else {
            evaled = eval(code);
        }

        if (typeof evaled !== 'string') {
            evaled = util.inspect(evaled, { depth: 2 });
        }

        await reply(`*Result:*\n\`\`\`javascript\n${evaled}\n\`\`\``);
    } catch (err) {
        await react("❌");
        await reply(`*Error:*\n\`\`\`text\n${err.message || err}\n\`\`\``);
    }
});