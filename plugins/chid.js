const { cmd } = require("../command");
cmd({
    pattern: "newsletter",
    alias: ["chid"],
    react: "📡",
    desc: "Get WhatsApp Channel newsletter ID",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

    try {
        if (!q) {
            return reply(`❎ WhatsApp channel link do.\n\nExample:\n.newsletter https://whatsapp.com/channel/xxxx`);
        }

        const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
        if (!match) {
            return reply("⚠️ Invalid channel link.");
        }

        const inviteId = match[1];
        let metadata;

        try {
            metadata = await conn.newsletterMetadata("invite", inviteId);
        } catch {
            return reply("❌ Channel fetch failed.");
        }

        if (!metadata?.id) {
            return reply("❌ Channel not found.");
        }

        const channelId = metadata.id;
        const channelName = metadata.name || "Channel Preview";

        const caption = 
`╭━━〔 *WHATSAPP CHANNEL INFO* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• 📡 *Channel:* ${channelName}
┃◈┃• 🆔 *ID:* ${channelId}
┃◈└───────────┈⊷
╰──────────────┈⊷

> *_POWERED BY LOVE-MD_*`;

        await reply(caption);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await reply(channelId);

    } catch (err) {
        console.error("Newsletter error:", err);
        reply("⚠️ Unexpected error.");
    }
});