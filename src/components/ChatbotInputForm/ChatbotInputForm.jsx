import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import "./ChatbotInputForm.css";
import axios from "axios";

export default function ChatbotInputForm() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { image, journalEntry, recipeText } = location.state;

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
                recipeText = section + "\n" + recipeText;
            }
        });

        return { recipeText, journalEntry, image };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;

        setLoading(true);
        setInput("");

        try {
            const response = await fetchOpenAIData();
            const parsedData = parseOpenAIResponse(response.data);
            const newState = {
                ...location.state,
                recipeText: parsedData.recipeText,
                journalEntry: parsedData.journalEntry,
                image: parsedData.image,
            };

            navigate("/EditRecipe", { state: newState, replace: true });
            setShowAlert(true);
        } catch (error) {
            console.error("Error fetching AI data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOpenAIData = async () => {
        return axios.post(
            "https://us-central1-generationalcookbook.cloudfunctions.net/updateRecipeWithChatbot",
            { image, input, journalEntry, recipeText }
        );
    };

    return (
        <div className="input-container">
            {showAlert && (
                <Alert
                    className="alert"
                    variant="filled"
                    severity="success"
                    onClose={() => setShowAlert(false)}
                >
                    Updated recipe using AI!
                </Alert>
            )}

            <div className="chatbot-input-container">
                {loading ? (
                    <div className="loading-spinner">
                        <CircularProgress size={40} />
                        <p>Processing your request...</p>
                    </div>
                ) : (
                    <form className="chatbot-input-form" onSubmit={handleSubmit}>
                        <button type="submit" className="chatbot-icon-button" disabled={loading}>
                            <AutoFixHighIcon className="new-chatbot-icon" />
                        </button>
                        <input
                            type="text"
                            placeholder="Ask AI to customize the recipe..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="chatbot-input"
                            disabled={loading}
                        />
                    </form>
                )}
            </div>
        </div>
    );
}
