import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { RagModule } from '../rag/rag.module';

@Module({
  imports: [RagModule],
  providers: [TelegramService],
})
export class TelegramModule {}
