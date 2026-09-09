const { cmd } = require("../command");

for (let i = 1; i <= 161; i++) {

    cmd({
        pattern: `sound${i}`,
        alias: [],
        desc: `Play sound number ${i}`,
        category: "media",
        react: "🎵",
        filename: __filename
    },

    async (conn, mek, m, { from, reply, command }) => {
        try {
            // extract number from command (sound7 → 7)
            const num = command.replace("sound", "");

            // tiktokmusic (m small)
            const url = `https://github.com/iTx-Sarkar/Sounds/raw/master/tiktokmusic/sound${num}.mp3`;

            await conn.sendMessage(
                from,
                {
                    audio: { url },
                    mimetype: "audio/mpeg",
                    ptt: false,

                    contextInfo: {
                        externalAdReply: {
                            title: "Edith-MD",
                            body: `Bandaheali Audio collection`,
                            thumbnailUrl: "https://bandaheali-cdn.koyeb.app/media/bot_1763528392302.jpg",
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: true,
                            sourceUrl: "https://github.com/iTx-Sarkar/Sounds"
                        }
                    }
                },
                { quoted: mek }
            );

        } catch (e) {
            console.error(e);
            reply("⚠ Error playing sound.", e);
        }
    });
}
