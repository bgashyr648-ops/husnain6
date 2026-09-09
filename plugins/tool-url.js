// Bandaeali The Destroyer
const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

cmd({
  pattern: "url",
  alias: ["uploade", "tourl", "imgkit", "ikup"],
  react: '🖇',
  desc: "Convert media to URL (via ImageKit)",
  category: "utility",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    const quotedMsg = m.quoted ? m.quoted : m;
    const mimeType = quotedMsg.mimetype || 
                     (quotedMsg.msg && quotedMsg.msg.mimetype) || 
                     (quotedMsg.message && quotedMsg.message[quotedMsg.mtype] && quotedMsg.message[quotedMsg.mtype].mimetype) || 
                     (quotedMsg.message && Object.values(quotedMsg.message)[0] && Object.values(quotedMsg.message)[0].mimetype) || 
                     '';
    
    if (!mimeType) {
      throw "Please reply to an image, video, audio, or other supported file";
    }

    const mediaBuffer = await quotedMsg.download();

    // Extension mapping
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('image/webp')) extension = '.webp';
    else if (mimeType.includes('video/mp4')) extension = '.mp4';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio/mpeg')) extension = '.mp3';
    else if (mimeType.includes('audio/mp4')) extension = '.m4a';
    else if (mimeType.includes('audio/x-m4a')) extension = '.m4a';
    else if (mimeType.includes('audio/ogg')) extension = '.opus';
    else if (mimeType.includes('audio/opus')) extension = '.opus';
    else if (mimeType.includes('audio')) extension = '.audio';
    else if (mimeType.includes('application/zip')) extension = '.zip';
    else if (mimeType.includes('application/pdf')) extension = '.pdf';
    else if (mimeType.includes('text/')) extension = '.txt';
    else extension = '.bin';
    
    const fileName = `SHABAN-${Date.now()}${extension}`;
    const tempFile = path.join(__dirname, fileName);
    fs.writeFileSync(tempFile, mediaBuffer);

    // 🔑 ImageKit setup
    const imagekit = new ImageKit({ 
      publicKey: "public_hVzpRbg4Hm2WRdS8x8lZz+TmAUk=",
      privateKey: "private_IMDgbBU8xJkuqY/1X5/2RhwiiTY=",
      urlEndpoint: "https://ik.imagekit.io/kfyseccyf"
    });

    // 🚀 Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fs.readFileSync(tempFile),
      fileName: fileName
    });

    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile); // remove temp file
    }

    const imageUrl = uploadResponse.url;
    
    if (!imageUrl) {
      throw "Upload failed - no URL returned";
    }

    const fileSize = formatBytes(mediaBuffer.length);
    
    let mediaType = 'File';
    if (mimeType.includes('image')) mediaType = '📷 Image';
    else if (mimeType.includes('video')) mediaType = '🎥 Video';
    else if (mimeType.includes('audio/ogg')) mediaType = '🎤 Voice Note';
    else if (mimeType.includes('audio')) mediaType = '🎵 Audio';
    else if (mimeType.includes('application/zip')) mediaType = '📦 Archive';

    await reply(
      `*${mediaType} Uploaded Successfully*\n\n` +
      `*Size:* ${fileSize}\n` +
      `*URL:* ${imageUrl}\n\n` +
      `> © Uploaded by Love MD💜` 
    );

  } catch (error) { 
    console.error(error);
    await reply(`❌ Error: ${error.message || error}`);
  }
});