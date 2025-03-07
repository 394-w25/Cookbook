const functions = require("firebase-functions/v1");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// import api keys from firebase config
const API_KEY = functions.config().openai.key;

exports.parseImage = functions.https.onRequest((req, res) => {
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
          },
        ],
        // Need to increase, it's cutting off some
        max_tokens: 5000,
        temperature: 0.5,
      };

      const apiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json(apiResponse.data);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  });
});


exports.updateRecipeWithChatbot = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { image, input, journalEntry, recipeText } = req.body;
      
      console.log("image!", image);
      console.log("input!", input);
      console.log("journalEntry!", journalEntry);
      console.log("recipeText!", recipeText);

      const requestBody = {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that modifies recipes based on user requests while strictly preserving the existing formatting.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `# Modify Recipe

            You will receive a recipe, a journal entry, and an image link. Your task is to modify the recipe, journal entry, or image based on the provided instruction.

            ## Instructions:
            - Carefully **follow the modification request** provided in the Modification Request.
            - Keep the **recipe title, ingredient structure, and instructions format exactly the same** unless instructed otherwise.
            - Maintain **Markdown formatting**, including:
            - # Title for the recipe name.
            - ## Ingredients for ingredients.
            - ## Instructions for steps.
            - Use "-" for unordered lists and "1." for ordered lists.
            - If an image change is requested, **replace the image URL** accordingly.
            - Ensure modifications **stay logical and relevant**.
            - Return the modified content in the exact same structure.

            ## Recipe Before Modification:
            ${recipeText}

            ## Journal Entry Before Modification:
            ${journalEntry}

            ## Image Before Modification:
            ${image}

            ## Modification Request:
            ${input}

            ## Return Format:
            - Recipe in the **same format**.
            - Journal entry in the **same format**.
            - Image as a URL string (if modified).

            Modify accordingly and output the complete updated version.`,
              },
            ],
          },
        ],
        max_tokens: 16000,
        temperature: 0.5,
      };

      const apiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(apiResponse);

      res.status(200).json(apiResponse.data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res
        .status(500)
        .json({ error: "Failed to process modification request." });
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
                            A: ${answers[2]}`,
          },
        ],
        max_tokens: 1024,
      };

      const apiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res
        .status(200)
        .json({ journal: apiResponse.data.choices[0].message.content });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to process answers" });
    }
  });
});

exports.generateImage = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { title, ingredients, steps } = req.body; // Receive prompt from frontend

      if (!title || !ingredients || !steps) {
        return res
          .status(400)
          .json({
            error: "Must provide the recipe title, ingredients, and steps",
          });
      }

      const requestBody = {
        model: "dall-e-3",
        prompt: `Imagine you are a professional photographer.
                Generate a high-quality, delicious-looking, home-cooked, image of this recipe of ${title}, 
                given that it is made with these ingredients:
                ${ingredients}
                and follows these instructions:
                ${steps}
                Ensure that the food looks realistically made and the presentation is accurate to the recipe.`,
        n: 1,
      };

      const apiResponse = await axios.post(
        "https://api.openai.com/v1/images/generations",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({ generatedImage: apiResponse.data.data[0].url });
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to generate an image" });
    }
  });
});
