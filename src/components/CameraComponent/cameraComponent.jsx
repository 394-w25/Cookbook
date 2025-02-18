import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CardContent } from '../ui/CardContent';
import { Alert } from '../ui/Alert';
import './cameraComponent.css';
import PhotoUpload from '../PhotoUpload/UploadPhoto';  // Import the new PhotoUpload component
import NavigationBar from '../NavigationBar/NavigationBar';

export default function RecipeCamera() {
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

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

  const handleCapture = () => {
    try {
      const photo = cameraRef.current?.takePhoto();
      if (photo) {
        const base64Image = photo.split(",")[1];
        setImage(photo);
        console.log("Base64 Image:", base64Image);
        setError('');
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
    <div className="flex flex-col items-center space-y-4 p-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      <Card className="camera-card">
        <CardContent className="flex flex-col items-center">
          {hasPermission ? (
            !image ? (
              <Camera ref={cameraRef} aspectRatio={16 / 9} />
            ) : (
              <img src={image} alt="Recipe" className="rounded-xl shadow-lg" />
            )
          ) : (
            <p className="text-red-500">Awaiting camera access...</p>
          )}
          <div className="mt-4 space-x-2">
            {!image ? (
              <>
                <Button onClick={handleCapture} disabled={!hasPermission}>
                  Capture Recipe
                </Button>
                {/* PhotoUpload Component to upload a photo from local machine */}
                <PhotoUpload onUpload={handleImageUpload} onError={handleUploadError} />
              </>
            ) : (
              <Button onClick={() => setImage(null)} variant="destructive">
                Retake
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <NavigationBar />
    </div>
  );
}
