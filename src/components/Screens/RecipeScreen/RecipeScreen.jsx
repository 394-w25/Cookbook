import React from 'react';
import './RecipeScreen.css';

export default function RecipeScreen({ recipeText, journalEntry, image }) {
  return (
    <div className="recipe-screen-container">
      <h1>Final Recipe</h1>

      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="recipe-image"
        />
      )}

      <h2>The Recipe</h2>
      <div className="recipe-text-box">
        {recipeText}
      </div>

      <h2>Family Notes / Journal</h2>
      <div className="recipe-journal">
        {journalEntry}
      </div>
    </div>
  );
}
