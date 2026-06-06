import { useEffect, useState } from 'react';
import { fetchHistory } from '../api';

export default function History({ refreshKey }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory()
      .then(setMeals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) return <p className="text-gray-400">Loading history...</p>;
  if (meals.length === 0) return null;

  return (
    <section className="space-y-md">
      <div className="flex justify-between items-end">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface">Recent Meals</h2>
        <button className="text-label-caps font-label-caps text-primary hover:underline transition-all">VIEW ALL</button>
      </div>
      <div className="space-y-base">
        {meals.map((meal) => (
          <div key={meal._id} className="group flex items-center gap-md p-sm bg-surface-container-lowest border border-outline-variant/10 rounded-xl hover:border-primary/30 transition-all cursor-pointer">
            <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
              {meal.image ? (
                <img src={meal.image} alt={meal.mealName || 'Meal'} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant">restaurant</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-on-surface truncate">{meal.mealName || 'Unknown Meal'}</div>
              <div className="text-body-sm text-on-surface-variant flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {new Date(meal.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-headline-md text-on-surface">{meal.calories}</div>
              <div className="text-label-caps font-label-caps text-on-surface-variant">KCAL</div>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors px-xs">chevron_right</span>
          </div>
        ))}
      </div>
    </section>
  );
}