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

export default function VoiceRecordComponent() {
  const [recipe, setRecipe] = useState(""); // Initialize as an empty string

  const handleMicToggle = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setRecipe((prevRecipe) => prevRecipe + " " + transcript); // Append new transcript
      resetTranscript(); // Reset transcript to avoid duplication
    }
  }, [transcript, resetTranscript]); // Add resetTranscript to dependencies

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <h3 className="voice-record-header">Tell us your recipe!</h3>
      <Box className="voice-record-text-box">
        <TextField
          label="Recipe"
          id="recipe-text"
          className="voice-record-text-field"
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={recipe || "Waiting for speech recognition..."}
        />
      </Box>

      { listening ? <img src={SoundWave} alt="Sound wave" className="sound-wave" /> : null }

      <div className="mic-container">
        <IconButton onClick={handleMicToggle}>
            <MicIcon className={`mic-icon ${listening ? "mic-on" : "mic-off"}`} />
        </IconButton>
      </div>

    </div>
  );
}
