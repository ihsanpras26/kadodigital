"use client";

interface DesaPreloaderProps {
  monogram: string;
  progress: number;
}

export function DesaPreloader({ monogram, progress }: DesaPreloaderProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F1E3] px-4"
      role="status"
      aria-live="polite"
    >
      <div className="desa-woven-pill flex w-full max-w-[300px] flex-col items-center rounded-[24px] border-[3px] border-[#B79B74] px-6 py-7 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#B79B74] bg-[#2A5C45] text-[#F7F1E3]">
          <span className="font-serif text-lg font-bold tracking-wide">
            {monogram}
          </span>
        </div>
        <p className="mt-4 text-xs font-extrabold tracking-widest text-[#3E2B1E] uppercase tabular-nums">
          Memuat Desa {Math.round(progress)}%
        </p>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#DFD2BA]">
          <div
            className="h-full rounded-full bg-[#2A5C45] transition-all duration-200"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-[#5C4633]">
          Menyiapkan suasana pedesaan asri
        </p>
      </div>
    </div>
  );
}
