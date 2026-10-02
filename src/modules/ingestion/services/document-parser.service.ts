import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class DocumentParserService {
  private readonly logger = new Logger(DocumentParserService.name);

  async extractText(filePath: string): Promise<string> {
    this.logger.debug(`Reading file: ${filePath}`);
    return fs.readFile(filePath, 'utf-8');
  }
}
