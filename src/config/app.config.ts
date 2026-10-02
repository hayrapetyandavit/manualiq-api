export default () => ({
  port: parseInt(process.env.PORT ?? '3000'),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  qdrantUrl: process.env.QDRANT_URL ?? 'http://localhost:6333',
  qdrantCollection: process.env.QDRANT_COLLECTION ?? 'documents',
  ollamaUrl: process.env.OLLAMA_URL ?? 'http://localhost:11434',
  embeddingModel: process.env.EMBEDDING_MODEL ?? 'nomic-embed-text',
  llmModel: process.env.LLM_MODEL ?? 'llama3',
  aiUrl: process.env.AI_URL ?? 'http://localhost:4891/v1/chat/completions',
  aiModel: process.env.AI_MODEL ?? 'gpt-4o-mini',
});
