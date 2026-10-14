import { z } from 'zod';

const BaseSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  TIMEOUT: z.coerce.number().default(60000),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  CONTEXT_TURNS: z.coerce.number().default(2),

  // Embedding Model Config (generic, provider-agnostic)
  EMBEDDING_API_KEY: z.string().min(1),
  EMBEDDING_MODEL: z.string().default("nvidia/nemotron-3-embed-1b"),
  EMBEDDING_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),

  MONGODB_ATLAS_INDEX_NAME: z.string().default("embeddings_index"),

  MONGODB_URI: z.string().url(),
  MONGODB_DBNAME: z.string().min(1),

  CONTACT_EMAIL: z.string().email(),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),

  FIREBASE_SERVICE_ACCOUNT_BASE64: z.string().default(""),
  FIREBASE_VAPID_KEY: z.string().min(1),

  ADMIN_PAGE_SECRET: z.string().min(1),

  MAINTENANCE_MODE: z.coerce.boolean().default(false),

  GOOGLE_SERVICE_ACCOUNT_JSON: z.string().default(""),
  GOOGLE_DOC_ID: z.string().default(""),

  RESUME_PARSER_AGENT_API_KEY: z.string().default(""),
  RESUME_PARSER_AGENT_MODEL: z.string().default(""),
  RESUME_PARSER_AGENT_MAX_RETRIES: z.coerce.number().default(3),
  RESUME_PARSER_AGENT_TIMEOUT: z.coerce.number().default(60000),

  // Chat Agent LLM Config (generic, provider-agnostic)
  CHAT_AGENT_API_KEY: z.string().min(1),
  CHAT_AGENT_MODEL: z.string().default("openrouter/free"),
  CHAT_AGENT_TEMPERATURE: z.coerce.number().default(0.1),
  CHAT_AGENT_MAX_RETRIES: z.coerce.number().default(3),
  CHAT_AGENT_TIMEOUT: z.coerce.number().default(60000),
  CHAT_AGENT_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),

  PROFILE_IMAGE_URL: z.string().url().optional(),
});


const configSchema = BaseSchema;

let config: z.infer<typeof configSchema>

try {
    config = configSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error("Environment Variable Validation Failed: " + JSON.stringify(error.flatten().fieldErrors));
    }

    process.exit(1);
}
export default config;