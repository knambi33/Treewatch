import React, { useRef, useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, RefreshCw, CheckCircle, AlertTriangle, SwitchCamera } from 'lucide-react';

interface CameraCaptureProps {
  onPhotoCaptured: (dataUrl: string, method: 'In-App Camera' | 'Gallery Upload') => void;
  guidanceText?: string;
  initialPhotoUrl?: string;
}

const SAMPLE_FALLBACK_PHOTOS = [
  { label: 'Healthy Neem (Vibrant)', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Healthy Sapling (Young)', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Mild Foliage Stress', url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Defoliated / Poor Health', url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dry / Dead Seedling', url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&auto=format&fit=crop&q=80' },
];

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoCaptured,
  guidanceText = 'Keep the entire tree visible if possible. Align trunk & canopy within guide.',
  initialPhotoUrl,
}) => {
  const [mode, setMode] = useState<'camera' | 'gallery'>('camera');
  const [capturedUrl, setCapturedUrl] = useState<string | null>(initialPhotoUrl || null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('In-app camera not accessible on this device. You can pick a sample or upload a photo.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (mode === 'camera' && !capturedUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, capturedUrl, facingMode]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedUrl(dataUrl);
      stopCamera();
      onPhotoCaptured(dataUrl, 'In-App Camera');
    }
  };

  const handleRetake = () => {
    setCapturedUrl(null);
    if (mode === 'camera') {
      startCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCapturedUrl(url);
        onPhotoCaptured(url, 'Gallery Upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSample = (url: string) => {
    setCapturedUrl(url);
    onPhotoCaptured(url, mode === 'camera' ? 'In-App Camera' : 'Gallery Upload');
    stopCamera();
  };

  return (
    <div className="space-y-3">
      {/* Mode Switcher */}
      <div className="flex bg-stone-100 p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => {
            setMode('camera');
            setCapturedUrl(null);
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            mode === 'camera'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>In-App Camera (Preferred)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('gallery');
            setCapturedUrl(null);
          }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            mode === 'gallery'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery Photo</span>
        </button>
      </div>

      {/* Gallery Warning Banner (Section 9 Requirement) */}
      {mode === 'gallery' && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Gallery Photo — Lower Verification Confidence</p>
            <p className="text-amber-700 mt-0.5">
              Photographs uploaded from the device gallery receive lower evidence weighting because camera hardware telemetry cannot be verified.
            </p>
          </div>
        </div>
      )}

      {/* Viewport Box */}
      <div className="relative aspect-4/3 w-full bg-stone-900 rounded-2xl overflow-hidden border-2 border-stone-800 shadow-inner flex flex-col items-center justify-center">
        {capturedUrl ? (
          // Captured Preview
          <div className="relative w-full h-full">
            <img src={capturedUrl} alt="Captured tree" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-emerald-700/90 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{mode === 'camera' ? 'In-App Capture ✓' : 'Gallery Upload'}</span>
            </div>
            <button
              type="button"
              onClick={handleRetake}
              className="absolute bottom-3 right-3 bg-white/90 text-stone-900 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg hover:bg-white backdrop-blur-xs transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Photo</span>
            </button>
          </div>
        ) : mode === 'camera' && cameraActive ? (
          // Live Video Stream
          <div className="relative w-full h-full">
            <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" />

            {/* Tree Alignment Frame Overlay */}
            <div className="absolute inset-6 border-2 border-dashed border-white/50 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
              <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-md self-center">
                Align tree trunk & canopy here
              </span>
              <div className="w-8 h-8 border-b-2 border-r-2 border-white/70 self-end" />
            </div>

            {/* Camera Controls */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 z-20">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 backdrop-blur-xs"
                title="Switch Camera"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={takeSnapshot}
                className="w-16 h-16 rounded-full border-4 border-white bg-emerald-500 hover:bg-emerald-600 shadow-xl flex items-center justify-center transition-all transform active:scale-90"
                title="Capture Photo"
              >
                <div className="w-10 h-10 rounded-full bg-white" />
              </button>

              <div className="w-10" />
            </div>
          </div>
        ) : (
          // File Picker / Fallback
          <div className="p-6 text-center text-stone-400 space-y-3 w-full">
            <Camera className="w-12 h-12 mx-auto text-stone-500 mb-2" />
            <p className="text-xs text-stone-300 max-w-xs mx-auto">
              {cameraError || 'Select a photograph of the tree or choose a sample.'}
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md transition-all">
              <ImageIcon className="w-4 h-4" />
              <span>Choose Photo File</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>

      {/* Guidance text */}
      <p className="text-[11px] text-stone-700 text-center italic">
        💡 {guidanceText}
      </p>

      {/* Quick Sample Selector for Demo Simulation */}
      <div className="pt-1">
        <p className="text-[11px] font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
          <span>Or simulate photo for demo:</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {SAMPLE_FALLBACK_PHOTOS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectSample(sample.url)}
              className="text-left px-2 py-1.5 bg-white border border-stone-200 hover:border-emerald-500 rounded-lg text-[11px] text-stone-700 truncate shadow-2xs hover:bg-emerald-50 transition-all"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
