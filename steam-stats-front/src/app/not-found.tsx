
export default function NotFound() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-8 overflow-hidden w-full bg-background text-on-surface font-body-lg">
      {/* Nebula Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-150 h-150 rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle at center, rgba(112,0,255,0.15) 0%, rgba(11,14,20,0) 70%)" }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-secondary/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}
        />
      </div>

      {/* Error Content */}
      <div className="relative z-10 text-center max-w-2xl px-4">
        {/* 404 Text */}
        <div className="relative inline-block mb-6">
          <h2 className="font-display-lg text-[100px] md:text-[160px] leading-none font-extrabold text-secondary">
            404
          </h2>
        </div>

        {/* Error Messages */}
        <h3 className="font-label-code text-lg text-tertiary tracking-[0.2em] mb-4">
          SIGNAL LOST
        </h3>
        <p className="font-body-lg text-base text-on-surface-variant max-w-md mx-auto mb-10 opacity-80">
          It seems you&apos;ve drifted into the void. This sector does not exist or has been
          redacted by tactical command.
        </p>

        {/* System Info Logs */}
        <div className="mt-10 font-label-code text-[10px] text-on-surface-variant/40 space-y-1">
          <p>&gt; ERR_CODE: VAPOR_NULL_PTR</p>
          <p>&gt; TRACE: 0xDEADBEEF // SEGMENT_FAULT</p>
          <p>&gt; STATUS: DRIFTING_IN_VOID</p>
        </div>

        <a
          href="/"
          className="mt-10 inline-block bg-secondary text-secondary-900 px-10 py-4 rounded-lg font-display-lg text-[20px] font-bold uppercase tracking-wider hover:bg-secondary-fixed transition-all active:scale-95 shadow-[0_0_20px_rgba(130,207,255,0.3)] hover:shadow-[0_0_35px_rgba(130,207,255,0.5)]"
        >
          RETURN TO BASE
        </a>
      </div>

      {/* Bottom UI Decoration */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end opacity-30 pointer-events-none">
        <div className="h-16 w-1 border-l-2 border-secondary" />
        <div className="text-right">
          <p className="font-label-code text-xs uppercase tracking-widest text-secondary">Sector 7-G</p>
          <div className="w-24 h-1 bg-secondary mt-1" />
        </div>
      </div>
    </main>
  );
}