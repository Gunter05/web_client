import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap"
      aria-label="Le Contineng"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
        C
      </span>
      {!compact && <span className="text-lg italic">Le Contineng</span>}
    </Link>
  );
}
