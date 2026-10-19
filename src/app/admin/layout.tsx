import type { Metadata } from "next";
import { AdminShell } from "@/widgets/admin-shell/AdminShell";

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  // L'espace d'administration n'est jamais indexé.
  robots: { index: false, follow: false },
};

/** Application Administration : sa propre coque, distincte du site. */
export default function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
