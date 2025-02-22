import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import './CameraComponent.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Card, CardContent, Alert } from '@mui/material';
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
  const fileInputRef = useRef(null);

  // Upload logic
  const handleUploadError = (errMessage) => {
    setError(errMessage);
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
        handleUploadError('Error uploading the file. Please try again.');
      };
      reader.readAsDataURL(file);
    } else {
      handleUploadError('No file selected.');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  // Camera / permission logic
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
      
      const extractedText = result.choices[0]?.message?.content || 'No text extracted.';
      setData(extractedText); 
  
      console.log('OpenAI result:', extractedText); // Debugging output
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

  const handleRetake = () => {
    setImage(null);
    setData('');
    setSentRequest(false);
  };

  const handleNext = () => {
    if (!data || data.trim() === "") {
      console.error("Data is empty. Cannot navigate.");
      return;
    }
  
    console.log("Navigating with data:", data);
    navigate("/prompts", { state: { data } });
  };  

  return (
    <div className="camera-container">
      {error && <Alert variant="destructive">{error}</Alert>}

      <Card className="camera-card">
        <CardContent className="camera-content">
          {hasPermission ? (
            !image ? (
              <Camera
                ref={cameraRef}
                className="camera-preview"
                aspectRatio={1}
              />
            ) : (
              <img 
                src={image} 
                alt="Captured or Uploaded Recipe" 
                className="captured-image" 
              />
            )
          ) : (
            <p className="text-red-500">Awaiting camera access...</p>
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
                <Button onClick={openFileDialog} className="upload-button">
                  Upload Photo
                </Button>
              </div>

              {/* Circle capture button with no text */}
              <button onClick={handleCapture} className="capture-circle-button" />
            </div>
          ) : (
            /* If an image is present, show Retake / Next */
            <div className="retake-next-buttons">
              <Button
                onClick={handleRetake}
                variant="destructive"
              >
                Retake
              </Button>
              <Button onClick={() => navigate("/prompts")}>
                Next
              </Button>
            </div>
          )}


          {/* 
            If you want to show results or questions after image is processed, 
            uncomment these:
            
            {data ? (
              <pre className='markdown-output'>
                <ReactMarkdown>{data}</ReactMarkdown>
              </pre>
            ) : sentRequest ? (
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            ) : null}

            {showQuestions && (
              <Questions recipeText={data} />
            )}
          */}
        </CardContent>
      </Card>
    </div>
  );
}
