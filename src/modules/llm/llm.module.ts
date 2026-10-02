import { Module } from '@nestjs/common';
import { EmbeddingService } from './services/embedding.service';
import { LlmProviderService } from './services/llm-provider.service';

@Module({
  providers: [EmbeddingService, LlmProviderService],
  exports: [EmbeddingService, LlmProviderService],
})
export class LlmModule {}
