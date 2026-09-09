const { cmd } = require('../command');

cmd({
  pattern: "end",
  alias: ["byeall", "kickall", "endgc", "nuke"],
  desc: "Removes all members from group except specified numbers",
  category: "group",
  react: "⚠️",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  botNumber2,
  botNumber,
  isGroup,
  sender,
  metadata,
  reply
}) => {
  try {
    if (!isGroup) return await reply("⚠️ This command only works in groups.");
    if (!isBotAdmins) return await reply("❌ I must be admin to remove members.");
    if (!isCreator) return await reply("🔐 Only bot owner can use this command.");

    const groupData = metadata || await conn.groupMetadata(from);
    const participants = groupData.participants || [];

    const cleanJid = (jid) => {
      if (!jid || typeof jid !== 'string') return '';
      return jid.split(':')[0].split('@')[0] + '@s.whatsapp.net';
    };

    const botJid = cleanJid(conn.user && (conn.user.id || conn.user.jid) || botNumber);
    const senderJid = cleanJid(sender);
    const creatorJid = cleanJid(groupData.owner || groupData.subjectOwner);
    const bot2Jid = cleanJid(botNumber2);

    const ignoreJids = [botJid, senderJid, creatorJid, bot2Jid].filter(Boolean);

    // Filter out ignored JIDs
    const targets = participants.filter(p => {
      const pJid = cleanJid(p.id);
      return !ignoreJids.includes(pJid);
    });
    
    const jids = targets.map(p => p.id);

    if (jids.length === 0) {
      return await reply("✅ No members to remove (everyone is excluded).");
    }

    await reply(`⚠️ Removing ${jids.length} members in progress...`);

    // Remove in chunks to prevent rate limits and handle errors gracefully
    const chunkSize = 5;
    let removedCount = 0;
    for (let i = 0; i < jids.length; i += chunkSize) {
      const chunk = jids.slice(i, i + chunkSize);
      try {
        await conn.groupParticipantsUpdate(from, chunk, "remove");
        removedCount += chunk.length;
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      } catch (err) {
        console.error("Error removing chunk:", err);
      }
    }

    await reply(`✅ Successfully removed ${removedCount} member${removedCount > 1 ? 's' : ''} from the group.`);

  } catch (err) {
    console.error(err);
    await reply("❌ Failed to execute the command. Please try again.");
  }
});