import { useEffect, useState } from 'react';
import { fetchHistory } from '../api';

export default function History() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory()
      .then(setMeals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="mt-6 text-gray-400">Loading history...</p>;
  if (meals.length === 0) return null;

  return (
    <div className="mt-8 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">Recent Meals</h3>
      <ul className="space-y-2">
        {meals.map((meal, idx) => (
          <li key={meal._id || idx} className="bg-white rounded-lg p-3 shadow-sm flex justify-between text-sm">
            <span>
              {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="font-medium">{meal.calories} kcal</span>
          </li>
        ))}
      </ul>
    </div>
  );
}