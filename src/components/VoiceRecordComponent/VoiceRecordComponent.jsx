import React, { useEffect, useState, useRef } from "react";
import "./VoiceRecordComponent.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import SoundWave from "./VoiceAssets/sound-wave.gif";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

export default function VoiceRecordComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState(""); // Initialize as an empty string
  // Display text fields only after scanning
  const [showEditableFields, setShowEditableFields] = useState(false);

  // Recipe fields
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');

  const navigate = useNavigate();

  const parseRecipeSections = (markdown) => {
    let title = '';
    let ingredients = '';
    let steps = '';
  
    const lines = markdown.split('\n').map((line) => line.trim());
    let currentSection = null;
  
    for (let line of lines) {
      if (line.startsWith('# ')) {
        // Title line
        title = line.replace('# ', '').trim();
        currentSection = 'TITLE';
      } else if (line.toLowerCase().startsWith('## ingredients')) {
        currentSection = 'INGREDIENTS';
      } else if (line.toLowerCase().startsWith('## instructions')) {
        currentSection = 'STEPS';
      } else {
        if (currentSection === 'INGREDIENTS') {
          ingredients += (ingredients ? '\n' : '') + line;
        } else if (currentSection === 'STEPS') {
          steps += (steps ? '\n' : '') + line;
        }
      }
    }
  
    return { title, ingredients, steps };
  };

  const handleNext = () => {
    const combinedText = `# ${title}\n\n## Ingredients\n${ingredients}\n\n## Instructions\n${steps}`;
    if (!combinedText.trim()) {
      console.error("No extracted text. Cannot proceed.");
      return;
    }
    navigate("/prompts", { state: { data: combinedText } });
  };

  const fetchOpenAIData = async (recipeText) => {
    try {
      const response = await axios.post(
        'https://us-central1-generationalcookbook.cloudfunctions.net/sendOpenAIAPIRequestWOImage',
        { 'recipeText': recipeText }
      );
      return response.data;
    } catch (error) {
      console.error('Axios Network Error:', error);
      throw error;
    }
  };  
  
  const handleRecipeUpload = async () => {
    try {
      setIsLoading(true);
      const result = await fetchOpenAIData(recipe);
      const text = result.choices[0]?.message?.content || 'No text extracted.';
      const { title, ingredients, steps } = parseRecipeSections(text);
      setTitle(title);
      setIngredients(ingredients);
      setSteps(steps);

      setShowEditableFields(true);
    } catch (error) {
      console.error('Axios Network Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    } else {
      // Save current visible text (recipe + transcript) into state
      setRecipe(prev => (prev + " " + transcript).trim());
      SpeechRecognition.stopListening();
      resetTranscript();
    }
  };
  
  

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }


  return (
<div className="voice-record-wrapper">
      {!showEditableFields && !isLoading && (
        <h3 className="voice-record-header">Tell us your recipe!</h3>
      )}
      {!showEditableFields && !isLoading && (
      <Box className="voice-record-text-box">
        <TextField
          label="Recipe"
          id="recipe-text"
          className="voice-record-text-field"
          fullWidth
          multiline
          rows={10}
          variant="filled"
          value={recipe + (listening ? " " + transcript : "")}
          onChange={(e) => setRecipe(e.target.value)}
        />
      </Box>
      )}


      { listening ? <img src={SoundWave} alt="Sound wave" className="sound-wave" /> : null }

      {!showEditableFields && !isLoading && (
      <div className="mic-container">
        <IconButton onClick={handleMicToggle}>
            <MicIcon className={`mic-icon ${listening ? "mic-on" : "mic-off"}`} />
        </IconButton>
      </div>
      )}

      {/* {!showEditableFields && !isLoading && (
        <p className="transcription">{transcript}</p>
      )} */}


      {!showEditableFields && !listening && !isLoading && (<button className="submit-transcription" onClick={handleRecipeUpload}>Submit</button>)}
      {isLoading && (
            <div className="loading-container">
              <CircularProgress />
              <p>Submitting your transcription...</p>
            </div>
      )}

      {showEditableFields && (
        <div className="recipe-fields">
          {/* Title */}
          <div className="field-row">
            <label>Title</label>
            <div className="field-with-mic">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Recipe Title"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="field-row">
            <label>Ingredients</label>
            <div className="field-with-mic">
              <textarea
                rows={4}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="List of ingredients..."
              />
            </div>
          </div>

          {/* Steps */}
          <div className="field-row">
            <label>Steps</label>
            <div className="field-with-mic">
              <textarea
                rows={4}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="Step-by-step instructions..."
              />
            </div>
          </div>
        </div>
      )}

      <div className="retake-next-buttons">
        {showEditableFields && (
          <button className="next-button" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
