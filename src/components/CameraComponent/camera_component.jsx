import { useState, useRef, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CardContent } from '../ui/CardContent'
import { Alert } from '../ui/Alert';

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
        setImage(photo);
        setError('');
      }
    } catch {
      setError('Error capturing photo. Please retry.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      <Card className="w-full max-w-md">
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
              <Button onClick={handleCapture} disabled={!hasPermission}>
                Capture Recipe
              </Button>
            ) : (
              <Button onClick={() => setImage(null)} variant="destructive">
                Retake
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
