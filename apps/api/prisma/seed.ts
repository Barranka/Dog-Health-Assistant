import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type KnowledgeCategory } from '@prisma/client';

loadEnvFile(fileURLToPath(new URL('../../../.env', import.meta.url)));

type Locale = 'ru' | 'en';

interface SeedKnowledgeArticle {
  slug: string;
  title: string;
  group: string;
  category: KnowledgeCategory;
  locale: Locale;
  content: string;
}

interface ArticleTemplate {
  slug: string;
  title: string;
  group: string;
  category: KnowledgeCategory;
  summary: string;
}

const russianTemplates: ArticleTemplate[] = [
  {
    slug: 'what-is-heat',
    title: 'Что такое течка',
    group: 'reproductive_cycle',
    category: 'proestrus',
    summary:
      'Течка — часть репродуктивного цикла собаки. В это время меняется гормональный фон, могут появляться выделения и изменения поведения.',
  },
  {
    slug: 'first-heat',
    title: 'Первая течка',
    group: 'reproductive_cycle',
    category: 'proestrus',
    summary:
      'Первая течка может начаться в разном возрасте в зависимости от размера, породы и индивидуальных особенностей собаки.',
  },
  {
    slug: 'cycle-phases',
    title: 'Фазы цикла',
    group: 'reproductive_cycle',
    category: 'proestrus',
    summary:
      'Репродуктивный цикл условно делят на проэструс, эструс, диэструс и анэструс. Пользователю важно отмечать факты, а приложение помогает с интерпретацией.',
  },
  {
    slug: 'proestrus',
    title: 'Проэструс',
    group: 'reproductive_cycle',
    category: 'proestrus',
    summary:
      'Проэструс — начальная фаза течки. Часто заметны кровянистые выделения, увеличение петли и изменения поведения.',
  },
  {
    slug: 'estrus',
    title: 'Эструс',
    group: 'reproductive_cycle',
    category: 'estrus',
    summary:
      'Эструс часто совпадает с фертильным периодом, но точные сроки индивидуальны и не всегда определяются только по внешним признакам.',
  },
  {
    slug: 'diestrus',
    title: 'Диэструс',
    group: 'reproductive_cycle',
    category: 'diestrus',
    summary:
      'Диэструс начинается после фертильной части цикла. Видимые признаки могут уменьшаться, но гормональные процессы продолжаются.',
  },
  {
    slug: 'anestrus',
    title: 'Анэструс',
    group: 'reproductive_cycle',
    category: 'diestrus',
    summary:
      'Анэструс — спокойный период между циклами. Его длительность помогает прогнозировать следующую течку.',
  },
  {
    slug: 'ovulation-and-fertility',
    title: 'Овуляция и фертильный период',
    group: 'reproductive_cycle',
    category: 'estrus',
    summary:
      'Фертильный период у собак может отличаться от ожидаемого по календарю. При планировании вязки лучше консультироваться с ветеринаром.',
  },
  {
    slug: 'heat-behavior',
    title: 'Поведение во время течки',
    group: 'reproductive_cycle',
    category: 'estrus',
    summary:
      'Во время течки собака может стать более ласковой, беспокойной, уставшей или активнее интересоваться другими собаками.',
  },
  {
    slug: 'heat-care',
    title: 'Уход во время течки',
    group: 'reproductive_cycle',
    category: 'proestrus',
    summary:
      'Во время течки важно следить за гигиеной, прогулками, контактом с другими собаками и общим самочувствием.',
  },
  {
    slug: 'heat-hygiene',
    title: 'Гигиена во время течки',
    group: 'reproductive_cycle',
    category: 'proestrus',
    summary:
      'Гигиенические трусы и регулярная уборка могут помочь, но важно не раздражать кожу и не использовать агрессивные средства.',
  },
  {
    slug: 'bathing-during-heat',
    title: 'Можно ли купать собаку во время течки',
    group: 'reproductive_cycle',
    category: 'proestrus',
    summary:
      'Купание возможно при необходимости, если собака чувствует себя хорошо. Важно избегать переохлаждения и стресса.',
  },
  {
    slug: 'normal-cycle-signs',
    title: 'Как понять, что цикл проходит нормально',
    group: 'reproductive_cycle',
    category: 'vet_warning_signs',
    summary:
      'Нормальный цикл обычно не сопровождается резкой слабостью, высокой температурой, сильной болью или гнойными выделениями.',
  },
  {
    slug: 'urgent-vet',
    title: 'Когда срочно нужен ветеринар',
    group: 'dangerous_symptoms',
    category: 'vet_warning_signs',
    summary:
      'Сильная вялость, затруднённое дыхание, судороги, кровотечение, температура или резкое ухудшение состояния — повод обратиться срочно.',
  },
  {
    slug: 'discharge-warning-signs',
    title: 'Выделения: норма и тревожные признаки',
    group: 'dangerous_symptoms',
    category: 'vet_warning_signs',
    summary:
      'Цвет, запах, количество и сопутствующие симптомы помогают понять, являются ли выделения обычными или требуют внимания.',
  },
  {
    slug: 'pyometra',
    title: 'Пиометра',
    group: 'dangerous_symptoms',
    category: 'vet_warning_signs',
    summary:
      'Пиометра — опасное воспаление матки. Вялость, жажда, температура, выделения или боль после течки требуют срочной диагностики.',
  },
  {
    slug: 'cycle-disorders',
    title: 'Нарушения цикла',
    group: 'dangerous_symptoms',
    category: 'vet_warning_signs',
    summary:
      'Слишком частые, редкие, длительные или необычные течки лучше обсуждать с ветеринаром, особенно при изменении самочувствия.',
  },
  {
    slug: 'fever',
    title: 'Высокая температура',
    group: 'dangerous_symptoms',
    category: 'vet_warning_signs',
    summary:
      'Высокая температура может быть признаком инфекции, воспаления или другого серьёзного состояния.',
  },
  {
    slug: 'food-water-refusal',
    title: 'Отказ от еды и воды',
    group: 'dangerous_symptoms',
    category: 'vet_warning_signs',
    summary:
      'Кратковременное снижение аппетита возможно, но отказ от воды, слабость или ухудшение состояния требуют внимания.',
  },
  {
    slug: 'red-flags-after-heat',
    title: 'Красные флаги после течки',
    group: 'dangerous_symptoms',
    category: 'vet_warning_signs',
    summary:
      'После течки особенно важны необычные выделения, вялость, температура, болезненность живота и резкое изменение поведения.',
  },
  {
    slug: 'vaccination',
    title: 'Вакцинация',
    group: 'prevention_and_health',
    category: 'vet_warning_signs',
    summary:
      'Вакцинация помогает снизить риск опасных инфекций. График зависит от возраста, региона, образа жизни и рекомендаций врача.',
  },
  {
    slug: 'tick-treatment',
    title: 'Обработка от клещей',
    group: 'prevention_and_health',
    category: 'vet_warning_signs',
    summary:
      'Защита от клещей важна в сезон активности паразитов и в регионах, где есть риск клещевых инфекций.',
  },
  {
    slug: 'flea-treatment',
    title: 'Обработка от блох',
    group: 'prevention_and_health',
    category: 'vet_warning_signs',
    summary:
      'Блохи могут вызывать зуд, дерматит и переносить паразитов. Регулярная профилактика снижает риск заражения.',
  },
  {
    slug: 'deworming',
    title: 'Дегельминтизация',
    group: 'prevention_and_health',
    category: 'vet_warning_signs',
    summary:
      'Профилактика гельминтов зависит от возраста, питания, прогулок и контакта с другими животными.',
  },
  {
    slug: 'planned-vet-visit',
    title: 'Плановый осмотр у ветеринара',
    group: 'prevention_and_health',
    category: 'vet_warning_signs',
    summary:
      'Плановые осмотры помогают заметить изменения раньше, чем они станут выраженной проблемой.',
  },
  {
    slug: 'sterilization',
    title: 'Стерилизация',
    group: 'prevention_and_health',
    category: 'vet_warning_signs',
    summary:
      'Стерилизация — хирургическое решение, которое обсуждают с врачом с учётом возраста, здоровья и репродуктивных планов.',
  },
  {
    slug: 'sterilization-timing',
    title: 'Когда лучше стерилизовать собаку',
    group: 'prevention_and_health',
    category: 'vet_warning_signs',
    summary:
      'Оптимальный срок стерилизации зависит от породы, возраста, состояния здоровья и индивидуальных рисков.',
  },
  {
    slug: 'sterilization-myths',
    title: 'Мифы о стерилизации',
    group: 'prevention_and_health',
    category: 'vet_warning_signs',
    summary:
      'Вокруг стерилизации много мифов. Решение лучше принимать на основе медицинских факторов, а не общих советов.',
  },
  {
    slug: 'heat-duration-faq',
    title: 'Сколько длится течка',
    group: 'faq',
    category: 'proestrus',
    summary:
      'У многих собак видимая течка длится около 2–4 недель, но индивидуальные сроки могут отличаться.',
  },
  {
    slug: 'walking-during-heat',
    title: 'Можно ли гулять во время течки',
    group: 'faq',
    category: 'estrus',
    summary:
      'Гулять можно, но важно избегать контакта с кобелями, выбирать спокойные маршруты и внимательно следить за собакой.',
  },
  {
    slug: 'activity-changes',
    title: 'Почему изменилась активность',
    group: 'faq',
    category: 'proestrus',
    summary:
      'Активность может меняться из-за гормональных процессов, дискомфорта, стресса или сопутствующих проблем со здоровьем.',
  },
  {
    slug: 'delayed-heat',
    title: 'Почему задерживается течка',
    group: 'faq',
    category: 'vet_warning_signs',
    summary:
      'Задержка может быть вариантом нормы, но также связана со стрессом, возрастом, весом, болезнями или гормональными нарушениями.',
  },
  {
    slug: 'vet-after-heat',
    title: 'Нужно ли обращаться к врачу после течки',
    group: 'faq',
    category: 'vet_warning_signs',
    summary:
      'Если собака чувствует себя хорошо, срочный визит может быть не нужен. Но тревожные симптомы после течки требуют консультации.',
  },
];

const obsoleteKnowledgeArticleSlugs = [
  'frequent-questions',
  'vet_warning_signs',
  'false_pregnancy',
];
const obsoleteKnowledgeArticleGroups = ['pregnancy_and_breeding', 'health_diary'];
const obsoleteKnowledgeArticleTitles = ['Когда обращаться к ветеринару'];

function toEnglishTemplate(article: ArticleTemplate): ArticleTemplate {
  return {
    ...article,
    title: article.title,
    summary:
      'This topic explains the key points in simple language and helps you decide what to track in Dog Health Assistant.',
  };
}

const englishTitleBySlug: Record<string, string> = {
  'what-is-heat': 'What Is Heat',
  'first-heat': 'First Heat',
  'cycle-phases': 'Cycle Phases',
  proestrus: 'Proestrus',
  estrus: 'Estrus',
  diestrus: 'Diestrus',
  anestrus: 'Anestrus',
  'ovulation-and-fertility': 'Ovulation and Fertile Period',
  'heat-behavior': 'Behavior During Heat',
  'heat-care': 'Care During Heat',
  'heat-hygiene': 'Hygiene During Heat',
  'bathing-during-heat': 'Can You Bathe a Dog During Heat',
  'normal-cycle-signs': 'How to Tell the Cycle Looks Normal',
  'urgent-vet': 'When a Veterinarian Is Needed Urgently',
  'discharge-warning-signs': 'Discharge: Normal and Warning Signs',
  pyometra: 'Pyometra',
  'cycle-disorders': 'Cycle Disorders',
  fever: 'Fever',
  'food-water-refusal': 'Refusing Food and Water',
  'red-flags-after-heat': 'Red Flags After Heat',
  vaccination: 'Vaccination',
  'tick-treatment': 'Tick Treatment',
  'flea-treatment': 'Flea Treatment',
  deworming: 'Deworming',
  'planned-vet-visit': 'Routine Vet Visit',
  sterilization: 'Sterilization',
  'sterilization-timing': 'When to Sterilize a Dog',
  'sterilization-myths': 'Sterilization Myths',
  'heat-duration-faq': 'How Long Heat Lasts',
  'walking-during-heat': 'Can You Walk During Heat',
  'activity-changes': 'Why Activity Changes',
  'delayed-heat': 'Why Heat Is Delayed',
  'vet-after-heat': 'Do You Need a Vet After Heat',
};

const articles: SeedKnowledgeArticle[] = [
  ...russianTemplates.map((article) => ({
    ...article,
    locale: 'ru' as const,
    content: article.summary,
  })),
  ...russianTemplates.map((article) => {
    const englishArticle = toEnglishTemplate(article);

    return {
      ...englishArticle,
      title: englishTitleBySlug[article.slug] ?? article.title,
      locale: 'en' as const,
      content: englishArticle.summary,
    };
  }),
];

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required.');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});
const prisma = new PrismaClient({
  adapter,
});

async function seedKnowledgeArticles(): Promise<void> {
  await prisma.knowledgeArticle.deleteMany({
    where: {
      OR: [
        {
          slug: {
            in: obsoleteKnowledgeArticleSlugs,
          },
        },
        {
          group: {
            in: obsoleteKnowledgeArticleGroups,
          },
        },
        {
          title: {
            in: obsoleteKnowledgeArticleTitles,
          },
        },
        {
          content: {
            contains: 'Обратитесь к ветеринару как можно скорее',
          },
        },
      ],
    },
  });

  for (const article of articles) {
    await prisma.knowledgeArticle.upsert({
      where: {
        slug_locale: {
          slug: article.slug,
          locale: article.locale,
        },
      },
      create: {
        slug: article.slug,
        title: article.title,
        group: article.group,
        category: article.category,
        locale: article.locale,
        content: article.content,
      },
      update: {
        title: article.title,
        group: article.group,
        category: article.category,
        content: article.content,
      },
    });
  }
}

async function main(): Promise<void> {
  try {
    await seedKnowledgeArticles();
    console.log(`Seeded ${articles.length} knowledge articles.`);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
