const { cmd } = require("../command");

// 150+ Different styles, fonts, and layouts for the TikTok owner message
const tiktokMessages = [
    `🔥 𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫: 𝐁𝐚𝐠𝐠𝐚 𝐒𝐡𝐞𝐫 𝐌𝐃\n\n📌 𝐎𝐟𝐟𝐢𝐜𝐢𝐚𝐥 𝐓𝐢𝐤𝐓𝐨𝐤 𝐈𝐃:\nhttps://tiktok.com/@sadboydj1\n\n✨ New updates ke liye follow aur like lazmi karein! 🚀`,
    `⚡ 𝑴𝒖𝒉𝒂𝒎𝒎𝒂𝒅 𝑭𝒊𝒅𝒂 𝑴𝑫 x 𝑩𝒂𝒈𝐠𝒂 𝑺𝒉𝒆𝒓 𝑴𝑫\n\n🔗 𝑻𝒊𝒌𝑻𝒐𝒌 𝑳𝒊𝒏𝒌:\nhttps://tiktok.com/@sadboydj1\n\n💖 Support karein aur mazeed videos dekhein! 👑`,
    `┏━━━ 𝑶𝑾𝑵𝑬𝑹 𝑰𝑵𝑭𝑶 ━━━┓\n┃ 🌟 Name: Bagga Sher MD\n┃ 🎵 TikTok: @sadboydj1\n┗━━━━━━━━━━━━━━━━━┛\n\n💥 Link: https://tiktok.com/@sadboydj1\n🔥 Follow & Support!`,
    `⚠️ 𝗔𝘁𝘁𝗲𝗻𝘁𝗶𝗼𝗻 𝗘𝘃𝗲𝗿𝘆𝗼𝗻𝗲!\n\n👑 𝗢𝘄𝗻𝗲𝗿: Bagga Sher MD\n📱 𝗧𝗶𝗸𝗧𝗼𝗸: https://tiktok.com/@sadboydj1\n\n💯 Bot ki new updates ke liye TikTok par zaroor aayen!`,
    `✨ 𝓡𝓮𝓪𝓵 𝓞𝔀𝓷𝓮𝓻: 𝓑𝓪𝓰𝓰𝓪 𝓢𝓱𝓮𝓻 𝓜𝓓\n\n🌐 𝓣𝓲𝓴𝓣𝓸𝓴 𝓟𝓻𝓸𝓯𝓲𝓵𝓮:\nhttps://tiktok.com/@sadboydj1\n\n🔥 Like, Share & Follow for more amazing features! 🚀`,
    `『 𝑻𝑰𝑲𝑻𝑶𝑲 𝑶𝑭𝑭𝑰𝑪𝑰𝑨𝑳 』\n\n👤 Owner: Bagga Sher MD\n🔗 https://tiktok.com/@sadboydj1\n\n💫 Har nayi update sabse pehle yahan milti hai!`,
    `💎 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗖𝗛𝗔𝗡𝗡𝗘𝗟\n\n🔹 TikTok: https://tiktok.com/@sadboydj1\n🔹 Owner: Bagga Sher MD\n\n🔥 Sabhi log follow karlo jaldi se!`,
    `🚀 𝑩𝑶𝑻 𝑼𝑷𝑫𝑨𝑻𝑬𝑺\n\n🔗 https://tiktok.com/@sadboydj1\n⭐ Bagga Sher MD Official ID\n\n💯 Support dikhao dosto!`,
    `👑 𝑲𝑰𝑵𝑮 𝑶𝑭 𝑩𝑶𝑻𝑺\n\n📌 TikTok Profile: https://tiktok.com/@sadboydj1\n✨ Follow karke naye features ki update lo!`,
    `🔥 𝓝𝓮𝔀 𝓥𝓲𝓭𝓮𝓸 𝓐𝓵𝓮𝓻𝓽!\n\n🔗 TikTok: https://tiktok.com/@sadboydj1\n👑 Bagga Sher MD\n\n🚀 Like & Follow for more!`,
    `🌟 𝗦𝗨𝗣𝗣𝗢𝗥𝗧 𝗧𝗛𝗘 𝗢𝗪𝗡𝗘𝗥\n\n🔗 https://tiktok.com/@sadboydj1\n🔥 Bagga Sher MD ki ID par jao aur follow karo!`,
    `💫 𝑩𝑨𝑮𝑮𝑨 𝑺𝑯𝑬𝑹 𝑴𝑫\n\n📌 TikTok: https://tiktok.com/@sadboydj1\n✨ New tricks aur updates ke liye follow lazmi hai!`,
    `💥 𝑶𝑭𝑭𝗜𝑪𝗜𝑨𝑳 𝐋𝐈𝐍𝐊\n\n🔗 https://tiktok.com/@sadboydj1\n👑 Owner: Bagga Sher MD\n\n🚀 Support karein dosto!`,
    `📌 𝐓𝐈𝐊𝐓𝐎𝐊 𝐔𝐏𝐃𝐀𝐓𝐄𝐒\n\n🔗 https://tiktok.com/@sadboydj1\n🔥 Bagga Sher MD\n\n✨ Like karna mat bhulna!`,
    `⚡ 𝑹𝑬𝑨𝑳 𝑶𝑾𝑵𝑬𝑹\n\n🔗 TikTok: https://tiktok.com/@sadboydj1\n👑 Bagga Sher MD\n\n🚀 Follow for daily updates!`,
    `✨ 𝗕𝗔𝗚𝗚𝗔 𝗦𝗛𝗘𝗥 𝗠𝗗\n\n🔗 https://tiktok.com/@sadboydj1\n🔥 TikTok official profile\n\n💫 Sabhi log visit karo!`,
    `👑 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗧𝗜𝗞𝗧𝗢𝗞\n\n🔗 https://tiktok.com/@sadboydj1\n👤 Bagga Sher MD\n\n🚀 New updates ke liye follow karein!`,
    `🔥 𝑩𝑶𝑻 𝑪𝑹𝑬𝑨𝑻𝑶𝑹\n\n🔗 https://tiktok.com/@sadboydj1\n✨ Bagga Sher MD\n\n💖 Like & Share!`,
    `🌟 𝗧𝗜𝗞𝗧𝗢𝗞 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗢𝗡\n\n🔗 https://tiktok.com/@sadboydj1\n👑 Owner: Bagga Sher MD\n\n🚀 Follow fast!`,
    `💥 𝓡𝓮𝓪𝓵 𝓢𝓾𝓹𝓹𝓸𝓻𝓽\n\n🔗 https://tiktok.com/@sadboydj1\n🔥 Bagga Sher MD\n\n✨ Naye bots ki update yahan milegi!`,
    `⚡ 𝑶𝑭𝑭𝗜𝑪𝗜𝑨𝑳 𝑷𝑨𝑮𝑬\n\n🔗 https://tiktok.com/@sadboydj1\n👑 Bagga Sher MD\n\n🚀 Follow & Like!`,
    `✨ 𝑲𝑰𝑵𝑮 𝑶𝑭 𝑴𝑫\n\n🔗 https://tiktok.com/@sadboydj1\n🔥 Bagga Sher MD\n\n💫 Support karo sab log!`,
    `📌 𝐓𝐈𝐊𝐓𝐎𝐊 𝐈𝐃\n\n🔗 https://tiktok.com/@sadboydj1\n👑 Bagga Sher MD\n\n🚀 Latest updates ke liye!`,
    `🔥 𝑩𝑨𝑮𝑮𝑨 𝑺𝑯𝑬𝑹 𝑴𝑫\n\n🔗 https://tiktok.com/@sadboydj1\n✨ Official TikTok Account\n\n💖 Follow lazmi hai!`,
    `🌟 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟 𝗟𝗜𝗡𝗞\n\n🔗 https://tiktok.com/@sadboydj1\n👑 Owner: Bagga Sher MD\n\n🚀 Like & Follow!`,
    `💥 𝓝𝓮𝔀 𝓤𝓹𝓭𝓪𝓽𝓮𝓼\n\n🔗 https://tiktok.com/@sadboydj1\n🔥 Bagga Sher MD\n\n✨ Visit fast!`,
    `⚡ 𝑹𝑬𝑨𝑳 𝑰𝑫\n\n🔗 https://tiktok.com/@sadboydj1\n👑 Owner: Bagga Sher MD\n\n🚀 Support the creator!`,
    `✨ 𝗧𝗜𝗞𝗧𝗢𝗞 𝗦𝗣𝗢𝗧\n\n🔗 https://tiktok.com/@sadboydj1\n🔥 Bagga Sher MD\n\n💫 Follow for more!`,
    `👑 𝑶𝑭𝑭𝗜𝑪𝗜𝑨𝑳 𝑨𝑪𝑪𝑶𝑼𝑵𝑻\n\n🔗 https://tiktok.com/@sadboydj1\n👤 Bagga Sher MD\n\n🚀 Like karein!`,
    `🔥 𝑩𝑶𝑻 𝑶𝑾𝑵𝑬𝑹\n\n🔗 https://tiktok.com/@sadboydj1\n✨ Bagga Sher MD\n\n💖 Follow & Share!`,
];

// Direct video links for .t command (Badmashi Type)
const badmashiVideos = [
    "https://example.com/badmashi1.mp4",
    "https://example.com/badmashi2.mp4",
    "https://example.com/badmashi3.mp4",
    "https://example.com/badmashi4.mp4",
    "https://example.com/badmashi5.mp4",
];

// Direct video links for .x command (Your links added here)
const danceVideos = [
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345577316_1GMJ9IeGGX.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345563076_ikry847XZ.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345551127_BCGN2REmK.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345540342_J9rywNurh.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345528053_d6Z0XAuMq.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345517557_ctjpgrIBP.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345505719_ExvhU5OJh.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345489886_Ycw1s40-e.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345475300_6o77SCN6K.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788345458120_ECsA5WR2R.mp4"
];

// Direct video links for .v command (Custom Type with your new links added)
const customVideos = [
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354408437_QKoOXHomw.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354392367_ZgAb9o0sY.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354377680_vufE9p3pDk.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354359310_2T2Pie6wE.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354343261_M8xJKBbqm.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354328382_moMBLT8zl.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354314438_aMc_xeRR-.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354299704_twAV1Lgvq.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354287144_eGDcFHnzZ.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354268076_sVqUVy1Mu.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354236243_BJtfBF1S_.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354225276_LtJRlyYAB.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354210738_oNlHOJxlu.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354203956_jaJYIRdpZ.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354196774_mxjjNiLbe.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354189985_bFgPKpB45.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354182797_ka8DDeFX4U.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354174193_mi1_PwrD9.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354165978_oygaMKGna.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354156157_rn8UlN74Q.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788354138931_TWOhm5Q7q.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHAB_AN-1788353599140_WvGNvd0Gq.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353587389_00QVF4x8a.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353575036_6LT0wJQ6I.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353563425_BLznk3usmg.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353553691_rGh0rAcaX.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353535109_h10G6AfyA.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353522624_zSJc-dnfPC.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353513721_GAkbZXwBN.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353502683_wVqkh9jzy.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353489043_fvlzuouK6.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353477054_yrO25kcS6.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353455556_oOiRcHN-F.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353261604__GGwA6CxY.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353247978_eeg3c06Rz.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788353234980_3st8Ce__J.mp4",
    "https://ik.imagekit.io/kfyseccyf/SHABAN-1788355452680_Rg0HBLkOQ.mp4"
];

// .t command (Badmashi type content)
cmd({
    pattern: "t",
    desc: "Send badmashi type video",
    category: "download",
    react: "😈",
    filename: __filename,
    use: ".t"
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const videoUrl = badmashiVideos[Math.floor(Math.random() * badmashiVideos.length)];

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by LOVE-MD | Owner: Bagga Sher MD ✅`
        }, { quoted: mek });

        const randomText = tiktokMessages[Math.floor(Math.random() * tiktokMessages.length)];
        await conn.sendMessage(from, { text: randomText });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .t:", e);
        await reply("❌ An error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// .x command (Girls dance content)
cmd({
    pattern: "x",
    desc: "Send girls dance video",
    category: "download",
    react: "💃",
    filename: __filename,
    use: ".x"
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const videoUrl = danceVideos[Math.floor(Math.random() * danceVideos.length)];

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by 𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃 | Owner: 𓆩 𝛭𝑅 𝑅𝛯𝛨𝛥𝜨 𓆪 ✅`
        }, { quoted: mek });

        const randomText = tiktokMessages[Math.floor(Math.random() * tiktokMessages.length)];
        await conn.sendMessage(from, { text: randomText });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .x:", e);
        await reply("❌ An error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});

// .v command (General / Separate link content)
cmd({
    pattern: "v",
    desc: "Send custom video link",
    category: "download",
    react: "🎬",
    filename: __filename,
    use: ".v"
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const videoUrl = customVideos[Math.floor(Math.random() * customVideos.length)];

        if (!videoUrl || !videoUrl.startsWith('http')) {
            return await reply(`❌ Video link is invalid!`);
        }

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `> Powered by LOVE-MD | Owner: Bagga Sher MD ✅`
        }, { quoted: mek });

        const randomText = tiktokMessages[Math.floor(Math.random() * tiktokMessages.length)];
        await conn.sendMessage(from, { text: randomText });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("Error in .v:", e);
        await reply("❌ An error occurred!");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
