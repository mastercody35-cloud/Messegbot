module.exports.config = {
  name: "pair4",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Khoa",
  description: "It's a compound :>",
  commandCategory: "Giải trí",
  usages: "",
  dependencies: {
        "axios": "",
        "fs-extra": ""
  },
  cooldowns: 0
}

module.exports.run = async function ({ args, Users, Threads, api, event, Currencies }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/background.png";
  let pathAvt1 = __dirname + "/cache/Avtmot.png";
  let pathAvt2 = __dirname + "/cache/Avthai.png";
  
  var id1 = event.senderID;
  var name1 = await Users.getNameUser(id1);
  var ThreadInfo = await api.getThreadInfo(event.threadID);
  var all = ThreadInfo.userInfo
  for (let c of all) {
    if (c.id == id1) var gender1 = c.gender;
  };
  const botID = api.getCurrentUserID();
  let ungvien = [];
  if(gender1 == "FEMALE"){
    for (let u of all) {
      if (u.gender == "MALE") {
      if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
      }
    }
  }
  else if(gender1 == "MALE"){
    for (let u of all) {
      if (u.gender == "FEMALE") {
      if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
      }
    }
  }
  else {
  for (let u of all) {
      if (u.id !== id1 && u.id !== botID) ungvien.push(u.id)
    }
  }
  var id2 = ungvien[Math.floor(Math.random() * ungvien.length)];
  var name2 = await Users.getNameUser(id2);
  var rd1 = Math.floor(Math.random() * 100) + 1;
  var cc = ["0", "-1", "99,99", "-99", "-100", "101", "0,01"];
