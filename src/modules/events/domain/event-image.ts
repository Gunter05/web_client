import type { Category, Event } from "@/modules/events/domain/event";

/** Hôte des photos publiques utilisées quand un événement n'a pas d'image. */
export const PUBLIC_IMAGE_HOST = "https://images.unsplash.com";

/**
 * Format idéal d'une affiche d'événement : portrait 4:5 (1080 × 1350), comme
 * une publication. Les photos ci-dessous sont nativement verticales (3:4 à
 * 2:3) : le passage au 4:5 ne retire qu'un peu du haut et du bas.
 */
export const IDEAL_WIDTH = 1080;
export const IDEAL_HEIGHT = 1350;

const photo = (id: string) =>
  `${PUBLIC_IMAGE_HOST}/photo-${id}?w=${IDEAL_WIDTH}&h=${IDEAL_HEIGHT}&q=80&auto=format&fit=crop`;

// Photos publiques Unsplash, toutes prises en format vertical.
const BALL_ON_GRASS = "1579952363873-27f3bade9f55"; // ballon sous le pied
const KICK = "1560272564-c83b66b1ad12"; // frappe sur un terrain
const CONFETTI_CROWD = "1509824227185-9c5a01ceba0d"; // foule et confettis
const DANCE_FLOOR = "1574391884720-bbc3740c59d1"; // salle, lumières
const WORKSHOP = "1544928147-79a2dbc1f389"; // atelier autour d'une table
const STUDENTS = "1517486808906-6ca8b3f04846"; // groupe d'étudiants

/** Photos par catégorie, choisies pour leur sujet. */
const PHOTOS: Record<Category, string[]> = {
  match: [KICK, BALL_ON_GRASS],
  interClub: [BALL_ON_GRASS, KICK],
  orientation: [STUDENTS],
  party: [CONFETTI_CROWD, DANCE_FLOOR],
  culture: [CONFETTI_CROWD, DANCE_FLOOR],
  conference: [WORKSHOP],
  campusLife: [STUDENTS, WORKSHOP],
  other: [DANCE_FLOOR, STUDENTS],
};

function hash(text: string): number {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * Image affichée pour un événement : sa photo, sinon une photo publique de
 * sa première catégorie, toujours la même pour un même événement.
 */
export function eventImage(
  event: Pick<Event, "id" | "photoUrl" | "categories">,
): string {
  if (event.photoUrl) return event.photoUrl;
  const choices = PHOTOS[event.categories[0] ?? "other"];
  return photo(choices[hash(event.id) % choices.length]!);
}
