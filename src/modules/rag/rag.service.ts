import { Injectable, Logger } from '@nestjs/common';
import { EmbeddingService } from '../llm/services/embedding.service';
import { VectorDbService } from '../vector-db/vector-db.service';
import { LlmProviderService } from '../llm/services/llm-provider.service';

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private readonly TOP_K = 3;

  constructor(
    private readonly embedder: EmbeddingService,
    private readonly vectorDb: VectorDbService,
    private readonly llm: LlmProviderService,
  ) {}

  /**
   * Core RAG flow:
   * 1. Embed the question
   * 2. Retrieve top-K similar chunks from Qdrant
   * 3. Build prompt with context
   * 4. Call LLM and return the answer
   */
  async answerQuestion(question: string): Promise<string> {
    this.logger.log(`Processing question: "${question}"`);

    // Step 1 – embed the query
    const queryVector = await this.embedder.embedText(question);

    // Step 2 – retrieve similar chunks
    const hits = await this.vectorDb.search(queryVector, this.TOP_K);

    if (hits.length === 0) {
      return "I don't have any relevant documents to answer your question. Please upload some documents first.";
    }

    // Step 3 – build context string from retrieved chunks
    const context = hits
      .map((h, i) => `[${i + 1}] ${h.payload.text}`)
      .join('\n\n');

    this.logger.debug(`Retrieved ${hits.length} context chunks`);

    console.log({ context, question });

    // Step 4 – call LLM
    const answer = await this.llm.chat([
      {
        role: 'system',
        content: `Вы — полезный помощник. Ответьте на вопрос пользователя, используя ТОЛЬКО приведенный ниже контекст.
Если в контексте недостаточно информации, скажите, что не знаете — не выдумывайте факты. Ответ должен основываться на документе, встроенном в векторную базу данных.

контекст:
${context}`,
      },
      {
        role: 'user',
        content: question,
      },
    ]);

    return answer;
  }
}
