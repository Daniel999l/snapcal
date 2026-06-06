export default function ResultCard({ result }) {
  if (!result) return null;

  const maxMacro = Math.max(result.protein, result.carbs, result.fat);

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-lg ambient-glow">
      {/* Header with calorie display and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg border-b border-outline-variant/10 pb-lg mb-lg">
        <div className="flex items-center gap-lg">
          <div className="flex flex-col">
            <span className="text-display-calories font-display-calories text-primary leading-none">{result.calories}</span>
            <span className="text-label-caps font-label-caps text-on-surface-variant tracking-widest">KCAL TOTAL</span>
          </div>
          <div className="h-12 w-px bg-outline-variant/30 hidden md:block" />
          <div className="hidden sm:flex flex-wrap gap-xs">
            {result.ingredients?.slice(0, 3).map((ing, i) => (
              <span key={i} className="px-sm py-xs bg-surface-container rounded-lg text-body-sm text-on-surface-variant flex items-center gap-xs border border-outline-variant/10">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {ing}
              </span>
            ))}
            {result.ingredients?.length > 3 && (
              <span className="text-body-sm text-on-surface-variant">+{result.ingredients.length - 3}</span>
            )}
          </div>
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <button className="flex-1 md:flex-none border border-outline px-lg py-sm rounded-full text-label-caps font-label-caps hover:bg-surface-container transition-colors">
            EDIT MEAL
          </button>
          <button className="flex-1 md:flex-none bg-primary text-on-primary px-xl py-sm rounded-full text-label-caps font-label-caps active:scale-95 transition-transform">
            SAVE TO LOG
          </button>
        </div>
      </div>

      {/* Macro grid */}
      <div className="grid grid-cols-3 gap-md">
        {/* Protein */}
        <div className="macro-pill bg-secondary-fixed/10 border border-secondary-fixed/30 rounded-xl p-md flex flex-col items-center text-center">
          <span className="text-headline-md font-headline-md text-secondary">{result.protein}g</span>
          <span className="text-label-caps font-label-caps text-secondary/70">PROTEIN</span>
          <div className="w-full bg-secondary-fixed/20 h-1.5 rounded-full mt-sm overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: `${(result.protein / maxMacro) * 100}%` }} />
          </div>
        </div>
        {/* Carbs */}
        <div className="macro-pill bg-tertiary-fixed/10 border border-tertiary-fixed/30 rounded-xl p-md flex flex-col items-center text-center">
          <span className="text-headline-md font-headline-md text-tertiary">{result.carbs}g</span>
          <span className="text-label-caps font-label-caps text-tertiary/70">CARBS</span>
          <div className="w-full bg-tertiary-fixed/20 h-1.5 rounded-full mt-sm overflow-hidden">
            <div className="bg-tertiary-container h-full rounded-full" style={{ width: `${Math.min((result.carbs / maxMacro) * 100, 100)}%` }} />
          </div>
        </div>
        {/* Fat */}
        <div className="macro-pill bg-primary-fixed/10 border border-primary-fixed/30 rounded-xl p-md flex flex-col items-center text-center">
          <span className="text-headline-md font-headline-md text-primary">{result.fat}g</span>
          <span className="text-label-caps font-label-caps text-primary/70">FAT</span>
          <div className="w-full bg-primary-fixed/20 h-1.5 rounded-full mt-sm overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: `${(result.fat / maxMacro) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Full ingredient list if more than 3 */}
      {result.ingredients?.length > 3 && (
        <div className="mt-lg pt-lg border-t border-outline-variant/10">
          <div className="flex flex-wrap gap-xs">
            {result.ingredients.map((ing, i) => (
              <span key={i} className="px-sm py-xs bg-surface-container rounded-lg text-body-sm text-on-surface-variant flex items-center gap-xs border border-outline-variant/10">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}