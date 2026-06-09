import { Bot, InlineKeyboard } from 'grammy';

import { createMiniAppLinks } from '../application/mini-app-links.js';
import type { BotEnvironment } from '../config/bot-environment.js';

export function createDogHealthBot(environment: BotEnvironment): Bot {
  const bot = new Bot(environment.TELEGRAM_BOT_TOKEN);
  const links = createMiniAppLinks(environment);

  bot.command('start', async (ctx) => {
    await ctx.reply(
      [
        'Dog Health Assistant',
        '',
        'Ведите календарь здоровья собаки, отслеживайте течки и не пропускайте важные события.',
      ].join('\n'),
      {
        reply_markup: new InlineKeyboard()
          .webApp('Открыть приложение', links.home)
          .row()
          .webApp('Мои собаки', links.dogs)
          .webApp('Календарь', links.calendar),
      },
    );
  });

  bot.command('events', async (ctx) => {
    await ctx.reply('Ближайшие события будут доступны после подключения календаря здоровья.', {
      reply_markup: new InlineKeyboard().webApp('Открыть календарь', links.calendar),
    });
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      [
        'Доступные команды:',
        '/start - открыть приложение',
        '/events - ближайшие события',
        '/help - помощь',
      ].join('\n'),
      {
        reply_markup: new InlineKeyboard()
          .webApp('Здоровье', links.health)
          .webApp('База знаний', links.knowledge),
      },
    );
  });

  bot.catch((error) => {
    console.error('Telegram Bot error:', error);
  });

  return bot;
}
