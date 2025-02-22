import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import './CameraComponent.css';
import '../PhotoUploadComponent/PhotoUploadComponent.css';
import PhotoUploadComponent from '../PhotoUploadComponent/PhotoUploadComponent';
// import { Button } from '@/components/Common/Button';
// import { Card } from '@/components/Common/Card';
// import { CardContent } from '@/components/Common/CardContent';
// import { Alert } from '@/components/Common/Alert';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { CircularProgress, Box, Button, Card, CardContent, Alert } from '@mui/material';
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
  const [data, setData] = useState('');
  const [sentRequest, setSentRequest] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  const navigate = useNavigate();

  const cameraRef = useRef(null);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);
        setError('');
      } catch (err) {
        setError('Camera access denied. Ensure permissions are enabled and reload the page.');
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

          const base64Image = photo.split(',')[1]; // remove the data URI prefix
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

      // Remove the data URI prefix to get raw base64
      const base64Image = base64DataUrl.split(',')[1] || '';
      await processImage(base64Image);
      setShowQuestions(true);
    } catch (err) {
      setError('Error uploading image.');
      console.error(err);
    }
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleRetake = () => {
    setImage(null);
    setData('');
    setSentRequest(false);
  };

  return (
    <div className="camera-container">
      {error && <Alert variant="destructive">{error}</Alert>}

      <Card className="camera-card">
        <CardContent className="camera-content">
          {hasPermission ? (
            !image ? (
              <Camera ref={cameraRef} className="camera-preview" aspectRatio={16 / 9} />
            ) : (
              <img src={image} alt="Captured or Uploaded Recipe" className="captured-image" />
            )
          ) : (
            <p className="text-red-500">Awaiting camera access...</p>
          )}

          <div className="button-container">
            {!image ? (
              <>
                <Button onClick={handleCapture} className="upload-button">
                  Capture Recipe
                </Button>
                <PhotoUploadComponent
                  onUpload={handleImageUpload}
                  onError={handleUploadError}
                />
              </>
            ) : (
              <div className="retake-next-buttons">
              <Button
                onClick={handleRetake}
                // className="capture-button"
                variant="destructive"
              >
                Retake
              </Button>
              <Button onClick={() => navigate("/prompts")}>Next</Button>
              </div>
            )}
          </div>

          {/* {data ? 
            <pre className='markdown-output'>
              <ReactMarkdown>{data}</ReactMarkdown>
            </pre> : sentRequest ?
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box> : null
          }
          {showQuestions && (
            <Questions />
          )}           */}
        </CardContent>
      </Card>
    </div>
  );
}
