// src/components/Questions/Questions.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import RecipePage from '../RecipePage/RecipePage';

export default function Questions() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // The user-edited recipe text from the camera page
  const [recipeText] = useState(location.state?.data || "");
  // The original uploaded/taken image
  const [image] = useState(location.state?.image || null);

  const prompts = [
    "Who invented this recipe and when is it usually made?",
    "What is a memory that you associate with this recipe?",
    "What makes this recipe unique in your family?"
  ];

  const [answers, setAnswers] = useState(Array(prompts.length).fill(""));
  const [journalEntry, setJournalEntry] = useState("");
  const [loading, setLoading] = useState(false);

  const [showRecipePage, setShowRecipePage] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://news-menu.onrender.com/writejournal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });
      const entry = await res.json();
      setJournalEntry(entry.journal || "Could not generate journal entry.");
      setLoading(false);

      // Show final recipe page
      setShowRecipePage(true);
    } catch (err) {
      console.error('Error creating journal: ' + err);
      setLoading(false);
    }
  };

  if (showRecipePage) {
    // Render the final recipe page
    return (
      <RecipePage
        recipeText={recipeText}
        journalEntry={journalEntry}
        image={image}
      />
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Answer These Questions</h2>
      <p>You can provide additional family context about your recipe!</p>

      {prompts.map((prompt, idx) => (
        <div key={idx} style={{ marginBottom: '1rem' }}>
          <strong>{idx + 1}. {prompt}</strong>
          <br />
          <textarea
            rows={3}
            style={{ width: '100%', marginTop: '5px' }}
            onChange={(e) => {
              const updated = [...answers];
              updated[idx] = e.target.value;
              setAnswers(updated);
            }}
          />
        </div>
      ))}

      {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (
        <button onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );
}
