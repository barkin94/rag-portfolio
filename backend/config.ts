import { z } from 'zod';

const BaseSchema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),

    TIMEOUT: z.coerce.number().default(60000),

    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
        .default('info'),

    HF_EMBEDDINGS_MODEL: z.string().default('sentence-transformers/all-MiniLM-L6-v2'),
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

    ENABLE_TG_SENDER: z
        .preprocess(
            (val) => val === 'true' || val === '1', 
            z.boolean()
        )
        .default(false),
    TG_U_BOT_TOKEN: z.string().min(1).optional(),
    TG_BOT_TOKEN: z.string().min(1).optional(),
    TG_CHAT_ID: z.string().optional(),

    ADMIN_PAGE_SECRET: z.string().min(1),
});

// 1. Define sub-schemas for each LLM_PROVIDER value
const GeminiSchema = z.object({
    LLM_PROVIDER: z.literal('gemini'),
    GEMINI_API_KEY: z.string().min(1),
    GEMINI_MODEL: z.string().default('gemini-2.5-flash-lite'),
    GEMINI_TEMPERATURE: z.coerce.number().default(0.1),
});

const OllamaSchema = z.object({
    LLM_PROVIDER: z.literal('ollama'),
    OLLAMA_MODEL: z.string().default('llama3.1:8b-instruct-q4_K_M'),
    OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
    OLLAMA_TEMPERATURE: z.coerce.number().default(0.1),
});

const OpenRouterSchema = z.object({
    LLM_PROVIDER: z.literal('openrouter'),
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_MODEL: z.string().default('xiaomi/mimo-v2-flash:free'),
    OPENROUTER_TEMPERATURE: z.coerce.number().default(0.1),
});

// 2. Combine them into a Union
const LLMProviderUnion = z.discriminatedUnion('LLM_PROVIDER', [
    GeminiSchema,
    OllamaSchema,
    OpenRouterSchema,
]);

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
