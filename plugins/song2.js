//---------------------------------------------------------------------------
//           LOVE-MD - SONG2 (Direct Audio, No Selection)
//---------------------------------------------------------------------------

const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

const API_BASE = "https://bandaheali-apis.netlify.app/api/downloader";

// Helper to extract YouTube video ID
function getVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
}

// ============================================
// COMMAND: song2 (Direct Audio Download)
// ============================================
cmd({
    pattern: "song2",
    alias: ["yt2", "ytdl2"],
    desc: "Download YouTube audio directly (bandaheali-apis)",
    category: "download",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (!text) return reply("🎶 Please provide a YouTube video name or link.\n\nExample: `.song2 Alone - Alan Walker`");

        let vid = null;

        if (text.startsWith('http://') || text.startsWith('https://')) {
            if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
                return reply("❌ Please provide a valid YouTube URL!");
            }
            const videoId = getVideoId(text);
            if (!videoId) return reply("❌ Invalid YouTube URL!");
            vid = await yts({ videoId: videoId });
        } else {
            const search = await yts(text);
            if (!search.videos || !search.videos.length) {
                return reply("❌ No results found!");
            }
            vid = search.videos[0];
        }

        if (!vid) return reply("❌ No results found!");

        await conn.sendMessage(from, { 
            image: { url: vid.thumbnail },
            caption: `- *AUDIO DOWNLOADER 🎧*\n╭━━❐━⪼\n┇๏ *Title* - ${vid.title}\n┇๏ *Duration* - ${vid.timestamp}\n┇๏ *Views* - ${vid.views?.toLocaleString() || 'N/A'}\n┇๏ *Author* - ${vid.author?.name || 'Unknown'}\n┇๏ *Status* - Downloading...\n╰━━❑━⪼\n> Powered by LOVE-MD`
        }, { quoted: mek });

        const apiUrl = `${API_BASE}/ytmp3?url=${encodeURIComponent(vid.url)}&key=bandaheali`;
        let audioUrl = null;
        let title = vid.title;

        try {
            const response = await axios.get(apiUrl, { 
                timeout: 20000,
                validateStatus: (status) => status >= 200 && status < 400,
                maxRedirects: 0 
            });

            if (response.status >= 300 && response.status < 400) {
                audioUrl = response.headers.location;
            } else if (response.data) {
                const r = response.data.result;
                audioUrl = response.data.status
                    ? (r?.url || r?.audio_url || r?.mp3_url || r?.audio)
                    : null;
                if (r?.title) title = r.title;
            }
        } catch (e) {
            if (e.response && e.response.status >= 300 && e.response.status < 400) {
                audioUrl = e.response.headers.location;
            }
        }

        // Resolve relative redirect URL if any
        if (audioUrl) {
            try {
                audioUrl = new URL(audioUrl, apiUrl).href;
            } catch (err) {
                audioUrl = null;
            }
        }

        // Fallback if primary API failed or didn't return a URL
        if (!audioUrl) {
            try {
                const fallbackUrl = `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(vid.url)}`;
                const fallbackRes = await axios.get(fallbackUrl, { timeout: 15000 });
                if (fallbackRes.data && fallbackRes.data.result) {
                    const rawFallback = fallbackRes.data.result.downloadLink || fallbackRes.data.result.url;
                    if (rawFallback) {
                        audioUrl = new URL(rawFallback, fallbackUrl).href;
                    }
                }
            } catch (fallbackErr) {
                try {
                    const fallbackUrl2 = `https://api.giftedtech.my.id/api/download/dlmp3?url=${encodeURIComponent(vid.url)}`;
                    const fallbackRes2 = await axios.get(fallbackUrl2, { timeout: 15000 });
                    if (fallbackRes2.data && fallbackRes2.data.result) {
                        const rawFallback2 = fallbackRes2.data.result.download_url || fallbackRes2.data.result.url;
                        if (rawFallback2) {
                            audioUrl = new URL(rawFallback2, fallbackUrl2).href;
                        }
                    }
                } catch (e2) {
                    // Ignore
                }
            }
        }

        if (!audioUrl) {
            return reply("❌ Audio download failed! Try again later.");
        }

        await conn.sendMessage(from, { 
            audio: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${title}.mp3`,
            ptt: false
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("❌ SONG2 ERROR:", e);
        reply(e.message || String(e));
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});