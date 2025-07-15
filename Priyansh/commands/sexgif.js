module.exports.config = {
  name: "sexgif",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "TALHA",
  description: "Chaeyoung Pictures.",
  commandCategory: "Image",
  cooldowns: 1,
  dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
  var link = [
"https://i.imgur.com/7s2MnDe.gif",
"https://i.imgur.com/RBwPdKP.gif",
"https://i.imgur.com/bhVxvfl.gif",
"https://i.imgur.com/Rv3XIlQ.gif",
"https://i.imgur.com/HVqz112.gif",
"https://i.imgur.com/O1bXLd0.gif",
"https://i.imgur.com/eSCHzQq.gif",
"https://i.imgur.com/1hF4oPs.gif",
"https://i.imgur.com/v57liqG.gif",
"https://i.imgur.com/9oR4FW5.gif",
"https://i.imgur.com/EuUpu4y.gif",
"https://i.imgur.com/bwII0ZG.gif",
"https://i.imgur.com/hB5fS0H.gif",
"https://i.imgur.com/nsNTabu.gif",
"https://i.imgur.com/MQwM3r4.gif",
"https://i.imgur.com/hyTU9Xr.gif",
"https://i.imgur.com/8RQBaMV.gif",
"https://i.imgur.com/pE4CTts.gif",
"https://i.imgur.com/7mgkJ25.gif",
"https://i.imgur.com/ntlf4Lo.gif",
"https://i.imgur.com/xdiDAXr.gif",
"https://i.imgur.com/I1GiBFp.gif",
"https://i.imgur.com/fRI7UrM.gif",
"https://i.imgur.com/y6Eepby.gif",
"https://i.imgur.com/nPw6v5D.gif",
"https://i.imgur.com/9W6rjA0.gif",
"https://i.imgur.com/4WQ5Xx3.gif",
"https://i.imgur.com/WZmdtpT.gif",
"https://i.imgur.com/XKQnhcU.gif",
"https://i.imgur.com/fLAFsgu.gif","https://i.imgur.com/RVmqqP2.gif","https://i.imgur.com/xq6b6l9.jpeg","https://i.imgur.com/Lu88ktE.gif","https://i.imgur.com/9RmR87J.gif",    "https://i.imgur.com/LrWWg5M.gif",
  ];
   var callback = () => api.sendMessage({body:`Here is a picture of the Chaeyoung \nNumber of photos available: ${link.length}`,attachment: fs.createReadStream(__dirname + "/cache/5.gif")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/5.gif"));	
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/5.gif")).on("close",() => callback());
   };
