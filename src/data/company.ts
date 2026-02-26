export const COMPANY = {
  name: "Техосмотр Брянск",
  legalName: 'ООО "Людмила-плюс"',
  inn: "3250526835",
  ogrn: "1113256019250",
  phone: "+7 4832 30-00-18",
  phoneRaw: "+74832300018",
  whatsapp: "+79066985753",
  whatsappLink: "https://web.whatsapp.com/send?phone=79066985753&text=",
  address: "г. Брянск, Большое Полпино, ул. Лермонтова, 1Б",
  mapLink: "https://yandex.ru/maps/?text=Брянск+Большое+Полпино+Лермонтова+1Б",
  experience: "более 8 лет",
  description:
    "Наш пункт техосмотра работает в Брянске и Брянской области уже более 8-и лет. Мы делаем официальный техосмотр для получения диагностических карт для страхования ОСАГО.",
  schedule: {
    weekdays: "Пн – Пт: 09:00 – 18:00",
    saturday: "Сб: 09:00 – 15:00",
    sunday: "Вс: выходной",
  },
  busSchedule: {
    title: "Проведение ТО транспортных средств М2 и М3 совместно с ГИБДД",
    days: [
      { day: "Понедельник", time: "выходной" },
      { day: "Вторник", time: "08:00 – 18:00" },
      { day: "Среда", time: "08:00 – 18:00" },
      { day: "Четверг", time: "08:00 – 18:00" },
      { day: "Пятница", time: "08:00 – 18:00" },
      { day: "Суббота", time: "08:00 – 18:00" },
      { day: "Воскресенье", time: "выходной" },
    ],
  },
  payment: "Оплата: в кассе ТО и по реквизитам",
  documents: [
    {
      title: 'Федеральный закон "О техническом осмотре транспортных средств"',
      url: "https://tehosmotr32.ru/wp-content/uploads/2025/02/fz170.pdf",
      shortTitle: "ФЗ-170",
    },
    {
      title: "Правила проведения технического осмотра транспортных средств",
      url: "https://tehosmotr32.ru/wp-content/uploads/2025/02/pp1008.pdf",
      shortTitle: "ПП-1008",
    },
    {
      title: "Типовая форма договора о проведении технического осмотра",
      url: "https://tehosmotr32.ru/wp-content/uploads/2025/02/dog.pdf",
      shortTitle: "Договор",
    },
    {
      title: "Прейскурант цен на 2025 год",
      url: "https://tehosmotr32.ru/wp-content/uploads/2025/02/preyskurant-tsen-na-2025.pdf",
      shortTitle: "Прейскурант 2025",
    },
  ],
} as const;
