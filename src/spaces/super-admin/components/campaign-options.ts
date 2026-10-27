import "server-only";
import type { PaginatedResult } from "@/modules/admin";
import { listAccounts, listEvents, listPages } from "@/modules/admin/server";
import type { CampaignFormOptions } from "@/modules/campaigns";

/** Au plus 10 pages de résultats par liste : assez pour une école. */
const MAX_PAGES = 10;

async function all<T>(
  load: (q: string, page: number) => Promise<PaginatedResult<T>>,
): Promise<T[]> {
  const first = await load("", 1);
  const rest = await Promise.all(
    Array.from({ length: Math.min(first.totalPages, MAX_PAGES) - 1 }, (_, i) =>
      load("", i + 2),
    ),
  );
  return [first, ...rest].flatMap((p) => p.elements);
}

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name);

/** Pages, comptes et événements proposés par le formulaire d'une campagne. */
export async function loadCampaignOptions(): Promise<CampaignFormOptions> {
  const [pages, accounts, events] = await Promise.all([
    all(listPages),
    all(listAccounts),
    all(listEvents),
  ]);
  return {
    pages: pages.map((p) => ({ id: p.id, name: p.name })).sort(byName),
    accounts: accounts
      .map((a) => ({ id: a.id, name: `${a.name} (${a.email})` }))
      .sort(byName),
    events: events.map((e) => ({
      id: e.id,
      name: `${e.name} · ${e.pageName}`,
    })),
  };
}
