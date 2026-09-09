const { cmd } = require('../command');

// 1. I Love You Command (50 Romantic Shayari)
cmd({
    pattern: "iloveyou",
    desc: "Sends romantic shayari",
    category: "general",
    react: "❤️",
    filename: __filename,
    use: ".iloveyou"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Mohabbat ka koi rang nahi hota, phir bhi wo rangin hai. I Love You! ❤️", "Teri aankhon mein meri duniya dikhti hai. ❤️",
        "Zindagi ki har khushi tere naam, tu hi mera pyaar hai. 🌹", "Dil dhadakta hai toh bas teri yaad mein. ✨",
        "Log kehte hain ishq ek saza hai, hum kehte hain ishq maza hai. 💖", "Tumhari muskurahat mere liye duniya ki sabse badi daulat hai. 🥰",
        "Pyaar wo ehsas hai jo kabhi kam nahi hota. ❤️", "Meri har subah aur har raat tumse shuru hoti hai. 🌅",
        "Tumhare bina ye zindagi adhuri hai. 🥀", "Ishq mein doob jana hi asli jeet hai. 💫",
        "Tumse milna jaise khuda se milna. 😇", "Har pal sirf tumhara intezar rehta hai. ⏳",
        "Mohabbat ki rahon mein bas tumhara saath chahiye. 🛣️", "Tumhari yaadein hi meri rooh ki khurak hain. 🧠",
        "Khuda ne fursat se tumhe banaya hai. ✨", "Tumhare bina saans lena bhi mushkil hai. 💔",
        "Meri har dua mein tum shamil ho. 🙏", "Ishq mein har gham khushi lagta hai. 😊",
        "Tumhare liye meri mohabbat kabhi kam na hogi. ♾️", "Zindagi ke har mod par tumhara saath chahiye. 🤝",
        "Tumhari har ada par fida hoon. 😍", "Mohabbat mein jeena aur marna dono khoobsurat hai. 🌹",
        "Tum meri dhadkan ho. ❤️", "Tumhari aankhon mein kho jane ka dil karta hai. 🌊",
        "Pyaar mein hi zindagi ka asli maza hai. 💖", "Tumhari ek jhalak se din ban jata hai. 🌟",
        "Har lamha tumhare naam. 🕰️", "Tumse mohabbat ek ibaadat hai. 📿",
        "Tum meri rooh ka sukoon ho. 🕊️", "Meri har khushi tumse judi hai. 😊",
        "Tumhare bina ye dil udaas rehta hai. 🌧️", "Ishq mein sab kuch qurbaan hai. 💎",
        "Tum meri kismat ka sitara ho. ⭐", "Tumhare saath bitaya har pal anmol hai. ⏳",
        "Mohabbat mein hi khuda milta hai. 🕌", "Tum meri zindagi ka wo hissa ho jiske bina main kuch nahi. 🌍",
        "Tumhari baaton mein hi mera sukoon hai. 🗣️", "Ishq ek nashe ki tarah hai. 🍷",
        "Tumhe pa kar sab kuch paa liya. 🏆", "Meri har baat tum par khatam hoti hai. 🏁",
        "Tum meri manzil ho. 🎯", "Tumse door jana namumkin hai. 🚫",
        "Har khwab mein tum aate ho. 😴", "Mohabbat ka safar tumhare sang hi achha hai. 🛤️",
        "Tum meri duniya ki roshni ho. 💡", "Tumhare bina andhera hi andhera hai. 🌑",
        "Pyaar mein har musibat aasan hai. 💪", "Tum hi ho jisse main sabse zyada pyaar karta hoon. 💖",
        "Meri har dhadkan mein tumhara naam hai. ❤️", "Tumse ishq karna meri fitrat hai. 🌹",
        "Duniya se kya darna, jab tum saath ho. 🤝", "Tum meri rooh ka sukoon ho. ✨",
        "Meri har khushi ka raaz tum ho. 🤫"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    let msg = `┏━━━━━━━━━━━━━━━━━━┓\n   ❤️ *LOVE MD - ROMANCE* ❤️\n┗━━━━━━━━━━━━━━━━━━┛\n\n✨ ${randomQuote}\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n*Powered by Love MD*`;
    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});

// 2. Hi Command (50 Hi Shayari/Greetings)
cmd({
    pattern: "hi",
    desc: "Sends greeting for Hi",
    category: "general",
    react: "👋",
    filename: __filename,
    use: ".hi"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Hi! Kaise hain aap? 🤝", "Aap aaye toh bahar aa gayi! 👋", "Hi! Muskurate rahiye. 😊", 
        "Ek chhota sa Hi, aapki yaad dilane ke liye. ✨", "Hi! Kya chal raha hai? 💬", 
        "Hi! Aapke din ki shuruaat achhi ho. ☀️", "Hi! Aaj ka din kaisa raha? 📅", 
        "Hi! Hamesha khush rahein. 🌸", "Hi! Koi nayi khabar? 🗞️", "Hi! Apne dost ko yaad kiya? 🤗",
        "Hi! Aapki vibes bahut positive hain. ⚡", "Hi! Mil kar achha laga. 🤝", "Hi! Hope all is well. ✅",
        "Hi! Thinking of you. 🤔", "Hi! Have a great day. 🌟", "Hi! Keep smiling. 😊",
        "Hi! Life kaisi hai? 🌍", "Hi! Kuch khaas? 🎈", "Hi! Aapke messages ka intezar rehta hai. 📩",
        "Hi! Just saying hi to my friend. 👋", "Hi! Hope your day is productive. 📈", "Hi! Stay blessed. 🤲",
        "Hi! Cheers to friendship. 🥂", "Hi! Sab thik? 👍", "Hi! You are awesome. 👑",
        "Hi! Long time no talk. 🕒", "Hi! Catch up soon? 🏃‍♂️", "Hi! Enjoy your moment. ⏳",
        "Hi! Stay positive. 🌈", "Hi! Sending good vibes. 💫", "Hi! You're special. 💎",
        "Hi! Wishing you happiness. ✨", "Hi! Make today count. 🔥", "Hi! Stay focused. 🎯",
        "Hi! Smile, it suits you. 😊", "Hi! How's everything? ❓", "Hi! Good to see you. 👀",
        "Hi! Let's have a great day. 🌞", "Hi! Never give up. 💪", "Hi! You inspire me. 🌟",
        "Hi! Stay cool. 😎", "Hi! Be kind to yourself. 💖", "Hi! Success is coming. 🏆",
        "Hi! Keep dreaming. 🌙", "Hi! Everything will be fine. 👍", "Hi! Stay humble. 🙏",
        "Hi! You're doing great. 🚀", "Hi! Take care. 🌹", "Hi! Talk to you later. 📞", "Hi! Love from Love MD. ❤️"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    let msg = `┏━━━━━━━━━━━━━━━━━━┓\n   👋 *LOVE MD - HI* 👋\n┗━━━━━━━━━━━━━━━━━━┛\n\n✨ ${randomQuote}\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n*Powered by Love MD*`;
    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});

// 3. Hello Command (50 Hello Shayari/Greetings)
cmd({
    pattern: "hello",
    desc: "Sends greeting for Hello",
    category: "general",
    react: "👋",
    filename: __filename,
    use: ".hello"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Hello! Kaise hain aap? 👋", "Hello! Muskurahat aapki pehchan hai. 😊", "Hello! Khushiyan aapke kadam chumein. ✨",
        "Hello! Aaj kuch naya ho jaye? 💡", "Hello! Aapki yaad aa gayi. 💭", "Hello! Hope you are doing great. 🌟",
        "Hello! Duniya mein sab khairiyat? 🌍", "Hello! Good to connect. 🤝", "Hello! Keep shining. ☀️",
        "Hello! Apne kaam mein busy? 🛠️", "Hello! Just checking in. 👀", "Hello! Aisi hi baatein hoti rahen. 🗣️",
        "Hello! Stay happy always. 🌸", "Hello! You're a true friend. 💖", "Hello! Hope you are safe. 🛡️",
        "Hello! What's up? ❓", "Hello! Enjoying the day? 🎈", "Hello! Life is beautiful. 🌈",
        "Hello! Sending positive energy. 💫", "Hello! You have great taste. 🕶️", "Hello! Always be yourself. ✨",
        "Hello! Let's make memories. 📸", "Hello! Dream big. 🌟", "Hello! Keep working hard. 💪",
        "Hello! Success awaits you. 🏆", "Hello! Take a break. ☕", "Hello! You are valuable. 💎",
        "Hello! Stay strong. 🦁", "Hello! Believe in yourself. 🪜", "Hello! Tomorrow will be better. 🌅",
        "Hello! Don't stress. 😌", "Hello! Find your peace. 🧘‍♂️", "Hello! You're amazing. 👑",
        "Hello! Keep going. 🏃‍♂️", "Hello! Love the energy. ⚡", "Hello! Stay connected. 🌐",
        "Hello! Have fun. 🎉", "Hello! Best of luck. 🍀", "Hello! Proud of you. 👏",
        "Hello! Take care of yourself. 🩺", "Hello! See you soon. 👋", "Hello! Keep learning. 📚",
        "Hello! Growth is key. 📈", "Hello! You shine bright. ✨", "Hello! Everything happens for a reason. 🌟",
        "Hello! Stay grateful. 🙏", "Hello! Life is a gift. 🎁", "Hello! You deserve the best. 🏅",
        "Hello! Cheers to new beginnings. 🥂", "Hello! Love MD is here to serve. 👑"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    let msg = `┏━━━━━━━━━━━━━━━━━━┓\n   👋 *LOVE MD - HELLO* 👋\n┗━━━━━━━━━━━━━━━━━━┛\n\n✨ ${randomQuote}\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n*Powered by Love MD*`;
    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});
