"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import Image from "next/image";
import { Logo } from "@/components/ui/Logo";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/pixelplay_mogilev",
    icon: <Image src="/instagram.svg" alt="Instagram" width={20} height={20} className="h-5 w-5 object-contain invert opacity-70 group-hover:opacity-100" />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@pixelplay_mogilev",
    icon: <Image src="/tiktok.svg" alt="TikTok" width={20} height={20} className="h-5 w-5 object-contain invert opacity-70 group-hover:opacity-100" />,
  },
  {
    label: "Telegram",
    href: "https://t.me/pixelplay_mogilev",
    icon: <Image src="/telegram.svg" alt="Telegram" width={20} height={20} className="h-5 w-5 object-contain invert opacity-70 group-hover:opacity-100" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@PixelPlayClub",
    icon: <Image src="/youtube.svg" alt="YouTube" width={20} height={20} className="h-5 w-5 object-contain invert opacity-70 group-hover:opacity-100" />,
  },
];

const TABS = [
  { id: "partners", label: "Наши партнёры" },
  { id: "award", label: "Награда BGA" },
  { id: "services", label: "Услуги" },
  { id: "cases", label: "Кейсы" },
  { id: "contacts", label: "Контакты" },
];

const PARTNERS = [
  {
    img: "/partner1.png",
    name: "Белорусская Ассоциация Компьютерного спорта",
    link: "https://www.instagram.com/belarus_esports_association/",
    desc: "Развитие киберспорта в Беларуси",
  },
  {
    img: "/partner2.png",
    name: "Белорусская Федерация Киберспорта",
    link: "https://cybersport.by/",
    desc: "Киберспортивная лига Беларуси",
  },
  {
    img: "/partner3.png",
    name: "Belarusian Esports League",
    link: "https://t.me/bel_cs2",
    desc: "Первая национальная лига",
  },
  {
    img: "/partner4.png",
    name: "Ardor Gaming",
    link: "https://ardor-gaming.com/",
    desc: "Компьютерные девайсы",
  },
  {
    img: "/partner5.png",
    name: "Kingstyle",
    link: "https://kingstyle.by/kresla/filter/manufacture-is-brave/",
    desc: "Компьютерные Кресла",
  },
  {
    img: "/partner6.png",
    name: "Gorilla Game League",
    link: "https://cybergorilla.by",
    desc: "Gorilla Game League",
  },
];

const SERVICES = [
  // Маркетинговые
  {
    category: "Маркетинговые",
    title: "Маркетинговый запуск под открытие клуба с нуля",
    desc: "Стратегия продвижения, оформление площадок, реклама и сбор первой активной аудитории в первые дни работы",
  },
  {
    category: "Маркетинговые",
    title: "Комплексный SMM для компьютерного клуба",
    desc: "Ведение сообщества под ключ: контент, оформление страницы, вовлечённость и привлечение клиентов из ЦА",
  },
  {
    category: "Маркетинговые",
    title: "Комплексное продвижение Telegram",
    desc: "Контент, оформление канала, подача и система, которая удерживает подписчиков и приводит новых",
  },
  {
    category: "Маркетинговые",
    title: "Оптимизация геосервисов и настройка рекламы в Яндекс. Бизнес",
    desc: "Карточка клуба в Яндекс. Бизнес, видимость в поиске и на картах, локальное продвижение клиентов рядом с вами",
  },
  {
    category: "Маркетинговые",
    title: "Настройка таргетированной рекламы",
    desc: "Подбор аудиторий, креативы и кампании, которые привлекают реальные заявки, а не просто клики",
  },
  {
    category: "Маркетинговые",
    title: "Бонусы от партнеров PIXEL",
    desc: "Партнёрские предложения и бонусы для ваших клиентов — увеличение ценности клуба и выделение среди конкурентов",
  },
  {
    category: "Маркетинговые",
    title: "Настройка геймификации и сбор автоворонки в рассылке",
    desc: "Механики вовлечения, автоворонки, розыгрыши и сценарии, чтобы не терять клиентов после первого контакта",
  },
  // Дизайн
  {
    category: "Дизайн",
    title: "Разработка логотипа и логобука",
    desc: "Логотип и базовый логобук: стиль, цвета и правила использования, чтобы бренд выглядел цельно",
  },
  {
    category: "Дизайн",
    title: "Дизайн презентаций",
    desc: "Презентации для партнёров, инвесторов или внутренних задач: чёткая структура и аккуратная подача",
  },
  {
    category: "Дизайн",
    title: "Разработка фирменного стиля",
    desc: "Единый визуальный стиль: цвета, шрифты, графика и правила использования во всех точках контакта",
  },
  {
    category: "Дизайн",
    title: "Отрисовка стикеров для VK и Telegram",
    desc: "Идеи, персонажи и набор стикеров под стиль клуба, которые реально будут использовать",
  },
  {
    category: "Дизайн",
    title: "Дизайн упаковки сообщества в ВК",
    desc: "Сообщество ВКонтакте под ключ: обложки, баннеры, визуальный стиль и структура",
  },
  {
    category: "Дизайн",
    title: "Дизайн кружек",
    desc: "Дизайн мерча для продаж, подарков или внутреннего использования — такой, который хочется оставить",
  },
  {
    category: "Дизайн",
    title: "Оформление программного обеспечения для компьютерного клуба",
    desc: "Дизайн интерфейсов и экранов клуба: современно, понятно для гостей, усиливает впечатление",
  },
  {
    category: "Дизайн",
    title: "Дизайн листовок, тейблтентов, демонстрационных мониторов",
    desc: "Рекламные материалы от листовок до экранов в зале — привлекают внимание без лишнего шума",
  },
  {
    category: "Дизайн",
    title: "Разработка сайта",
    desc: "Сайт клуба с акцентом на бронирование, услуги и привлечение клиентов, адаптация под мобильные",
  },
  // Организация турниров и трансляций
  {
    category: "Организация турниров и трансляций",
    title: "Упаковка трансляции на турнир",
    desc: "Экран ожидания, оверлеи, донаты, титры и визуальный стиль — трансляция выглядит как продукт",
  },
  {
    category: "Организация турниров и трансляций",
    title: "Организация турнира",
    desc: "Турнир под ключ: концепция, регламент, продвижение, партнёры и привлечение участников",
  },
  {
    category: "Организация турниров и трансляций",
    title: "Организация трансляции",
    desc: "Визуальная упаковка, экраны, оверлеи и подача — трансляция выглядит профессионально",
  },
  // Консалтинговые
  {
    category: "Консалтинговые",
    title: "Консалтинг, анализ рынка и разработка стратегии",
    desc: "Изучение клуба, конкурентов и рынка, точки роста и понятная стратегия развития",
  },
  {
    category: "Консалтинговые",
    title: "Консультация и аудит маркетинговых каналов",
    desc: "Аудит рекламных площадок и соцсетей: слабые места, точки роста и конкретные рекомендации",
  },
  {
    category: "Консалтинговые",
    title: "Тайный гость",
    desc: "Проверка клуба под видом обычного клиента: оценка сервиса и конкретные рекомендации",
  },
  // Дополнительные
  {
    category: "Дополнительные",
    title: "Интеграция брендов в компьютерные клубы",
    desc: "Формат интеграции, подбор площадок и реализация проектов, которые привлекают внимание и запоминаются",
  },
];

const CATEGORY_FILTERS = ["Все", "Маркетинговые", "Дизайн", "Дополнительные", "Консалтинговые", "Организация турниров и трансляций"];

type CaseSection = { heading: string; paragraphs: string[]; highlight?: boolean };

const CASES: { title: string; image: string; sections: CaseSection[] }[] = [
  {
    title: "Кибер-вызов от «Белтелеком» ко Дню Победы",
    image: "/case1-3.png",
    sections: [
      {
        heading: "Кратко о проекте",
        paragraphs: [
          "«Белтелеком» провёл киберспортивную активность для молодёжи в формате открытого мероприятия по игре War Thunder. Событие прошло 8 мая с 14:00 до 20:00 возле Дворца культуры области.",
          "Мероприятие было приурочено к 80-летию Победы советского народа в Великой Отечественной войне. Формат объединил игровую механику, соревновательный интерес и памятную дату, важную для нескольких поколений.",
        ],
      },
      {
        heading: "Задача",
        paragraphs: [
          "Задача мероприятия — вовлечь молодёжь в тематическое событие через понятный и современный формат. Вместо стандартной официальной программы участникам предложили интерактивную активность, где можно было сыграть, посоревноваться и провести время в живой атмосфере.",
          "Такой подход помогает говорить с молодой аудиторией на привычном для неё языке, не теряя уважительного отношения к историческому контексту.",
        ],
      },
      {
        heading: "Что было проведено",
        paragraphs: [
          "В рамках мероприятия прошли кибер-баталии по игре War Thunder. Участники могли попробовать свои силы в игровом формате, побороться за результат и получить эмоции от соревновательного процесса.",
          "Место проведения было выбрано открытым и доступным — возле Дворца культуры области. Время проведения с 14:00 до 20:00 позволило сделать событие удобным для посещения в течение дня.",
          "Военная форма одежды приветствовалась, что дополнительно поддерживало связь мероприятия с памятной датой.",
        ],
      },
      {
        heading: "Награждение",
        paragraphs: [
          "Для участников были предусмотрены призы от «Белтелеком» и сюрпризы от ОАО «Могилев Аттракционы». Это добавило мероприятию соревновательную мотивацию и сделало участие более запоминающимся.",
        ],
      },
      {
        heading: "Почему такой формат работает для компаний",
        paragraphs: [
          "Киберспортивный формат хорошо подходит для работы с молодой аудиторией. Он не требует сложного входа, быстро вовлекает участников и создаёт понятный соревновательный сценарий.",
          "Для компаний и организаций такие мероприятия полезны сразу по нескольким причинам: они усиливают контакт с аудиторией, создают живое участие, дают положительные эмоции и помогают развивать современный формат корпоративных и общественных событий.",
          "В случае с памятной датой такой подход особенно важен. Он позволяет соединить историческую тему с интерактивным форматом, который ближе молодому поколению.",
        ],
      },
      {
        heading: "Результат",
        highlight: true,
        paragraphs: [
          "Мероприятие стало примером того, как киберспортивный формат можно использовать не только для развлечения, но и для тематических городских событий. Участники получили возможность сыграть, посоревноваться и провести время в необычном формате, а организаторы — живой инструмент вовлечения молодёжи.",
          "Такой формат можно адаптировать под корпоративные мероприятия, городские события, профсоюзные активности и специальные проекты для молодёжной аудитории.",
        ],
      },
    ],
  },
  {
    title: "Корпоративный турнир ОАО «Зенит» по Counter-Strike 2",
    image: "/case1-2.png",
    sections: [
      {
        heading: "Кратко о проекте",
        paragraphs: [
          "18 апреля 2026 года в компьютерном клубе Pixel в Могилёве прошёл корпоративный турнир ОАО «Зенит» по киберспортивной дисциплине Counter-Strike 2.",
          "Киберспорт в последние годы набирает всё большую популярность, и корпоративный формат турнира стал для участников возможностью проявить себя не только как игроков, но и как команду.",
          "В соревновании приняли участие работники различных структурных подразделений предприятия. Турнир прошёл в дружеской атмосфере и позволил участникам показать навыки тактического командного взаимодействия, соревновательный дух и умение действовать вместе.",
        ],
      },
      {
        heading: "Задача",
        paragraphs: [
          "Организовать киберспортивное мероприятие для сотрудников ОАО «Зенит» на базе компьютерного клуба Pixel.",
          "Главная цель проекта — создать живой и вовлекающий формат корпоративного турнира, где участники могут соревноваться между собой, раскрывать свои способности и взаимодействовать вне привычных рабочих задач.",
        ],
      },
      {
        heading: "Что было проведено",
        paragraphs: [
          "В рамках мероприятия был проведён турнир по Counter-Strike 2 для работников ОАО «Зенит».",
          "Pixel предоставил площадку, игровые места и технические условия для проведения соревнования. Участники играли в клубной атмосфере, где всё было подготовлено под командный формат: игровые зоны, оборудование и пространство для проведения корпоративного события.",
          "Турнир получился насыщенным: были победы, поражения, напряжённые противостояния и множество ярких игровых моментов.",
          "По словам участников, турнир выдался интересным, качественным и впечатляющим. В играх было много борьбы, командных решений и захватывающих моментов, которые сделали мероприятие запоминающимся.",
        ],
      },
      {
        heading: "Итоги турнира",
        paragraphs: [
          "По итогам упорной борьбы места распределились следующим образом:",
          "1 место — команда «Чертёжники» (ОГК). 2 место — команда «Алексеевская застава» (ОГК). 3 место — команда «Head shot takers» (сборная МЗЦ, СКЦ, ЭМЦ).",
        ],
      },
      {
        heading: "Награждение",
        paragraphs: [
          "Награждение победителей турнира провёл председатель первичной профсоюзной организации Николай Табунов.",
          "Победители получили дипломы, медали и памятные призы. Все участники проявили себя в соревновании и получили опыт командной игры в формате корпоративного киберспортивного мероприятия.",
        ],
      },
      {
        heading: "Почему такой формат работает для компаний",
        paragraphs: [
          "Корпоративный турнир помогает сотрудникам взаимодействовать в другой обстановке. Это не стандартное собрание, банкет или формальное мероприятие, а живой формат с вовлечением участников.",
          "Киберспортивный формат даёт компании сразу несколько преимуществ: сотрудники включаются в командную игру; подразделения взаимодействуют между собой не только по рабочим задачам; мероприятие легко адаптировать под разные компании и количество участников; формат хорошо подходит для внутренних активностей, тимбилдинга и развития корпоративной культуры.",
        ],
      },
      {
        heading: "Результат",
        highlight: true,
        paragraphs: [
          "Корпоративный турнир ОАО «Зенит» по Counter-Strike 2 прошёл в компьютерном клубе Pixel в Могилёве по адресу: ул. Мовчанского, 53Б-1.",
          "Участники получили яркий соревновательный опыт, а предприятие — готовый формат внутреннего мероприятия, который помогает сплотить коллектив, раскрыть командные качества и сделать корпоративное событие более живым и запоминающимся.",
        ],
      },
    ],
  },
  {
    title: "Первый кибертурнир по Counter-Strike 2 для сотрудников",
    image: "/case2.png",
    sections: [
      {
        heading: "Кратко о проекте",
        paragraphs: [
          "В компьютерном клубе Pixel состоялся первый кибертурнир по Counter-Strike 2 для коллег. На один день площадка стала местом для командных матчей, живого соперничества и неформального общения между участниками.",
          "Турнир прошёл в формате командной игры. Участники соревновались в CS2, где важны не только личные навыки, но и коммуникация, распределение ролей, реакция и умение действовать вместе.",
        ],
      },
      {
        heading: "Задача",
        paragraphs: [
          "Главная задача мероприятия — объединить коллег через нестандартный корпоративный формат. Кибертурнир позволил участникам выйти за рамки обычного рабочего взаимодействия, проявить командный дух и получить общий эмоциональный опыт.",
          "Такой формат хорошо подходит для компаний, которым важно развивать внутренние связи между сотрудниками и делать корпоративные события более живыми.",
        ],
      },
      {
        heading: "Что было проведено",
        paragraphs: [
          "В Pixel был организован турнир по Counter-Strike 2. Участники играли командами, соревновались за призовые места и определяли сильнейших по итогам матчей.",
          "Формат турнира создал рабочую, но при этом эмоциональную атмосферу: азарт, командная поддержка, соревновательный настрой и вовлечённость участников. Для корпоративного мероприятия это особенно важно, потому что люди включаются не формально, а через понятную игровую задачу.",
        ],
      },
      {
        heading: "Итоги турнира",
        paragraphs: [
          "По итогам турнира был отмечен лучший игрок — Артём Сергеевич. Мероприятие прошло в командном формате, где участники соревновались в Counter-Strike 2, проявляли личные навыки, взаимодействовали внутри команд и поддерживали общий соревновательный настрой.",
        ],
      },
      {
        heading: "Почему такой формат работает для компаний",
        paragraphs: [
          "Кибертурнир — это понятный и вовлекающий формат для корпоративного мероприятия. Он помогает сотрудникам взаимодействовать не через формальные активности, а через командную игру, где сразу видны коммуникация, поддержка и общая цель.",
          "Для компании такой формат даёт несколько важных эффектов: участники лучше узнают друг друга вне рабочей обстановки; команды учатся быстро договариваться и распределять роли; событие создаёт эмоции, которые запоминаются сильнее обычного корпоративного формата; соревновательный элемент повышает вовлечённость; мероприятие можно повторять и адаптировать под разные команды, отделы и задачи.",
        ],
      },
      {
        heading: "Результат",
        highlight: true,
        paragraphs: [
          "Первый кибертурнир по Counter-Strike 2 показал, что формат хорошо подходит для корпоративных событий. Участники получили живые эмоции, опыт командного взаимодействия и повод для неформального общения.",
          "Для компании это стало примером того, как киберспорт можно использовать не только как развлечение, но и как инструмент для укрепления коллектива. Такой формат можно повторять, расширять и адаптировать под внутренние турниры, корпоративные встречи и командные мероприятия.",
        ],
      },
    ],
  },
];

const brandVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState("partners");
  const [filter, setFilter] = useState("Все");
  const [showModal, setShowModal] = useState(false);
  const [caseSlide, setCaseSlide] = useState(0);
  const [activeCase, setActiveCase] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalTriggerRef = useRef<HTMLElement | null>(null);
  const closeModal = useCallback(() => {
    setShowModal(false);
    window.setTimeout(() => modalTriggerRef.current?.focus(), 0);
  }, []);
  const openModal = useCallback((event: React.MouseEvent<HTMLElement>) => {
    modalTriggerRef.current = event.currentTarget;
    setShowModal(true);
  }, []);

  useEffect(() => {
    if (!showModal) return;

    modalRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal, closeModal]);

  const filteredServices =
    filter === "Все"
      ? SERVICES
      : SERVICES.filter((s) => s.category === filter);

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative min-h-screen">
      {/* Фоновые слои: градиент + сетка + свечения (белый/оранжевый/синий) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#1a1f3d_0%,#101322_40%,#0a0a0f_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,140,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(120,140,255,0.10) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)",
          }}
        />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/[0.13] blur-[130px]" />
        <div className="absolute left-[-8%] top-[35%] h-[380px] w-[520px] rounded-full bg-brand/[0.08] blur-[130px]" />
        <div className="absolute right-[-8%] top-[45%] h-[380px] w-[520px] rounded-full bg-brand/[0.08] blur-[130px]" />
        <div className="absolute bottom-[-10%] left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-white/[0.045] blur-[130px]" />
      </div>
      {/* Хедер */}
      <header className="fixed inset-x-0 top-0 z-50 bg-void/85 backdrop-blur-md border-b border-brand/15">
        <div className="relative flex h-20 items-center justify-between px-4 md:px-8">
          <Logo size={120} href="/" className="shrink-0" />

          {/* Табы — по центру, в уровень с логотипом */}
          <nav aria-label="Разделы партнёрства" role="tablist" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`partner-panel-${tab.id}`}
                className={`relative overflow-hidden whitespace-nowrap rounded-md border px-3 py-2 text-xs uppercase tracking-[0.15em] transition-all ${
                  activeTab === tab.id
                    ? "border-brand/70 bg-gradient-to-b from-brand/40 to-brand/15 text-brand shadow-[0_0_16px_rgba(255,106,0,0.35)]"
                    : "border-white/10 bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-brand/[0.06] text-white/80 hover:border-brand/40 hover:from-brand/20 hover:to-brand/[0.08] hover:text-white hover:shadow-[0_0_14px_rgba(255,106,0,0.2)]"
                }`}
              >
                {/* Блик сверху */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex h-full items-center gap-5">
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="group flex h-10 w-10 items-center justify-center transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <a
              href="https://t.me/pixelplay_mogilev"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-button !px-5 !py-2"
            >
              Связаться
            </a>
          </div>
        </div>
      </header>

      {/* Контент */}
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8">
        {/* Табы для узких экранов */}
        <div aria-label="Разделы партнёрства" role="tablist" className="mb-10 flex flex-wrap gap-2 lg:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`partner-panel-${tab.id}`}
              className={`relative overflow-hidden rounded-md border px-4 py-2 text-sm uppercase tracking-[0.15em] transition-all ${
                activeTab === tab.id
                  ? "border-brand/70 bg-gradient-to-b from-brand/40 to-brand/15 text-brand shadow-[0_0_16px_rgba(255,106,0,0.35)]"
                  : "border-white/10 bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-brand/[0.06] text-white/80 hover:border-brand/40 hover:from-brand/20 hover:to-brand/[0.08] hover:text-white"
              }`}
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* === НАШИ ПАРТНЁРЫ === */}
          {activeTab === "partners" && (
            <motion.div
              id="partner-panel-partners"
              role="tabpanel"
              key="partners"
              variants={brandVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Заголовок */}
              <div className="mb-6 text-center">
                <h1 className="text-4xl font-bold text-white md:text-5xl">
                  Наши <span className="text-brand">Партнёры</span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">
                  Мы сотрудничаем с ведущими компаниями и организациями в сфере киберспорта,
                  технологий и развлечений. Наши партнёры разделяют нашу страсть к индустрии
                  и вместе с нами создают будущее гейминга в Беларуси.
                </p>
              </div>

              {/* Логотипы партнёров */}
              <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6">
                {PARTNERS.map((p, i) => (
                  <motion.div
                    id="partner-panel-award"
                    role="tabpanel"
                    key={i}
                    className="group flex flex-col items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex h-52 w-full overflow-hidden rounded-xl bg-black border border-white/10 transition-all duration-500 group-hover:border-brand/40 group-hover:shadow-[0_0_35px_rgba(255,106,0,0.15)]"
                    >
                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 16vw, 240px"
                        className="h-full w-full object-contain transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      />
                    </motion.a>
                    <span className="text-center text-sm font-semibold tracking-wide text-white/70 transition-all group-hover:text-white">
                      {p.name}
                    </span>
                    <span className="h-px w-8 rounded-full bg-brand/30 transition-all duration-500 group-hover:w-14 group-hover:bg-brand/70" />
                  </motion.div>
                ))}
              </div>

              {/* PIXEL ДЛЯ ВАШЕГО БРЕНДА */}
              <motion.div
                id="partner-panel-services"
                role="tabpanel"
                variants={brandVariant}
                className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12"
              >
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  PIXEL ДЛЯ ВАШЕГО <span className="text-brand">БРЕНДА</span>
                </h2>
                <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-center">
                  <div className="space-y-4 text-white/70">
                    <p>
                      Мы помогаем брендам заходить в киберспорт без случайных решений и пустых интеграций.
                      Находим нужную аудиторию, продумываем формат сотрудничества и собираем коллаборации,
                      которые действительно запоминаются и работают на результат.
                    </p>
                    <p>
                      У нас есть опыт работы с разными брендами в рамках киберспортивных интеграций,
                      поэтому мы понимаем специфику индустрии, её аудиторию и то, как выстраивать
                      партнерства с пользой для бизнеса.
                    </p>
                    <p>
                      Сотрудничая с нами, вы получаете партнёра, который разбирается в гейминге и киберспорте,
                      умеет работать на результат и доводить задачи до нужного итога.
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <Image
                      src="/PixelPart.png"
                      alt="Pixel Partnership"
                      width={1024}
                      height={1024}
                      className="h-full max-h-[480px] w-full max-w-md rounded-xl object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* === НАГРАДА BGA === */}
          {activeTab === "award" && (
            <motion.div
              id="partner-panel-cases"
              role="tabpanel"
              key="award"
              variants={brandVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mx-auto max-w-4xl"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
                <Image
                  src="/BGA.jpg"
                  alt="The Belarusian Gaming Awards"
                  width={1200}
                  height={768}
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="mb-8 w-full rounded-xl object-cover"
                />
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  PIXEL удостоен награды на премии{" "}
                  <span className="text-brand">The Belarusian Gaming Awards</span>
                </h1>
                <p className="mt-4 text-white/70">
                  На премии The Belarusian Gaming Awards в Минске Pixel Play стал победителем
                  в номинации «Центр киберспортивного взаимодействия» («Белтелеком»). Это не просто
                  клуб, а площадка, где встречаются игроки, команды, турниры и киберспортивное сообщество.
                  Для нас эта награда означает, что PIXEL заметен в индустрии и реально влияет
                  на развитие игровой культуры в Беларуси.
                </p>
                <a
                  href="https://www.cybersport.ru/tags/other/v-minske-proshla-the-belarusian-gaming-awards-nagradili-luchshii-belorusskii#:~:text=%C2%AB%D0%A6%D0%B5%D0%BD%D1%82%D1%80%20%D0%BA%D0%B8%D0%B1%D0%B5%D1%80%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%B2%D0%B7%D0%B0%D0%B8%D0%BC%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D0%B8%D1%8F%C2%BB%20(%C2%AB%D0%91%D0%B5%D0%BB%D1%82%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC%C2%BB)%20%E2%80%94%20PixelPlay%3B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-block cyber-button"
                >
                  Подробнее
                </a>
              </div>
            </motion.div>
          )}

          {/* === УСЛУГИ === */}
          {activeTab === "services" && (
            <motion.div
              id="partner-panel-contacts"
              role="tabpanel"
              key="services"
              variants={brandVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Фильтры */}
              <div className="mb-8 flex flex-wrap gap-2">
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFilter(cat)}
                    aria-pressed={filter === cat}
                    className={`rounded-md px-3 py-1.5 text-xs uppercase tracking-[0.15em] transition-all ${
                      filter === cat
                        ? "bg-brand/30 text-brand shadow-[0_0_10px_rgba(255,106,0,0.25)]"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Карточки */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-brand/30"
                  >
                    <span className="mb-2 inline-block rounded-full bg-brand/15 px-3 py-0.5 text-xs text-brand">
                      {s.category}
                    </span>
                    <h3 className="mb-1 text-lg font-semibold text-white">{s.title}</h3>
                    <p className="mb-4 text-sm text-white/50">{s.desc}</p>
                    <button
                      type="button"
                      onClick={openModal}
                      className="w-full rounded-lg border border-brand/50 bg-brand/15 px-4 py-2 text-sm text-brand transition-all hover:bg-brand hover:text-white"
                    >
                      Оставить заявку
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* === КЕЙСЫ === */}
          {activeTab === "cases" && (
            <motion.div
              key="cases"
              variants={brandVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mx-auto max-w-4xl"
            >
              {/* Переключатель кейсов */}
              <div className="mb-8 grid gap-3 md:grid-cols-3">
                {CASES.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setActiveCase(i); setCaseSlide(0); }}
                    aria-pressed={activeCase === i}
                    className={`rounded-xl border p-4 text-left text-sm font-semibold transition-all ${
                      activeCase === i
                        ? "border-brand/60 bg-brand/15 text-brand shadow-[0_0_16px_rgba(255,106,0,0.2)]"
                        : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    <span className="mb-1 block text-[10px] uppercase tracking-[0.25em] text-white/40">
                      Кейс {i + 1}
                    </span>
                    {c.title}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
                <p className="text-xs uppercase tracking-[0.4em] text-brand">Кейс {activeCase + 1}</p>
                <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                  {CASES[activeCase].title}
                </h2>

                {/* Слайдер фото */}
                <div className="relative mt-8 overflow-hidden rounded-xl border border-white/10">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${activeCase}-${caseSlide}`}
                      src={CASES[activeCase].image}
                      alt={`Кейс ${activeCase + 1} — фото ${caseSlide + 1}`}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-64 w-full object-cover md:h-[420px]"
                    />
                  </AnimatePresence>
                </div>

                {/* Секции текста */}
                {CASES[activeCase].sections.map((section, i) =>
                  section.highlight ? (
                    <div key={i} className="mt-8 rounded-xl border border-brand/20 bg-brand/[0.04] p-6">
                      <h3 className="text-lg font-bold uppercase tracking-wider text-brand">{section.heading}</h3>
                      {section.paragraphs.map((p, j) => (
                        <p key={j} className="mt-3 text-white/70">{p}</p>
                      ))}
                    </div>
                  ) : (
                    <div key={i} className="mt-8">
                      <h3 className="text-lg font-bold uppercase tracking-wider text-brand">{section.heading}</h3>
                      {section.paragraphs.map((p, j) => (
                        <p key={j} className="mt-3 text-white/70">{p}</p>
                      ))}
                    </div>
                  )
                )}
              </div>

              {/* CTA */}
              <div className="mt-8 rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/15 via-brand/5 to-transparent p-8 text-center md:p-10">
                <h3 className="text-2xl font-bold text-white md:text-3xl">
                  Хотите такой же <span className="text-brand">кейс для своей компании?</span>
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-white/60">
                  Организуем турнир, мероприятие или интеграцию бренда под ваши задачи.
                </p>
                <button type="button" onClick={openModal} className="cyber-button mt-6 !px-8 !py-3">
                  Оставить заявку на партнёрство
                </button>
              </div>
            </motion.div>
          )}

          {/* === КОНТАКТЫ === */}
          {activeTab === "contacts" && (
            <motion.div
              key="contacts"
              variants={brandVariant}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mx-auto max-w-5xl"
            >
              {/* Хиро-блок */}
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/90 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm md:p-12">
                {/* Декоративное свечение */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />

                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.4em] text-brand">Контакты</p>
                  <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                    Связаться с <span className="text-gradient-brand">нами</span>
                  </h2>
                  <p className="mt-4 max-w-2xl text-white/60">
                    Хотите стать партнёром PIXEL? Выберите удобный способ связи — обсудим
                    условия сотрудничества и подберём формат под ваш бренд.
                  </p>
                  <button
                    type="button"
                    onClick={openModal}
                    className="cyber-button mt-8 !px-7 !py-3"
                  >
                    Оставить заявку
                  </button>
                </div>
              </div>

              {/* Карточки контактов */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {/* Email */}
                <motion.a
                  href="mailto:info@pixelplay.by"
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/90 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors hover:border-brand/50"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/0 blur-2xl transition-all duration-500 group-hover:bg-brand/20" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,106,0,0.4)]">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/40">Email</p>
                    <p className="mt-1 font-semibold text-white transition-colors group-hover:text-brand">
                      info@pixelplay.by
                    </p>
                    <p className="mt-3 text-xs text-white/35">Ответим в течение рабочего дня</p>
                  </div>
                </motion.a>

                {/* Телефон */}
                <motion.a
                  href="tel:+375293193015"
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/90 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors hover:border-brand/50"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/0 blur-2xl transition-all duration-500 group-hover:bg-brand/20" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,106,0,0.4)]">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/40">Телефон</p>
                    <p className="mt-1 font-semibold text-white transition-colors group-hover:text-brand">
                      +375 29 319 30 15
                    </p>
                    <p className="mt-3 text-xs text-white/35">Ежедневно с 10:00 до 22:00</p>
                  </div>
                </motion.a>

                {/* Telegram */}
                <motion.a
                  href="https://t.me/pixelplay_mogilev"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d12]/90 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors hover:border-brand/50"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/0 blur-2xl transition-all duration-500 group-hover:bg-brand/20" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_0_20px_rgba(255,106,0,0.4)]">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9.04 15.51l-.38 5.32c.54 0 .78-.23 1.06-.51l2.55-2.44 5.28 3.87c.97.53 1.66.25 1.92-.89L23.9 3.83c.31-1.42-.51-1.98-1.45-1.63L2.4 9.87c-1.39.54-1.37 1.31-.24 1.66l4.69 1.46L18.5 6.02c.51-.34.98-.15.6.19L9.04 15.51z" />
                      </svg>
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/40">Telegram</p>
                    <p className="mt-1 font-semibold text-white transition-colors group-hover:text-brand">
                      @pixelplay_mogilev
                    </p>
                    <p className="mt-3 text-xs text-white/35">Самый быстрый способ связи</p>
                  </div>
                </motion.a>
              </div>

              {/* Соцсети */}
              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-[#0d0d12]/90 p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-sm md:flex-row md:justify-between md:px-8">
                <p className="text-sm text-white/50">
                  Мы в соцсетях — новости, турниры и акции
                </p>
                <div className="flex items-center gap-3">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="group flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-0.5 hover:border-brand/50 hover:bg-brand/10"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* === МОДАЛЬНОЕ ОКНО ЗАЯВКИ === */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="partnership-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-[101] w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                aria-label="Закрыть форму партнёрства"
                className="absolute right-4 top-4 text-white/50 hover:text-white"
              >
                ✕
              </button>
              <h3 className="mb-6 text-xl font-bold text-white">
                <span id="partnership-modal-title">Оставьте заявку на <span className="text-brand">Партнёрство</span></span>
              </h3>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Заявка отправлена!");
                  closeModal();
                }}
              >
                <div>
                  <label htmlFor="partner-name" className="mb-1 block text-sm text-white/60">Имя</label>
                  <input
                    id="partner-name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-brand/50"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label htmlFor="partner-company" className="mb-1 block text-sm text-white/60">Почта</label>
                  <input
                    id="partner-company"
                    type="text"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-brand/50"
                    placeholder="Компания / должность"
                  />
                </div>
                <div>
                  <label htmlFor="partner-phone" className="mb-1 block text-sm text-white/60">Номер телефона</label>
                  <input
                    id="partner-phone"
                    type="tel"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-brand/50"
                    placeholder="+375 (__) ___-__-__"
                  />
                </div>
                <div>
                  <label htmlFor="partner-email" className="mb-1 block text-sm text-white/60">Email</label>
                  <input
                    id="partner-email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white placeholder-white/30 outline-none focus:border-brand/50"
                    placeholder="email@example.com"
                  />
                </div>
                <p className="mt-4 text-xs text-white/40">
                  Отправляя форму, вы соглашаетесь с{" "}
                  <Link href="/terms" className="underline text-brand hover:text-white">
                    пользовательским соглашением
                  </Link>
                </p>
                <button
                  type="submit"
                  className="w-full rounded-lg border-2 border-brand bg-brand/15 py-3 text-sm font-semibold text-brand shadow-[0_0_16px_rgba(255,106,0,0.2)] transition-all hover:bg-brand hover:text-white hover:shadow-[0_0_24px_rgba(255,106,0,0.4)]"
                >
                  Отправить заявку
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    </MotionConfig>
  );
}
