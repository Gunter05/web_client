import { splitLinks } from "@/shared/lib/links";

/**
 * Texte dont les adresses web deviennent des liens bleus, soulignés au
 * survol, ouverts dans un nouvel onglet. `nofollow ugc` : contenu publié par
 * les utilisateurs.
 */
export function LinkifiedText({ text }: { text: string }) {
  return splitLinks(text).map((part, i) =>
    part.type === "text" ? (
      part.text
    ) : (
      <a
        key={i}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer nofollow ugc"
        className="break-all text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
      >
        {part.text}
      </a>
    ),
  );
}
