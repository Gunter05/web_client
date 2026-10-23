import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";
import {
  Button as UiButton,
  buttonVariants as uiButtonVariants,
} from "@/shared/ui/button";

/**
 * Variantes du relooking (design/contineng-glass.css), ajoutées autour du
 * bouton shadcn sans le modifier. Toutes opaques, sauf `glass-circle`,
 * réservé aux boutons posés sur une photo. Appui « ressort » (.ct-press).
 */
const ownVariants = cva("ct-press rounded-full font-semibold", {
  variants: {
    variant: {
      // Action principale : rouge plein, texte blanc 4,6:1.
      primary:
        "bg-ct-red text-white shadow-[0_6px_16px_rgb(235_4_5/0.22)] hover:bg-ct-red-press active:bg-ct-red-press disabled:bg-[#ebeef2] disabled:text-[#6b7380] disabled:opacity-100 disabled:shadow-none dark:disabled:bg-[#2a2e35] dark:disabled:text-[#a3aab5]",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)]",
      // Capsule blanche bordée (filtres, actions de second rang).
      surface:
        "ct-solid hover:bg-[#f7f8fa] dark:hover:bg-[#1c1f24] aria-expanded:bg-[#f7f8fa] dark:aria-expanded:bg-[#1c1f24]",
      // Encre : « Se connecter » dans l'en-tête, filtre actif.
      ink: "bg-ct-ink text-background hover:bg-ct-ink/88",
      "glass-circle": "ct-glass size-11 [&_svg:not([class*='size-'])]:size-5",
    },
    size: {
      // Zone tactile de 44 px.
      pill: "h-11 gap-2 px-5 text-[15px] has-data-[icon=inline-start]:pl-4",
      // Bouton principal d'un formulaire : 52 px.
      xl: "h-13 gap-2 px-6 text-base",
      circle: "size-11 [&_svg:not([class*='size-'])]:size-5",
    },
  },
});

type UiProps = VariantProps<typeof uiButtonVariants>;
type OwnProps = VariantProps<typeof ownVariants>;
type Variant = NonNullable<UiProps["variant"] | OwnProps["variant"]>;
type Size = NonNullable<UiProps["size"] | OwnProps["size"]>;

const OWN_VARIANTS = new Set<string>([
  "primary",
  "secondary",
  "surface",
  "ink",
  "glass-circle",
]);
const OWN_SIZES = new Set<string>(["pill", "xl", "circle"]);

function isOwnVariant(v: Variant): v is NonNullable<OwnProps["variant"]> {
  // « secondary » existe aussi dans shadcn : celle du relooking l'emporte.
  return OWN_VARIANTS.has(v);
}
function isOwnSize(s: Size): s is NonNullable<OwnProps["size"]> {
  return OWN_SIZES.has(s);
}

export type ButtonVariantProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** Classes du bouton : shadcn pour la base, puis les variantes du relooking. */
export function buttonVariants({
  variant = "default",
  size = "default",
  className,
}: ButtonVariantProps = {}) {
  const ownVariant = isOwnVariant(variant);
  const ownSize = isOwnSize(size);
  return cn(
    uiButtonVariants({
      variant: ownVariant ? null : variant,
      size: ownSize ? null : size,
    }),
    (ownVariant || ownSize) &&
      ownVariants({
        variant: ownVariant ? variant : null,
        size: ownSize ? size : null,
      }),
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: Omit<ComponentProps<typeof UiButton>, "variant" | "size"> &
  ButtonVariantProps) {
  return (
    <UiButton
      variant={null}
      size={null}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
