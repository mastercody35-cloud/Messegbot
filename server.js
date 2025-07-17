const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Facebook Webhook Verification
app.get("/webhook", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token && token === VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Main webhook to receive messages
app.post("/webhook", async (req, res) => {
    const body = req.body;

    if (body.object === "page") {
        for (const entry of body.entry) {
            const webhookEvent = entry.messaging[0];
            const senderId = webhookEvent.sender.id;

            if (webhookEvent.message && webhookEvent.message.text) {
                const userMessage = webhookEvent.message.text;
                const songLink = await searchYouTube(userMessage);
                await sendMessage(senderId, `🎵 Here's your song:\n${songLink}`);
            }
        }

        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
});

// YouTube Song Search Function
async function searchYouTube(query) {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=1`;

    try {
        const response = await axios.get(url);
        const videoId = response.data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
    } catch (error) {
        console.error("YouTube API Error:", error.message);
        return "❌ Sorry, song not found.";
    }
}

// Send message to user using Messenger Send API
async function sendMessage(senderId, text) {
    const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;

    try {
        await axios.post(url, {
            recipient: { id: senderId },
            message: { text: text },
        });
    } catch (error) {
        console.error("Failed to send message:", error.message);
    }
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Bot is running on port ${PORT}`));
