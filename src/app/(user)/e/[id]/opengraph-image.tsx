import { ImageResponse } from "next/og";
import { eventImage, PUBLIC_IMAGE_HOST } from "@/modules/events";
import { getEventById } from "@/modules/events/server";
import { env } from "@/shared/config/env";
import { demoImage } from "@/shared/lib/demo-images";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const DEFAULT_IMAGE = `data:image/svg+xml;base64,${Buffer.from(demoImage("defaut")).toString("base64")}`;

/**
 * Image de l'événement en data URL, si elle est servie en JPEG ou PNG : sa
 * photo (API), sinon la photo publique de sa catégorie, demandée en JPEG.
 */
async function photo(address: string | null): Promise<string> {
  const url = address?.startsWith("/api/v1/medias/")
    ? `${env.API_URL}${address}`
    : address?.startsWith(PUBLIC_IMAGE_HOST)
      ? `${address}&fm=jpg`
      : null;
  if (!url) return DEFAULT_IMAGE;
  const response = await fetch(url).catch(() => null);
  const type = response?.headers.get("content-type") ?? "";
  if (!response?.ok || !["image/jpeg", "image/png"].includes(type)) {
    return DEFAULT_IMAGE;
  }
  const content = Buffer.from(await response.arrayBuffer());
  return `data:${type};base64,${content.toString("base64")}`;
}

/**
 * Image d'aperçu WhatsApp en PNG (US-36) : WhatsApp n'affiche ni SVG ni WebP.
 * Image de l'événement si JPEG/PNG, sinon l'image par défaut.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const event = await getEventById((await params).id);
  return new ImageResponse(
    <img
      src={await photo(event ? eventImage(event) : null)}
      alt=""
      width={size.width}
      height={size.height}
      style={{ objectFit: "cover" }}
    />,
    size,
  );
}
