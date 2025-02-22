import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import './CameraComponent.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import Questions from '../../Questions/Questions';
import { useNavigate } from 'react-router-dom';

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
  
  // For the "scanning" overlay
  const [scanning, setScanning] = useState(false);
  
  // The extracted text from the first OpenAI call
  const [extractedText, setExtractedText] = useState('');
  
  // Whether we have finished scanning and are showing the editable text
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
      setScanning(true); // Start scanning
      const result = await fetchOpenAIData(base64Image);
      const text = result.choices[0]?.message?.content || 'No text extracted.';
      setExtractedText(text);
      setShowEditableText(true); // Now show the editable text
    } catch (err) {
      setError('Error processing image. Please retry.');
      console.error(err);
    } finally {
      setScanning(false); // Stop scanning
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

  // Called when user chooses a file
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

  // "Retake" means user discards current image & text
  const handleRetake = () => {
    setImage(null);
    setExtractedText('');
    setShowEditableText(false);
  };

  // When user clicks "Next," go to prompts
  // We pass the "edited" text along to the next route
  const handleNext = () => {
    if (!extractedText || extractedText.trim() === "") {
      console.error("No extracted text. Cannot proceed.");
      return;
    }
    // Navigate to prompts, passing the user-edited text
    navigate("/prompts", { state: { data: extractedText, image } });
  };

  return (
    <div className="camera-container">
      <Card className="camera-card">
        <CardContent className="camera-content">

          {/* 1) Show loading while checking camera permission */}
          {isLoading ? (
            <div className="loading-container">
              <CircularProgress />
              <p>Awaiting camera access...</p>
            </div>
          ) : hasPermission ? (
            /* 2) If we have no image yet, show camera or show captured image */
            !image ? (
              <Camera ref={cameraRef} className="camera-preview" aspectRatio={1} />
            ) : (
              /* Show captured or uploaded image 
                 We can "gray it out" if scanning is true */
              <div className="image-wrapper">
                <img
                  src={image}
                  alt="Captured or Uploaded Recipe"
                  className={`captured-image ${scanning ? "grayscale" : ""}`}
                />
                {/* Scanning overlay */}
                {scanning && (
                  <div className="scanning-overlay">
                    <CircularProgress style={{ color: "white" }} />
                    <p>Scanning...</p>
                  </div>
                )}
              </div>
            )
          ) : (
            <p className="text-red-500">Camera access denied</p>
          )}

          {/* 3) Button area */}
          {!image ? (
            /* No image => allow uploading or capturing */
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
            /* If an image is present => show either the editable text or final retake/next buttons */
            <>
              {showEditableText ? (
                /* Show text area to let user edit the extracted text */
                <div style={{ width: "100%", marginTop: "1rem" }}>
                  <textarea
                    style={{ width: "100%", height: "200px", padding: "10px" }}
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                  />
                </div>
              ) : null}

              <div className="retake-next-buttons">
                <button className="upload-button" onClick={handleRetake}>
                  Retake
                </button>
                <button className="next-button" onClick={handleNext}>
                  Next
                </button>
              </div>
            </>
          )}

          {/* Error message at the bottom */}
          {error && <div className="error-message">{error}</div>}

        </CardContent>
      </Card>
    </div>
  );
}
