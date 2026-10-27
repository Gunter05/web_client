"use client";

import { EyeIcon, EyeSlashIcon } from "@/shared/components/icons";
import { useTranslations } from "next-intl";
import { type ComponentProps, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";

/** Champ mot de passe avec un œil pour afficher ou masquer la saisie. */
export function PasswordInput(
  props: Omit<ComponentProps<typeof Input>, "type">,
) {
  const t = useTranslations("auth");
  // null tant que l'œil n'a pas servi : pas d'animation à l'ouverture
  const [visible, setVisible] = useState<boolean | null>(null);
  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className="!pr-12"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("hidePassword") : t("showPassword")}
        aria-pressed={visible === true}
        className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:text-foreground [&_svg]:size-5"
      >
        {/* La clé remonte l'icône : elle apparaît en zoom à chaque bascule (pas à l'ouverture) */}
        <span
          key={String(visible)}
          className={cn(
            "grid",
            visible !== null &&
              "motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in-0 motion-safe:zoom-in-50",
          )}
        >
          {visible ? <EyeIcon /> : <EyeSlashIcon />}
        </span>
      </button>
    </div>
  );
}
