"use client";

import { useState, useEffect } from "react";

function formatHours(h: number): string {
  return h.toLocaleString();
}

export function ComparisonHeader({
  player1,
  player2,
  matchValue,
}: {
  player1: { profile: any; totalGames: number; totalHours?: number; accountValue?: string };
  player2: { profile: any; totalGames: number; totalHours?: number; accountValue?: string; totalPrice?: number };
  commonGames: number;
  matchValue: number;
}) {
  const circumference = 251.2;
  const targetOffset = circumference - (matchValue / 100) * circumference;

  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Circular bar animation
    const offsetTimer = setTimeout(() => {
      setAnimatedOffset(targetOffset);
    }, 100);

    // Number counter animation (smooth easeOutQuad)
    let animationFrameId: number;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      
      setCount(easeProgress * matchValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(matchValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      clearTimeout(offsetTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, [matchValue, targetOffset]);

  return (
    <div
      className="animate-slide-left glass-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
      style={{ animationDelay: "100ms" }}
    >
      <div className="scanline absolute top-0 left-0 w-full h-0.5 opacity-50"></div>

      {/* Player 1 */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <div className="w-35 h-35 rounded-full border-4 border-secondary overflow-hidden shadow-[0_0_20px_rgba(130,207,255,0.3)]">
            <img
              alt={`${player1.profile.name || "Player 1"} Avatar`}
              className="w-full h-full object-cover"
              src={player1.profile.avatar || ""}
            />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-2 py-0.5 rounded font-label-code text-[10px] uppercase">
            Host
          </span>
        </div>
        <div>
          <h2 className="font-headline-lg text-2xl text-secondary">{player1.profile.name || "Player 1"}</h2>
          <p className="font-label-code text-[14px] text-on-surface-variant">
            Lvl {player1.profile.level ?? "?"} &bull; {player1.totalGames || "?"} games
          </p>
          <div className="flex gap-4 mt-1">
            <span className="font-label-code text-[15px] text-secondary/70">
              {formatHours(player1.totalHours ?? 0)}h total
            </span>
            <span className="font-label-code text-[15px] text-tertiary/70">{player1.accountValue ?? "?"} library</span>
          </div>
        </div>
      </div>

      {/* Compatibility Score */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center" style={{ width: "12rem", height: "12rem" }}>
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1b2838" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#82cfff"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={animatedOffset}
              strokeLinecap="square"
              style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.25, 1, 0.5, 1)" }}
            />
          </svg>
          <div className="text-center relative z-10">
            <span className="block font-display-lg text-5xl text-secondary leading-none">
              {count.toFixed(0)}%
            </span>
            <span className="block font-label-code text-xs text-on-surface-variant uppercase tracking-widest">
              Match
            </span>
          </div>
        </div>
        <p className="mt-2 font-label-code text-xs text-secondary text-center">COSINE VECTOR MATCH: {count.toFixed(1)}%</p>
      </div>

      {/* Player 2 */}
      <div className="flex items-center gap-4 flex-1 justify-end text-right">
        <div>
          <h2 className="font-headline-lg text-2xl text-tertiary">{player2.profile.name || "Player 2"}</h2>
          <p className="font-label-code text-[14px] text-on-surface-variant">
            Lvl {player2.profile.level ?? "?"} &bull; {player2.totalGames || "?"} games
          </p>
          <div className="flex gap-4 mt-1 justify-end">
            <span className="font-label-code text-[15px] text-secondary/70">
              {formatHours(player2.totalHours ?? 0)}h total
            </span>
            <span className="font-label-code text-[15px] text-tertiary/70">
              ${(player2.totalPrice ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} library
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="w-35 h-35 rounded-full border-4 border-tertiary overflow-hidden shadow-[0_0_20px_rgba(209,188,255,0.3)]">
            <img
              alt={`${player2.profile.name || "Player 2"} Avatar`}
              className="w-full h-full object-cover"
              src={player2.profile.avatar || ""}
            />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary px-2 py-0.5 rounded font-label-code text-[10px] uppercase">
            Rival
          </span>
        </div>
      </div>
    </div>
  );
}
