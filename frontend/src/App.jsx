import { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import ResultCard from './components/ResultCard';
import History from './components/History';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraState, setCameraState] = useState('idle'); // idle, active, processing

  const handleImage = async (base64Image) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setCameraState('processing');
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Estimation failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setCameraState('idle');
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-lg text-on-surface antialiased">
      {/* Top Navigation */}
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/20">
        <div className="flex justify-between items-center w-full px-container-margin py-base max-w-[1200px] mx-auto h-16">
          <div className="flex flex-col">
            <span className="text-headline-md font-headline-md font-extrabold text-primary tracking-tight">SnapCal</span>
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-widest">AI Meal Tracker</span>
          </div>
          <div className="flex items-center gap-md">
            <div className="hidden md:flex items-center gap-xs px-sm py-xs bg-surface-container-low rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <span className="text-label-caps font-label-caps">12 DAY STREAK</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors duration-200">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-container-margin py-lg space-y-xl">
        {/* Camera Section */}
        <CameraCapture onImage={handleImage} disabled={loading} cameraState={cameraState} setCameraState={setCameraState} />

        {/* Error */}
        {error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-md flex items-center gap-sm">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-xl">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">autorenew</span>
            <span className="ml-2 text-on-surface-variant">Analyzing...</span>
          </div>
        )}

        {/* Result */}
        {result && <ResultCard result={result} />}

        {/* History */}
        <History key={result?.timestamp} />
      </main>

      {/* Floating Action Button for mobile - opens camera */}
      <button
        className="md:hidden fixed bottom-lg right-container-margin w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform"
        onClick={() => setCameraState('active')}
      >
        <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
      </button>
    </div>
  );
}