import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { Logo } from "@/shared/components/layout/Logo";

/**
 * Connexion et inscription : page épurée, sans la navigation du site, toujours
 * sombre : fond encre, grandes formes aux couleurs du logo en bas, formulaire
 * sur une carte sombre opaque. Aucun verre.
 */
export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="dark relative isolate flex min-h-dvh flex-col overflow-hidden bg-[#0a0a0a] text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -bottom-28 -left-24 size-[18rem] rotate-[18deg] rounded-[38%] bg-ct-red sm:size-[26rem]" />
        <div className="absolute -bottom-36 left-[24%] size-[14rem] rotate-[32deg] rounded-[40%] bg-ct-green sm:size-[20rem]" />
        <div className="absolute right-[18%] -bottom-32 size-[15rem] -rotate-[24deg] rounded-[42%] bg-ct-blue sm:size-[22rem]" />
        <div className="absolute -right-24 -bottom-20 size-[14rem] -rotate-[12deg] rounded-[45%] bg-ct-orange sm:size-[20rem]" />
      </div>
      <header className="flex h-16 items-center justify-between px-4">
        <Logo />
        <LanguageSwitcher />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
