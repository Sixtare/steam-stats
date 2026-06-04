"use client";

export function TagRadarChart({
  compareTags,
  playerName1,
  playerName2,
}: {
  compareTags: { tag: string; player1_percentage: number; player2_percentage: number }[];
  playerName1: string;
  playerName2: string;
}) {
  const sliceCount = Math.min(compareTags.length, 10);

  return (
    <section
      className="animate-slide-left col-span-12 lg:col-span-4 glass-card rounded-xl p-6 flex flex-col"
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex justify-between items-center mb-4 pb-2">
        <h3 className="font-title-md text-lg text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">radar</span>
          Shared Tag Affinity
        </h3>
        <span className="font-label-code text-xs text-on-surface-variant">Tag Density</span>
      </div>
      <div className="relative grow flex items-center justify-center p-2 bg-transparent rounded-lg overflow-hidden">
        <svg className="w-full h-full max-w-70 aspect-square overflow-visible" viewBox="0 0 200 200">
          <defs>
            <filter id="glow-cyan">
              <feGaussianBlur result="blur" stdDeviation="2" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-purple">
              <feGaussianBlur result="blur" stdDeviation="2" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Concentric circles */}
          {[80, 60, 40, 20].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              fill="none"
              r={r}
              stroke="#44474c"
              strokeDasharray="2,2"
              strokeWidth="0.5"
            />
          ))}
          {/* Radial lines */}
          {compareTags.slice(0, 10).map((_: any, i: number) => {
            const angle = (2 * Math.PI * i) / sliceCount - Math.PI / 2;
            const x = 100 + 80 * Math.cos(angle);
            const y = 100 + 80 * Math.sin(angle);
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={x}
                y2={y}
                stroke="#44474c"
                strokeDasharray="4,4"
                strokeWidth="0.5"
              />
            );
          })}
          {/* Labels */}
          {compareTags.slice(0, 10).map((t: any, i: number) => {
            const angle = (2 * Math.PI * i) / sliceCount - Math.PI / 2;
            const labelR = 88;
            const x = 100 + labelR * Math.cos(angle);
            const y = 100 + labelR * Math.sin(angle);
            const textAnchor =
              Math.abs(Math.cos(angle)) < 0.05 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fill="#c4c6cc"
                fontSize="7"
                fontFamily="JetBrains Mono, monospace"
              >
                {t.tag.toUpperCase()}
              </text>
            );
          })}
          {/* Player 1 polygon */}
          <polygon
            fill="rgba(130, 207, 255, 0.15)"
            filter="url(#glow-cyan)"
            stroke="#82cfff"
            strokeWidth="1.5"
            points={compareTags
              .slice(0, 10)
              .map((t: any, i: number) => {
                const angle = (2 * Math.PI * i) / sliceCount - Math.PI / 2;
                const r = (t.player1_percentage / 100) * 80;
                const x = 100 + r * Math.cos(angle);
                const y = 100 + r * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(" ")}
          />
          {/* Player 2 polygon */}
          <polygon
            fill="rgba(209, 188, 255, 0.15)"
            filter="url(#glow-purple)"
            stroke="#d1bcff"
            strokeWidth="1.5"
            points={compareTags
              .slice(0, 10)
              .map((t: any, i: number) => {
                const angle = (2 * Math.PI * i) / sliceCount - Math.PI / 2;
                const r = (t.player2_percentage / 100) * 80;
                const x = 100 + r * Math.cos(angle);
                const y = 100 + r * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(" ")}
          />
        </svg>
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center justify-between font-label-code text-xs">
          <div className="flex items-center gap-1 text-secondary">
            <div className="w-2 h-0.5 bg-secondary"></div> {playerName1}
          </div>
        </div>
        <div className="flex items-center justify-between font-label-code text-xs">
          <div className="flex items-center gap-1 text-tertiary">
            <div className="w-2 h-0.5 bg-tertiary"></div> {playerName2}
          </div>
        </div>
      </div>
    </section>
  );
}
