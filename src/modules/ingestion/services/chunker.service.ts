import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export interface TextChunk {
  text: string;
  index: number;
}

@Injectable()
export class ChunkerService {
  private readonly splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  });

  async chunk(text: string): Promise<TextChunk[]> {
    const docs = await this.splitter.createDocuments([text]);
    return docs.map((doc, index) => ({
      text: doc.pageContent.trim(),
      index,
    }));
  }
}
