"use client";

import { useState, useMemo, useEffect, useRef } from "react";

export function LibraryView({ allGames, headerImages }: { allGames: any[]; headerImages: Record<string, string> }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [filterMode, setFilterMode] = useState<'all' | 'recent'>('all');
  
  // Sort games by playtime initially
  const sortedGames = useMemo(() => {
    return [...allGames].sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0));
  }, [allGames]);

  // Calculate total playtime for relative bar
  const totalPlaytime = useMemo(() => {
    return allGames.reduce((sum, g) => sum + (g.playtime_forever || 0), 0);
  }, [allGames]);

  // Filter based on search and mode
  const filteredGames = useMemo(() => {
    let games = sortedGames;
    if (filterMode === 'recent') {
      games = games.filter(g => (g.playtime_2weeks || 0) > 0);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      games = games.filter(g => g.name.toLowerCase().includes(lowerSearch));
    }
    return games;
  }, [sortedGames, searchTerm, filterMode]);
  
  const visibleGames = filteredGames.slice(0, visibleCount);

  // Infinite scroll observer
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < filteredGames.length) {
        setVisibleCount(prev => prev + 20);
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredGames.length]);

  return (
    <section>
      {/* Library Controls */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <button onClick={() => { setFilterMode('all'); setVisibleCount(20); }} className={`px-5 py-1.5 hover:cursor-pointer rounded-full font-label-code text-[11px] whitespace-nowrap transition-all hover:brightness-110 ${filterMode === 'all' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high/50 text-on-surface-variant hover:text-secondary border border-outline-variant/10'}`}>
            All Games
          </button>
          <button onClick={() => { setFilterMode('recent'); setVisibleCount(20); }} className={`px-5 py-1.5 hover:cursor-pointer rounded-full font-label-code text-[11px] whitespace-nowrap transition-all hover:brightness-110 ${filterMode === 'recent' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high/50 text-on-surface-variant hover:text-secondary border border-outline-variant/10'}`}>
            Recent
          </button>
        </div>
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low/50 border border-outline-variant/20 focus:border-secondary/50 transition-all outline-none rounded-lg font-body-sm text-on-surface placeholder:text-on-surface-variant/50" 
            placeholder="Filter library..." 
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(20);
            }}
          />
        </div>
      </div>

      {/* High-Density Game List Container */}
      <div className="space-y-3" id="game-list">

        {/* Game Rows - 3 per row */}
        {visibleGames.reduce((rows: any[], game: any, idx: number) => {
          if (idx % 4 === 0) rows.push([game]);
          else rows[rows.length - 1].push(game);
          return rows;
        }, []).map((pair: any[], rowIdx: number) => (
          <div key={`row-${rowIdx}`} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {pair.map((game: any) => {
              const playtimeHours = Math.round(game.playtime_forever / 60);
              const relativePercent = totalPlaytime > 0 ? Math.min(100, Math.round((game.playtime_forever / totalPlaytime) * 100)) : 0;
              const timeText = playtimeHours > 1000 ? `${(playtimeHours / 1000).toFixed(1)}kh` : `${playtimeHours}h`;

              return (
                <div key={game.appid} className="glass-card animate-item group flex items-center px-4 py-3 rounded-lg transition-all hover:bg-surface-variant/40 hover:border-secondary/30">
                  <div className="w-36 h-14 rounded bg-surface-container overflow-hidden border border-outline-variant/10 shadow-sm shrink-0">
                    <img
                      alt={game.name}
                      className="w-full h-full object-cover"
                      src={headerImages[String(game.appid)] || `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (img.dataset.fallbackAttempted) return;
                        img.dataset.fallbackAttempted = "true";
                        img.src = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;
                      }}
                    />
                  </div>
                  
                  <div className="ml-3 flex-1 overflow-hidden">
                    <h3 className="font-title-md text-[13px] text-on-surface group-hover:text-secondary transition-colors truncate">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 max-w-35 h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-secondary shadow-[0_0_8px_rgba(130,207,255,0.4)] transition-all duration-1000" style={{ width: `${relativePercent}%` }}></div>
                      </div>
                      <span className="font-label-code text-[12px] text-secondary/80 shrink-0">
                        {timeText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Loading / Infinite Scroll Trigger */}
        {visibleCount < filteredGames.length && (
          <div ref={loaderRef} className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            <p className="font-label-code text-[10px] text-on-surface-variant uppercase tracking-widest">Loading Library...</p>
          </div>
        )}
      </div>
    </section>
  );
}