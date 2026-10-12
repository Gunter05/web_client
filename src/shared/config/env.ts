import "server-only";
import { serverSchema, valider } from "./schema";

export const env = valider(serverSchema, process.env);
