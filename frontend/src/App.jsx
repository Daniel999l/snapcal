import { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import ResultCard from './components/ResultCard';
import History from './components/History';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mt-8 mb-2">SnapCal</h1>
      <p className="text-gray-500 mb-6">Snap a photo of your meal to estimate calories and macros</p>
      <CameraCapture onImage={handleImage} disabled={loading} />
      {loading && <div className="mt-4 text-blue-500">Analyzing...</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {result && <ResultCard result={result} />}
      <History key={result?.timestamp} />
    </div>
  );
}