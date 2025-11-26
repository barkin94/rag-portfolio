const { env } = process

export default {
    provider: env.LLM_PROVIDER ?? 'ollama',
    gemini: {
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL ?? 'gemini-2.5-flash-lite',
        embeddingModel: env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001",
        temperature: parseInt(env.GEMINI_TEMPERATURE ?? '0.1')
    },
    ollama: {
        model: env.OLLAMA_MODEL ?? 'llama3.1:8b-instruct-q4_K_M',
        temperature: parseInt(env.OLLAMA_TEMPERATURE ?? '0.1'),
        baseUrl: env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
    },
    redis: {
        url: env.REDIS_URL ?? '',
        messagesTTLSeconds: parseInt(env.REDIS_MESSAGES_TTL_SECONDS ?? '3000')
    }
}