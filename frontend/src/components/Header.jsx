export default function Header() {
  return (
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
  );
}