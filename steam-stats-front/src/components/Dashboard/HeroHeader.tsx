"use client";

export function HeroHeader({ profile, stats }: { profile: any, stats: any }) {
  return (
    <section className="glass-card rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 z-0 opacity-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="w-full h-full object-cover" alt="Hero background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6VndA9GcrSYzyXeVQJVSAk0GGuOwc_IGM-vUHOnIyfGdUp4XSuc-cF3YuPxyl8Pkm_48uUKgm-pZBEwGj7MseXeQBM0IZEv3ewbuNctnrhrRmivxOLF6Aw10F8q9xrFid0OJxT9Tb6ecWPgQ843i3v_SUHIT7JI6NYlexY43Z-xWN-MQM05vX5HBnXPRiPuQ_YmUPoGVl1I5ccO_lOf9-S4-64DvH4MAE5bKs_ZI9Vm5VS9u6ObaHTwEzEE7ESgjjrSiMewlTM-0" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent z-10"></div>
      
      <div className="relative z-20 p-6 space-y-6">
        {/* Profile Section */}
        <div className="flex items-center gap-6">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-secondary rounded-full blur-sm opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="User Profile Avatar" className="relative w-25 h-25 rounded-full border-2 border-secondary/50 bg-surface-container-highest" src={profile.avatar} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display-lg text-2xl text-white tracking-tight uppercase font-bold">{profile.name}</h2>
              <div className="bg-secondary/20 text-secondary rounded px-2 py-0.5 text-[15px] font-bold border border-secondary/30">LVL {profile.level}</div>
            </div>
            <div className="flex gap-2 mt-1">
              <span className="text-[13px] font-label-code text-on-surface-variant uppercase tracking-widest">{profile.badges?.[0]}</span>
              <span className="text-[13px] font-label-code text-tertiary uppercase tracking-widest">• {profile.badges?.[1]}</span>
            </div>
          </div>
        </div>

        {/* Horizontal Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-outline-variant/10">
          <div className="flex flex-col">
            <span className="text-[12px] text-on-surface-variant font-label-code tracking-widest uppercase">Total Playtime</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-display-lg font-bold text-secondary">{stats.totalPlaytime}</span>
              <span className="text-[10px] text-on-surface-variant font-label-code">HRS</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-on-surface-variant font-label-code tracking-widest uppercase">Collection</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-display-lg font-bold text-tertiary">{stats.collection}</span>
              <span className="text-[10px] text-on-surface-variant font-label-code">GAMES</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-on-surface-variant font-label-code tracking-widest uppercase">Service Medal</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-display-lg font-bold text-white">{stats.yearsOnSteam}</span>
              <span className="text-[10px] text-on-surface-variant font-label-code">YEARS</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-on-surface-variant font-label-code tracking-widest uppercase">Library Value</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-display-lg font-bold text-secondary">{stats.accountValue}</span>
              <span className="text-[10px] text-on-surface-variant font-label-code">EST</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}