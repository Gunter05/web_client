import { cn } from "@/shared/lib/utils";
import { mediaSrc } from "@/shared/lib/media-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

/** Avatar rond : photo, ou initiales sur fond gris à défaut. */
export function ProfileAvatar({
  name,
  photo,
  size = "md",
  className,
}: {
  name: string;
  photo: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
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
  return (
    <Avatar className={cn(sizes[size], className)}>
      {photo && (
        <AvatarImage src={mediaSrc(photo)} alt="" className="object-cover" />
      )}
      <AvatarFallback className="bg-muted font-semibold text-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
