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

  HF_EMBEDDINGS_MODEL: z
    .string()
    .default("sentence-transformers/all-MiniLM-L6-v2"),
  HF_EMBEDDINGS_API_KEY: z.string().min(1),

  MONGODB_URI: z.string().url(),
  MONGODB_DBNAME: z.string().min(1),

  UPSTASH_VECTOR_REST_URL: z.string().url(),
  UPSTASH_VECTOR_REST_TOKEN: z.string().min(1),

  CONTACT_EMAIL: z.string().email(),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),

  FIREBASE_SERVICE_ACCOUNT_BASE64: z.string().min(1),
  FIREBASE_VAPID_KEY: z.string().min(1),

  ADMIN_PAGE_SECRET: z.string().min(1),

  // Maintenance mode - toggle via env var (no redeploy needed on Vercel)
  MAINTENANCE_MODE: z.coerce.boolean().default(false),

  // Google Docs CV Sync
  GOOGLE_SERVICE_ACCOUNT_JSON: z.string().default(""),
  GOOGLE_DOC_ID: z.string().default(""),

  RESUME_PARSER_API_KEY: z.string().default(""),
  RESUME_PARSER_MODEL: z.string().default(""),
  RESUME_PARSER_MAX_RETRIES: z.coerce.number().default(3),
  RESUME_PARSER_TIMEOUT: z.coerce.number().default(60000),
});


const OpenRouterSchema = z.object({
    LLM_PROVIDER: z.literal('openrouter'),
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_MODEL: z.string().default('openrouter/free'),
    OPENROUTER_TEMPERATURE: z.coerce.number().default(0.1),
});

const LLMProviderUnion = OpenRouterSchema;

const configSchema = BaseSchema.and(LLMProviderUnion);

let config: z.infer<typeof configSchema>

try {
    config = configSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error("Environment Variable Validation Failed: " + JSON.stringify(error.flatten().fieldErrors));
    }

    process.exit(1);
}
// Parse and export the validated data
export default config;
