const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

// Use body-parser to parse incoming JSON requests
app.use(bodyParser.json());

// Replace with your OpenAI API key
require("dotenv").config();
const OPENAI_API_KEY = process.env.API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: userMessage,
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const chatbotReply = response.data.choices[0].text.trim();
    res.json({ reply: chatbotReply });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).send("Error communicating with OpenAI");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
