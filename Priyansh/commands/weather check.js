const axios = require("axios");

module.exports = {
  config: {
    name: "weather",
    aliases: ["wthr", "mosam"],
    version: "1.0",
    author: "Talha",
    countDown: 5,
    role: 0,
    shortDescription: "Get current weather",
    longDescription: "Check real-time weather for your location",
    category: "utility",
    guide: "{p}weather"
  },

  onStart: async function ({ api, event }) {
    try {
      const city = "Peshawar"; // 🌍 Change to your city if needed
      const API_KEY = "3bfc6bd6c8731d64d35ae3e0e31877f5"; // Free OpenWeatherMap API key
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

      const res = await axios.get(url);
      const data = res.data;

      const temp = data.main.temp;
      const feels = data.main.feels_like;
      const humidity = data.main.humidity;
      const wind = data.wind.speed;
      const sky = data.weather[0].description;
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

      const msg = 
`🌍 Weather in ${city}
🌡 Temp: ${temp}℃
🌡 Feels like: ${feels}℃
☁️ Sky: ${sky}
💦 Humidity: ${humidity}%
💨 Wind speed: ${wind}km/h
🌅 Sun rises: ${sunrise}
🌄 Sun sets: ${sunset}`;

      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Failed to fetch weather data.", event.threadID, event.messageID);
    }
  }
};
