import { lireImage } from "@/shared/stockage/fichiers";

/** Sert les images téléversées (stockage simulé). */
export async function GET(
  _: Request,
  { params }: RouteContext<"/media/[nom]">,
) {
  const image = lireImage((await params).nom);
  if (!image) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(image.contenu), {
    headers: {
      "Content-Type": image.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
