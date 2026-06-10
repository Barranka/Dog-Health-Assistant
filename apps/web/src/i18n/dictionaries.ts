export type Locale = 'ru' | 'en';

export const dictionaries = {
  ru: {
    app: {
      name: 'Dog Health Assistant',
      modeTelegram: 'Telegram',
      modePreview: 'Предпросмотр',
      notifications: 'Уведомления',
      settings: 'Настройки',
      language: 'Язык',
      mode: 'Режим',
      theme: 'Тема',
      received: 'Получены',
      notReceived: 'Нет',
      browserPreview: 'Предпросмотр в браузере',
    },
    common: {
      add: 'Добавить',
      addDog: 'Добавить собаку',
      calendar: 'Календарь',
    },
    navigation: {
      home: 'Главная',
      dogs: 'Собаки',
      calendar: 'Календарь',
      health: 'Здоровье',
      knowledge: 'База',
      heatCycles: 'Течки',
      symptoms: 'Симптомы',
      settings: 'Настройки',
    },
    topBar: {
      defaultOwner: 'Владелец',
    },
    home: {
      heatCycle: 'Течка',
      healthEvent: 'Событие',
      symptoms: 'Симптомы',
      activeDog: 'Активная собака',
      noActiveDog: 'Пока не выбрана',
      addPetDescription:
        'Добавьте питомца, чтобы вести календарь здоровья и прогнозировать важные события.',
      quickActions: 'Быстрые действия',
      nextEvent: 'Ближайшее событие',
      noScheduledEvents: 'Нет запланированных событий',
      scheduledEventsDescription:
        'Здесь появятся вакцинации, осмотры, обработки и прогнозируемые течки.',
    },
    dogs: {
      title: 'Мои собаки',
      emptyTitle: 'Питомцы пока не добавлены',
      emptyDescription:
        'Карточка собаки будет включать имя, породу, пол, дату рождения, вес, окрас, стерилизацию и заметки.',
    },
    heatCycles: {
      title: 'Течки',
      emptyTitle: 'История циклов появится здесь',
      emptyDescription:
        'Следующий этап CRUD течек добавит даты начала, окончания, длительность и комментарии.',
    },
    calendar: {
      title: 'Календарь',
      emptyTitle: 'Единый календарь здоровья',
      emptyDescription:
        'Здесь будут течки, прогнозы, вакцинации, обработки, осмотры и пользовательские заметки.',
    },
    healthPage: {
      title: 'Здоровье',
      addRecord: 'Запись',
      emptyTitle: 'Медицинские события',
      emptyDescription:
        'Вакцинации, ревакцинации, дегельминтизация, обработки и осмотры будут доступны после API этапов.',
    },
    symptoms: {
      title: 'Анализ симптомов',
      descriptionLabel: 'Описание симптомов',
      placeholder: 'Опишите состояние собаки',
      submit: 'Подготовить анализ',
    },
    knowledge: {
      title: 'База знаний',
      proestrus: 'Проэструс',
      estrus: 'Эструс',
      diestrus: 'Диэструс',
      falsePregnancy: 'Ложная беременность',
      vetWarningSigns: 'Когда обращаться к ветеринару',
    },
    desktop: {
      workspace: 'Рабочее пространство',
      mainNavigation: 'Основная навигация',
      webMode: 'Web App режим',
      webModeDescription: 'Расширенная навигация для браузера и больших экранов.',
    },
  },
  en: {
    app: {
      name: 'Dog Health Assistant',
      modeTelegram: 'Telegram',
      modePreview: 'Preview',
      notifications: 'Notifications',
      settings: 'Settings',
      language: 'Language',
      mode: 'Mode',
      theme: 'Theme',
      received: 'Received',
      notReceived: 'No',
      browserPreview: 'Browser preview',
    },
    common: {
      add: 'Add',
      addDog: 'Add dog',
      calendar: 'Calendar',
    },
    navigation: {
      home: 'Home',
      dogs: 'Dogs',
      calendar: 'Calendar',
      health: 'Health',
      knowledge: 'Knowledge',
      heatCycles: 'Heat cycles',
      symptoms: 'Symptoms',
      settings: 'Settings',
    },
    topBar: {
      defaultOwner: 'Owner',
    },
    home: {
      heatCycle: 'Heat cycle',
      healthEvent: 'Event',
      symptoms: 'Symptoms',
      activeDog: 'Active dog',
      noActiveDog: 'Not selected yet',
      addPetDescription: 'Add a pet to keep a health calendar and forecast important events.',
      quickActions: 'Quick actions',
      nextEvent: 'Next event',
      noScheduledEvents: 'No scheduled events',
      scheduledEventsDescription:
        'Vaccinations, vet visits, treatments and predicted heat cycles will appear here.',
    },
    dogs: {
      title: 'My dogs',
      emptyTitle: 'No pets added yet',
      emptyDescription:
        'The dog profile will include name, breed, sex, birth date, weight, color, sterilization status and notes.',
    },
    heatCycles: {
      title: 'Heat cycles',
      emptyTitle: 'Cycle history will appear here',
      emptyDescription:
        'The heat cycle CRUD stage will add start date, end date, duration and comments.',
    },
    calendar: {
      title: 'Calendar',
      emptyTitle: 'Unified health calendar',
      emptyDescription:
        'Heat cycles, forecasts, vaccinations, treatments, vet visits and user notes will appear here.',
    },
    healthPage: {
      title: 'Health',
      addRecord: 'Record',
      emptyTitle: 'Medical events',
      emptyDescription:
        'Vaccinations, revaccinations, deworming, treatments and vet visits will be available after the API stages.',
    },
    symptoms: {
      title: 'Symptom analysis',
      descriptionLabel: 'Symptom description',
      placeholder: 'Describe your dog condition',
      submit: 'Prepare analysis',
    },
    knowledge: {
      title: 'Knowledge base',
      proestrus: 'Proestrus',
      estrus: 'Estrus',
      diestrus: 'Diestrus',
      falsePregnancy: 'False pregnancy',
      vetWarningSigns: 'When to contact a veterinarian',
    },
    desktop: {
      workspace: 'Workspace',
      mainNavigation: 'Main navigation',
      webMode: 'Web App mode',
      webModeDescription: 'Expanded navigation for browsers and larger screens.',
    },
  },
} as const;

type Dictionary = typeof dictionaries.ru;

export type TranslationKey = {
  [Section in keyof Dictionary]: {
    [Key in keyof Dictionary[Section]]: `${Section & string}.${Key & string}`;
  }[keyof Dictionary[Section]];
}[keyof Dictionary];
