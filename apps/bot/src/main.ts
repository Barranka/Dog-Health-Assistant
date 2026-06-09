import { createDogHealthBot } from './presentation/create-dog-health-bot.js';
import { loadBotEnvironment } from './config/load-bot-environment.js';
import { validateBotEnvironment } from './config/validate-bot-environment.js';

async function bootstrap(): Promise<void> {
  loadBotEnvironment();

  const environment = validateBotEnvironment(process.env);
  const bot = createDogHealthBot(environment);

  if (environment.BOT_DRY_RUN) {
    console.info('Dog Health Assistant bot configuration is valid.');
    return;
  }

  await bot.api.setMyCommands([
    {
      command: 'start',
      description: 'Открыть Dog Health Assistant',
    },
    {
      command: 'events',
      description: 'Ближайшие события',
    },
    {
      command: 'help',
      description: 'Помощь',
    },
  ]);

  process.once('SIGINT', () => {
    void bot.stop();
  });
  process.once('SIGTERM', () => {
    void bot.stop();
  });

  await bot.start({
    onStart: (botInfo) => {
      console.info(`Dog Health Assistant bot started as @${botInfo.username}.`);
    },
  });
}

void bootstrap();
