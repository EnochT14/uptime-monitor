import { z } from "zod"

export const PRE_FQDN = "UPDATE_ME_PRE_FQDN"
export const PROD_FQDN = "UPDATE_ME_PROD_FQDN"

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
}

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
}

export const ErrorResponseSchema = z.object({
  error: z.string(),
})
