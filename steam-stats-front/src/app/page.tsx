"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LoginScreen } from "../components/LoginScreen";
import { Sidebar } from "../components/Sidebar";
import { TopNav, BottomNav } from "../components/MobileNav";
import { DashboardView } from "../components/DashboardView";
import { LibraryView } from "../components/LibraryView";
import { ComparisonsView } from "../components/ComparisonsView";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function Home() {
  const [steamIdInput, setSteamIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<any>(null);
  const [activeView, setActiveView] = useState<"login" | "dashboard" | "library" | "comparisons">(() => {
    // Restore view from history state on mount, or infer from URL
    if (typeof window !== "undefined") {
      const path = window.location.pathname.slice(1) as "login" | "dashboard" | "library" | "comparisons";
      if (["dashboard", "library", "comparisons"].includes(path)) return path;
      if (window.history.state?.view) return window.history.state.view;
    }
    return "login";
  });
  const [hostSteamId, setHostSteamId] = useState("");
  const [comparisonResetKey, setComparisonResetKey] = useState(0);
  const navigatingBack = useRef(false);

  // Sync view with URL for browser back/forward
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const view = (e.state?.view as "login" | "dashboard" | "library" | "comparisons") || "login";
      navigatingBack.current = true;
      setActiveView(view);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Scroll to top when active view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  const navigateToView = useCallback((view: "login" | "dashboard" | "library" | "comparisons") => {
    if (navigatingBack.current) {
      navigatingBack.current = false;
      setActiveView(view);
      return;
    }
    setActiveView(view);
    const url = view === "login" ? "/" : `/${view}`;
    window.history.pushState({ view }, "", url);
  }, []);

  const fetchStats = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = steamIdInput.trim();
    if (!trimmed) return;
    setLoading(true);
    setLoginError("");
    setData(null);
    setComparisonResetKey(k => k + 1);
    try {
      // Validate input via backend first — resolves any URL or ID to a steam ID
      const validateRes = await fetch(`${API_BASE}/api/stats/validate?url=${encodeURIComponent(trimmed)}`);
      if (!validateRes.ok) {
        throw new Error("Invalid Steam profile URL or ID.");
      }
      let validateData;
      try { validateData = await validateRes.json(); } catch { throw new Error("Invalid Steam profile URL or ID."); }
      const id = validateData.steamid;
      if (!id) throw new Error("Could not resolve Steam ID.");
      setHostSteamId(id);

      // First fetch the profile to verify it exists and is not private
      const profileRes = await fetch(`${API_BASE}/api/stats?id=${id}`);

      if (!profileRes.ok) {
        let errorMsg = "An error occurred while fetching the profile.";
        try {
          const errJson = await profileRes.json();
          if (errJson && errJson.error) errorMsg = errJson.error;
        } catch { }
        throw new Error(errorMsg);
      }

      let json;
      try {
        json = await profileRes.json();
      } catch {
        throw new Error("Invalid Steam profile URL or ID.");
      }

      if (json && typeof json === "object" && "error" in json) {
        throw new Error(json.error || "Player profile is not public.");
      }

      const gamesRes = await fetch(`${API_BASE}/api/stats/gamelist?id=${id}`);
      const lastPlayedRes = await fetch(`${API_BASE}/api/stats/lastplayed?id=${id}`);

      let gamesList: any = [];
      if (!gamesRes.ok) {
        let errorMsg = "Invalid Steam profile URL or ID.";
        try { const errJson = await gamesRes.json(); if (errJson && errJson.error) errorMsg = errJson.error; } catch { }
        throw new Error(errorMsg);
      }
      try { gamesList = await gamesRes.json(); } catch { throw new Error("Player profile is not public."); }
      if (!gamesList || typeof gamesList !== "object" || !Array.isArray(gamesList.games)) {
        if (gamesList && typeof gamesList === "object" && "error" in gamesList) {
          throw new Error(gamesList.error || "Player profile is not public.");
        }
        throw new Error("Player profile is not public.");
      }
      if (gamesList.games.length === 0) {
        throw new Error("Player profile is not public.");
      }
      let lastPlayedList: any[] = [];
      try { lastPlayedList = lastPlayedRes.ok ? await lastPlayedRes.json() : []; } catch { }

      const allGamesList = gamesList.games;
      const gameCount = gamesList.game_count;
      const totalHours = gamesList.total_hours;

      // Fetch full game data (tags, prices, images) via /api/gamedata/{ids}
      let headerImages: Record<string, string> = {};
      let totalAccountValue = "?";
      let topTags: any[] = [];
      let gridTags: any[] = [];

      try {
        const appIds = allGamesList.map((g: any) => g.appid).filter(Boolean);
        if (appIds.length > 0) {
          const gameDataRes = await fetch(`${API_BASE}/api/gamedata?ids=${appIds.join(',')}`);
          if (gameDataRes.ok) {
            const gameDataResponse = await gameDataRes.json();

            if (gameDataResponse && Array.isArray(gameDataResponse.gameData)) {
              const gameDataList = gameDataResponse.gameData;

              // header_image map for LibrarySection
              gameDataList.forEach((g: any) => {
                if (g.appid && g.header_image) {
                  headerImages[String(g.appid)] = g.header_image;
                }
              });

              totalAccountValue = `$${(gameDataResponse.total_price || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

              const allTags = (Object.entries(gameDataResponse.aggregated_tags || {}) as [string, number][]).sort(([, a], [, b]) => b - a);

              const colorPalette = ["blue-400", "purple-400", "cyan-500", "indigo-500", "sky-500", "slate-400"];
              topTags = allTags.slice(0, 10).map(([name, value], i) => ({
                name,
                value,
                color: colorPalette[i % colorPalette.length]
              }));

              gridTags = allTags.map(([name, value]) => ({
                name,
                value
              }));
            }
          }
        }
      } catch {
        // ignore gamedata failure
      }

      const topGames = (allGamesList || [])
        .sort((a: any, b: any) => b.playtime_forever - a.playtime_forever)
        .slice(0, 7)
        .map((g: any) => ({
          name: g.name,
          value: Math.round(g.playtime_forever / 60)
        }));

      const totalPlaytimeHoursRounded = totalHours || 0;

      const recentGames = (Array.isArray(lastPlayedList) ? lastPlayedList : []).slice(0, 3).map((g: any) => ({
        name: g.name,
        playtime2w: (g.playtime_2weeks / 60).toFixed(1),
        progress: Math.min(100, Math.round((g.playtime_2weeks / 2016) * 100))
      }));

      setData({
        profile: {
          name: json.personaname || "Unknown",
          level: json.player_level ?? json.level ?? 0,
          avatar: json.avatarfull || "https://steamuserimages-a.akamaihd.net/ugc/868480752636433334/1D2881C5C9B3D5F462700ED171BF33ADF3F965EA/",
          badges: ["STEAM USER", "GAMER"]
        },
        stats: {
          totalPlaytime: totalPlaytimeHoursRounded.toLocaleString(),
          totalPlaytimeRaw: totalPlaytimeHoursRounded,
          collection: (gameCount || 0).toLocaleString(),
          yearsOnSteam: json.timecreated ? Math.floor((Date.now() / 1000 - json.timecreated) / 31557600) : "?",
          accountValue: totalAccountValue
        },
        genreEcosystem: topTags,
        allGenres: gridTags,
        titanHours: topGames,
        recentGames: recentGames,
        allGames: allGamesList,
        headerImages: headerImages
      });

      navigateToView("dashboard");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Erro ao buscar dados. Verifique o Steam ID e tente novamente.");
    }
    setLoading(false);
  };

  const hasData = !!data;

  return (
    <>
      <div className="nebula-glow"></div>

      {/* Side Navigation (Web) — always visible */}
      <Sidebar
        profile={data?.profile}
        activeView={activeView}
        setActiveView={navigateToView}
        onHome={() => navigateToView("login")}
        disabled={loading || !hasData}
      />

      {/* Top Navigation (Mobile) */}
      <TopNav />

      {/* Main Content Canvas */}
      <main className="md:ml-64 p-0 md:p-0 overflow-x-hidden">

        {activeView === "login" && (
          <LoginScreen
            steamIdInput={steamIdInput}
            setSteamIdInput={setSteamIdInput}
            loading={loading}
            error={loginError}
            fetchStats={fetchStats}
          />
        )}

        {activeView === "dashboard" && data && (
          <div className="p-4 md:p-8 space-y-5">
            <DashboardView data={data} onSync={fetchStats} />
          </div>
        )}

        {activeView === "library" && data && (
          <div className="p-4 md:p-8 space-y-5">
            <div className="animate-slide-left" style={{ animationDelay: "100ms" }}>
              <LibraryView allGames={data.allGames} headerImages={data.headerImages} />
            </div>
          </div>
        )}

        {/* Comparisons: render when data exists, hide/show via CSS to preserve state */}
        {data && (
          <div className={`p-4 md:p-8 space-y-5 ${activeView === "comparisons" ? "" : "hidden"}`}>
            <ComparisonsView
              key={comparisonResetKey}
              profile={data.profile}
              allGames={data.allGames}
              hostSteamId={hostSteamId}
              player1Hours={data.stats.totalPlaytimeRaw}
              player1AccountValue={data.stats.accountValue}
            />
          </div>
        )}

      </main>

      {/* Bottom Navigation (Mobile) */}
      {activeView !== "login" && (
        <BottomNav
          activeView={activeView}
          setActiveView={navigateToView}
          onHome={() => navigateToView("login")}
        />
      )}
    </>
  );
}
