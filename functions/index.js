const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

const API_KEY = functions.config().openai.key;  // Store API key in Firebase environment variables

exports.sendOpenAIAPIRequest = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { image } = req.body; // Receive base64 image string from frontend

            if (!image) {
                return res.status(400).json({ error: "No image provided" });
            }

            const requestBody = {
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Extract and format the text from this image into a structured recipe with title, ingredients, and instructions.",
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${image}`, // Use base64 data from frontend
                                },
                            },
                        ],
                    }
                ],
                max_tokens: 300,
                temperature: 0.5
            };

            const apiResponse = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            });

            res.status(200).json(apiResponse.data);
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            res.status(500).json({ error: "Failed to process image" });
        }
    });
});
