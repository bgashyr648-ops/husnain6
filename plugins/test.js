//---------------------------------------------------------------------------
// LOVE-MD - YTMP3 DOWNLOADER COMMAND
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');
const ytSearch = require('yt-search'); // <-- naya package

// ============================================
// COMMAND: ytmp3
// ============================================
cmd({
    pattern: "ytmp3",
    alias: ["ytaudio", "song"],
    desc: "Download audio from a YouTube URL or Search Query",
    category: "downloader",
    react: "🎵",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("❌ Please provide a YouTube URL or Song Name.\n\nExample:.ytmp3 dard dilon ke");
        }

        await reply("⏳ Searching & Fetching audio, please wait...");

        let videoUrl = q;
        const urlRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;

        // 1. Agar link nahi hai to yt-search se search karo
        if (!urlRegex.test(q)) {
            const searchResult = await ytSearch(q);
            if (!searchResult.videos.length) {
                return reply("❌ No results found for: " + q);
            }
            videoUrl = searchResult.videos[0].url; // pehla result lelo
            await reply(`🔎 Found: *${searchResult.videos[0].title}*\nDownloading now...`);
        }

        const apiUrl = `https://bandaheali-apis.netlify.app/api/downloader/ytmp3?url=${encodeURIComponent(videoUrl)}&key=bandaheali`;

        const { data } = await axios.get(apiUrl);

        if (!data ||!data.status ||!data.result) {
            return reply("❌ Failed to fetch audio. Please try again later.");
        }

        const { title, audio_url, thumbnail, duration, author } = data.result;

        const caption = `🎵 *YouTube Audio Downloader*\n\n` +
            `📌 *Title:* ${title}\n` +
            `👤 *Author:* ${author}\n` +
            `⏱️ *Duration:* ${duration}\n\n` +
            `> Powered By Love-MD`;

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: audio_url },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ytmp3 command:", e);
        reply("❌ Error occurred while downloading audio!");
    }
});
