import { useRef, useState } from 'react';

export default function CameraSection({ onImage, loading }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      let s;
      try {
        s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
      } catch {
        s = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } }
        });
      }
      videoRef.current.srcObject = s;
      setStream(s);
      setCameraActive(true);
    } catch (err) {
      alert(`Camera error: ${err.message}. Check that camera is not in use and you've allowed access.`);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    stopCamera();
    onImage(base64);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      onImage(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div id="camera-section" className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden ambient-glow">
      {/* Camera area */}
      <div className="relative bg-gradient-to-b from-surface-container-high to-surface-container w-full aspect-video flex items-center justify-center overflow-hidden">
        {/* Video element always rendered so ref exists */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? '' : 'hidden'}`}
        />
        <canvas ref={canvasRef} className="hidden" />
        {!cameraActive && !loading && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative w-64 h-48 border-2 border-primary/50 rounded-xl">
                <div className="scanner-line" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-30 p-lg space-y-sm">
              <button
                onClick={startCamera}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-md px-lg rounded-full font-headline-md flex items-center justify-center gap-sm hover:bg-white/20 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined">photo_camera</span>
                Snap Photo
              </button>
              <label className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-md px-lg rounded-full font-headline-md flex items-center justify-center gap-sm hover:bg-white/20 active:scale-95 transition-all cursor-pointer">
                <span className="material-symbols-outlined">gallery_thumbnail</span>
                Upload from Gallery
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>
          </>
        )}
        {loading && (
          <div className="flex items-center gap-sm text-primary">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span className="font-headline-md">Analyzing...</span>
          </div>
        )}
        {cameraActive && (
          <div className="absolute bottom-0 left-0 right-0 z-30 p-lg flex gap-sm">
            <button
              onClick={capture}
              disabled={loading}
              className="flex-1 bg-primary text-on-primary py-md px-lg rounded-full font-headline-md hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
            >
              Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white py-md px-lg rounded-full hover:bg-white/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}