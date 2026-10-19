import Link from "next/link";

export function Logo({ court = false }: { court?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap"
      aria-label="Le Contineng"
    >
      <span className="grid size-8 place-items-center rounded-lg degrade-marque text-sm font-black text-white">
        C
      </span>
      {!court && <span className="text-lg italic">Le Contineng</span>}
    </Link>
  );
}
