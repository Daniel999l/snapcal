export default function ResultCard({ result }) {
  if (!result) return null;

  const maxMacro = Math.max(result.protein, result.carbs, result.fat, 1);
  const macros = [
    { label: 'PROTEIN', value: result.protein, color: '#0058be', bg: '#d8e2ff' },
    { label: 'CARBS', value: result.carbs, color: '#855300', bg: '#ffddb8' },
    { label: 'FAT', value: result.fat, color: '#006c49', bg: '#6ffbbe' },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-lg ambient-glow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg border-b border-outline-variant/10 pb-lg mb-lg">
        <div className="flex items-center gap-lg">
          <div className="flex flex-col">
            <span className="text-display-calories font-display-calories text-primary leading-none">{result.calories}</span>
            <span className="text-label-caps font-label-caps text-on-surface-variant tracking-widest">KCAL TOTAL</span>
          </div>
          {result.ingredients && result.ingredients.length > 0 && (
            <div className="h-12 w-px bg-outline-variant/30 hidden md:block"></div>
          )}
          {result.ingredients && result.ingredients.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-xs">
              {result.ingredients.slice(0, 4).map((ing, i) => (
                <span key={i} className="px-sm py-xs bg-surface-container rounded-lg text-body-sm text-on-surface-variant flex items-center gap-xs border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {ing}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-sm w-full md:w-auto">
          <button className="flex-1 md:flex-none border border-outline px-lg py-sm rounded-full text-label-caps font-label-caps hover:bg-surface-container transition-colors">EDIT MEAL</button>
          <button className="flex-1 md:flex-none bg-primary text-on-primary px-xl py-sm rounded-full text-label-caps font-label-caps active:scale-95 transition-transform">SAVE TO LOG</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-md">
        {macros.map(m => (
          <div key={m.label} className="rounded-xl p-md flex flex-col items-center text-center" style={{ backgroundColor: `${m.bg}1A`, borderColor: `${m.bg}4D`, borderWidth: 1 }}>
            <span className="text-headline-md font-headline-md" style={{ color: m.color }}>{m.value}g</span>
            <span className="text-label-caps font-label-caps" style={{ color: `${m.color}B3` }}>{m.label}</span>
            <div className="w-full h-1.5 rounded-full mt-sm overflow-hidden" style={{ backgroundColor: `${m.bg}33` }}>
              <div className="h-full rounded-full" style={{ width: `${(m.value / maxMacro) * 100}%`, backgroundColor: m.color }}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}