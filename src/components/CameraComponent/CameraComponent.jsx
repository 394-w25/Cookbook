import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import './CameraComponent.css';
import axios from 'axios';
import { Card, CardContent, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useNavigate } from 'react-router-dom';
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition';

const fetchOpenAIData = async (base64Image) => {
  try {
    const response = await axios.post(
      'https://us-central1-generationalcookbook.cloudfunctions.net/parseImage',
      { image: base64Image }
    );
    return response.data;
  } catch (error) {
    console.error('Axios Network Error:', error);
    throw error;
  }
};

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

export default function CameraComponent() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  // Display text fields only after scanning
  const [showEditableFields, setShowEditableFields] = useState(false);

  // Recipe fields
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');

  // Image enlargement toggle
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  const navigate = useNavigate();
  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);

  // Camera permission
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

  const processImage = async (base64Image) => {
    try {
      setScanning(true);
      const result = await fetchOpenAIData(base64Image);
      const text = result.choices[0]?.message?.content || 'No text extracted.';
      
      // Parse
      const { title, ingredients, steps } = parseRecipeSections(text);
      setTitle(title);
      setIngredients(ingredients);
      setSteps(steps);

      setShowEditableFields(true);
    } catch (err) {
      setError('Error processing image. Please retry.');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

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
    setShowEditableFields(false);
    setTitle('');
    setIngredients('');
    setSteps('');
    setIsImageEnlarged(false);
  };

  const handleNext = () => {
    const combinedText = `# ${title}\n\n## Ingredients\n${ingredients}\n\n## Instructions\n${steps}`;
    if (!combinedText.trim()) {
      console.error("No extracted text. Cannot proceed.");
      return;
    }
    navigate("/prompts", { state: { data: combinedText, image } });
  };

  const toggleImageSize = () => {
    setIsImageEnlarged(prev => !prev);
  };

  return (
    <div className="camera-container">
      <Card className="camera-card">
        <CardContent className="camera-content">
          {isLoading ? (
            <div className="loading-container">
              <CircularProgress />
              <p>Awaiting camera access...</p>
            </div>
          ) : hasPermission ? (
            !image ? (
              <Camera
                ref={cameraRef}
                className="camera-preview"
                aspectRatio={1}
              />
            ) : (
              <div
                className={`image-wrapper 
                  ${showEditableFields && !isImageEnlarged ? 'shrink' : ''} 
                  ${isImageEnlarged ? 'enlarged' : ''}`}
                onClick={toggleImageSize}
              >
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

          {/* Buttons for capturing/uploading photo (only if no image yet) */}
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
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="upload-button"
                >
                  Upload Photo
                </button>
              </div>
              <button onClick={handleCapture} className="capture-circle-button" />
            </div>
          ) : (
            <>
              {/* Editable Fields: Title, Ingredients, Steps */}
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

              {/* Retake & Next */}
              <div className="retake-next-buttons">
                <button className="upload-button" onClick={handleRetake}>
                  Retake
                </button>
                {showEditableFields && (
                  <button className="next-button" onClick={handleNext}>
                    Next
                  </button>
                )}
              </div>
            </>
          )} 

          {error && <div className="error-message">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
