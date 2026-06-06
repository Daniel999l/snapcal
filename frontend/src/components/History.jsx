export default function History({ meals }) {
  if (meals.length === 0) return null;

  return (
    <section>
      <h3 className="text-headline-md font-headline-md mb-md">Recent Meals</h3>
      <div className="space-y-sm">
        {meals.map((meal, idx) => (
          <a key={meal._id || idx} className="group flex items-center justify-between bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-md py-sm hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-md">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="flex flex-col">
                <span className="font-headline-md text-on-surface">{meal.calories} kcal</span>
                <div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  {new Date(meal.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-sm">
              <div className="text-right">
                <div className="font-headline-md text-on-surface">{meal.calories}</div>
                <div className="text-label-caps font-label-caps text-on-surface-variant">KCAL</div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors px-xs">chevron_right</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}