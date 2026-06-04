"use client";

export function TopNav() {
  return (
    <header className="md:hidden w-full sticky top-0 z-50 bg-surface/60 backdrop-blur-xl border-b border-secondary/30 flex justify-between items-center px-4 py-4 shadow-lg shadow-tertiary/10">
      <h1 className="font-display-lg text-2xl font-bold tracking-tighter text-secondary uppercase italic">VAPOR STATS</h1>
      <div className="flex gap-4">
        <span className="material-symbols-outlined text-secondary">notifications</span>
        <span className="material-symbols-outlined text-secondary">settings</span>
      </div>
    </header>
  );
}

export function BottomNav({ activeView, setActiveView }: { activeView?: string; setActiveView?: (view: any) => void }) {
  const getTabColor = (tabName: string) => {
    return activeView === tabName ? "text-secondary" : "text-on-surface-variant";
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/80 backdrop-blur-xl border-t border-secondary/20 flex justify-around py-4 z-50">
      <button className={`flex flex-col items-center cursor-pointer ${getTabColor('dashboard')}`} onClick={() => setActiveView && setActiveView('dashboard')}>
        <span className="material-symbols-outlined">dashboard</span>
        <span className="text-[10px] font-label-code">DASH</span>
      </button>
      <button className={`flex flex-col items-center cursor-pointer ${getTabColor('library')}`} onClick={() => setActiveView && setActiveView('library')}>
        <span className="material-symbols-outlined">sports_esports</span>
        <span className="text-[10px] font-label-code">GAMES</span>
      </button>
      <button className="flex flex-col items-center text-on-surface-variant cursor-pointer">
        <span className="material-symbols-outlined">military_tech</span>
        <span className="text-[10px] font-label-code">ACHIEVE</span>
      </button>
      <button className="flex flex-col items-center text-on-surface-variant cursor-pointer">
        <span className="material-symbols-outlined">group</span>
        <span className="text-[10px] font-label-code">FRIENDS</span>
      </button>
    </nav>
  );
}