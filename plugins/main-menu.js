const config = require('../config')
const { cmd, commands } = require('../command');
const path = require('path');
const os = require("os")
const fs = require('fs');
const {runtime} = require('../lib/functions')
const axios = require('axios')

// Helper function for small caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    const smallCapsMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
        'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ғ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ',
        'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ',
        'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
    };
    return text.split('').map(char => smallCapsMap[char] || char).join('');
};

// Format category with heavy premium styles
const formatCategory = (category, cmds, prefix = '.') => {
    // Filter out commands with empty or undefined patterns
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');

    if (validCmds.length === 0) return ''; // Skip empty categories

    let title = `\n╭━━━〔 ⚡ *${toSmallCaps(category.toUpperCase())}* 〕━━━┈⊷\n`;
    let body = validCmds.map(cmd => {
        const commandName = cmd.pattern || '';
        return `┃ ✦ ${prefix}${commandName}`;
    }).join('\n');
    let footer = `\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷`;
    return `${title}${body}${footer}`;
};

// Function to validate image URL
const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
        return false;
    }
    return url.startsWith('http://') || url.startsWith('https://');
};

cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu","fullmenu"],
    use: '.menu',
    desc: "Show all bot commands",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply, userConfig }) => {
    try {
        // Show typing presence before processing
        await conn.sendPresenceUpdate('composing', from);

        let totalCommands = Object.keys(commands).length;

        // Get all unique categories and filter out undefined/null categories
        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(cat =>
            cat && cat.trim() !== '' && cat !== 'undefined'
        );

        // Organize commands by category and filter out empty categories
        const categorized = {};
        categories.forEach(cat => {
            const categoryCommands = Object.values(commands).filter(c => c.category === cat);
            // Only add category if it has valid commands
            const validCommands = categoryCommands.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
            if (validCommands.length > 0) {
                categorized[cat] = validCommands;
            }
        });

        // Get all values from userConfig with fallback to config
        const BOT_NAME = userConfig?.BOT_NAME || config.BOT_NAME || "Bot";
        const OWNER_NAME = userConfig?.OWNER_NAME || config.OWNER_NAME || "Owner";
        const PREFIX = userConfig?.PREFIX || config.PREFIX || ".";
        const MODE = userConfig?.MODE || config.MODE || "private";
        const VERSION = userConfig?.VERSION || config.VERSION || "1.0.0";
        const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION || "";

        // BOT_IMAGE will be resolved just before sending (userConfig.BOT_IMAGE takes priority)

        // Build menu sections - only for categories that have commands
        let menuSections = '';
        for (const [category, cmds] of Object.entries(categorized)) {
            if (cmds && cmds.length > 0) {
                const section = formatCategory(category, cmds, PREFIX);
                if (section !== '') {
                    menuSections += section;
                }
            }
        }

        // Main menu text with heavy premium styling
        let dec = `╭━━━〔 🌟 *${BOT_NAME.toUpperCase()}* 🌟 〕━━━┈⊷
┃
┃ 👤 *${toSmallCaps('Owner')}:* ${OWNER_NAME}
┃ ⚙️ *${toSmallCaps('Prefix')}:* ${PREFIX}
┃ ⏱️ *${toSmallCaps('Uptime')}:* ${runtime(process.uptime())}
┃ 📊 *${toSmallCaps('Commands')}:* ${totalCommands}
┃ 🛡️ *${toSmallCaps('Mode')}:* ${MODE}
┃ 🏷️ *${toSmallCaps('Version')}:* ${VERSION}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━┈⊷
${menuSections}

> ${DESCRIPTION || ''}`;

        // Determine which image to use: verify userConfig.BOT_IMAGE actually works, else local love.jpg
        const localImagePath = path.join(__dirname, '../lib/love.jpg');
        let imageToUse = localImagePath;

        if (isValidImageUrl(userConfig?.BOT_IMAGE)) {
            try {
                // Check if the image URL is actually reachable (timeout after 3 seconds)
                await axios.head(userConfig.BOT_IMAGE, { timeout: 3000 });
                imageToUse = userConfig.BOT_IMAGE;
            } catch (urlError) {
                console.log('BOT_IMAGE URL not reachable, using local love.jpg:', urlError.message);
                imageToUse = localImagePath;
            }
        }

        // Send menu image with caption, with robust fallbacks to ensure delivery
        let sent = false;
        try {
            await conn.sendMessage(from, {
                image: { url: imageToUse },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363426314834573@newsletter',
                        newsletterName: BOT_NAME,
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });
            sent = true;
        } catch (imageError) {
            console.log('Error sending menu image with contextInfo, trying without contextInfo:', imageError.message);
            try {
                await conn.sendMessage(from, {
                    image: { url: imageToUse },
                    caption: dec
                }, { quoted: mek });
                sent = true;
            } catch (fallbackImageError) {
                console.log('Error sending menu image entirely, falling back to text message:', fallbackImageError.message);
            }
        }

        // Fallback to text-only if image sending failed completely
        if (!sent) {
            try {
                await conn.sendMessage(from, {
                    text: dec,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363406831654518@newsletter',
                            newsletterName: BOT_NAME,
                            serverMessageId: 143
                        }
                    }
                }, { quoted: mek });
            } catch (textError) {
                console.log('Error sending text menu with contextInfo, sending plain text:', textError.message);
                await conn.sendMessage(from, { text: dec }, { quoted: mek });
            }
        }

        // Send love.mp3 audio after menu (with small delay)
        setTimeout(async () => {
            try {
                const audioPath = path.join(__dirname, '../lib/love.mp3');

                // Check if audio file exists
                if (fs.existsSync(audioPath)) {
                    await conn.sendMessage(from, {
                        audio: { url: audioPath },
                        mimetype: 'audio/mpeg',
                        ptt: false  // Set to true if you want as voice note
                    }, { quoted: mek });
                } else {
                    console.log('love.mp3 not found at:', audioPath);
                }
            } catch (audioError) {
                console.log('Error sending audio:', audioError);
            }
        }, 1000); // 1 second delay after menu

    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});
