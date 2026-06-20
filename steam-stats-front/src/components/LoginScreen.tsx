"use client";

export function LoginScreen({ steamIdInput, setSteamIdInput, loading, error, fetchStats }: any) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0E14] text-on-surface selection:bg-secondary/30">
      {/* Atmospheric Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] animate-[float_6s_ease-in-out_infinite]" 
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(112, 0, 255, 0.15) 0%, transparent 70%)' }}>
        </div>
        <div 
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] animate-[float_6s_ease-in-out_infinite]" 
          style={{ animationDelay: '-3s', background: 'radial-gradient(circle at 50% 50%, rgba(112, 0, 255, 0.15) 0%, transparent 70%)' }}>
        </div>
        <div 
          className="absolute inset-0 opacity-30" 
          style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(130, 207, 255, 0.03) 50%)', backgroundSize: '100% 4px' }}>
        </div>
      </div>

      <main className="relative z-10 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 md:px-8 py-16">
        {/* Hero Section */}
        <div className="w-full max-w-4xl text-center mb-10 mt-10">
          <h1 className="font-display-lg text-[48px] md:text-display-lg text-secondary mb-3 tracking-tight leading-none uppercase italic border-b-0">
            UNLOCK YOUR <br className="hidden md:block" /> GAMING STATS.
          </h1>
          <p className="font-body-lg text-[20px] text-on-surface-variant max-w-2xl mx-auto opacity-80 mt-6">
            Analyze your Steam stats in seconds. Deep-dive into playtimes, favorite genres, and library value with ease.
          </p>
        </div>

        {/* High-Impact Input Area */}
        <div className="w-full max-w-4xl glass-card p-6 md:p-10 rounded-xl shadow-2xl relative group">
          {/* Decorative corner highlights */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary rounded-tl-xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary rounded-br-xl opacity-50"></div>
          
          <form onSubmit={fetchStats} className="flex flex-col lg:flex-row gap-4 lg:gap-5">
            <div className="relative grow">
              <span className="absolute left-4 top-3 material-symbols-outlined text-secondary/50">id_card</span>
              <input 
                className="w-full bg-surface-container-lowest/50 border-0 border-b-2 border-secondary/30 text-on-secondary-container font-label-code text-[12px] py-4 pl-12 pr-4 focus:ring-0 focus:border-secondary focus:bg-surface-container-low transition-all placeholder:text-on-surface-variant/40 rounded-t-lg outline-none" 
                placeholder="ENTER STEAM ID OR PROFILE URL" 
                type="text"
                required
                value={steamIdInput}
                onChange={(e) => setSteamIdInput(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-1/2 min-w-fit self-center lg:w-auto lg:self-auto bg-secondary text-secondary-900 px-6 py-3 lg:px-10 lg:py-4 rounded-lg font-display-lg text-[13px] sm:text-[14px] lg:text-[20px] font-bold uppercase tracking-wider hover:bg-secondary-fixed transition-all active:scale-95 shadow-[0_0_20px_rgba(130,207,255,0.3)] hover:shadow-[0_0_35px_rgba(130,207,255,0.5)] disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : "Analyze Library"}
            </button>
          </form>

          {/* Hint text */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">info</span>
            <span className="font-label-code text-[12px] text-on-surface-variant opacity-60 break-all">Example: https://steamcommunity.com/profiles/76561198000000000/</span>
          </div>

          {error && (
            <p className="mt-4 text-red-500 font-label-code text-[12px] text-center">
              {error}
            </p>
          )}
        </div>

        {/* Featured Stats Grid (Bento Style) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl z-10">
          {/* Card 1 */}
          <div className="glass-card p-6 rounded-lg group transition-all hover:shadow-[0_0_20px_rgba(130,207,255,0.4)] hover:border-secondary/80">
            <div className="flex justify-between items-start mb-3">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
              <span className="font-label-code text-[12px] text-tertiary">LIVE DATA</span>
            </div>
            <h3 className="font-display-lg text-[20px] text-on-surface mb-1">Genre & Tag Analytics</h3>
            <p className="font-body-sm text-[14px] text-on-surface-variant">Real-time visualization of your most-played tags and genres powered by metadata analysis.</p>
          </div>
          
          {/* Card 2 */}
          <div className="glass-card p-6 rounded-lg group transition-all hover:shadow-[0_0_20px_rgba(130,207,255,0.4)] hover:border-secondary/80">
            <div className="flex justify-between items-start mb-3">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>compare_arrows</span>
              <span className="font-label-code text-[12px] text-tertiary">COMPARE</span>
            </div>
            <h3 className="font-display-lg text-[20px] text-on-surface mb-1">Compare Stats</h3>
            <p className="font-body-sm text-[14px] text-on-surface-variant">Stack your playtime, library value, and top genres side-by-side with friends and rivals.</p>
          </div>
          
          {/* Card 3 */}
          <div className="glass-card p-6 rounded-lg group transition-all hover:shadow-[0_0_20px_rgba(130,207,255,0.4)] hover:border-secondary/80">
            <div className="flex justify-between items-start mb-3">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              <span className="font-label-code text-[12px] text-tertiary">VALUATION</span>
            </div>
            <h3 className="font-display-lg text-[20px] text-on-surface mb-1">Library Worth</h3>
            <p className="font-body-sm text-[14px] text-on-surface-variant">Calculate the real-time market value of your steam library empire.</p>
          </div>
        </div>
      </main>

      {/* Background Decoration Image */}
      <div className="fixed bottom-0 left-0 w-full h-64 pointer-events-none opacity-20 z-0">
        <img 
          alt="Nebula" 
          className="w-full h-full object-cover" 
          style={{ WebkitMaskImage: 'linear-gradient(to top, transparent, black)', maskImage: 'linear-gradient(to top, transparent, black)' }} 
          src="/galaxy-bg.png"
        />
      </div>
    </div>
  );
}