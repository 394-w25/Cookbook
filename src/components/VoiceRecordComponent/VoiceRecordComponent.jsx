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
      resetTranscript(); // Reset transcript before starting to listen
      SpeechRecognition.startListening({ continuous: true });
    } else {
      SpeechRecognition.stopListening();
      setRecipe((prevRecipe) => prevRecipe + " " + transcript);
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
          variant="filled"
          value={recipe || "Waiting for speech input..."}
          onChange={(e) => setRecipe(e.target.value)}
        />
      </Box>

      { listening ? <img src={SoundWave} alt="Sound wave" className="sound-wave" /> : null }

      <div className="mic-container">
        <IconButton onClick={handleMicToggle}>
            <MicIcon className={`mic-icon ${listening ? "mic-on" : "mic-off"}`} />
        </IconButton>
      </div>

      <p className="transcription">{transcript}</p>

    </div>
  );
}
