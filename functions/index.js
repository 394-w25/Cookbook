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
                                    # Your Task

                                    Please parse the text in the provided image of a recipe, which is encoded in base64 format, and output the extracted text in **Markdown format**, using appropriate **headings, subheadings, lists, and formatting** to maintain clarity and structure.

                                    ## Instructions

                                    ### 1. Extract Text Line by Line
                                    - Decode the provided base64-encoded image and extract the text from the recipe.
                                    - Ensure that each line of text is captured separately while preserving the correct order.
                                    
                                    ### 2. Formatting
                                    - Use **Markdown** to structure the output properly:
                                        - Recipe **title** as "# Title"
                                        - **Section headers** (e.g., Ingredients, Instructions) as "## Section Name"
                                        - Ingredients and steps formatted as **bullet points ("-" or "1.")**
                                        - Maintain **bold** and *italic* text where applicable.

                                    ### 3. Preserve Structure
                                    - Maintain the natural structure of the recipe, ensuring that:
                                        - **Ingredients** appear under "## Ingredients"
                                        - **Step-by-step instructions** appear under "## Instructions"
                                        - Any **additional sections** (e.g., "Notes," "Serving Suggestions") are preserved.

                                    ### 4. Language Handling
                                    - If the recipe is written in a **foreign language**, translate it into **English**.
                                    - Ensure **accuracy** in ingredient names, measurements, and instructions.
                                    - Maintain the original **formatting and structure** while providing the English translation.

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
