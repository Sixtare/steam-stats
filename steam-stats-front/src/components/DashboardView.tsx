"use client";

import { HeroHeader } from "./Dashboard/HeroHeader";
import { EcosystemCharts } from "./Dashboard/EcosystemCharts";
import { FavoriteGenres } from "./Dashboard/FavoriteGenres";
import { RecentActivity } from "./Dashboard/RecentActivity";

export function DashboardView({
  data,
  onSync,
}: {
  data: {
    profile: any;
    stats: any;
    genreEcosystem: any[];
    allGenres: any[];
    titanHours: any[];
    recentGames: any[];
    allGames: any[];
    headerImages: Record<string, string>;
  };
  onSync: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <>
      {/* Compact Hero Header */}
      <div className="animate-slide-left" style={{ animationDelay: "100ms" }}>
        <HeroHeader profile={data.profile} stats={data.stats} />
      </div>

      {/* Charts Grid */}
      <div className="animate-slide-right" style={{ animationDelay: "250ms" }}>
        <EcosystemCharts
          genreEcosystem={data.genreEcosystem}
          titanHours={data.titanHours}
        />
      </div>

      {/* Favorite Genres Analysis */}
      <div className="animate-slide-left" style={{ animationDelay: "400ms" }}>
        <FavoriteGenres allGenres={data.allGenres} />
      </div>

      {/* Recent Activity */}
      <div className="animate-slide-right" style={{ animationDelay: "550ms" }}>
        <RecentActivity recentGames={data.recentGames} onSync={onSync} />
      </div>
    </>
  );
}
