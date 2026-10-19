import { ImageResponse } from "next/og";
import { evenementParId } from "@/features/events/server";
import { env } from "@/shared/config/env";
import { imageDemo } from "@/shared/lib/images-demo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const IMAGE_PAR_DEFAUT = `data:image/svg+xml;base64,${Buffer.from(imageDemo("defaut")).toString("base64")}`;

/** Photo de l'événement en data URL, si l'API la sert en JPEG ou PNG. */
async function photo(adresse: string | null): Promise<string> {
  if (!adresse?.startsWith("/api/v1/medias/")) return IMAGE_PAR_DEFAUT;
  const reponse = await fetch(`${env.API_URL}${adresse}`).catch(() => null);
  const type = reponse?.headers.get("content-type") ?? "";
  if (!reponse?.ok || !["image/jpeg", "image/png"].includes(type)) {
    return IMAGE_PAR_DEFAUT;
  }
  const contenu = Buffer.from(await reponse.arrayBuffer());
  return `data:${type};base64,${contenu.toString("base64")}`;
}

/**
 * Image d'aperçu WhatsApp en PNG (US-36) : WhatsApp n'affiche ni SVG ni WebP.
 * Photo de l'événement si JPEG/PNG, sinon l'image par défaut.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const evenement = await evenementParId((await params).id);
  return new ImageResponse(
    <img
      src={await photo(evenement?.photo ?? null)}
      alt=""
      width={size.width}
      height={size.height}
      style={{ objectFit: "cover" }}
    />,
    size,
  );
}
