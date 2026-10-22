"use client";

import { useState } from "react";
import { checkPhoto } from "@/modules/medias/domain/photo";
import {
  confirmPhotoUploadAction,
  reservePhotoUploadAction,
  uploadPhotoAction,
} from "@/modules/medias/application/medias.actions";
import {
  type PreparedPhoto,
  preparePhoto,
} from "@/modules/medias/presentation/compress-photo";

type State =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "done"; url: string }
  | { status: "error"; error: string };

/**
 * Envoi d'une photo dès qu'elle est choisie (ADR 0014 du backend) :
 * compression dans le navigateur (avec dimensions et aperçu flou), puis envoi direct au stockage (réservation,
 * envoi, confirmation), ou par l'API si le stockage ne le permet pas. Le
 * formulaire ne transmet ensuite que l'adresse de la photo (`photoUrl`).
 */
export function usePhotoUpload() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function upload(file: File): Promise<void> {
    const invalid = checkPhoto(file);
    if (invalid) {
      setState({ status: "error", error: invalid });
      return;
    }
    setState({ status: "uploading" });
    try {
      const photo = await preparePhoto(file);
      const result = await send(photo);
      setState(
        result.ok
          ? { status: "done", url: result.value }
          : { status: "error", error: result.error },
      );
    } catch {
      setState({ status: "error", error: "uploadFailed" });
    }
  }

  return {
    upload,
    reset: () => setState({ status: "idle" }),
    uploading: state.status === "uploading",
    url: state.status === "done" ? state.url : null,
    error: state.status === "error" ? state.error : null,
  };
}

async function send(
  photo: PreparedPhoto,
): Promise<{ ok: true; value: string } | { ok: false; error: string }> {
  const { blob } = photo;
  const layout = layoutOf(photo);
  const reserved = await reservePhotoUploadAction(blob.type, blob.size, layout);
  if (!reserved.ok) return reserved;
  if (!reserved.value) {
    // Stockage sur disque : la photo passe par l'API
    const form = new FormData();
    form.append("file", blob, fileName(blob.type));
    if (layout) {
      form.append("width", String(layout.width));
      form.append("height", String(layout.height));
      if (layout.placeholder) form.append("placeholder", layout.placeholder);
    }
    return uploadPhotoAction(form);
  }
  const target = reserved.value;
  const sent = await fetch(target.uploadUrl, {
    method: "PUT",
    headers: target.headers,
    body: blob,
  });
  if (!sent.ok) return { ok: false, error: "uploadFailed" };
  return confirmPhotoUploadAction(target.id);
}

/** Dimensions et aperçu flou à annoncer, s'ils ont pu être calculés. */
function layoutOf(photo: PreparedPhoto) {
  return photo.width > 0 && photo.height > 0
    ? {
        width: photo.width,
        height: photo.height,
        placeholder: photo.placeholder,
      }
    : null;
}

function fileName(type: string): string {
  return `photo.${type.split("/")[1] ?? "jpg"}`;
}
