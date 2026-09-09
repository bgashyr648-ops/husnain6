//---------------------------------------------------------------------------
//           𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃 - RANDOM INSTAGRAM/STATUS VIDEO COMMAND (.dj)
//---------------------------------------------------------------------------

const { cmd } = require('../command');

// Hardcoded list of direct HD video/reel links so it never fails or asks for tokens
const directVideoUrls = [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
];

cmd({
    pattern: "d",
    alias: ["v", "mujra", "insta", "ig"],
    desc: "Fetch random video automatically instantly",
    category: "downloader",
    react: "🎥",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Automatically pick a random video link from the list
        const randomVideoUrl = directVideoUrls[Math.floor(Math.random() * directVideoUrls.length)];

        const finalCaption = `╭───────────────◆
│ 📌 *Status:* Random Viral Video
╰───────────────◆

> 🤖 *𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃 Bot HD Video*
> 👑 *Owner:* 𓆩 𝛭𝑅 𝑅𝛯𝛨𝛥𝜨 𓆪`;

        // Send the video directly to WhatsApp instantly
        await conn.sendMessage(from, {
            video: { url: randomVideoUrl },
            caption: finalCaption
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error occurred while sending the video!");
    }
});
