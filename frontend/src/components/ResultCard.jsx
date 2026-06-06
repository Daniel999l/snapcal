import { useState } from 'react';

export default function ResultCard({ result, onSave }) {
  if (!result) return null;

  const maxMacro = Math.max(result.protein, result.carbs, result.fat, 1);
  const macros = [
    { label: 'PROTEIN', value: result.protein, color: '#0058be', bg: '#d8e2ff' },
    { label: 'CARBS', value: result.carbs, color: '#855300', bg: '#ffddb8' },
    { label: 'FAT', value: result.fat, color: '#006c49', bg: '#6ffbbe' },
  ];

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ ...result });
  const [toast, setToast] = useState(null);

  const handleSave = () => {
    if (editing) {
      // Save edited meal via backend update
      fetch(`/api/meals/${result._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })
        .then(r => r.json())
        .then(updated => {
          setToast('Meal updated!');
          setTimeout(() => setToast(null), 2000);
          setEditing(false);
          if (onSave) onSave(updated);
        })
        .catch(() => setToast('Save failed'));
    } else {
      setToast('Meal saved to log!');
      setTimeout(() => setToast(null), 2000);
      if (onSave) onSave(result);
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-lg ambient-glow relative">
      {toast && (
        <div className="absolute top-2 right-2 bg-primary text-on-primary px-lg py-sm rounded-full text-label-caps font-label-caps z-10 animate-pulse">
          {toast}
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg border-b border-outline-variant/10 pb-lg mb-lg">
        <div className="flex items-center gap-lg">
          <div className="flex flex-col">
            <span className="text-display-calories font-display-calories text-primary leading-none">{result.calories}</span>
            <span className="text-label-caps font-label-caps text-on-surface-variant tracking-widest">KCAL TOTAL</span>
          </div>
          {result.ingredients && result.ingredients.length > 0 && (
            <div className="h-12 w-px bg-outline-variant/30 hidden md:block" />
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
          <button onClick={() => setEditing(!editing)} className="flex-1 md:flex-none border border-outline px-lg py-sm rounded-full text-label-caps font-label-caps hover:bg-surface-container transition-colors">
            {editing ? 'CANCEL' : 'EDIT MEAL'}
          </button>
          <button onClick={handleSave} className="flex-1 md:flex-none bg-primary text-on-primary px-xl py-sm rounded-full text-label-caps font-label-caps active:scale-95 transition-transform">
            {editing ? 'SAVE CHANGES' : 'SAVE TO LOG'}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-md">
          <div className="flex flex-col gap-sm">
            <label className="text-label-caps font-label-caps">Meal Name</label>
            <input value={editData.mealName} onChange={e => setEditData({...editData, mealName: e.target.value})} className="border border-outline-variant rounded-lg p-sm text-body-sm" />
          </div>
          <div className="grid grid-cols-4 gap-sm">
            <div>
              <label className="text-label-caps font-label-caps">Calories</label>
              <input type="number" value={editData.calories} onChange={e => setEditData({...editData, calories: Number(e.target.value)})} className="border border-outline-variant rounded-lg p-sm text-body-sm w-full" />
            </div>
            <div>
              <label className="text-label-caps font-label-caps">Protein</label>
              <input type="number" value={editData.protein} onChange={e => setEditData({...editData, protein: Number(e.target.value)})} className="border border-outline-variant rounded-lg p-sm text-body-sm w-full" />
            </div>
            <div>
              <label className="text-label-caps font-label-caps">Carbs</label>
              <input type="number" value={editData.carbs} onChange={e => setEditData({...editData, carbs: Number(e.target.value)})} className="border border-outline-variant rounded-lg p-sm text-body-sm w-full" />
            </div>
            <div>
              <label className="text-label-caps font-label-caps">Fat</label>
              <input type="number" value={editData.fat} onChange={e => setEditData({...editData, fat: Number(e.target.value)})} className="border border-outline-variant rounded-lg p-sm text-body-sm w-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-md">
          {macros.map(m => (
            <div key={m.label} className="rounded-xl p-md flex flex-col items-center text-center" style={{ backgroundColor: `${m.bg}1A`, borderColor: `${m.bg}4D`, borderWidth: 1 }}>
              <span className="text-headline-md font-headline-md" style={{ color: m.color }}>{m.value}g</span>
              <span className="text-label-caps font-label-caps" style={{ color: `${m.color}B3` }}>{m.label}</span>
              <div className="w-full h-1.5 rounded-full mt-sm overflow-hidden" style={{ backgroundColor: `${m.bg}33` }}>
                <div className="h-full rounded-full" style={{ width: `${(m.value / maxMacro) * 100}%`, backgroundColor: m.color }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}