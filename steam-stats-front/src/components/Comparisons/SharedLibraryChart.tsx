"use client";

function formatHours(h: number): string {
  return h.toLocaleString();
}

export function SharedLibraryChart({
  compareHours,
  commonGames,
  playerName1,
  playerName2,
}: {
  compareHours: { appid: number; name: string; player1_hours: number; player2_hours: number }[];
  commonGames: number;
  playerName1: string;
  playerName2: string;
}) {
  return (
    <section
      className="animate-slide-left col-span-12 lg:col-span-8 glass-card rounded-xl p-6"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex justify-between items-center mb-4 pb-15">
        <h3 className="font-title-md text-lg text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">library_books</span>
          Shared Library
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 font-label-code text-xs text-secondary">
            <div className="w-2 h-2 rounded-full bg-secondary"></div> {playerName1}
          </div>
          <div className="flex items-center gap-1 font-label-code text-xs text-tertiary">
            <div className="w-2 h-2 rounded-full bg-tertiary"></div> {playerName2}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {compareHours.map((game) => {
          const total = game.player1_hours + game.player2_hours;
          const w1 = total > 0 ? (game.player1_hours / total) * 100 : 0;
          const w2 = total > 0 ? (game.player2_hours / total) * 100 : 0;
          const truncName = game.name.length > 24 ? game.name.slice(0, 24) + "..." : game.name;
          return (
            <div key={game.appid} className="space-y-1">
              <div className="flex justify-between font-label-code text-xs text-on-surface-variant">
                <span>{truncName}</span>
                <span>
                  {formatHours(game.player1_hours)}h vs {formatHours(game.player2_hours)}h
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-secondary-container shadow-[0_0_8px_rgba(0,125,173,0.5)]"
                  style={{ width: `${w1}%` }}
                ></div>
                <div
                  className="h-full bg-tertiary-container shadow-[0_0_8px_rgba(209,188,255,0.5)]"
                  style={{ width: `${w2}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      {compareHours.length > 0 && (
        <div className="mt-4 pt-3 border-t border-outline-variant/30 text-center">
          <span className="font-label-code text-xs text-on-surface-variant">{commonGames} GAMES IN COMMON</span>
        </div>
      )}
    </section>
  );
}
