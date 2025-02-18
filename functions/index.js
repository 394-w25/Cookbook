const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const API_KEY = functions.config().api.key;

// Helper function to encode an image to base64
const encodeImage = (imagePath) => {
    const imageBuffer = fs.readFileSync(imagePath); // Read the image as a buffer
    return imageBuffer.toString('base64'); // Convert the buffer to a base64 string
};

exports.sendOpenAIAPIRequest = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            // Encode the image to base64
            const base64Image = encodeImage(imagePath);

            const requestBody = {
                model: "gpt-4o-mini",  // You can use other models like text-curie-001, etc.
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Parse the text in this image and output a list with each index being each line of text in the image.", // Your prompt
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`, // Add the base64 image in the format
                                },
                            },
                        ],
                    }
                ],
                max_tokens: 100,  // Limits the number of tokens in the response
                temperature: 0.7,  // Controls the randomness of the output
                top_p: 1,  // Controls diversity via nucleus sampling
                n: 1,  // Number of completions to generate
            };

            const apiResponse = await axios.post("https://api.openai.com/v1/completions", requestBody, {
                headers: { "Authorization": `Bearer ${API_KEY}`, 
                            "Content-Type": 'application/json' },
            });

            res.status(200).json(apiResponse.data);
        } catch (error) {
            console.error("Error calling API:", error);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    });
});