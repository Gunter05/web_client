import "server-only";
import { cache } from "react";
import { apiPages } from "./infrastructure/api-pages";

export type {
  DemandePage,
  FormulaireDemande,
  Membre,
  Page,
  Role,
} from "./domain/page";

// ——— Lecture publique ———
export const toutesLesPages = cache(() => apiPages.pages());
export const pageParSlug = cache((slug: string) => apiPages.page(slug));

// ——— Profil actif (US-37) ———
export const pagesDuMembre = cache(() => apiPages.mesPages());

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
