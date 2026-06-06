import { useRef, useState, useEffect } from 'react';

export default function CameraCapture({ onImage, disabled, cameraState, setCameraState }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    if (cameraState === 'active') {
      startCamera();
    } else if (cameraState === 'idle' && stream) {
      stopCamera();
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [cameraState]);

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
      // Attach event before setting srcObject
      const video = videoRef.current;
      video.oncanplay = () => {};
      video.srcObject = s;
      setStream(s);
    } catch (err) {
      alert(`Camera error: ${err.message}`);
      setCameraState('idle');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraState('idle');
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Camera feed not ready yet. Please wait a moment.');
      return;
    }
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
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-lg ambient-glow">
      <div className="flex flex-col items-center text-center">
        {cameraState === 'active' ? (
          <>
            <div className="relative w-full max-w-md aspect-[4/3] bg-black rounded-xl overflow-hidden mb-4">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-primary/50 rounded-xl pointer-events-none"></div>
              <div className="scanner-line"></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={capture}
                disabled={disabled}
                className="bg-primary text-on-primary px-xl py-sm rounded-full text-label-caps font-label-caps active:scale-95 transition-transform flex items-center gap-sm disabled:opacity-50"
              >
                <span className="material-symbols-outlined">camera</span>
                Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="border border-outline px-lg py-sm rounded-full text-label-caps font-label-caps hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative w-40 h-40 rounded-full bg-surface-container-high flex items-center justify-center mb-4 border-2 border-dashed border-outline-variant/60">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant">add_a_photo</span>
            </div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-1">Snap Your Meal</h2>
            <p className="text-body-sm text-on-surface-variant mb-6">Take a photo or upload to get instant nutrition breakdown</p>
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
              <button
                onClick={() => setCameraState('active')}
                disabled={disabled}
                className="flex-1 bg-primary text-on-primary py-md px-lg rounded-full font-headline-md flex items-center justify-center gap-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">photo_camera</span>
                Snap Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex-1 bg-white/10 backdrop-blur-md border border-outline-variant py-md px-lg rounded-full font-headline-md flex items-center justify-center gap-sm hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined">gallery_thumbnail</span>
                Upload from Gallery
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </>
        )}
      </div>
    </section>
  );
}