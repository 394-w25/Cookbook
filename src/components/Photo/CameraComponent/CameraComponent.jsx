import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import './CameraComponent.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Card, CardContent, Alert, CircularProgress } from '@mui/material';
import Questions from '../../Questions/Questions';
import { useNavigate } from 'react-router-dom';

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

  const handleCapture = async () => {
    try {
      if (cameraRef.current) {
        const photo = cameraRef.current.takePhoto();
        if (photo) {
          setError('');
          setImage(photo);
        }
      }
    } catch {
      setError('Error capturing photo. Please retry.');
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

          <div className="button-container">
            {!image ? (
              <>
                <div className="upload-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <button onClick={() => fileInputRef.current.click()} className="upload-button">
                    Upload Photo
                  </button>
                </div>

                <button onClick={handleCapture} className="capture-circle-button"></button>
              </>
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
          </div>

          {/* Error message now at the bottom */}
          {error && <div className="error-message">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
