"use client";

export function ComparisonForm({
  value,
  loading,
  error,
  onChange,
  onSubmit,
}: {
  value: string;
  loading: boolean;
  error?: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 md:px-8">
      <div className="glass-card rounded-xl p-8 md:p-12 text-center relative overflow-hidden w-full max-w-4xl mx-auto">
        {/* Decorative corner highlights */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary rounded-tl-xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary rounded-br-xl opacity-50"></div>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <span className="material-symbols-outlined text-6xl text-secondary opacity-60">compare_arrows</span>
          </div>
          <h2 className="font-headline-lg text-2xl text-on-surface mb-3">Compare Profiles</h2>
          <p className="font-label-code text-xs text-on-surface-variant mb-8">
            Enter another Steam profile URL or ID to compare libraries and genre affinity.
          </p>

          {error && (
            <p className="mb-4 text-red-500 font-label-code text-[12px] text-center">
              {error}
            </p>
          )}

          <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-4 md:gap-5">
            <div className="relative grow">
              <span className="absolute left-4 top-3 material-symbols-outlined text-secondary/50">id_card</span>
              <input
                className="w-full bg-surface-container-lowest/50 border-0 border-b-2 border-secondary/30 text-on-secondary-container font-label-code text-[12px] py-4 pl-12 pr-4 focus:ring-0 focus:border-secondary focus:bg-surface-container-low transition-all placeholder:text-on-surface-variant/40 rounded-t-lg outline-none"
                placeholder="ENTER STEAM ID OR PROFILE URL"
                type="text"
                required
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-secondary-900 px-10 py-3 rounded-lg font-display-lg text-[20px] font-bold uppercase tracking-wider hover:bg-secondary-fixed transition-all active:scale-95 shadow-[0_0_20px_rgba(130,207,255,0.3)] hover:shadow-[0_0_35px_rgba(130,207,255,0.5)] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Compare"
              )}
            </button>
          </form>

          {/* Hint text */}
          <div className="mt-4 text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
            <span className="font-label-code text-[12px] text-on-surface-variant opacity-60">Example: https://steamcommunity.com/profiles/76561198000000000/</span>
          </div>
        </div>
      </div>
    </div>
  );
}
