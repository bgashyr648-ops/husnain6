const { cmd } = require('../command');

// 🌅 Good Morning Command (50 Messages)
cmd({
    pattern: "goodmorning",
    desc: "Good morning wishes for groups",
    category: "general",
    react: "🌅",
    filename: __filename,
    use: ".goodmorning"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Nayi subah, naya din, nayi umang! Muskurate rahiye. 🌅", "Utho aur duniya ko dikha do ki aaj ka din tumhara hai! 🔥",
        "Koshish itni karo ki kismat bhi kahe, 'Lele beta, ye tera haq hai'. 💎", "Har subah ek naya safar hai, hausla rakho toh sab behtar hai. 🛤️",
        "Zindagi jeene ke liye nazariya chahiye, na ki sirf saansein. ☕", "Manzil unhi ko milti hai, jinke sapno mein jaan hoti hai. 🌟",
        "Aaj ka din aapki mehnat aur kamyabi ka naam ho! 🚀", "Muskurahat aapki pehchan hai, ise kabhi khone na dein. 😊",
        "Waqt badalna hai toh mehnat karo, kismat badalni hai toh intezar karo. 🕰️", "Hausle buland ho toh aasman bhi jhukta hai. 🦁",
        "Nayi subah, nayi shuruaat, hamesha kuch naya karne ka jazba rakhein. ⚡", "Aapka aaj ka din kal se behtar ho. Good Morning! ☀️",
        "Success ka koi shortcut nahi hota, mehnat hi raasta hai. 💪", "Apni khushi ke zimmedar khud banein. 🌈",
        "Har subah aapko ek naya mauka deti hai. Sahi istemaal karein. 🎯", "Duniya mein kuch bhi naamumkin nahi, bas himmat chahiye. 🏆",
        "Khush rehna ek kala hai, ise seekhein. 🎨", "Aapke sapne bade hain, toh mehnat bhi badi honi chahiye. 💼",
        "Soch positive rakhein, sab achha hoga. ✨", "Aaj kuch aisa karein ki duniya yaad rakhe. 🌍",
        "Har mushkil ka hal nikalta hai, bas thoda sabr rakhein. ⏳", "Life simple hai, ise complicate mat karein. ✅",
        "Aapki mehnat hi aapki pehchan hai. 👊", "Good Morning! Aaj ka din khushiyon se bhara ho. 🌸",
        "Himmat mat haarein, agla kadam kamyabi ka ho sakta hai. 🆙", "Apne kaam se pyaar karein, result apne aap milega. 📈",
        "Har din ek nayi seekh le kar aata hai. 📚", "Muskuraiye, kyunki aap bahut special hain! 👑",
        "Self-belief hi success ki pehli seedhi hai. 🪜", "Aaj ka din aapki energy aur positive vibe se bhara ho. ⚡",
        "Mehnat kabhi zaya nahi jaati, bas waqt lagta hai. ⏳", "Ek nayi umeed ke saath din shuru karein. 🌅",
        "Zindagi ek race nahi, ek safar hai. Enjoy karein. 🏎️", "Apne aap ko improve karne mein lagayein din. 🚀",
        "Aapki positivity hi aapki asli power hai. 💪", "Aaj ka din aapki productivity ka din ho! 📝",
        "Kabhi mat roko, chalte raho. 🏃‍♂️", "Khush rehne ke liye chhote pal hi kaafi hote hain. 🎈",
        "Success raato-raat nahi milti, roz ki mehnat se milti hai. 🛠️", "Aapka potential unlimited hai, use pehchanein. 💎",
        "Positive rahen, positive sochein, positive ho jayega. 💫", "Aaj ka din aapki mehnat aur jazbe ke naam! 🔥",
        "Apne targets ko chote hisson mein baantein aur win karein. 🎯", "Confidence hi aapka sabse bada asset hai. 🕶️",
        "Zindagi mein ups and downs aate hain, par haar nahi maanni. 🧗‍♂️", "Good Morning! Aaj ka din shandaar ho. 🌞",
        "Har subah naya mauka lekar aati hai, use grab karein. 🤝", "Aapki smile se kisi ka din ban sakta hai. 😊",
        "Keep shining and keep rising! 🌟", "Aaj ka din aapke liye best ho! 👑"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    let msg = `┏━━━━━━━━━━━━━━━━━━┓\n   👑 *Good morning 🌞🌞* 👑\n┗━━━━━━━━━━━━━━━━━━┛\n\n✨ ${randomQuote}\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n*Powered by Love MD*`;
    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});

// 🌙 Good Night Command (50 Messages)
cmd({
    pattern: "goodnight",
    desc: "Good night wishes for groups",
    category: "general",
    react: "🌙",
    filename: __filename,
    use: ".goodnight"
}, async (conn, mek, m, { reply }) => {
    const quotes = [
        "Raat ki khamoshi mein sukoon dhoondhein. Shubhratri! 🌙", "Kal phir naye jazbe ke saath milenge. Good Night! ✨",
        "Sapne dekhein, unhe pura karne ki himmat rakhein. 🌟", "So jao, kyunki kal phir ek badi jeet intezar kar rahi hai. 😴",
        "Andhera mitane ke liye ek diya hi kaafi hai, aur din banane ke liye ek sapna. 🕯️", "Raat ka sukoon aapki thakaan mita de. 💤",
        "Chaand ki chandni aur taaron ki roshni aapke sapno ko sajaye. 🌌", "Zindagi mein sukoon chahiye toh thoda khud ko waqt dena seekho. 🌃",
        "Kal ka suraj nayi umeed layega. Chain se so jao. 🌙", "Har raat ek nayi shiksha hai, agle din ki taiyari hai. 💫",
        "Sapno ki duniya mein kho jao, kal reality jeetni hai. 🏆", "Raat bakhair! Apne goals ko yaad karke soyein. 📝",
        "Dil halka rakhein, achhe sapne aayenge. 💖", "So jao, duniya tab tak aapka intezar kar sakti hai. 🌍",
        "Raat ka waqt relaxation ke liye hai. Enjoy! 🍹", "Kal ek aur chance milega behtar banne ka. 🚀",
        "Sapne wahi hain jo sone na dein. Par abhi so jao! 😉", "Good Night! Kal ki taiyari aaj raat se shuru. ⚡",
        "Raat ki shaanti mein apne aap se baat karein. 🧘‍♂️", "Aapka har khwab sach ho, bas mehnat jari rakhein. 💎",
        "Shubhratri! Kal ki subah naye rang layegi. 🌈", "Apni worries ko chhodiye, kal naya din hai. ☀️",
        "Sone se pehle ek smile zaroor dein. 😊", "Night is just a bridge to the next morning. 🌉",
        "Aaram karo, kyunki aapne aaj bahut mehnat ki hai. 💪", "Raat ka sukoon aapke liye best ho. 🌙",
        "Sapne bade dekhein, unhe pura karne ka hausla rakhein. 🦁", "Shubhratri! Kal ke liye energy save karein. 🔋",
        "Raat ki gehrayi mein apne sapno ko tarsein. 🌌", "So jao, kal duniya fateh karni hai! 🔥",
        "Khwab achhe hon toh neend bhi achhi aati hai. 😴", "Stay positive, even in your dreams. ✨",
        "Kal phir ek naya challenge, kal phir ek nayi jeet. 🏁", "Apne aap ko kal ke liye refresh karein. 🔄",
        "Raat bakhair! Sab achha hoga. 👍", "Sapno ki udaan bharo, kal haqeeqat banana hai. ✈️",
        "Night time is for resting your mind. 🧠", "Shubhratri! Hope you have sweet dreams. 🍬",
        "Don't worry, just sleep and wake up refreshed. 🌊", "Kal ka din aapka hai! 👑",
        "Raat ki chandni aapko sukoon de. 🌙", "Dream big, sleep well. 🛌",
        "Good Night! Kal phir milenge naye jazbe ke saath. 🤝", "Aapka kal aaj se behtar ho! ✨",
        "Take a deep breath and sleep peacefully. 🧘‍♀️", "Tomorrow is another day to shine. 🌟",
        "So jao, kal phir se grind shuru karna hai. 🛠️", "Good Night! Stay blessed. 🌟",
        "Raat ka sukoon aur kal ki umeed! 🌅", "Shubhratri, doston! 💤"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    let msg = `┏━━━━━━━━━━━━━━━━━━┓\n   👑 *Good night 😴😴😴* 👑\n┗━━━━━━━━━━━━━━━━━━┛\n\n✨ ${randomQuote}\n\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n*Powered by Love MD*`;
    return await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
});
