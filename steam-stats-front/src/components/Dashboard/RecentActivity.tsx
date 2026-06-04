"use client";

export function RecentActivity({ recentGames, onSync }: { recentGames: any, onSync: (e: any) => void }) {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Recent Activity (2/3 width) */}
      <div className="xl:col-span-2 glass-card rounded-xl p-8 min-h-112.5 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline-lg text-2xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">analytics</span>
            Recent Activity (Last 2 Weeks)
          </h3>
        </div>
        <div className="flex-1 space-y-8">
          {recentGames.length === 0 ? (
            <div className="text-on-surface-variant italic h-full flex items-center justify-center">Nenhuma atividade recente registrada nas últimas 2 semanas.</div>
          ) : recentGames.map((game: any, i: number) => {
            const colorClasses = [
              {
                bg: "bg-secondary/10",
                text: "text-secondary",
                gradient: "from-secondary/40 via-secondary to-secondary/80",
                iconText: "text-secondary"
              },
              {
                bg: "bg-tertiary/10",
                text: "text-tertiary",
                gradient: "from-tertiary/40 via-tertiary to-tertiary/80",
                iconText: "text-tertiary"
              },
              {
                bg: "bg-secondary-container/10",
                text: "text-on-surface",
                gradient: "from-secondary-container/40 via-secondary-container to-secondary-container/80",
                iconText: "text-on-secondary-container"
              }
            ];
            const c = colorClasses[i] || colorClasses[0];
            const icons = ["playing_cards", "memory", "target"];
            const icon = icons[i] || "sports_esports";
            return (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded ${c.bg} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${c.iconText}`}>{icon}</span>
                    </div>
                    <div>
                      <h4 className="font-title-md text-xl font-bold text-white">{game.name}</h4>
                      <p className="text-[10px] font-label-code text-on-surface-variant">RECENTLY PLAYED</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-display-lg text-3xl font-bold ${c.text}`}>{game.playtime2w}h</span>
                    <span className="text-[10px] font-label-code text-on-surface-variant block uppercase tracking-tighter">Played Last 14d</span>
                  </div>
                </div>
                <div className="h-6 w-full bg-surface-container-low rounded-full overflow-hidden inner-glow">
                  <div
                    className={`h-full bg-linear-to-r ${c.gradient} rounded-full relative`}
                    style={{ width: `${Math.max(5, game.progress)}%` }}
                  >
                    <div className="absolute inset-0 animate-pulse-slow bg-white/5"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Genre Ecosystem (1/3 width) */}
      <div className="xl:col-span-1 glass-card rounded-xl p-8 min-h-112.5 flex flex-col">
        <div className="mb-8">
          <h3 className="font-headline-lg text-2xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary">donut_small</span>
            Recent Ecosystem
          </h3>
          <span className="font-label-code text-xs text-on-surface-variant">LAST 14 DAYS</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-full space-y-6">
            <div className="space-y-2">
              <div className="h-8 w-full bg-surface-container-low rounded-lg overflow-hidden flex inner-glow">
                {recentGames.slice(0, 3).map((g: any, i: number) => {
                  const colors = ["bg-secondary", "bg-tertiary", "bg-secondary-container"];
                  return (
                    <div key={i} className={`h-full ${colors[i] || 'bg-outline'}`} style={{ width: `${Math.max(5, g.progress)}%` }} title={`${g.name}`}></div>
                  )
                })}
              </div>
              <div className="flex justify-center items-center gap-2 pt-2">
                <span className="font-display-lg text-xl font-bold">14d</span>
                <span className="text-[10px] font-label-code text-on-surface-variant uppercase tracking-widest">Trend</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {recentGames.slice(0, 3).map((g: any, i: number) => {
                const dotColors = ["bg-secondary", "bg-tertiary", "bg-secondary-container"];
                const labelColors = ["text-secondary", "text-tertiary", "text-on-surface"];
                return (
                  <div key={i} className="flex items-center justify-between text-xs font-label-code">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dotColors[i] || 'bg-outline'}`}></div>
                      <span className="truncate max-w-30">{g.name.toUpperCase()}</span>
                    </div>
                    <span className={labelColors[i] || 'text-secondary'}>{g.playtime2w}h</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}