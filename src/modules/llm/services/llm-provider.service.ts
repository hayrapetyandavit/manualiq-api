import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../../config/app-config.service';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class LlmProviderService {
  private readonly logger = new Logger(LlmProviderService.name);

  constructor(private readonly cfg: AppConfigService) {}

  /**
   * Calls the LLM API (compatible with OpenAI chat completions format).
   * Works with Ollama's OpenAI-compatible endpoint, LM Studio, GPT4All, etc.
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    const response = await fetch(this.cfg.aiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.cfg.aiModel,
        messages,
        stream: false,
        max_tokens: 1024,
        // num_ctx_tokens: 2048,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `LLM request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    return data.choices[0].message.content.trim();
  }
}
