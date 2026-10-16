import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

/** Avatar rond façon réseau social, avec anneau dégradé optionnel (pages). */
export function AvatarProfil({
  nom,
  photo,
  taille = "md",
  anneau = false,
  className,
}: {
  nom: string;
  photo: string | null;
  taille?: "xs" | "sm" | "md" | "lg" | "xl";
  anneau?: boolean;
  className?: string;
}) {
  const tailles = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-16 text-lg",
    xl: "size-24 text-2xl",
  };
  const initiales = nom
    .split(/\s+/)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase())
    .join("");
  const avatar = (
    <Avatar
      className={cn(
        tailles[taille],
        anneau && "border-2 border-background",
        !anneau && className,
      )}
    >
      {photo && <AvatarImage src={photo} alt="" className="object-cover" />}
      <AvatarFallback className="bg-muted font-semibold text-muted-foreground">
        {initiales}
      </AvatarFallback>
    </Avatar>
  );
  if (!anneau) return avatar;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full degrade-marque p-[2px]",
        className,
      )}
    >
      {avatar}
    </span>
  );
}
