import "server-only";
import { cache } from "react";
import { apiPages } from "@/features/pages/api/pages.api";

export type {
  DemandePage,
  FormulaireDemande,
  Membre,
  Page,
  Role,
} from "@/features/pages/types/page.types";

// ——— Lecture publique ———
export const toutesLesPages = cache(() => apiPages.pages());
export const pageParSlug = cache((slug: string) => apiPages.page(slug));

// ——— Personne connectée et ses pages (« Mes pages », choix avant de publier) ———
export {
  acteurCourant,
  maPage,
  maPageParId,
  mesPages,
} from "@/features/pages/api/mes-pages";

// ——— Accès (US-06), réservé aux membres de la page ———
export const membresDe = (pageId: string) => apiPages.membres(pageId);
export const donnerAcces = apiPages.donnerAcces;
export const retirerAcces = apiPages.retirerAcces;

// ——— Demande de page (US-03) ———
export const derniereDemande = () => apiPages.derniereDemande();
export const deposerDemande = apiPages.deposer;
export const retirerDemande = apiPages.retirer;

// ——— Administration des demandes (admins) ———
export const demandesEnAttente = cache(() => apiPages.demandesEnAttente());
export const demandeParId = (id: string) => apiPages.demande(id);
export const accepterDemande = apiPages.accepter;
export const refuserDemande = apiPages.refuser;
