const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });
const fs = require("fs");
const yaml = require("js-yaml");

const API_KEY = functions.config().openai.key;

// Load parseDataTemplate.yml and extract the prompt
let parseRecipePrompt = "";

try {
  const fileContents = fs.readFileSync("./parseDataTemplate.yml", "utf8");
  const yamlData = yaml.load(fileContents);
  parseRecipePrompt = yamlData.parse_recipe_prompt;
} catch (error) {
  console.error("Error loading YAML file:", error);
}

exports.sendOpenAIAPIRequest = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      const userPrompt = parseRecipePrompt.replace("{base64_encoded_image_here}", `data:image/jpeg;base64,${image}`);

      const requestBody = {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: userPrompt, // insert YAML prompt
              }
            ],
          }
        ],
        max_tokens: 1000, // Ensure full responses
        temperature: 0.5
      };

      const apiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          }
        }
      );

      res.status(200).json(apiResponse.data);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      res.status(500).json({ error: "Failed to process image" });
    }
  });
});
