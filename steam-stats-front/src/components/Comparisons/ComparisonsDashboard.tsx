"use client";

import { ComparisonHeader } from "./ComparisonHeader";
import { SharedLibraryChart } from "./SharedLibraryChart";
import { TagRadarChart } from "./TagRadarChart";
import { GenreOverlapChart } from "./GenreOverlapChart";

export function ComparisonsDashboard({
  player1,
  player2,
  compareData,
}: {
  player1: { profile: any; totalGames: number; totalHours?: number; accountValue?: string };
  player2: { profile: any; totalGames: number; totalHours?: number; accountValue?: string };
  compareData: {
    common_games: number;
    cosine_similarity: number;
    player2_total_price?: number;
    player2_total_hours?: number;
    compare_hours?: { appid: number; name: string; player1_hours: number; player2_hours: number }[];
    compare_tags?: { tag: string; player1_percentage: number; player2_percentage: number }[];
  } | null;
}) {
  const commonGames = compareData?.common_games ?? 0;
  const matchValue = compareData?.cosine_similarity ?? 85;
  const compareTags = compareData?.compare_tags ?? [];
  const compareHours = compareData?.compare_hours ?? [];

  const player2WithPrice = {
    ...player2,
    totalHours: compareData?.player2_total_hours ?? 0,
    totalPrice: compareData?.player2_total_price ?? 0,
  };

  const genreData = compareTags.map((t) => {
    const p1 = t.player1_percentage;
    const p2 = t.player2_percentage;
    return {
      label: t.tag,
      h1: `${p1.toFixed(2)}%`,
      h2: `${p2.toFixed(2)}%`,
      glow1: p1 > p2,
      glow2: p2 > p1,
    };
  });

  const playerName1 = player1.profile.name || "P1";
  const playerName2 = player2.profile.name || "P2";

  return (
    <div className="space-y-5">
      <ComparisonHeader
        player1={player1}
        player2={player2WithPrice}
        commonGames={commonGames}
        matchValue={matchValue}
      />

      <div className="grid grid-cols-12 gap-5">
        <SharedLibraryChart
          compareHours={compareHours}
          commonGames={commonGames}
          playerName1={playerName1}
          playerName2={playerName2}
        />

        <TagRadarChart
          compareTags={compareTags}
          playerName1={playerName1}
          playerName2={playerName2}
        />

        <GenreOverlapChart
          genreData={genreData}
          playerName1={playerName1}
          playerName2={playerName2}
        />
      </div>
    </div>
  );
}
