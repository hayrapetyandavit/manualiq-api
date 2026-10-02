import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { DocumentParserService } from './services/document-parser.service';
import { ChunkerService } from './services/chunker.service';
import { LlmModule } from '../llm/llm.module';
import { VectorDbModule } from '../vector-db/vector-db.module';

@Module({
  imports: [LlmModule, VectorDbModule],
  controllers: [IngestionController],
  providers: [IngestionService, DocumentParserService, ChunkerService],
  exports: [IngestionService],
})
export class IngestionModule {}
