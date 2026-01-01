import { z } from 'zod';

const BaseSchema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),

    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
        .default('info'),

    HF_EMBEDDINGS_MODEL: z.string().default('sentence-transformers/all-MiniLM-L6-v2'),
    HF_EMBEDDINGS_API_KEY: z.string().min(1),
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
        console.error("Environment Variable Validation Failed: " + error.flatten().fieldErrors);
        // logger.error({
        //     msg: "Environment Variable Validation Failed",
        //     details: error.flatten().fieldErrors,
        // });
    }

    process.exit(1);
}
// Parse and export the validated data
export default config;
