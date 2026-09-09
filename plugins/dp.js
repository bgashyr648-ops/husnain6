const { cmd } = require('../command');

cmd({
    pattern: "getpp",
    desc: "Number likh kar DP download karein.",
    category: "general",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    // Check agar number dia gaya hai
    let input = args[0];
    if (!input) return reply("*Bhai, koi number toh likho! Maslan: .getpp 923001234567*");

    // Number ko format karna
    let number = input.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
    
    try {
        let ppUrl = await conn.profilePictureUrl(number, 'image');
        await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: "*Love MD - Profile Pic Downloaded*" }, { quoted: mek });
    } catch (e) {
        reply("*Bhai, ya toh number galat hai ya phir uski DP private hai.*");
    }
});
