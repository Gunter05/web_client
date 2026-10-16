import { imageDemo } from "@/shared/stockage/images-demo";

/** Images de démonstration et image par défaut des événements (SVG généré). */
export async function GET(_: Request, { params }: RouteContext<"/demo/[nom]">) {
  const nom = (await params).nom.replace(/\.svg$/, "");
  return new Response(imageDemo(nom), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
