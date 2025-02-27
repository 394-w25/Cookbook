import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import './CameraComponent.css';
import axios from 'axios';
import { Card, CardContent, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useNavigate } from 'react-router-dom';
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Call your Cloud Function that processes the image with OpenAI
const fetchOpenAIData = async (base64Image) => {
  try {
    const response = await axios.post(
      'https://us-central1-generationalcookbook.cloudfunctions.net/sendOpenAIAPIRequest',
      { image: base64Image }
    );
    return response.data;
  } catch (error) {
    console.error('Axios Network Error:', error);
    throw error;
  }
};

export default function CameraComponent() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Tracking overlay for scanning
  const [scanning, setScanning] = useState(false);
  // The extracted text from the first OpenAI call
  const [extractedText, setExtractedText] = useState('');
  // Whether we show the editable text area
  const [showEditableText, setShowEditableText] = useState(false);

  const navigate = useNavigate();
  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);

  // Request camera permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);
        setError('');
      } catch (err) {
        setError('Camera access denied. Ensure permissions are enabled and reload the page.');
      } finally {
        setIsLoading(false);
      }
    };
    requestPermission();
  }, []);

  // Process the base64 image with OpenAI
  const processImage = async (base64Image) => {
    try {
      setScanning(true); // Start scanning => show overlay
      const result = await fetchOpenAIData(base64Image);
      const text = result.choices[0]?.message?.content || 'No text extracted.';
      setExtractedText(text);
      setShowEditableText(true);
    } catch (err) {
      setError('Error processing image. Please retry.');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  // Taking a photo with the camera
  const handleCapture = async () => {
    try {
      if (cameraRef.current) {
        const photo = cameraRef.current.takePhoto();
        if (photo) {
          setError('');
          setImage(photo);
          const base64Image = photo.split(',')[1];
          await processImage(base64Image);
        }
      }
    } catch {
      setError('Error capturing photo. Please retry.');
    }
  };

  // Handling an uploaded file
  const handleImageUpload = async (base64DataUrl) => {
    try {
      setError('');
      setImage(base64DataUrl);
      const base64Image = base64DataUrl.split(',')[1] || '';
      await processImage(base64Image);
    } catch (err) {
      setError('Error uploading image.');
      console.error(err);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageUpload(reader.result);
      };
      reader.onerror = () => {
        setError('Error uploading the file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      setError('No file selected.');
    }
  };

  const handleRetake = () => {
    setImage(null);
    setExtractedText('');
    setShowEditableText(false);
  };

  // “Next” => pass user’s final text + image to prompts
  const handleNext = () => {
    if (!extractedText || extractedText.trim() === "") {
      console.error("No extracted text. Cannot proceed.");
      return;
    }
    navigate("/prompts", { state: { data: extractedText, image } });
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  let micClicked = false;

  const handleSpeechRecognition = () => {
    if (!micClicked) {
      SpeechRecognition.startListening();
      micClicked = true;
    }
    else {
      SpeechRecognition.stopListening();
      micClicked = false;
    }
  };

  return (
    <div className="camera-container">
      <Card className="camera-card">
        <CardContent className="camera-content">
          {isLoading ? (
            // Show spinner while checking camera
            <div className="loading-container">
              <CircularProgress />
              <p>Awaiting camera access...</p>
            </div>
          ) : hasPermission ? (
            !image ? (
              <Camera ref={cameraRef} className="camera-preview" aspectRatio={1} />
            ) : (
              <div className={`image-wrapper ${showEditableText ? 'shrink' : ''}`}>
                <img
                  src={image}
                  alt="Captured or Uploaded Recipe"
                  className={`captured-image ${scanning ? 'darken' : ''}`}
                />
                {scanning && (
                  <div className="scanning-overlay">
                    <CircularProgress style={{ color: "white", marginBottom: "10px" }} />
                    <p>Scanning...</p>
                  </div>
                )}
              </div>
            )
          ) : (
            <p className="text-red-500">Camera access denied</p>
          )}

          {/* Button area */}
          {!image ? (
            <div className="button-container">
              <div className="upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <button onClick={() => fileInputRef.current.click()} className="upload-button">
                  Upload Photo
                </button>
              </div>
              <button onClick={handleCapture} className="capture-circle-button" />
            </div>
          ) : (
            <>
              {showEditableText && (
                <div className="recipe-text-area">
                  <textarea
                    value={extractedText + '\n\n' + transcript}
                    onChange={(e) => setExtractedText(e.target.value)}
                    placeholder="Edit your recipe text here..."
                  />
                </div>
              )}

              {showEditableText && browserSupportsSpeechRecognition ? 
                (<div>
                  <p>Microphone: {listening ? 'on' : 'off'}</p>
                  <MicIcon className='mic-icon' onClick={handleSpeechRecognition}>Start</MicIcon>
                  {/* <p>{transcript}</p> */}
                </div>) : 
                (<p>Browser does not support speech recognition.</p>
                )
              }

              <div className="retake-next-buttons">
                <button className="upload-button" onClick={handleRetake}>
                  Retake
                </button>
                {showEditableText && (
                <button className="next-button" onClick={handleNext}>
                  Next
                </button>)}
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
