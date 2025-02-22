import React from 'react';

export default function RecipeScreen({ recipeText, journalEntry, image }) {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Final Recipe</h1>
      {image && (
        <img
          src={image}
          alt="Final Recipe"
          style={{ maxWidth: '300px', borderRadius: '8px', marginBottom: '1rem' }}
        />
      )}

      <h2>Recipe (Edited Text)</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{recipeText}</pre>

      <h2>Family Notes / Journal</h2>
      <p>{journalEntry}</p>
    </div>
  );
}
