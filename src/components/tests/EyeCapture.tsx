import React, { useRef, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Camera, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface EyeCaptureProps {
  onCapture: (base64: string) => void;
}

export const EyeCapture: React.FC<EyeCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setError(null);
    } catch (e) {
      setError("Unable to access camera. Please ensure permissions are granted.");
      console.error(e);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        // Compress the image to fit in Firestore/Gemini limits
        const base64 = canvas.toDataURL('image/jpeg', 0.6);
        setCaptured(base64);
        stopCamera();
      }
    }
  };

  const reset = () => {
    setCaptured(null);
    startCamera();
  };

  React.useEffect(() => {
    startCamera();
    return stopCamera;
  }, []);

  return (
    <Card className="max-w-xl mx-auto w-full" padding="lg">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">Eye Photography</h2>
        <p className="text-sm text-gray-500">Position the eye clearly within the frame. Avoid glare from lights.</p>
      </div>

      <div className="relative aspect-square bg-black rounded-xl overflow-hidden mb-8 border border-border-gray shadow-inner">
        {error ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-google-red">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : captured ? (
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={captured} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        )}
        
        {!captured && !error && (
          <div className="absolute inset-0 pointer-events-none border-4 border-google-blue/30 rounded-xl m-8 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-dashed border-white/50 rounded-full" />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {captured ? (
          <>
            <Button variant="outline" className="flex-1" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" /> Retake
            </Button>
            <Button className="flex-1 bg-google-green hover:bg-green-700" onClick={() => onCapture(captured)}>
              <Check className="w-4 h-4 mr-2" /> Confirm Photo
            </Button>
          </>
        ) : (
          <Button 
            disabled={!!error}
            className="w-full py-6" 
            onClick={capture}
          >
            <Camera className="w-6 h-6 mr-2" /> Capture Analysis Photo
          </Button>
        )}
      </div>
    </Card>
  );
};
