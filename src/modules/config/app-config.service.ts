import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Typed wrapper around ConfigService – one place to read all env vars.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return this.config.get<number>('port');
  }

  get telegramBotToken(): string {
    return this.config.get<string>('telegramBotToken');
  }

  get qdrantUrl(): string {
    return this.config.get<string>('qdrantUrl');
  }

  get qdrantCollection(): string {
    return this.config.get<string>('qdrantCollection');
  }

  get ollamaUrl(): string {
    return this.config.get<string>('ollamaUrl');
  }

  get embeddingModel(): string {
    return this.config.get<string>('embeddingModel');
  }

  get aiUrl(): string {
    return this.config.get<string>('aiUrl');
  }

  get aiModel(): string {
    return this.config.get<string>('aiModel');
  }
}
