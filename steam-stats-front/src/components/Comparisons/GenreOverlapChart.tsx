"use client";

export function GenreOverlapChart({
  genreData,
  playerName1,
  playerName2,
}: {
  genreData: { label: string; h1: string; h2: string; glow1: boolean; glow2: boolean }[];
  playerName1: string;
  playerName2: string;
}) {
  return (
    <section
      className="animate-slide-left col-span-12 glass-card rounded-xl p-4 sm:p-6"
      style={{ animationDelay: "400ms" }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-outline-variant/10">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-title-md text-lg text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">analytics</span>
            Genre Overlap
          </h3>
          <span className="font-label-code text-[10px] sm:text-xs text-on-surface-variant">Percentage of Games With the Tag</span>
        </div>
        <div className="flex gap-4 self-end sm:self-auto">
          <div className="flex items-center gap-1 font-label-code text-xs text-secondary">
            <div className="w-2 h-2 rounded-full bg-secondary"></div> {playerName1}
          </div>
          <div className="flex items-center gap-1 font-label-code text-xs text-tertiary">
            <div className="w-2 h-2 rounded-full bg-tertiary"></div> {playerName2}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-10 md:gap-16 lg:gap-20 py-4">
        {genreData.map((genre) => (
          <div key={genre.label} className="space-y-2 text-center group relative shrink-0">
            <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-32">
              <div
                className={`w-6 sm:w-8 bg-secondary-container rounded-t ${genre.glow1 ? "shadow-[0_0_15px_rgba(0,125,173,0.3)]" : ""}`}
                style={{ height: genre.h1 }}
              ></div>
              <div
                className={`w-6 sm:w-8 bg-tertiary-container rounded-t ${genre.glow2 ? "shadow-[0_0_15px_rgba(49,0,121,0.3)]" : ""}`}
                style={{ height: genre.h2 }}
              ></div>
            </div>
            <p className="font-label-code text-[10px] sm:text-xs text-on-surface uppercase tracking-wide">{genre.label}</p>
            <div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-20 shadow-lg pointer-events-none"
              style={{
                backgroundColor: "var(--color-surface-container-highest)",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: "8px",
                color: "var(--color-on-surface)",
              }}
            >
              <div className="px-3 py-2 font-label-code text-xs whitespace-nowrap space-y-1">
                <div className="flex items-center gap-2" style={{ color: "var(--color-on-surface)" }}>
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                  {playerName1}: {genre.h1}
                </div>
                <div className="flex items-center gap-2" style={{ color: "var(--color-on-surface)" }}>
                  <span className="w-2 h-2 rounded-full bg-tertiary shrink-0"></span>
                  {playerName2}: {genre.h2}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
