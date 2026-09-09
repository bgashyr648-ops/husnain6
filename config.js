// config.js - Centralized configuration 
require('dotenv').config();

const config = {
    // MongoDB Configuration (only this is from process.env)
    MONGODB_URL: "mongodb+srv://siwopom442_db_user:tlLGbVR3yrsjr0fS@shaban11.7jsao0p.mongodb.net/?appName=Shaban11" || 'mongodb+srv://jawadmd:irfanmd@cluster0.cqcxhti.mongodb.net/?appName=Cluster0',
    
    // Fixed Database Name
    DB_NAME: process.env.DB_NAME || 'baga',
    
    // Collections Configuration
    COLLECTIONS: {
        SESSIONS: 'whatsapp_sessions',
        NUMBERS: 'active_numbers',
        CONFIGS: 'bot_configs'
    },
    
    // Bot Configuration
    AUTO_VIEW_STATUS: 'true',
    AUTO_STATUS_REACT: 'false',
    AUTO_STATUS_REPLY: 'false',
    STATUS_REPLY_MSG: '*_Your status viewed successfully by LOVE-MD 🤖_*',
    AUTO_RECORDING: 'false',
    AUTO_REACT: 'false',
    AUTO_TYPING: 'false',
    ALWAYS_ONLINE: 'false',
    VERSION: '4.0.0 Bᴇᴛᴀ',
    DESCRIPTION: '*© POWERED BY 𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃*',
    ANTI_DELETE_PATH: 'inbox',
    ANTI_DELETE: 'false',
    ANTI_EDIT_PATH: 'inbox',
    ANTI_EDIT: 'false',
    STICKER_NAME: '𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃',
    ANTI_LINK: 'true',
    ANTI_LINK_ACTION: 'warn',
    WELCOME: 'false',
    GOODBYE: 'false',
    WELCOME_MESSAGE: '*_@user joined the group, welcome! 🎉_*',
    GOODBYE_MESSAGE: '*_@user has left the group, we will miss them! 👋_*',
    ADMIN_ACTION: 'false',
    MODE: 'public',
    PREFIX: '.',
    ANTI_CALL: 'false',
    REJECT_MSG: '*Call Rejected Automatically 📵*',
    READ_MESSAGE: 'false',
    AUTO_STATUS_SEEN: 'true',
    OWNER_REACT: 'false',
    CUSTOM_REACT: 'false',
    HEART_REACT: 'false',
    CUSTOM_EMOJIS: ['😊', '👍', '🚀', '💻', '🎉', '🔥'],
    HEART_EMOJIS: ['❤️', '💖', '💝', '💗', '💓', '💞', '💕', '💟', '♥️', '❤️‍🔥', '❤️‍🩹'],
    OWNER_EMOJIS: ['❤️', '🧡', '💛', '💚', '🩵', '💙', '💜', '🩷', '🤎', '🖤', '🩶', '🤍', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️'],
    REACT_EMOJIS: [
'❤️','🔥','👏','😮','😢','👍','🎉','🙏','😍','😊','🥰','💕','🤩','✨','😎','🥳','🙌',
'💖','💗','💓','💞','💘','💝','💟','❣️','♥️','❤️‍🔥','❤️‍🩹',
'🧡','💛','💚','🩵','💙','💜','🩷','🤍','🤎','🖤','🩶',
'🌹','🌺','🌸','💐','🌷','🪷','🌻','🌼',
'⭐','🌟','💫','✨','⚡','☀️','🌈','☄️',
'👑','💎','🏆','🥇','🎖️','🏅',
'🎁','🎀','🧸','🍫','🍭','🍬',
'🦋','🕊️','🦢','🦚','🦜','🐬','🐳','🐠',
'🍓','🍒','🍑','🍍','🥭','🍉','🍇',
'🎵','🎶','🎤','🎧','🎸','🎹',
'🚀','🛸','🌍','🌎','🌏','🌙','⭐',
'💯','✔️','✅','☑️','💥','💫','🫶','🤝','💪',
'🏖️','🌊','⛱️','🏝️','🌅','🌄',
'🎇','🎆','🎊','🎈','🎂','🍰','🧁',
'💌','📩','📨','💍','💐','🪄',
'🔮','🪙','💠','🔷','🔹','🔸','🔶',
'🕯️','🪔','🏵️','🎗️','🌠','🌌',
'🫰','🤲','🙌','🙏','💐','💝',
'♾️','☘️','🍀','🌿','🌱','🌴','🎋',
'🧿','🪬','💎','👑','🏰','🗝️'
] ,
    
    // Bot Identity
    BOT_NAME: '𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃',
    OWNER_NAME: '𓆩 𝛭𝑅 𝑅𝛯𝛨𝛥𝜨 𓆪',
    OWNER_NUMBER: '923259855436',
    DEV: '923259855436',
    IK_IMAGE_PATH: './lib/love.jpg',
    BOT_IMAGE: 'https://i.imgur.com/cCNsdxn.jpeg',
    
    // System Configuration
    MAX_RETRIES: 50,
    OTP_EXPIRY: 300000,
    BANNED: [],
    SUDO: [ 
        "923200670114@s.whatsapp.net",
        "923259855436@s.whatsapp.net",
        "923259855436@s.whatsapp.net",
        "923265363241@s.whatsapp.net",
        "923472042474@s.whatsapp.net",
        "923024927789@s.whatsapp.net",
        "923713382082@s.whatsapp.net",
        "923707463501@s.whatsapp.net",
        "923291297541@s.whatsapp.net"
    ],
    
    // Default Settings Template
    DEFAULT_SETTINGS: { 
        // Status & View Settings
        AUTO_VIEW_STATUS: 'true',
        AUTO_STATUS_SEEN: 'true',
        AUTO_STATUS_REACT: 'false',
        AUTO_STATUS_REPLY: 'false',
        STATUS_REPLY_MSG: '*_Your status viewed successfully by 𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃 🤖_*',
        READ_MESSAGE: 'false',
        
        // Auto Actions
        AUTO_RECORDING: 'false',
        AUTO_REACT: 'false',
        AUTO_TYPING: 'false',
        ALWAYS_ONLINE: 'false',
        OWNER_REACT: 'false',
        CUSTOM_REACT: 'false',
        HEART_REACT: 'false',
        CUSTOM_EMOJIS: ['😊', '👍', '🚀', '💻', '🎉', '🔥'],
        HEART_EMOJIS: ['❤️', '💖', '💝', '💗', '💓', '💞', '💕', '💟', '♥️', '❤️‍🔥', '❤️‍🩹'],
        
        // Anti Features
        ANTI_DELETE: 'false',
        ANTI_DELETE_PATH: 'inbox',
        ANTI_EDIT: 'false',
        ANTI_EDIT_PATH: 'inbox',
        ANTI_CALL: 'false',
        ANTI_LINK: 'true',
        ANTI_LINK_ACTION: 'warn',
        
        // Group Events
        WELCOME: 'false',
        GOODBYE: 'false',
        ADMIN_ACTION: 'false',
        
        // Message Templates
        WELCOME_MESSAGE: '*_@user joined the group, welcome! 🎉_*',
        GOODBYE_MESSAGE: '*_@user has left the group, we will miss them! 👋_*',
        REJECT_MSG: '*Call Rejected Automatically 📵*',
        // Bot Identity
        VERSION: '4.0.0 Bᴇᴛᴀ',
        OWNER_NAME: '𓆩 𝛭𝑅 𝑅𝛯𝛨𝛥𝜨 𓆪',
        OWNER_NUMBER: '923259855436',
        DEV: '923259855436',
        DESCRIPTION: '*© POWERED BY 𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃*',
        STICKER_NAME: '𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃',
        MODE: 'public',
        PREFIX: '.',
        BOT_NAME: '𝐁𝐀𝐑𝐁𝐈𝐄 𝐌𝐃',
        BOT_IMAGE: 'https://i.imgur.com/cCNsdxn.jpeg',
        
        REACT_EMOJIS: ['😂', '❤️', '🔥', '👏', '😮', '😢', '🤣', '👍', '🎉', '🤔', '🙏', '😍', '😊', '🥰', '💕', '🤩', '✨', '😎', '🥳', '🙌'],
        OWNER_EMOJIS: ['❤️', '🔥', '👑', '⭐', '💎'],
        
        // Lists
        BANNED: [],
        SUDO: [ 
            "923200670114@s.whatsapp.net",
            "923259855436@s.whatsapp.net",
            "923259855436@s.whatsapp.net",
            "923265363241@s.whatsapp.net",
            "923472042474@s.whatsapp.net",
            "923024927789@s.whatsapp.net",
            "923713382082@s.whatsapp.net",
            "923707463501@s.whatsapp.net",
            "923291297541@s.whatsapp.net"
        ]
    }
};

module.exports = config;
