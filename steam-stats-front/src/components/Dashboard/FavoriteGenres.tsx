"use client";

import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const TreemapContent = (props: any) => {
  const { depth, x, y, width, height, name, value, maxVal } = props;

  // Only render child items (depth 1), root is depth 0 and caused blurred text
  if (depth !== 1) return null;

  // Color depends on treemap size
  const percent = Math.max(0.1, value / maxVal);
  const bgOpacity = 0.1 + (percent * 0.4);
  const borderOpacity = 0.2 + (percent * 0.3);

  // Calculate dynamic font size to always fit in the box
  const availableWidth = Math.max(0, width - 16); // 8px de padding de cada lado
  
  // Smart line break for title: try to keep 11px if possible
  const targetFontSize = 11;
  const maxCharsPerLine = Math.max(1, Math.floor(availableWidth / (targetFontSize * 0.6)));
  
  const words = name.split(' ');
  const lines = [];
  let currentLine = words[0] || '';
  for (let i = 1; i < words.length; i++) {
    if ((currentLine + ' ' + words[i]).length <= maxCharsPerLine) {
      currentLine += ' ' + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);

  // Calculate final font size based on longest line (reduces if the longest word overflows)
  const longestLineLength = Math.max(...lines.map(l => l.length), 1);
  const estimatedTitleSize = availableWidth / (longestLineLength * 0.6);
  const titleFontSize = Math.max(7, Math.min(12, estimatedTitleSize));
  
  const gamesText = `${value} GAMES`;
  const estimatedSubSize = availableWidth / (gamesText.length * 0.6);
  const subtitleFontSize = Math.max(6, Math.min(10, estimatedSubSize));

  // Text block sizing with line count
  const titleLineHeight = titleFontSize * 1.2;
  const titleBlockHeight = lines.length * titleLineHeight;

  // Only show if box has minimum height to support text
  const showTitle = height > titleBlockHeight + 12 && availableWidth > 10;
  const showSubtitle = height > titleBlockHeight + subtitleFontSize + 20 && availableWidth > 10;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: `rgba(130, 207, 255, ${bgOpacity})`,
          stroke: `rgba(130, 207, 255, ${borderOpacity})`,
          strokeWidth: 1,
          transition: 'all 0.3s ease',
        }}
        className="hover:fill-secondary/30 hover:stroke-secondary/70 cursor-pointer"
      />
      {showTitle && (
        <text
          x={x + 8}
          y={y + 12 + (titleFontSize / 2)}
          fill="#e4e2e3"
          stroke="none"
          fontSize={titleFontSize}
          fontWeight="bold"
          fontFamily="Sora, sans-serif"
          className="pointer-events-none"
        >
          {lines.map((line, index) => (
            <tspan x={x + 8} dy={index === 0 ? 0 : titleLineHeight} key={index}>
              {line}
            </tspan>
          ))}
        </text>
      )}
      {showSubtitle && (
        <text
          x={x + 8}
          y={y + 16 + titleBlockHeight + (subtitleFontSize / 2)}
          fill="#82cfff"
          stroke="none"
          fontSize={subtitleFontSize}
          fontFamily="JetBrains Mono, monospace"
          className="pointer-events-none opacity-80"
        >
          {gamesText}
        </text>
      )}
    </g>
  );
};

export function FavoriteGenres({ allGenres }: { allGenres: any }) {
  // Prepare data for Treemap
  const top100Genres = allGenres.slice(0, 100);
  const maxVal = top100Genres[0]?.value || 1;
  const treemapData = top100Genres.map((genre: any, i: number) => ({
    name: genre.name,
    size: genre.value,
    value: genre.value,
    rank: i + 1,
    maxVal
  }));

  return (
    <section>
      <div className="glass-card rounded-xl p-8">
        <div className="flex items-center justify-between mb-8 border-b border-outline-variant/10 pb-4">
          <h3 className="font-headline-lg text-2xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">psychology</span>
            Favorite Genres Analysis
          </h3>
          <div className="flex items-center gap-4">
            <span className="font-label-code text-xs text-on-surface-variant">CORE PREFERENCES</span>
          </div>
        </div>
        
        <div className="h-125">
          <ResponsiveContainer width="100%" height={500}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke="#fff"
              isAnimationActive={false}
              content={<TreemapContent />}
            >
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-surface-container-highest border border-outline-variant/30 rounded p-3 shadow-xl">
                        <p className="font-display-lg text-sm font-bold text-white mb-1">{data.name}</p>
                        <p className="font-label-code text-xs text-secondary">{data.value} Games</p>
                        <p className="font-label-code text-[10px] text-on-surface-variant mt-1">Rank #{data.rank}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}