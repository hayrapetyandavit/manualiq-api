import { Injectable, Logger } from '@nestjs/common';
import { Ollama } from 'ollama';
import { AppConfigService } from '../../config/app-config.service';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly ollama: Ollama;

  constructor(private readonly cfg: AppConfigService) {
    this.ollama = new Ollama({ host: this.cfg.ollamaUrl });
  }

  async embedText(text: string): Promise<number[]> {
    console.log({ model: this.cfg.embeddingModel });
    const response = await this.ollama.embeddings({
      model: this.cfg.embeddingModel,
      prompt: text,
    });
    return response.embedding;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    // Ollama doesn't have a native batch API – run sequentially with concurrency cap
    const results: number[][] = [];
    for (const text of texts) {
      results.push(await this.embedText(text));
    }
    return results;
  }
}
