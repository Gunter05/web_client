import Link from "next/link";

export default function PageIntrouvable() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-8">
      <h1 className="text-2xl font-bold">Page introuvable</h1>
      <p>Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="underline underline-offset-4">
        Revenir à l&apos;accueil
      </Link>
    </main>
  );
}
