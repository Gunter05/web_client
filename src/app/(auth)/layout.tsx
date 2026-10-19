import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { Logo } from "@/shared/components/layout/Logo";

/** Connexion et inscription : page épurée, sans la navigation du site. */
export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center justify-between px-4">
        <Logo />
        <LanguageSwitcher />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
