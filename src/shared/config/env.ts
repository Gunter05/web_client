import "server-only";
import { serverSchema, valider } from "@/shared/config/schema";

export const env = valider(serverSchema, process.env);
