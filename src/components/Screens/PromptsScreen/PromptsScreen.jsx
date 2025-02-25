import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import RecipeScreen from '../RecipeScreen/RecipeScreen';
import { db } from '../../../utilities/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import './PromptsScreen.css';

export default function Questions() {
  const location = useLocation();
  const recipeText = location.state?.data || "";
  const originalImage = location.state?.image || null;

  const prompts = [
    "Who invented this recipe and when is it usually made?",
    "What is a memory that you associate with this recipe?",
    "What makes this recipe unique in your family?"
  ];

  const [answers, setAnswers] = useState(Array(prompts.length).fill(""));
  const [loading, setLoading] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const [showRecipeScreen, setShowRecipeScreen] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        'https://us-central1-generationalcookbook.cloudfunctions.net/writejournal',
        { answers: answers }
      );
      setJournalEntry(res.data.journal || "Could not generate journal entry.");
      setLoading(false);

      setShowRecipeScreen(true);

      const title = recipeText.split("\n")[0].replace("# ", "").trim();
      await saveRecipeToDb(title, recipeText, res.data.journal, originalImage);

    } catch (err) {
      console.error("Error creating journal: " + err);
      setLoading(false);
    }
  };

  const saveRecipeToDb = async (title, recipeText, journalEntry, originalImage) => {
    try {
      const collectionRef = collection(db, 'Recipes');
      
      const recipe_text = recipeText.split("\n").slice(1).join("\n").replace("##", ' ').trim();
  
      const recipe = {
        Title: title,
        Category: "Dinner",
        Creator: "Anna Rose",
        Image: originalImage,
        JournalEntry: journalEntry,
        cookbook: "Rose Family Cookbook",
        Date: serverTimestamp(),
        Recipe: recipe_text,
      };
  
      await addDoc(collectionRef, recipe);
      console.log('Recipe added!');
    } catch (err) {
      console.error("Error adding recipe:", err);
    }
  };

  if (showRecipeScreen) {
    // Render the final recipe with:
    // 1) original image
    // 2) user-edited recipe text
    // 3) the journal entry
    return (
      <RecipeScreen
        recipeText={recipeText}
        journalEntry={journalEntry}
        image={originalImage}
      />
    );
  }

  return (
    <div className="prompts-container">
      <h1>What's the Story?</h1>
      <p>Tell us more about your family’s memories & context for this recipe!</p>

      {prompts.map((prompt, idx) => (
        <div key={idx} className="prompt-block">
          <strong>{idx + 1}. {prompt}</strong>
          <textarea
            rows={3}
            onChange={(e) => {
              const updated = [...answers];
              updated[idx] = e.target.value;
              setAnswers(updated);
            }}
          />
        </div>
      ))}

      {loading ? (
        <CircularProgress />
      ) : (
        <button className="submit-button" onClick={handleSubmit}>
          Generate Final Recipe
        </button>
      )}
    </div>
  );
}
