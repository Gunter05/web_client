import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

/** Recherche par formulaire GET : l'état vit dans l'adresse. */
export function AdminSearch({
  value,
  placeholder,
}: {
  value: string;
  placeholder: string;
}) {
  const t = useTranslations("common");
  return (
    <form className="flex gap-2" role="search">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={value}
          placeholder={placeholder}
          aria-label={placeholder}
          className="pl-8"
        />
      </div>
      <Button type="submit" variant="secondary">
        {t("search")}
      </Button>
    </form>
  );
}
