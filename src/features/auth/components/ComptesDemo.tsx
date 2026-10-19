import { useTranslations } from "next-intl";

const COMPTES = [
  ["awa@contineng.test", "BDE, Les Planches"],
  ["karim@contineng.test", "Club Foot, BDE"],
  ["lina@contineng.test", "—"],
  ["admin@contineng.test", "Admin"],
] as const;

/** Aide de démonstration : identifiants des comptes simulés (ADR 0010). */
export function ComptesDemo() {
  const t = useTranslations("identite");
  return (
    <div className="rounded-lg border border-dashed bg-muted/50 p-3 text-xs text-muted-foreground">
      <p className="mb-2 font-medium">{t("comptesDemo")}</p>
      <ul className="grid gap-1">
        {COMPTES.map(([email, role]) => (
          <li key={email} className="flex justify-between gap-2">
            <code>{email}</code>
            <span>{role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
