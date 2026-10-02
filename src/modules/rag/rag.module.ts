import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { LlmModule } from '../llm/llm.module';
import { VectorDbModule } from '../vector-db/vector-db.module';

@Module({
  imports: [LlmModule, VectorDbModule],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
