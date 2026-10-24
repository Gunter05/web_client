import type { ReactNode } from "react";

/** Identifiant du titre : le modal d'authentification s'en sert comme nom accessible. */
export const AUTH_TITLE_ID = "auth-title";

/**
 * Contenu d'un écran d'authentification : grand titre centré, contenu, puis
 * pied séparé (« Pas encore de compte ? »). Le cadre (modal, plein écran ou
 * carte de la page) est fourni par l'appelant.
 */
export function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-full grid-rows-[1fr_auto]">
      {/* Champs et bouton hauts, comme le modèle TikTok ; bouton principal gris tant qu'il manque un champ ;
          libellés lus par les lecteurs d'écran, affichés dans le champ (placeholder) ;
          micro-animations : champ qui s'éclaire au focus,
          bouton qui s'enfonce au clic, erreur qui tremble */}
      <div className="grid content-start gap-6 px-6 pt-6 pb-8 sm:px-10 motion-safe:[&_[role=alert]]:animate-shake [&_button[type=submit]]:h-12 [&_button[type=submit]]:rounded-full [&_button[type=submit]]:transition-[background-color,color,transform] [&_button[type=submit]]:duration-200 [&_button[type=submit]]:active:scale-[0.98] [&_button[type=submit]:disabled]:bg-muted [&_button[type=submit]:disabled]:text-muted-foreground [&_button[type=submit]:disabled]:opacity-100 [&_input]:h-12 [&_input]:rounded-lg [&_input]:border-transparent [&_input]:bg-muted [&_input]:px-4 [&_input]:text-base [&_input]:transition-[background-color,box-shadow] [&_input]:duration-200 [&_input:focus-visible]:bg-background [&_label]:sr-only">
        <div className="mt-6 grid justify-items-center gap-2 text-center">
          <h1 id={AUTH_TITLE_ID} className="text-2xl font-bold sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
      <p className="border-t px-6 py-5 text-center text-sm">{footer}</p>
    </div>
  );
}
