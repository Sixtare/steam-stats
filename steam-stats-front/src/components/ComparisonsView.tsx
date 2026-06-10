"use client";

import { useState } from "react";
import { ComparisonsDashboard } from "./Comparisons/ComparisonsDashboard";
import { ComparisonForm } from "./Comparisons/ComparisonForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function ComparisonsView({
  profile,
  allGames,
  hostSteamId,
  player1Hours,
  player1AccountValue,
}: {
  profile: any;
  allGames: any[];
  hostSteamId: string;
  player1Hours: number;
  player1AccountValue: string;
}) {
  const [opponentInput, setOpponentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [opponentData, setOpponentData] = useState<any>(null);
  const [compareData, setCompareData] = useState<any>(null);

  const fetchOpponent = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = opponentInput.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    try {
      // Validate input via backend first
      const validateRes = await fetch(`${API_BASE}/api/stats/validate?url=${encodeURIComponent(trimmed)}`);
      if (!validateRes.ok) {
        throw new Error("Invalid Steam profile URL or ID.");
      }
      let validateData;
      try { validateData = await validateRes.json(); } catch { throw new Error("Invalid Steam profile URL or ID."); }
      const id = validateData.steamid;
      if (!id) throw new Error("Could not resolve Steam ID.");

      // First fetch opponent profile to verify it exists and is not private
      const profileRes = await fetch(`${API_BASE}/api/stats?id=${id}`);

      if (!profileRes.ok) {
        let errorMsg = "Invalid Steam profile URL or ID.";
        try {
          const errJson = await profileRes.json();
          if (errJson && errJson.error) errorMsg = errJson.error;
        } catch {}
        throw new Error(errorMsg);
      }

      let pJson;
      try {
        pJson = await profileRes.json();
      } catch {
        throw new Error("Invalid Steam profile URL or ID.");
      }

      // Se a API retornou um erro (perfil privado), para por aqui
      if (pJson && typeof pJson === "object" && "error" in pJson) {
        throw new Error(pJson.error || "Player profile is not public.");
      }

      // Only then fetch gamelist and compare data
      const [gamesRes, compareRes] = await Promise.all([
        fetch(`${API_BASE}/api/stats/gamelist?id=${id}`),
        fetch(`${API_BASE}/api/compare?id1=${hostSteamId}&id2=${id}`),
      ]);

      let gamesList: any = [];
      if (!gamesRes.ok) {
        let errorMsg = "Invalid Steam profile URL or ID.";
        try { const errJson = await gamesRes.json(); if (errJson && errJson.error) errorMsg = errJson.error; } catch {}
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

      let compareJson = null;
      if (compareRes.ok) {
        try { compareJson = await compareRes.json(); } catch {}
      }

      setOpponentData({
        profile: {
          name: pJson.personaname || "Unknown",
          level: pJson.player_level ?? pJson.level ?? 0,
          avatar: pJson.avatarfull || "",
        },
        totalGames: gamesList.game_count || gamesList.games.length,
      });
      setCompareData(compareJson);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao buscar dados do oponente. Verifique o Steam ID e tente novamente.");
    }
    setLoading(false);
  };

  if (!opponentData) {
    return (
      <ComparisonForm
        value={opponentInput}
        loading={loading}
        error={error}
        onChange={setOpponentInput}
        onSubmit={fetchOpponent}
      />
    );
  }

  const player1Total = Array.isArray(allGames) ? allGames.length : 0;
  return (
    <ComparisonsDashboard
      player1={{
        profile,
        totalGames: player1Total,
        totalHours: player1Hours,
        accountValue: player1AccountValue,
      }}
      player2={opponentData}
      compareData={compareData}
    />
  );
}
