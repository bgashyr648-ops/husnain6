const { cmd } = require('../command');

// ==================================================
// COMMAND 1: gc - Broadcast status to all groups
// ==================================================
cmd({
    pattern: "gc",
    alias: ["gsa", "statusall", "sall"],
    desc: "Broadcast status to all groups",
    category: "group",
    react: "📡",
    filename: __filename
}, async (conn, mek, m, { text, reply, isCreator }) => {

    if (!isCreator) {
        return reply("❌ Owner only");
    }

    try {
        const caption = text?.trim();
        const quotedMsg = m.quoted;

        if (!quotedMsg && !caption) {
            return reply("❌ Please provide text or reply to media to broadcast.");
        }

        const groups = Object.keys(await conn.groupFetchAllParticipating());
        await conn.sendMessage(m.chat, { react: { text: "⏳", key: mek.key } });

        for (const id of groups) {
            try {
                if (quotedMsg) {
                    const mediaBuffer = await quotedMsg.download();
                    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || "";

                    if (mimeType.startsWith("image/")) {
                        await conn.sendMessage(id, { image: mediaBuffer, caption: caption || "" });
                    } else if (mimeType.startsWith("video/")) {
                        await conn.sendMessage(id, { video: mediaBuffer, caption: caption || "" });
                    } else {
                        await conn.sendMessage(id, { text: caption || "Broadcast Update" });
                    }
                } else {
                    await conn.sendMessage(id, { text: caption });
                }
            } catch (e) {
                console.log(`Failed to send to ${id}`);
            }
        }

        await conn.sendMessage(m.chat, { react: { text: "✅", key: mek.key } });
        reply(`✅ Broadcasted to ${groups.length} groups.`);

    } catch (error) {
        console.error(error);
        reply(`❌ Error: ${error.message}`);
    }
});