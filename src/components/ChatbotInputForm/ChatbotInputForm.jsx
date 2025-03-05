import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ChatbotInputForm.css";

export default function ChatbotInputForm() {
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() === "") return;

        if (location.pathname !== "/EditRecipeChatbot") {
            navigate("/EditRecipeChatbot", { state: { initialMessage: input } });
        }
        setInput("");
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
