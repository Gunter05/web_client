import "server-only";
import { api, apiOrNull } from "@/shared/api/client";
import type { PaginatedResult } from "@/modules/admin/domain/pagination.types";
import type {
  AdminActivity,
  AdminAccount,
  AdminEvent,
  AdminMember,
  AdminPage,
  AdminPageDetails,
} from "@/modules/admin/domain/admin.types";

// ——— Contrat du module `administration` de l'API (encore en français) ———

type PeriodResponse = { visiteurs: number; application: number };
type ActivityResponse = {
  jour: PeriodResponse;
  semaine: PeriodResponse;
  mois: PeriodResponse;
  installations: { semaine: number; mois: number; total: number };
};
const toPeriod = (p: PeriodResponse) => ({
  visitors: p.visiteurs,
  installedApp: p.application,
});

type AccountResponse = {
  id: string;
  nom: string;
  email: string;
  role: "user" | "admin";
  emailConfirme: boolean;
  suspenduJusqua: string | null;
  creeLe: string;
};
type PageResponse = {
  id: string;
  slug: string;
  nom: string;
  type: AdminPage["type"];
  photo: string | null;
  creeLe: string;
  proprietaire: string | null;
  nbEvenements: number;
  nbMembres: number;
};
type EventResponse = {
  id: string;
  nom: string;
  pageId: string;
  page: string;
  debut: string;
  statut: AdminEvent["status"];
  creeLe: string;
  epingleJusqua: string | null;
};
type MemberResponse = {
  compteId: string;
  nom: string;
  photo: string | null;
  role: AdminMember["role"];
  ajouteLe: string;
};
type PageDetailsResponse = {
  page: PageResponse;
  membres: MemberResponse[];
  evenements: EventResponse[];
};

const toAccount = (a: AccountResponse): AdminAccount => ({
  id: a.id,
  name: a.nom,
  email: a.email,
  isAdmin: a.role === "admin",
  emailVerified: a.emailConfirme,
  suspendedUntil: a.suspenduJusqua,
  createdAt: a.creeLe,
});
const toPage = (p: PageResponse): AdminPage => ({
  id: p.id,
  slug: p.slug,
  name: p.nom,
  type: p.type,
  photoUrl: p.photo,
  createdAt: p.creeLe,
  owner: p.proprietaire,
  eventCount: p.nbEvenements,
  memberCount: p.nbMembres,
});
const toEvent = (e: EventResponse): AdminEvent => ({
  id: e.id,
  name: e.nom,
  organizerPageId: e.pageId,
  pageName: e.page,
  startsAt: e.debut,
  status: e.statut,
  createdAt: e.creeLe,
  pinnedUntil: e.epingleJusqua ?? null,
});
const toMember = (m: MemberResponse): AdminMember => ({
  accountId: m.compteId,
  name: m.nom,
  photoUrl: m.photo,
  role: m.role,
  addedAt: m.ajouteLe,
});
const mapPage = <R, T>(r: PaginatedResult<R>, f: (x: R) => T) => ({
  ...r,
  elements: r.elements.map(f),
});

const query = (q: string, page: number) =>
  new URLSearchParams({ q, page: String(page) }).toString();

/**
 * Client du module `administration` de l'API Spring (lecture seule). Ce
 * module n'est pas encore passé en anglais : ses champs sont convertis ici.
 */
export const administrationApi = {
  /** Activité des visiteurs anonymes (admins seulement). */
  activity: async (): Promise<AdminActivity> => {
    const a = await api<ActivityResponse>("/api/v1/admin/activite");
    return {
      today: toPeriod(a.jour),
      week: toPeriod(a.semaine),
      month: toPeriod(a.mois),
      installs: {
        week: a.installations.semaine,
        month: a.installations.mois,
        total: a.installations.total,
      },
    };
  },
  accounts: async (q: string, page: number) =>
    mapPage(
      await api<PaginatedResult<AccountResponse>>(
        `/api/v1/admin/comptes?${query(q, page)}`,
      ),
      toAccount,
    ),
  pages: async (q: string, page: number) =>
    mapPage(
      await api<PaginatedResult<PageResponse>>(
        `/api/v1/admin/pages?${query(q, page)}`,
      ),
      toPage,
    ),
  pageDetails: async (id: string): Promise<AdminPageDetails | null> => {
    const d = await apiOrNull<PageDetailsResponse>(`/api/v1/admin/pages/${id}`);
    return (
      d && {
        page: toPage(d.page),
        members: d.membres.map(toMember),
        events: d.evenements.map(toEvent),
      }
    );
  },
  events: async (q: string, page: number) =>
    mapPage(
      await api<PaginatedResult<EventResponse>>(
        `/api/v1/admin/evenements?${query(q, page)}`,
      ),
      toEvent,
    ),
};
