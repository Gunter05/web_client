"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { thumbHashToDataURL } from "thumbhash";
import { cn } from "@/shared/lib/utils";

/**
 * Image qui ne fait pas sauter la page : sa place est réservée d'avance
 * (dimensions connues), un aperçu flou s'affiche pendant le chargement, puis
 * l'image apparaît en fondu. Sans dimensions connues, elle prend sa hauteur
 * naturelle comme une image ordinaire.
 *
 * L'image prioritaire (la première visible, mesurée par le LCP) n'est jamais
 * masquée en attendant : elle s'affiche dès qu'elle arrive.
 */
export function ProgressiveImage({
  src,
  alt = "",
  width,
  height,
  placeholder,
  priority = false,
  fill = false,
  fit = "cover",
  className,
  imageClassName,
}: {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  /** Aperçu flou : ThumbHash en base64. */
  placeholder?: string | null;
  priority?: boolean;
  /** Remplit son conteneur (taille fixée par le parent) au lieu de la réserver. */
  fill?: boolean;
  fit?: "cover" | "contain";
  className?: string;
  imageClassName?: string;
}) {
  const image = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(priority);
  const preview = useMemo(() => decode(placeholder), [placeholder]);

  // Une image déjà en cache a fini de charger avant l'hydratation : pas de fondu
  useEffect(() => {
    if (image.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted bg-cover bg-center",
        fill && "size-full",
        className,
      )}
      style={{
        aspectRatio:
          !fill && width && height ? `${width} / ${height}` : undefined,
        backgroundImage: preview ? `url(${preview})` : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- images servies par le stockage (ADR 0014) */}
      <img
        ref={image}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "block w-full transition-opacity duration-300 motion-reduce:transition-none",
          fill || (width && height) ? "h-full" : "h-auto",
          fit === "contain" ? "object-contain" : "object-cover",
          loaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
      />
    </div>
  );
}

/** ThumbHash (base64) → petite image PNG en data URL ; `null` s'il est illisible. */
function decode(placeholder: string | null | undefined): string | null {
  if (!placeholder) return null;
  try {
    const bytes = Uint8Array.from(atob(placeholder), (c) => c.charCodeAt(0));
    return thumbHashToDataURL(bytes);
  } catch {
    return null;
  }
}
