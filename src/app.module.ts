import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { AppConfigModule } from './modules/config/app-config.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { VectorDbModule } from './modules/vector-db/vector-db.module';
import { LlmModule } from './modules/llm/llm.module';
import { RagModule } from './modules/rag/rag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    AppConfigModule,
    VectorDbModule,
    LlmModule,
    IngestionModule,
    RagModule,
    TelegramModule,
  ],
})
export class AppModule {}
