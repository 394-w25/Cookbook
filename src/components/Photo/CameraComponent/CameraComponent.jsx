import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { CardContent } from '@/components/Common/CardContent';
import { Alert } from '@/components/Common/Alert';
import './CameraComponent.css';
import PhotoUploadComponent from '../PhotoUploadComponent/PhotoUploadComponent';
import axios from "axios";

const fetchOpenAIData = async (base64Image) => {
  try {
      const response = await axios.post("https://us-central1-generationalcookbook.cloudfunctions.net/sendOpenAIAPIRequest", {
          image: base64Image
      });

      return response.data;
  } catch (error) {
      console.error("Axios Network Error:", error);
  }
};

export default function CameraComponent() {
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
        setError('');
      } catch (err) {
        setError('Camera access denied. Ensure permissions are enabled and reload the page.');
      }
    };
    requestPermission();
  }, []);

  const handleCapture = async () => {
    try {
      if (cameraRef.current) {
        const photo = cameraRef.current.takePhoto();
        if (photo) {
          const base64Image = photo.split(",")[1];
          setImage(photo);
          setError('');
          console.log("Base64 Image:", base64Image);

          const result = await fetchOpenAIData(base64Image);
          setData(result);
          console.log(result);
        }
      }
    } catch {
      setError('Error capturing photo. Please retry.');
    }
  };

  const handleImageUpload = (uploadedImage) => {
    setImage(uploadedImage);
    setError('');
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
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
              <img src={image} alt="Captured Recipe" className="captured-image" />
            )
          ) : (
            <p className="text-red-500">Awaiting camera access...</p>
          )}
          
          <div className="button-container">
            {!image ? (
              <>
                <Button onClick={handleCapture} className="capture-button">
                  Capture Recipe
                </Button>
                <PhotoUploadComponent 
                  onUpload={handleImageUpload} 
                  onError={handleUploadError} 
                  className="upload-button"
                />
              </>
            ) : (
              <Button onClick={() => setImage(null)} className="capture-button" variant="destructive">
                Retake
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
