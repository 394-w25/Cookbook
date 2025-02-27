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

                                    Please parse the text in the provided image of a recipe, which is encoded in base64 format, and output the extracted text in **Markdown format**, ensuring proper structure using headings, lists, and formatting for clarity.

                                    ## Instructions

                                    ### 1. Extract Text Line by Line
                                    - Decode the provided base64-encoded image and extract the text from the recipe.
                                    - Ensure that each line of text is captured separately while preserving the correct order.

                                    ### 2. Formatting
                                    - Use **Markdown** for proper structuring:
                                    - The **recipe title** should be formatted as a first-level heading (\`# Title\`) where Title is just the name of the dish.
                                    - **Section names** (e.g., Ingredients, Instructions) should be formatted as second-level headings (\`## Section Name\`).
                                    - Ingredients and steps should be formatted as bullet points (\`- Item\`) or ordered lists (\`1. Step\`).
                                    - Do not apply \`#\` to content other than section headings.
                                    - Maintain **bold** and *italic* text where applicable.

                                    ### 3. Preserve Structure
                                    - Maintain the original logical structure of the recipe:
                                    - **Ingredients** should appear under \`## Ingredients\`.
                                    - **Step-by-step instructions** should be under \`## Instructions\`.
                                    - Any additional sections (e.g., "Notes," "Serving Suggestions") should be preserved with appropriate headings.

                                    ### 4. Language Handling
                                    - If the recipe is in a **foreign language**, translate it into **English**.
                                    - Ensure **accuracy** in ingredient names, measurements, and instructions.
                                    - Retain the original **formatting and structure** while providing the English translation.

                                    **The base64-encoded image for you to process is in the image section.**
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


exports.sendOpenAIAPIRequestWOImage = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const { prompt } = req.body; 

            if (!prompt) {
                return res.status(400).json({ error: "No prompt provided" });
            }

            const requestBody = {
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt,
                            },
                        ],
                    }
                ],
                // Need to increase, it's cutting off some
                max_tokens: 700,
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
            res.status(500).json({ error: "Failed to process question prompt" });
        }
    });
});

exports.writejournal = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            const { answers } = req.body; // Receive answers as array from frontend

            if (answers.length !== 3) {
                return res.status(400).json({ error: "Need 3 answers" });
            }
            
            const requestBody = {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are an experienced chef who can summarize answers to questions from user input. 
                        You are writing a journal entry based on answers. Make the entry feel organic while maintaining correctness based on the answers.`,
                    },
                    {
                        role: "user",
                        content: `Here are my answers to the questions:
                            Q: Who invented this recipe and when is it usually made?
                            A: ${answers[0]}
                            Q: What is a memory that you associate with this recipe?
                            A: ${answers[1]}
                            Q: What makes this recipe unique in your family?
                            A: ${answers[2]}`
                    }
                ],
                max_tokens: 1024,
            };

            const apiResponse = await axios.post("https://api.openai.com/v1/chat/completions", requestBody, {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            });

            res.status(200).json({ journal: apiResponse.data.choices[0].message.content });
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            res.status(500).json({ error: "Failed to process answers" });
        }
    });
});