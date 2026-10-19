import { SelecteurLangue } from "@/shared/components/SelecteurLangue";
import { Logo } from "@/shared/components/layout/Logo";

/** Connexion et inscription : page épurée, sans la navigation du site. */
export default function LayoutAuth({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center justify-between px-4">
        <Logo />
        <SelecteurLangue />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
