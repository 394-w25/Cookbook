import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ChatbotInputForm.css";
import axios from "axios";

export default function ChatbotInputForm( ) {
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const {image, journalEntry, recipeText} = location.state;

    const parseOpenAIResponse = (responseText) => {
        let recipeText = "";
        let journalEntry = "";
        let image = "";
    
        const sections = responseText.split("## ");
        
        sections.forEach((section) => {
            if (section.startsWith("Ingredients") || section.startsWith("Instructions")) {
                recipeText += `## ${section}\n`;
            } else if (section.startsWith("Journal Entry")) {
                journalEntry = `## ${section}`;
            } else if (section.startsWith("Image Before Modification")) {
                const imageMatch = section.match(/(https?:\/\/[^\s]+)/);
                if (imageMatch) image = imageMatch[1];
            } else if (section.startsWith("# ")) {
                recipeText = section + "\n" + recipeText; // Ensure title is included
            }
        });
    
        return { recipeText, journalEntry, image };
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;
    
        setInput("");
        const response = await fetchOpenAIData();
        
        // Parse response into structured format
        const parsedData = parseOpenAIResponse(response.data);
        
        // Update state and navigate to EditRecipe with new data
        const newState = { 
            ...location.state, 
            recipeText: parsedData.recipeText, 
            journalEntry: parsedData.journalEntry, 
            image: parsedData.image 
        };
    
        navigate("/EditRecipe", { state: newState, replace: true });
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
