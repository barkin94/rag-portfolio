
import { z } from "zod";

export const stateSchema = z.object({
  nextHumanMessageIndex: z.number().default(0),
  threadId: z.string(),
});
