import { useRef, useState } from 'react';

export default function CameraCapture({ onImage, disabled }) {
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
      alert(`Camera error: ${err.message}. Check that camera is not in use by another app and that you've allowed camera access.`);
    }
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

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
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
    <div className="flex flex-col items-center gap-4">
      {/* Video element always rendered so ref exists */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`rounded-lg w-80 ${cameraActive ? '' : 'hidden'}`}
      />
      <canvas ref={canvasRef} className="hidden" />
      {cameraActive ? (
        <button onClick={capture} disabled={disabled} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
          Capture Photo
        </button>
      ) : (
        <div className="flex gap-4">
          <button onClick={startCamera} disabled={disabled} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            Use Camera
          </button>
          <label className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 cursor-pointer disabled:opacity-50">
            Upload Photo
            <input type="file" accept="image/*" onChange={handleFile} disabled={disabled} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
}