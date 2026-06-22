import * as HttpStatusPhrases from "@doubleyooz/wardenhttp/http-status-messages";
import { createMessageObjectSchema } from "../utils/schema.util.js";

export const POWS = 'Pows'
export const POSTS = 'Posts';
export const PROFILES = 'Profiles';

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
