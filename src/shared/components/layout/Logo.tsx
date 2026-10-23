import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-tight whitespace-nowrap"
      aria-label="Le Contineng"
    >
      <Image
        src="/brand/nameless-contineng.svg"
        alt=""
        width={36}
        height={32}
        unoptimized
        className="h-8 w-auto"
      />
      {!compact && <span className="text-lg font-bold">Le Contineng</span>}
    </Link>
  );
}
