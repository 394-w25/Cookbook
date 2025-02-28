import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import { db } from '../../../utilities/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import './PromptsScreen.css';


export default function Questions() {
  const location = useLocation();
  const recipeText = location.state?.data || "";
  const originalImage = location.state?.image || null;
  const navigate = useNavigate();

  const prompts = [
    "Who invented this recipe and when is it usually made?",
    "What is a memory that you associate with this recipe?",
    "What makes this recipe unique in your family?"
  ];

  const [answers, setAnswers] = useState(Array(prompts.length).fill(""));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        'https://us-central1-generationalcookbook.cloudfunctions.net/writejournal',
        { answers: answers }
      );
      setLoading(false);

      const title = recipeText.split("\n")[0].replace("# ", "").trim();
      const imageToUse = imagePreview || await fetchRecipeImage(title);
      await saveRecipeToDb(title, recipeText, res.data.journal, imageToUse);

      // navigate to final recipe page
      navigate('/final_recipe', {state: {recipeText: recipeText, journalEntry: res.data.journal, image: originalImage}});

    } catch (err) {
      console.error("Error creating journal: " + err);
      setLoading(false);
    }
  };

  const fetchRecipeImage = async (title) => {
    try {
      const accessKey = "XZ1GnWJ2tx4KH1E4r1P-Ux7rSN-iQQFFGJ8UAyuDJqg";
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${title}&client_id=${accessKey}&per_page=1`
      );
 
      if (response.data.results.length > 0) {
        return response.data.results[0].urls.small;
      } else {
        return "https://via.placeholder.com/150";
      }
    } catch (error) {
      console.error("Error fetching image: ", error);
      return "https://via.placeholder.com/150";
    }
  };
 
  const saveRecipeToDb = async (title, recipeText, journalEntry, originalImage) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is logged in.");
        return;
      }

      const collectionRef = collection(db, 'Recipes');

      const recipe_text = recipeText.split("\n").slice(1).join("\n").trim();

      const recipe = {
        Title: title,
        Category: "Dinner",
        Creator: "Anna Rose",
        Image: originalImage,
        JournalEntry: journalEntry,
        cookbook: "Rose Family Cookbook",
        Date: serverTimestamp(),
        Recipe: recipe_text,
        UserName: user.displayName,
      };

      await addDoc(collectionRef, recipe);
      console.log('Recipe added by:', user.displayName || user.email);
    } catch (err) {
      console.error("Error adding recipe:", err);
    }
};

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
