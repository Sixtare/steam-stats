"use client";

export function TopNav() {
  return (
    <header className="md:hidden w-full sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 flex justify-center items-center px-4 py-3.5 shadow-md">
      <h1 className="font-display-lg text-xl font-bold tracking-tighter text-secondary uppercase italic">STEAM STATS</h1>
    </header>
  );
}

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: any) => void;
  onHome: () => void;
}

export function BottomNav({ activeView, setActiveView, onHome }: BottomNavProps) {
  const getTabClass = (tabName: string) => {
    const base = "w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-300 ease-out cursor-pointer";
    if (activeView === tabName) {
      return `${base} bg-white/10 text-white border border-white/10 scale-105 shadow-inner`;
    }
    return `${base} text-on-surface-variant hover:text-white hover:bg-white/5`;
  };

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-low/95 backdrop-blur-2xl border border-outline-variant/30 rounded-2xl p-2 flex items-center gap-1.5 shadow-2xl shadow-black/80 z-50 max-w-[90vw] shrink-0">
      {/* Home / New Analysis button */}
      <button 
        className="w-11 h-11 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
        onClick={onHome}
        title="New Analysis"
      >
        <span className="material-symbols-outlined">search</span>
      </button>

      {/* Divider */}
      <div className="w-[1px] h-6 bg-outline-variant/30 mx-1 shrink-0" />

      {/* Dashboard View */}
      <button 
        className={getTabClass("dashboard")} 
        onClick={() => setActiveView("dashboard")}
        title="Dashboard"
      >
        <span className="material-symbols-outlined">dashboard</span>
      </button>

      {/* Library View */}
      <button 
        className={getTabClass("library")} 
        onClick={() => setActiveView("library")}
        title="Library"
      >
        <span className="material-symbols-outlined">sports_esports</span>
      </button>

      {/* Comparisons View */}
      <button 
        className={getTabClass("comparisons")} 
        onClick={() => setActiveView("comparisons")}
        title="Comparisons"
      >
        <span className="material-symbols-outlined">compare_arrows</span>
      </button>
    </nav>
  );
}