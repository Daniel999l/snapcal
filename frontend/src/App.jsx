import { useState, useEffect } from 'react';
import CameraCapture from './components/CameraCapture';
import ResultCard from './components/ResultCard';
import History from './components/History';

const STORAGE_KEY = 'snapcal_meals';

function loadMeals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMeals(meals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals.slice(0, 50)));
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraState, setCameraState] = useState('idle');
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    setMeals(loadMeals());
  }, []);

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

      // Save to localStorage
      const newMeal = { ...data, _id: Date.now().toString(), timestamp: new Date().toISOString() };
      const updated = [newMeal, ...meals];
      setMeals(updated);
      saveMeals(updated);
      setResult(newMeal);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setCameraState('idle');
    }
  };

  const handleUpdateMeal = (updatedMeal) => {
    const updated = meals.map(m => m._id === updatedMeal._id ? updatedMeal : m);
    setMeals(updated);
    saveMeals(updated);
    setResult(updatedMeal);
  };

  return (
    <div className="min-h-screen bg-surface font-body-lg text-on-surface antialiased">
      <Header />
      <main className="max-w-[1200px] mx-auto px-container-margin py-lg space-y-xl">
        <CameraCapture onImage={handleImage} disabled={loading} cameraState={cameraState} setCameraState={setCameraState} />

        {error && (
          <div className="bg-error-container text-on-error-container rounded-xl p-md flex items-center gap-sm">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-xl">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">autorenew</span>
            <span className="ml-2 text-on-surface-variant">Analyzing...</span>
          </div>
        )}

        {result && <ResultCard result={result} onSave={handleUpdateMeal} />}

        <History meals={meals} />
      </main>

      <button
        className="md:hidden fixed bottom-lg right-container-margin w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform"
        onClick={() => setCameraState('active')}
      >
        <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
      </button>
    </div>
  );
}