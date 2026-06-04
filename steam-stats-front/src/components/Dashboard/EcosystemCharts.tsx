"use client";

import { DonutChart, donutColorMap } from "./DonutChart";
import { BarList } from "./BarList";

export function EcosystemCharts({ genreEcosystem, titanHours }: { genreEcosystem: any, titanHours: any }) {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      {/* Genre Distribution (Pie Chart using Tremor) */}
      <div className="glass-card rounded-xl p-8 min-h-112.5 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline-lg text-2xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">pie_chart</span>
            Genre Ecosystem
          </h3>
          <span className="font-label-code text-xs text-on-surface-variant">TOP 10 TAGS</span>
        </div>
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center pt-8 gap-8">
          <div className="w-full md:w-1/2">
            <DonutChart
              data={genreEcosystem}
              category="value"
              index="name"
              colors={genreEcosystem.map((tag: any) => tag.color)}
              className="h-64"
              showAnimation={true}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            {genreEcosystem.map((tag: any, i: number) => {
              return (
                <div key={i} className="flex items-center justify-between font-label-code text-xs border-b border-outline-variant/10 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: donutColorMap[tag.color] }}></span>
                    <span className="text-on-surface uppercase tracking-widest">{tag.name}</span>
                  </div>
                  <span className="text-on-surface-variant font-bold">{tag.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Played Games (Bar Chart using Tremor) */}
      <div className="glass-card rounded-xl p-8 min-h-112.5 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline-lg text-2xl font-bold text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary">bar_chart</span>
            Titan Hours
          </h3>
          <span className="font-label-code text-xs text-on-surface-variant">LIFETIME ENGAGEMENT</span>
        </div>
        <div className="flex-1">
          <BarList
            data={titanHours}
            className="mt-4"
            showAnimation={true}
            valueFormatter={(val) => `${val} HRS`}
            maxValue={titanHours[0]?.value ?? 0}
          />
        </div>
      </div>
    </section>
  );
}