"use client";

export function Sidebar({ profile, activeView, setActiveView, onHome, disabled }: { profile: any; activeView: string; setActiveView: (view: any) => void; onHome: () => void; disabled?: boolean }) {
  const getTabClass = (tabName: string) => {
    if (disabled) {
      return "flex items-center gap-4 p-3 text-on-surface-variant/40 rounded-lg mx-2 my-1 cursor-not-allowed";
    }
    if (activeView === tabName) {
      return "flex items-center gap-4 p-3 bg-secondary-container text-on-secondary-container rounded-lg mx-2 my-1 scale-105 duration-300 ease-out cursor-pointer";
    }
    return "flex items-center gap-4 p-3 text-on-surface-variant hover:text-secondary hover:bg-surface-variant/50 rounded-lg mx-2 my-1 transition-all hover:border-l-4 hover:border-secondary cursor-pointer";
  };

  const handleNavClick = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    if (!disabled) {
      setActiveView(view);
    }
  };

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest/80 backdrop-blur-2xl border-r border-outline-variant/20 flex-col py-2 z-50">
      <div className="px-6 py-8">
        <h1 className="font-display-lg text-3xl font-bold tracking-tighter text-secondary uppercase italic">STEAM STATS</h1>
      </div>
      <nav className="px-4 space-y-2">
        <a className={getTabClass("dashboard")} onClick={(e) => handleNavClick(e, "dashboard")}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-code text-xs font-semibold">Dashboard</span>
        </a>
        <a className={getTabClass("library")} onClick={(e) => handleNavClick(e, "library")}>
          <span className="material-symbols-outlined">sports_esports</span>
          <span className="font-label-code text-xs font-semibold">Library</span>
        </a>
        <a className={getTabClass("comparisons")} onClick={(e) => handleNavClick(e, "comparisons")}>
          <span className="material-symbols-outlined">compare_arrows</span>
          <span className="font-label-code text-xs font-semibold">Comparisons</span>
        </a>
      </nav>
      {/* New Analysis — vertically centered in remaining space */}
      <div className="flex-1 flex items-center px-4 pb-6">
        <a className="w-full flex items-center gap-3 p-3 bg-secondary/20 text-secondary hover:bg-secondary/30 rounded-xl transition-all cursor-pointer border border-secondary/30 hover:border-secondary/50" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="material-symbols-outlined text-lg">search</span>
          <span className="font-label-code text-xs font-semibold tracking-wide">New Analysis</span>
        </a>
      </div>
    </aside>
  );
}
