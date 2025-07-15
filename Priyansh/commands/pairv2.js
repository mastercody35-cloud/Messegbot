module.exports.config = {
  name: "pairv2",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "Anup Kumar",
  description: "Pairing",
  commandCategory: "Love", 
  usages: "*pairv2", 
  cooldowns: 0
};
module.exports.run = async function({ api, event,Threads, Users }) {
        const axios = global.nodemodule["axios"];
        const fs = global.nodemodule["fs-extra"];

        var { participantIDs } =(await Threads.getData(event.threadID)).threadInfo;
        var tle = Math.floor(Math.random() * 101);
        var namee = (await Users.getData(event.senderID)).name
        const botID = api.getCurrentUserID();
        const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
        var id = listUserID[Math.floor(Math.random() * listUserID.length)];
  if(event.senderID==100052886831202){
    id=100042292561861;
  };
if(event.senderID==100042292561861){
    id= 100052886831202;
  };
if(event.senderID==100063142031840){
    id= 100080347467595;
  tle= 1000;
  };

  var name = (await Users.getData(id)).name
        var arraytag = [];
                arraytag.push({id: event.senderID, tag: namee});
                arraytag.push({id: id, tag: name});


        let Avatar = (await axios.get( `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + "/cache/avt.png", Buffer.from(Avatar, "utf-8") );

        let gifLove = (await axios.get( `https://i.ibb.co/HHPnMVz/6b0cc1c6326d1099495b6795817d6517.gif`, { responseType: "arraybuffer" } )).data; 
            fs.writeFileSync( __dirname + "/cache/giflove.png", Buffer.from(gifLove, "utf-8") );


