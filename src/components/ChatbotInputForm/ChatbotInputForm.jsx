import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ChatbotInputForm.css";
import axios from "axios";

export default function ChatbotInputForm() {
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const {image, journalEntry, recipeText} = location.state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;

        // if (location.pathname !== "/EditRecipeChatbot") {
        //     navigate("/EditRecipeChatbot", { state: { ...(location.state || {}), initialMessage: input } });
        // }
        //Call open ai with location

        setInput("");
        const response = await fetchOpenAIData();
        console.log("response!!", response);
    };

    const fetchOpenAIData = async () => {
        try {
          const response = await axios.post(
            'https://us-central1-generationalcookbook.cloudfunctions.net/updateRecipeWithChatbot',
            { image, input, journalEntry, recipeText }
          );
          return response;
        } catch (error) {
          console.error('Axios Network Error:', error);
          throw error;
        }
      };

    return (
        <div className="chatbot-input-container">
            <form className="chatbot-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ask AI to customize the recipe..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="chatbot-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
}
