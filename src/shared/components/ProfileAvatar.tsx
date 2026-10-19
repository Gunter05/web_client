import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

/** Avatar rond façon réseau social, avec anneau dégradé optionnel (pages). */
export function ProfileAvatar({
  name,
  photo,
  size = "md",
  ring = false,
  className,
}: {
  name: string;
  photo: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
}) {
  const sizes = {
    xs: "size-6 text-[10px]",
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-16 text-lg",
    xl: "size-24 text-2xl",
  };
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase())
    .join("");
  const avatar = (
    <Avatar
      className={cn(
        sizes[size],
        ring && "border-2 border-background",
        !ring && className,
      )}
    >
      {photo && <AvatarImage src={photo} alt="" className="object-cover" />}
      <AvatarFallback className="bg-muted font-semibold text-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
  if (!ring) return avatar;
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
