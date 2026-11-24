"use client";

interface DesaPreloaderProps {
  monogram: string;
  title: string;
  subtitle: string;
  progress: number;
}

export function DesaPreloader({
  monogram,
  title,
  subtitle,
  progress,
}: DesaPreloaderProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F1E3] px-4"
      role="status"
      aria-live="polite"
    >
      <div className="desa-woven-pill flex w-full max-w-[310px] flex-col items-center rounded-[24px] border border-[#C8B490] px-7 py-8 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#C8B490] bg-[#2A5C45] text-[#FAF6EE]">
          <span className="desa-display text-lg font-semibold italic tracking-wide">
            {monogram}
          </span>
        </div>
        <p className="mt-4 text-xs font-semibold tracking-widest text-[#3E2B1E] uppercase tabular-nums">
          {title} · {Math.round(progress)}%
        </p>
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#DFD2BA]">
          <div
            className="h-full rounded-full bg-[#2A5C45] transition-all duration-200"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
        <p className="mt-2.5 text-xs font-normal text-[#5C4633]">{subtitle}</p>
      </div>
    </div>
  );
}
