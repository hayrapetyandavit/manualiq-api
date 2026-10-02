import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { AppConfigService } from '../config/app-config.service';

export interface VectorPoint {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
}

export interface SearchResult {
  id: string | number;
  score: number;
  payload: Record<string, unknown>;
}

@Injectable()
export class VectorDbService implements OnModuleInit {
  private readonly logger = new Logger(VectorDbService.name);
  private readonly client: QdrantClient;
  private readonly collection: string;

  constructor(private readonly cfg: AppConfigService) {
    this.client = new QdrantClient({ url: this.cfg.qdrantUrl });
    this.collection = this.cfg.qdrantCollection;
  }

  async onModuleInit() {
    await this.ensureCollection();
  }

  private async ensureCollection() {
    try {
      await this.client.getCollection(this.collection);
      this.logger.log(`Collection "${this.collection}" already exists`);
    } catch {
      await this.client.createCollection(this.collection, {
        vectors: { size: 768, distance: 'Cosine' }, // nomic-embed-text produces 768-dim vectors
      });
      this.logger.log(`Created collection "${this.collection}"`);
    }
  }

  async upsert(points: VectorPoint[]): Promise<void> {
    await this.client.upsert(this.collection, {
      wait: true,
      points: points.map((p) => ({
        id: this.toUUID(p.id),
        vector: p.vector,
        payload: p.payload,
      })),
    });
  }

  async search(vector: number[], topK = 5): Promise<SearchResult[]> {
    const result = await this.client.search(this.collection, {
      vector,
      limit: topK,
      with_payload: true,
    });
    return result.map((r) => ({
      id: r.id,
      score: r.score,
      payload: r.payload as Record<string, unknown>,
    }));
  }

  /**
   * Converts an arbitrary string to a deterministic UUIDv5-like hex string
   * because Qdrant requires UUID or unsigned int as point IDs.
   */
  private toUUID(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}-0000-4000-8000-000000000000`;
  }
}
