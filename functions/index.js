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

const API_KEY = functions.config().thirdparty.apikey; 

exports.callThirdPartyAPI = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            const apiResponse = await axios.get("https://api.example.com/data", {
                headers: { "Authorization": `Bearer YOUR_API_KEY` }
            });

            res.status(200).json(apiResponse.data);
        } catch (error) {
            console.error("Error calling API:", error);
            res.status(500).json({ error: "Failed to fetch data" });
        }
    });
});
