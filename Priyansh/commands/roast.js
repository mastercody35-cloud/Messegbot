module.exports = {
  config: {
    name: "roast",
    aliases: ["burn", "insult"],
    version: "2.0",
    author: "Owner: Talha 💀",
    countDown: 2,
    role: 0,
    shortDescription: "🔥 Roast command",
    longDescription: "Funny 50+ line roasts for fun in group",
    category: "fun",
    guide: "{p}roast @mention"
  },

  onStart: async function ({ api, event }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) {
      return api.sendMessage("⚠️ Tag someone to roast.\n\nExample: *roast @someone", event.threadID, event.messageID);
    }

    const name = event.mentions[mention[0]].replace("@", "");
    const roasts = [

      // 🔥 Top 50+ Funny Roasts
      `${name}, tu roast nahi, poora burnt toast hai. 🍞`,
      `${name}, teri DP dekh ke log Facebook uninstall kar dete hain.`,
      `${name}, tera sense of humor itna weak hai ke Google bhi search nahi karta.`,
      `${name}, tu itna bekar hai ke NASA bhi tujhe space me bhejne se inkaar karta hai.`,
      `${name}, tujhe dekh ke wifi signals bhi chali jaati hain.`,
      `${name}, tu itna cringe hai ke Tiktok tujhe permanently ban kar de.`,
      `${name}, teri shakal dekh ke mirror bhi turn off ho jaye.`,
      `${name}, jab tu bolta hai to lagta hai jaise Siri ne suicide kar liya ho.`,
      `${name}, tu itna slow hai ke snail bhi tujhe overtake kar jaye.`,
      `${name}, tera fashion sense dekh ke mannequins bhi resign karte hain.`,

      `${name}, tu roast nahi, puri BBQ plate hai.`,
      `${name}, tera logic aise hai jaise Windows XP ka update.`,
      `${name}, tu aisi mistake hai jo autocorrect bhi ignore kar deta hai.`,
      `${name}, tu itna bekar hai ke motivational speakers bhi tujhe ignore karte hain.`,
      `${name}, tu group ka charging cable hai – sab chahiye hota hai, koi sambhalta nahi.`,
      `${name}, tujhme talent hai – logon ko irritate karne ka.`,
      `${name}, tu jaise hi online aata hai, sabki battery low ho jaati hai.`,
      `${name}, tu error ka upgraded version lagta hai.`,
      `${name}, tujhe dekh ke dard bhi sharma jaata hai.`,
      `${name}, tu roast nahi – live warning ho.`,

      `${name}, tu itna invisible hai ke apne birthday pe bhi log bhool jaate hain.`,
      `${name}, tu background noise hai – sabko disturb karta hai, kisi kaam ka nahi.`,
      `${name}, tera future dark web me bhi visible nahi hai.`,
      `${name}, tu Google pe search ho to result mile: ‘Sorry, we don’t know this trash.’`,
      `${name}, tu vaccine ka side effect lagta hai.`,
      `${name}, tujhe banaya kisne? Software crash kar gaya tha kya?`,
      `${name}, jab tu paida hua tha, doctor ne bola: ‘Error 404 – soul not found.’`,
      `${name}, tu roast nahi, full system shutdown hai.`,
      `${name}, jab tu group me message karta hai, notifications khud hi mute ho jaati hain.`,
      `${name}, teri baatein sun ke AirPods bhi disconnect ho jaate hain.`,

      `${name}, tu logic ka dushman hai.`,
      `${name}, tu itna boring hai ke neend bhi tujhe avoid karti hai.`,
      `${name}, tera sense of style = lagan movie ke kapde.`,
      `${name}, tu power bank ho – khud dead, aur dusron ko bhi karta hai.`,
      `${name}, tujhe dekh ke sad music bhi khush ho jaata hai.`,
      `${name}, tu itna weak hai ke cartoon bhi tujhe strong dikhte hain.`,
      `${name}, tujhe chappal nahi, direct uninstall ki zarurat hai.`,
      `${name}, jab tu chalta hai, zameen bhi regret karti hai.`,
      `${name}, tu itna flop hai ke background dancers bhi front pe aa jate hain.`,
      `${name}, tera brain Google Drive pe corrupt file jaisa hai.`,

      `${name}, tujhme itna talent hai ke award: “Best Waste of Oxygen” milna chahiye.`,
      `${name}, tu PUBG me chicken dinner nahi – raw potato hai.`,
      `${name}, tujhe roast karne ke liye to fire brigade bulani padegi.`,
      `${name}, tu filter se nahi, miracle se sudhar sakta hai.`,
      `${name}, tu group ka dustbin hai – sab kuch daal diya jata hai.`,
      `${name}, teri baat sun ke AI bhi shut down ho gayi.`,
      `${name}, tu roast nahi – burnt hard disk hai.`,
      `${name}, tu bluetooth hai – kaam ka nahi, connect bhi nahi hota.`,
      `${name}, tu logic nahi – full lag hai.`,
      `${name}, tu admin ka friend hota to group delete kar deta.`,

      `Aur yaad rakh, Owner: Talha ne ye roast personally approve kiya hai. 🔥`
    ];

    const burn = roasts[Math.floor(Math.random() * roasts.length)];
    api.sendMessage(burn, event.threadID, event.messageID);
  }
};
