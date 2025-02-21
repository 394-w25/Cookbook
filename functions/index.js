const functions = require("firebase-functions/v1");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// import api keys from firebase config
const API_KEY = functions.config().openai.key;

exports.sendOpenAIAPIRequest = functions.https.onRequest((req, res) => {
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
                                text: `
                                    **Your Task:**

                                    Please parse the text in the provided image of a recipe, which is encoded in base64 format, and output a list where each index represents one line of text from the recipe. Make sure to maintain the exact order of lines as they appear in the image.

                                    **Instructions:**

                                    1. **Extract Text Line by Line:**
                                        - Decode the provided base64 encoded image and extract the text from the recipe.
                                        - Ensure that each line of text is captured separately as an individual entry in the list.
                                        - Maintain the correct order of lines as they appear in the recipe.

                                    2. **Formatting:**
                                        - Each line should be a separate entry in the list.
                                        - Preserve any special characters, measurements, ingredients, and instructions exactly as they appear.

                                    3. **Preserve Structure:**
                                        - Maintain the structure of the recipe, such as the ingredients list, step-by-step instructions, and any headings (e.g., "Ingredients," "Instructions").

                                    4. **Language Handling:**
                                        - If the recipe is written in a foreign language, translate it into **English** while ensuring accuracy in ingredient names, measurements, and instructions.
                                        - Maintain the original formatting and structure while providing the English translation.

                                    **The base64 encoded image for you to process is in the image section**
                                `,
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
                // Need to increase, it's cutting off some
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
