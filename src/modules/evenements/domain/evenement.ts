export type Evenement = {
  id: string;
  titre: string;
  date: Date;
  lieu: string;
};

export function trierParDate(evenements: readonly Evenement[]): Evenement[] {
  return [...evenements].sort((a, b) => a.date.getTime() - b.date.getTime());
}
