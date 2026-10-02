import { Injectable, Logger } from '@nestjs/common';
import { DocumentParserService } from './services/document-parser.service';
import { ChunkerService } from './services/chunker.service';
import { EmbeddingService } from '../llm/services/embedding.service';
import { VectorDbService } from '../vector-db/vector-db.service';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly parser: DocumentParserService,
    private readonly chunker: ChunkerService,
    private readonly embedder: EmbeddingService,
    private readonly vectorDb: VectorDbService,
  ) {}

  /**
   * Full pipeline: parse → chunk → embed → save to vector DB.
   */
  async processDocument(filePath: string): Promise<{ chunks: number }> {
    this.logger.log(`Starting ingestion for: ${filePath}`);

    const text = await this.parser.extractText(filePath);
    const chunks = await this.chunker.chunk(text);
    this.logger.log(`Split into ${chunks.length} chunks`);

    // Embed and upsert in batches to avoid memory spikes
    const BATCH = 5;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const vectors = await this.embedder.embedBatch(batch.map((c) => c.text));

      await this.vectorDb.upsert(
        batch.map((chunk, j) => ({
          id: `${filePath}-chunk-${chunk.index}`,
          vector: vectors[j],
          payload: {
            text: chunk.text,
            source: filePath,
            chunkIndex: chunk.index,
          },
        })),
      );

      this.logger.debug(`Upserted batch ${i / BATCH + 1}`);
    }

    this.logger.log(`Ingestion complete: ${chunks.length} chunks saved`);
    return { chunks: chunks.length };
  }
}
