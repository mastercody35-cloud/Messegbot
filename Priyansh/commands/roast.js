module.exports = {
  config: {
    name: "roast",
    aliases: ["insult", "burn"],
    version: "2.0",
    author: "Talha ",
    countDown: 3,
    role: 0,
    shortDescription: "Roast someone hilariously",
    longDescription: "Tag someone to get a funny roast",
    category: "fun",
    guide: "{p}roast @user"
  },

  onStart: async function ({ api, event }) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention)
      return api.sendMessage("⚠️ Tag someone to roast!", event.threadID, event.messageID);

    const name = event.mentions[mention];
    const roasts = [

      `🤣 ${name}, teri dp dekh ke to Photoshop bhi resign kar gaya.`,
      `😂 ${name}, tu itna slow hai ke YouTube shorts bhi tere samne long videos lagti hain.`,
      `💀 ${name}, tera fashion sense dekh ke mannequin ne bhi aankh band kar li.`,
      `💩 ${name}, teri smile aisi lagti hai jaise network error ka emoji.`,
      `📴 ${name}, tu itna bekaar hai ke motivational speakers bhi tera example dete hain... kya na ban'na.`,
      `🚽 ${name}, tu group ka emoji hai — use to sab karte hain, samajhta koi nahi.`,
      `🧠 ${name}, tera dimaag recharge card jaisa hai — scratch karne pe bhi kuch nahi milta.`,
      `🕳️ ${name}, jab tu bolta hai na, to silence bhi volume badha leta hai.`,
      `📱 ${name}, tera face dekh ke Face ID bhi lock lagata hai.`,
      `🤖 ${name}, AI bhi confuse ho gayi thi: 'Error 404: Logic not found'.`,

      `🐸 ${name}, teri baatein sunkar frogs bhi mute ho gaye.`,
      `🔥 ${name}, tu roast nahi, puri BBQ platter hai.`,
      `🌪️ ${name}, tere jaise log dekh ke cyclone bhi direction change kar lete hain.`,
      `📉 ${name}, tera confidence sensex ki tarah hamesha neeche jaata hai.`,
      `🎃 ${name}, tu Halloween pe bina costume scary lagta hai.`,
      `🛑 ${name}, jab tu aata hai to luck bhi "offline" ho jata hai.`,
      `🧽 ${name}, tu itna useless hai ke sponge bhi kaam ka lagta hai.`,
      `🥴 ${name}, tu confuse nahi karta — tu confusion ka baap hai.`,
      `📦 ${name}, tere jokes sunke courier company ne bhi parcel bhejna band kar diya.`,
      `🥱 ${name}, tu itna boring hai ke sleep mode bhi active ho jaye.`,

      `🚫 ${name}, tu fail hone ka prototype hai.`,
      `🎭 ${name}, tu acting kare na kare, zindagi tujhe award deti hai: "Best Background Object"`,
      `🫥 ${name}, agar tu idea hota, to log innovation chor dete.`,
      `📸 ${name}, filter bhi tujhe dekh ke crash ho jata hai.`,
      `🍅 ${name}, tu roast nahi — seedha tomato ho, sirf chutney ke laayak.`,
      `📢 ${name}, jab tu joke sunata hai, audience mute pe chali jaati hai.`,
      `👣 ${name}, tera future Google Maps pe "not found" dikhata hai.`,
      `🧂 ${name}, tu itna salty hai ke Lays tere naam pe flavour nikaal de.`,
      `🔋 ${name}, tera energy level dead battery se bhi kam hai.`,
      `🚬 ${name}, tu stress deta nahi — tu khud stress hai.`,

      `📀 ${name}, tere jaise logon ki copy bhi recycle bin me hoti hai.`,
      `🎮 ${name}, tu game ka tutorial bhi fail kar de.`,
      `🪑 ${name}, jab tu group me aata hai, silence automatic hota hai.`,
      `🫗 ${name}, tu itna light hai ke hawa bhi ignore karti hai.`,
      `📚 ${name}, tujhe dekh ke dictionary ne new word banaya: "uselessaurus"`,
      `🛸 ${name}, aliens bhi tujhe abduct karne se mana kar gaye.`,
      `💳 ${name}, tu prepaid dimaag hai — khatam hone pe recharge bhi nahi hota.`,
      `🚿 ${name}, tu itna cringe hai ke log Insta scroll karte hue ruk jaate hain... block karne ke liye.`,
      `🎯 ${name}, tu goal nahi — distraction ka doosra naam hai.`,
      `🪓 ${name}, tu roast nahi, poora bandook ka target hai.`,

      `👎 ${name}, tu itna flop hai ke TikTok ne tujhe block kar diya.`,
      `🧢 ${name}, tu cool nahi, bas cold drink ki tarah dhoka hai.`,
      `🦠 ${name}, tu virus nahi — tu system crash hi hai.`,
      `🪞 ${name}, mirror bhi tujhe dekh ke toot jaata hai.`,
      `🔇 ${name}, tu gaana hota to Spotify tujhe "no results" bolta.`,
      `📡 ${name}, tu signal nahi — interference hai.`,
      `🔒 ${name}, jab tu hasti hai, duniya sad ho jaati hai.`,
      `👻 ${name}, horror movies tujhe dekh ke apna genre change kar leti hain.`,
      `🔮 ${name}, tera future dekh ke astrologer ne profession chhod diya.`,
      `🛜 ${name}, tu wifi pe chalta hai — kabhi connected, kabhi lost.`

    ];

    const burn = roasts[Math.floor(Math.random() * roasts.length)];
    api.sendMessage(burn, event.threadID, event.messageID);
  }
};
