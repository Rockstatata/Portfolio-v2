import { SHS_PATHS } from "@/lib/brand";

export function SHSMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 104 104" fill="currentColor" className={className} aria-hidden="true">
      {SHS_PATHS.map(path => <path key={path} d={path} />)}
    </svg>
  );
}
