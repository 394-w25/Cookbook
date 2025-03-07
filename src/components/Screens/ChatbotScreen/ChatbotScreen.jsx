import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChatbotScreen.css";

export default function ChatbotScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log("asdf", location.state);
  const {image, initialMessage, journalEntry, recipeText} = location.state;
  // const initialMessage = location.state?.initialMessage || "";
  // const recipeText = location.state?.recipeText;
  const [messages, setMessages] = useState([]);
  const [updatedRecipe, setUpdatedRecipe] = useState(location.state?.recipe || {});


  const fetchOpenAIData = async () => {
    try {
      const response = await axios.post(
        '',
        { image, initialMessage, journalEntry, recipeText }
      );
      return response.data;
    } catch (error) {
      console.error('Axios Network Error:', error);
      throw error;
    }
  };  

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ text: initialMessage, sender: "user" }]);

      setTimeout(() => {
        const updatedText = "Sure thing! Updated the recipe!";
        setMessages((prev) => [...prev, { text: updatedText, sender: "bot" }]);

        setUpdatedRecipe((prev) => ({
          ...prev,
          title: "Updated Recipe Title",
          ingredients: prev.ingredients + "\nExtra ingredient",
        }));
      }, 1000);
    }
  }, [initialMessage]);

  

  return (
    <div className="chatbot-screen">
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
