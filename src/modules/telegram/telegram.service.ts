import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { AppConfigService } from '../config/app-config.service';
import { RagService } from '../rag/rag.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private readonly bot: Telegraf;

  constructor(
    private readonly cfg: AppConfigService,
    private readonly rag: RagService,
  ) {
    this.bot = new Telegraf(this.cfg.telegramBotToken);
  }

  async onModuleInit() {
    this.registerHandlers();
    // Launch in long-polling mode (swap to webhook if needed)
    void this.bot.launch();
    this.logger.log('Telegram bot started (long-polling)');
  }

  async onModuleDestroy() {
    this.bot.stop('SIGTERM');
  }

  private registerHandlers() {
    this.bot.start((ctx) =>
      ctx.reply(
        '👋 Hello! I am your RAG assistant.\n\n' +
          'Send me any question and I will answer it using the ingested documents.\n' +
          'Use the REST API at POST /ingest/document to upload documents first.',
      ),
    );

    this.bot.help((ctx) =>
      ctx.reply(
        'Just send me a question and I will search the knowledge base to answer it.',
      ),
    );

    this.bot.on('text', async (ctx: Context) => {
      const message = ctx as Context & { message: { text: string } };
      const question = message.message.text.trim();

      this.logger.log(
        `Question from ${ctx.from?.username ?? ctx.from?.id}: "${question}"`,
      );

      // Show typing indicator while we process
      await ctx.sendChatAction('typing');

      try {
        const answer = await this.rag.answerQuestion(question);
        console.log({ answer });
        await ctx.reply(answer);
      } catch (error) {
        this.logger.error('Failed to answer question', error);
        await ctx.reply(
          '❌ Something went wrong while processing your question. Please try again.',
        );
      }
    });
  }
}
