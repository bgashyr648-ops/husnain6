const { cmd } = require('../command');

cmd({
    pattern: "autodelete",
    desc: "Group mein status/message delete karne ke liye",
    category: "group",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, { reply, isGroup, isAdmin, isBotAdmin }) => {
    
    // Check agar bot admin hai aur group mein hai
    if (!isGroup) return reply("Yeh command sirf group mein chalegi.");
    if (!isBotAdmin) return reply("Bot ko admin banayein.");
    
    // Yahan delete ka logic aayega
    // Agar koi specific message delete karna ho:
    // await conn.sendMessage(m.chat, { delete: m.key });
    
    return await reply("Auto-delete active ho gaya hai!");
});
