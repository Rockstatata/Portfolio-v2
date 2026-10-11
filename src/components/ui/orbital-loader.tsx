export function OrbitalLoader({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`orbital-loader ${compact ? "orbital-loader-compact" : ""}`}
      role="status"
      aria-label="Loading the portfolio"
    >
      <div className="loader-system" aria-hidden="true">
        <span className="loader-orbit loader-orbit-one" />
        <span className="loader-orbit loader-orbit-two" />
        <span className="loader-orbit loader-orbit-three" />
        <span className="loader-core">S</span>
      </div>
      <p className="mt-6 font-mono text-[10px] tracking-[0.3em] text-ion">
        ENTERING ORBIT
      </p>
      <div className="loader-scan mt-4 h-px w-32 overflow-hidden bg-line">
        <span />
      </div>
    </div>
  );
}
