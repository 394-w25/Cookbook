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
  const [data, setData] = useState('');
  const [sentRequest, setSentRequest] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const navigate = useNavigate();
  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);

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
      setSentRequest(true);
      const result = await fetchOpenAIData(base64Image);
      setData(result.choices[0]?.message?.content || 'No text extracted.');
      console.log('OpenAI result:', result);
    } catch (err) {
      setError('Error processing image. Please retry.');
      console.error(err);
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
      setShowQuestions(true);
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
      setImage(file);
    } else {
      setError('No file selected.');
    }
  };

  const handleRetake = () => {
    setImage(null);
    setData('');
    setSentRequest(false);
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
              <Camera ref={cameraRef} className="camera-preview" aspectRatio={1} />
            ) : (
              <img src={image} alt="Captured or Uploaded Recipe" className="captured-image" />
            )
          ) : (
            <p className="text-red-500">Camera access denied</p>
          )}

          {/* If no image, show upload button (left) + circle capture button (center). */}
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

              <button onClick={handleCapture} className="capture-circle-button"></button>
            </div>
          ) : (
            <div className="retake-next-buttons">
              <button className="upload-button" onClick={handleRetake}>
                Retake
              </button>
              <button className="next-button" onClick={() => navigate("/prompts")}>
                Next
              </button>
            </div>
          )}

          {/* Error message now at the bottom */}
          {error && <div className="error-message">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
