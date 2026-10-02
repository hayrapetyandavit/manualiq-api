import { Controller, Post, BadRequestException, Logger } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';
import { IngestionService } from './ingestion.service';

@Controller('ingest')
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);
  /** Absolute path to the local data directory */
  private readonly DATA_DIR = join(process.cwd(), 'data');

  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * POST /ingest/document
   * Body: { "filename": "document.txt" }
   *
   * Reads the file from the local data/ folder and runs the full ingestion pipeline.
   */
  @Post('document')
  async ingestDocument() {
    const filename = 'nto.txt';
    const filePath = join(this.DATA_DIR, filename);

    if (!existsSync(filePath)) {
      throw new BadRequestException(
        `File not found in data directory: "${filename}"`,
      );
    }

    this.logger.log(`Ingesting file: ${filePath}`);
    const result = await this.ingestionService.processDocument(filePath);

    return {
      status: 'ok',
      file: filename,
      chunksIngested: result.chunks,
    };
  }
}
