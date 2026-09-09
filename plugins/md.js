const { cmd } = require('../command');

cmd({
    pattern: "md",
    desc: "Bot ke malikan ki tafseelat",
    category: "general",
    react: "👑",
    filename: __filename,
    use: ".md"
}, async (conn, mek, m, { reply }) => {
    try {
        const sher = [
            "Hum sher hain, humari dahad se zamana darta hai, humne aaj tak kisi ke samne sir nahi jhukaya.",
            "Dushman bhi humari izzat karte hain, kyunke hum apni marzi se jeena jante hain.",
            "Badmashi toh bachpan ka shauk hai, par humari asli pehchan humara rutba hai.",
            "Humara raasta koi rok sake, abhi itni kisi mein himmat nahi.",
            "Log kehte hain hum badmash hain, hum kehte hain hum bas apne usoolon ke pakke hain.",
            "Sher ki dahad aur humara naam, dono hi kaafi hain dushmanon ko chup karane ke liye.",
            "Hum apne raaste khud banate hain, kisi ke mohtaj hokar chalna humari fitrat mein nahi.",
            "Attitude toh khoon mein hai, aur dabdaba humare naam ka hai.",
            "Jahan hum khade hote hain, wahan se hi naya daur shuru hota hai.",
            "Sher kabhi khamosh nahi hota, bas apne waqt ka intezar karta hai.",
            "Humara andaz sabse juda hai, tabhi toh dunya humari fan hai.",
            "Dosti mein jaan dete hain, aur dushmani mein jahan hila dete hain.",
            "Humne toh bas raaj karna seekha hai, kisi ke aage jhukna humari dictionary mein nahi.",
            "Humara naam hi kaafi hai, dushmanon ke hosh udaane ke liye.",
            "Sher hain hum, humein kaid karna kisi ke bas ki baat nahi.",
            "Hukam dena humari fitrat hai, aur humara hukam patthar ki lakeer hai.",
            "Badmashi toh sirf ek naam hai, asli asliyat toh humara rutba hai.",
            "Dunya ke usool hum par laagu nahi hote, hum apne usool khud banate hain.",
            "Humse takrao ge toh choor choor ho jaoge, kyunke hum toofan hain.",
            "Bagga Sher MD ka raaj hai, yahan sirf humara dabdaba chalta hai."
        ];

        const randomSher = sher[Math.floor(Math.random() * sher.length)];

        const ownerInfo = `BAGGA SHER MD - OWNER PANEL

---

${randomSher}

---

BAGGA SHER MD SINEAIR DAWALPOR

ASIF HAFIZ MD JUNIAR DAWALPOR

HAMID FIDA MD APLIKASHAN MASTAR

DANGEROUS AND HACKER BOY MD ALL MASTAR

---

🔥 Hukam ke ghulam nahi, hum khud apni misaal hain.
Stay connected with the Power! ⚡`;
        
        await reply(ownerInfo);
    } catch (e) {
        console.log(e);
        reply("Bhai, MD panel load hone mein koi technical masla aa gaya hai!");
    }
});
