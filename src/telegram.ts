import ky, { HTTPError, KyInstance } from 'ky';

const tgbBaseUrl = 'https://tgb.vercel.app/api/tgproxy/v1';

type KeyboardButton = {
  text: string;
};
type ReplyKeyboardMarkup = {
  keyboard: Array<Array<KeyboardButton>>;
};
// https://core.telegram.org/bots/api#sendmessage
type SendMessageParams = {
  chat_id: number;
  text: string;
  parse_mode?: string;
  reply_markup?: ReplyKeyboardMarkup;
};

type SendPhotoParams = {
  chat_id: number;
  photo: string;
  caption: string;
  parse_mode?: string;
};

export class TelegramService {
  constructor(botToken: string | null, jwt: string | undefined) {
    if (typeof botToken === 'string' && botToken !== '') {
      this.ky = ky.create({
        prefix: 'https://api.telegram.org/bot' + botToken,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else if (typeof jwt === 'string' && jwt !== '') {
      this.ky = ky.create({
        prefix: tgbBaseUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });
    } else {
      throw new Error('botToken or jwt is needed');
    }
  }

  private ky: KyInstance;

  async sendPhoto(body: SendPhotoParams) {
    try {
      await this.ky
        .post('sendPhoto', {
          json: {
            parse_mode: 'MarkdownV2',
            ...body,
          },
        })
        .text();
    } catch (e: unknown) {
      await this.handleAPIError(e);
    }
  }

  async sendMessage(body: SendMessageParams) {
    try {
      await this.ky
        .post('sendMessage', {
          json: {
            parse_mode: 'MarkdownV2',
            ...body,
          },
        })
        .text();
    } catch (e: unknown) {
      await this.handleAPIError(e);
    }
  }

  async handleAPIError(e: unknown): Promise<never> {
    if (e instanceof HTTPError) {
      const msg = await e.response.text();
      throw new Error(`${e.response.status}:${msg}`);
    }

    if (e instanceof Error) {
      throw new Error(`network:error:${e.name}`);
    }

    throw e;
  }
}
