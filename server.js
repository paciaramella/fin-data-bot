const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

// Use the CORS middleware
app.use(cors());
app.use(bodyParser.json());

// Replace with your OpenAI API key
require("dotenv").config();
const OPENAI_API_KEY = process.env.API_KEY;
app.post("/getDefinition", async (req, res) => {
  console.log("OPENAI_API_KEY", OPENAI_API_KEY);
  const metric = req.body.metric;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // Use the appropriate model
        messages: [
          { role: "system", content: `You are a financial expert.` },
          {
            role: "user",
            content: `Provide a detailed definition for the financial metric "${metric}".`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response);

    const definition = response.data.choices[0].message.content.trim();
    res.json({ definition });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.message);
    res
      .status(error.response.status || 500)
      .send("Error communicating with OpenAI");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
