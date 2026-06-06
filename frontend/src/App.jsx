import { useState, useEffect } from 'react';
import Header from './components/Header';
import CameraSection from './components/CameraSection';
import ResultCard from './components/ResultCard';
import History from './components/History';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [meals, setMeals] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setMeals(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleImage = async (base64Image) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Estimation failed');
      setResult(data);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-container-margin py-lg space-y-xl">
        <CameraSection onImage={handleImage} loading={loading} />
        {error && (
          <div className="bg-error-container text-on-error-container p-md rounded-xl flex items-center gap-sm">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}
        {result && <ResultCard result={result} />}
        <History meals={meals} />
      </main>
      {/* Floating action for mobile */}
      <button
        className="md:hidden fixed bottom-lg right-container-margin w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform"
        onClick={() => document.getElementById('camera-section')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
      </button>
    </>
  );
}