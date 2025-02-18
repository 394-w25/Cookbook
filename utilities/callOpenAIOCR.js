// https://us-central1-generationalcookbook.cloudfunctions.net/sendOpenAIAPIRequest

import OpenAI from "openai";
const openai = new OpenAI();
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const sendOpenAIAPIRequest = httpsCallable(functions, 'sendOpenAIAPIRequest');

sendOpenAIAPIRequest({ text: "Hello from Firebase!" })




addMessage({ text: messageText })
  .then((result) => {
    // Read result of the Cloud Function.
    /** @type {any} */
    const data = result.data;
    const sanitizedMessage = data.text;
  });