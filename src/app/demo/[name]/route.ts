import { demoImage } from "@/shared/lib/demo-images";

/** Images de démonstration et image par défaut des événements (SVG généré). */
export async function GET(
  _: Request,
  { params }: RouteContext<"/demo/[name]">,
) {
  const name = (await params).name.replace(/\.svg$/, "");
  return new Response(demoImage(name), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
