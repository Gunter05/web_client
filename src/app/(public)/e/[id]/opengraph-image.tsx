import { evenementParId } from "@/modules/evenements/server";
import { imageDemo } from "@/shared/stockage/images-demo";
import { lireImage } from "@/shared/stockage/fichiers";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image d'aperçu WhatsApp en PNG (US-36) : WhatsApp n'affiche ni SVG ni WebP.
 * Photo de l'événement si JPEG/PNG, sinon l'image par défaut.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const evenement = evenementParId((await params).id);
  let source = `data:image/svg+xml;base64,${Buffer.from(imageDemo("defaut")).toString("base64")}`;
  const photo = evenement?.photo;
  if (photo?.startsWith("/media/")) {
    const image = lireImage(photo.slice("/media/".length));
    if (image && image.type !== "image/webp")
      source = `data:${image.type};base64,${image.contenu.toString("base64")}`;
  } else if (photo?.startsWith("/demo/")) {
    const nom = photo.slice("/demo/".length).replace(/\.svg$/, "");
    source = `data:image/svg+xml;base64,${Buffer.from(imageDemo(nom)).toString("base64")}`;
  }
  return new ImageResponse(
    <img
      src={source}
      alt=""
      width={size.width}
      height={size.height}
      style={{ objectFit: "cover" }}
    />,
    size,
  );
}
