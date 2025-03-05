import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import './PromptsScreen.css';
import UploadIcon from '@mui/icons-material/Upload';
import parseMarkdown from '../../../utilities/parseRecipeIntoComponents';

export default function Questions() {
  const location = useLocation();
  const recipeText = location.state?.data || "";
  const navigate = useNavigate();

  const { title, ingredients, instructions } = parseMarkdown(recipeText);

  const prompts = [
    "Who invented this recipe and when is it usually made?",
    "What is a memory that you associate with this recipe?",
    "What makes this recipe unique in your family?"
  ];

  const [answers, setAnswers] = useState(Array(prompts.length).fill(""));
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        'https://us-central1-generationalcookbook.cloudfunctions.net/writejournal',
        { answers: answers }
      );
      setLoading(false);

      const imageToUse = imagePreview || await fetchRecipeImage(title);

      let imageUrl = "";
      if (selectedImage) {
        imageUrl = URL.createObjectURL(selectedImage);
      } else {
        imageUrl = imageToUse || "https://via.placeholder.com/150";
      }

      navigate('/EditRecipe', { 
        state: { 
          recipeText: recipeText, 
          journalEntry: res.data.journal, 
          image: imageUrl 
        }
      });
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setModalOpen(false);
    }
  };

  const handleImageGeneration = async () => {
    try {
      setGeneratingImage(true);
      const title = recipeText.split("\n")[0].replace("# ", "").trim();
      const response = await axios.post(
        'https://us-central1-generationalcookbook.cloudfunctions.net/generateImage',
        {
          title,
          ingredients,
          steps: instructions
        }
      );
      setImagePreview(response.data.generatedImage);
      setGeneratingImage(false);
      setModalOpen(false);
    } catch (error) {
      console.error("Error generating image:", error);
      setGeneratingImage(false);
    }
  };

  return (
    <div className="prompts-container">
      <h1>What's the Story?</h1>
      <p>Tell us more about your family’s memories & context for this recipe!</p>

      <div className="image-upload-section" onClick={() => setModalOpen(true)}>
        {imagePreview ? (
          <img src={imagePreview} alt="Food Preview" className="recipe-image" />
        ) : (
          <div className="food-photo-upload">
            <UploadIcon />
            food photo
          </div>
        )}
      </div>

      <div className={`modal ${modalOpen ? 'open' : ''}`}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <div className="modal-content">
          <h2>Choose an Option</h2>
          <div className="modal-buttons">
            <button
              className="add-photo-button"
              htmlFor="file-upload"
              onClick={() => document.getElementById('file-upload').click()}
            >
              Upload Food Photo
            </button>
            <button className="add-photo-button" onClick={handleImageGeneration}>
              {generatingImage ? <CircularProgress size={24} /> : "Generate Food Photo"}
            </button>
            <button className="close" onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      </div>

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
