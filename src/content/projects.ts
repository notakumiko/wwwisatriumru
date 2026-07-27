export type ProjectCategorySlug =
  | "restorany"
  | "ofisy"
  | "mop-kompleksy"
  | "chastnye-doma"
  | "kvartiry"
  | "dekor"
  | "avtorskie-kontseptsii";

export const projectCategories: {
  slug: ProjectCategorySlug;
  title: string;
  description: string;
}[] = [
  {
    slug: "restorany",
    title: "Рестораны",
    description: "Фасады, залы и террасы заведений — от бара у парка до курортного ресторанного комплекса.",
  },
  {
    slug: "ofisy",
    title: "Офисы",
    description: "Штаб-квартиры и кабинеты руководителей — пространство как аргумент работодателя.",
  },
  {
    slug: "mop-kompleksy",
    title: "МОП и коммерческие комплексы",
    description: "Лобби, общественные зоны и торговые пространства крупных объектов.",
  },
  {
    slug: "chastnye-doma",
    title: "Частные дома",
    description: "Загородные резиденции — от классики до курортного модернизма.",
  },
  {
    slug: "kvartiry",
    title: "Квартиры",
    description: "Городские квартиры и студии — камерные объекты студии.",
  },
  {
    slug: "dekor",
    title: "Декор",
    description: "Проекты, где акцент — на стайлинге и предметном слое, а не на перепланировке.",
  },
  {
    slug: "avtorskie-kontseptsii",
    title: "Авторские концепции",
    description: "Эскизы и идеи студии, ещё не воплощённые в конкретном объекте.",
  },
];

export function getCategory(slug: ProjectCategorySlug) {
  return projectCategories.find((c) => c.slug === slug);
}

export type Project = {
  slug: string;
  title: string;
  location: string;
  objectType: "Квартира" | "Дом" | "Коммерция" | "Концепт";
  category: ProjectCategorySlug;
  style: string;
  area?: string;
  year: string;
  // true — карточка-заглушка: имя и категория подтверждены студией,
  // фото и описание временные, ждут материалов (второй заход).
  comingSoon?: boolean;
  summary: string;
  task: string;
  solution: string[];
  materials: string[];
  servicesUsed: string[]; // слаги услуг из services.ts
  cover: string;
  gallery: string[];
  quote?: { text: string; author: string };
};

function stub(overrides: {
  slug: string;
  title: string;
  location: string;
  objectType: Project["objectType"];
  category: ProjectCategorySlug;
  year: string;
  servicesUsed: string[];
  cover: string;
  gallery: string[];
  subject: string; // "Ресторан" | "Дом" | "Квартира" | "Офис" и т.п. — для честного summary
}): Project {
  return {
    slug: overrides.slug,
    title: overrides.title,
    location: overrides.location,
    objectType: overrides.objectType,
    category: overrides.category,
    style: "Материалы уточняются",
    year: overrides.year,
    comingSoon: true,
    summary: `${overrides.subject} уже в портфолио студии — полное описание и реальные фотографии добавим, когда получим материалы от студии.`,
    task: "Кейс уточняется — карточка зарезервирована в структуре портфолио.",
    solution: [
      "Полное описание проекта, ход работы и фотографии появятся здесь после загрузки материалов студии.",
    ],
    materials: ["Уточняется"],
    servicesUsed: overrides.servicesUsed,
    cover: overrides.cover,
    gallery: overrides.gallery,
  };
}

const ph = (name: string) => `/portfolio/_placeholder/${name}`;
const PLACEHOLDER_POOL = [
  ph("ph-bathroom-marble.jpg"),
  ph("ph-bathroom-glass.jpg"),
  ph("ph-bathroom-vanity.jpg"),
  ph("ph-restaurant-arch.jpg"),
  ph("ph-restaurant-shelf.jpg"),
  ph("ph-restaurant-nook.jpg"),
  ph("ph-conservatory.jpg"),
  ph("ph-pendant-lights.jpg"),
  ph("ph-relief-panel-silver.jpg"),
  ph("ph-relief-panel-gold.jpg"),
];
// PLACEHOLDER: все проекты ниже используют временные фото из архива студии
// (реальные интерьеры, но не привязанные к конкретному названному объекту).
// Заменить на фото клиента по каждому проекту во втором заходе.
function poolCover(i: number) {
  return PLACEHOLDER_POOL[i % PLACEHOLDER_POOL.length];
}
function poolGallery(i: number) {
  return [
    PLACEHOLDER_POOL[(i + 1) % PLACEHOLDER_POOL.length],
    PLACEHOLDER_POOL[(i + 2) % PLACEHOLDER_POOL.length],
  ];
}

// Реальные проекты студии из портфолио (фото — из архива портфолио ATRIUM, 2026).
// Названия и годы части объектов — временные: точные даты и подписи
// уточняются вторым заходом вместе с полным «сырым» архивом работ студии.
export const projects: Project[] = [
  // ---------- РЕАЛЬНЫЕ ФОТО ----------
  {
    slug: "rezidentsiya-art-deco-spb",
    title: "Резиденция в стиле ар-деко",
    location: "Санкт-Петербург",
    objectType: "Дом",
    category: "chastnye-doma",
    style: "Ар-деко с авторскими барельефами",
    year: "2024",
    summary:
      "Флагманский частный объект студии: серебряные барельефы, латунь и чеканка, витражи и художественное стекло — интерьер, собранный вокруг предметов, изготовленных специально для него.",
    task:
      "Создать целостную резиденцию, где отделка и предметный слой не куплены из каталога, а разработаны и изготовлены под конкретное пространство — от стеновых панелей до светильников и мебели.",
    solution: [
      "Главным языком проекта стали авторские барельефы и художественный металл: серебряные и латунные панно с растительными мотивами, зеркальные композиции и чеканка в духе ар-деко — в холле, столовой и гостиной.",
      "Каждое изделие прошло путь от эскиза студии через собственную мастерскую — с образцами материалов и авторским надзором за изготовлением: барельефы, витражные вставки, мебель и свет по чертежам.",
      "Свет выстроен как в галерее: точечные сценарии подчёркивают рельеф стен и фактуру металла, не превращая жилые комнаты в музей.",
    ],
    materials: [
      "Серебряные и латунные барельефы по авторским эскизам",
      "Чеканка по металлу, латунь с патиной",
      "Витражи и художественное стекло",
      "Тёмное дерево и мрамор",
      "Бархат и шёлк в текстиле",
    ],
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "realizatsiya", "handmade"],
    cover: "/portfolio/rezidentsiya-art-deco-spb/cover.jpg",
    gallery: [
      "/portfolio/rezidentsiya-art-deco-spb/01.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/02.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/03.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/04.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/05.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/06.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/07.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/08.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/09.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/10.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/11.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/12.jpg",
      "/portfolio/rezidentsiya-art-deco-spb/13.jpg",
    ],
  },
  {
    slug: "ahun-sochi",
    title: "Ахун",
    location: "Сочи",
    objectType: "Дом",
    category: "chastnye-doma",
    style: "Современная курортная классика",
    year: "2025",
    summary:
      "Приватный дом для отдыха: светлые анфилады комнат, каминная гостиная с авторским муарным панно и отдельный этаж с крытым бассейном.",
    task:
      "Собрать дом, который работает и как курортная резиденция для семьи, и как место для приёма гостей: светлый, просторный, с собственной СПА-зоной под одной крышей.",
    solution: [
      "Гостиные объединены анфиладой — тёплый светлый камень, панорамные окна и глубокие диваны создают ощущение непрерывного отдыха.",
      "Авторское панно с мотивом волны стало смысловым центром гостиной: связывает камин, лестницу и вид на бассейн в одну композицию.",
      "Бассейн решён как отдельный «курортный» этаж: тёплое дерево, ночная подсветка воды и стеклянные перегородки убирают границу между спортом и релаксом.",
    ],
    materials: [
      "Светлый натуральный камень и мрамор",
      "Авторское рельефное панно ручной работы",
      "Тёплое дерево в отделке бассейна",
      "Бархат и рогожка в мебели",
      "Латунь и стекло в свете",
    ],
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "realizatsiya", "handmade"],
    cover: "/portfolio/ahun-sochi/cover.jpg",
    gallery: [
      "/portfolio/ahun-sochi/01.jpg",
      "/portfolio/ahun-sochi/02.jpg",
      "/portfolio/ahun-sochi/03.jpg",
      "/portfolio/ahun-sochi/04.jpg",
      "/portfolio/ahun-sochi/05.jpg",
      "/portfolio/ahun-sochi/06.jpg",
      "/portfolio/ahun-sochi/07.jpg",
      "/portfolio/ahun-sochi/08.jpg",
      "/portfolio/ahun-sochi/09.jpg",
      "/portfolio/ahun-sochi/10.jpg",
      "/portfolio/ahun-sochi/11.jpg",
      "/portfolio/ahun-sochi/12.jpg",
      "/portfolio/ahun-sochi/13.jpg",
    ],
  },
  {
    slug: "kvartira-alicante",
    title: "Квартира в Аликанте",
    location: "Аликанте, Испания",
    objectType: "Квартира",
    category: "kvartiry",
    style: "Средиземноморский минимализм",
    year: "2023",
    summary:
      "Светлая европейская квартира для жизни у моря: белые стены, натуральные текстуры и мебель из ротанга вместо тяжёлого декора.",
    task:
      "Сделать квартиру, которая работает как продолжение отпуска: лёгкую, светлую, без плотной меблировки — с акцентом на дневной свет и фактуру природных материалов.",
    solution: [
      "Палитра построена на белом и натуральном дереве: стены оставлены свободными, а характер комнатам задают текстуры — ротанг, лён, зелень.",
      "Мебель подобрана по принципу «отпускной» лёгкости — плетёные кресла, низкие столики, минимум декора на поверхностях.",
    ],
    materials: [
      "Известковая штукатурка светлых тонов",
      "Ротанг и плетёная мебель",
      "Лён в текстиле",
    ],
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "dekorirovanie"],
    cover: "/portfolio/kvartira-alicante/cover.jpg",
    gallery: ["/portfolio/kvartira-alicante/01.jpg"],
  },
  {
    slug: "restoran-aristarh-perinon",
    title: "Ресторан «Аристарх Периньон»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "restorany",
    style: "Тёплый эклектизм: лофт, зелень, винная классика",
    year: "2024",
    summary:
      "Ресторан с характерным кирпичным лофтом: арки, живая зелень и авторский барельеф на входе задают настроение всего пространства.",
    task:
      "Собрать несколько залов ресторана в едином настроении так, чтобы гость узнавал бренд в любой части зала — без ощущения набора случайных интерьеров.",
    solution: [
      "Основой стал кирпичный лофт с арочными проёмами и живой зеленью — свет, мебель и графика держат единый стиль во всех залах.",
      "Фирменный барельеф с головой барана на кирпичной стене стал визитной карточкой входной группы и главным «фотогеничным» местом ресторана.",
      "Мягкая мебель и патинированный металл барных стоек продолжают материальную палитру от входа до дальних кабинок зала.",
    ],
    materials: [
      "Открытый кирпич и архитектурный бетон",
      "Тёмное дерево и латунь в барных стойках",
      "Авторский барельеф ручной работы",
      "Живая зелень как часть интерьера",
    ],
    servicesUsed: ["dizayn-proekt", "realizatsiya", "dekorirovanie"],
    cover: "/portfolio/restoran-aristarh-perinon/cover.jpg",
    gallery: [
      "/portfolio/restoran-aristarh-perinon/01.jpg",
      "/portfolio/restoran-aristarh-perinon/02.jpg",
      "/portfolio/restoran-aristarh-perinon/03.jpg",
      "/portfolio/restoran-aristarh-perinon/04.jpg",
      "/portfolio/restoran-aristarh-perinon/05.jpg",
      "/portfolio/restoran-aristarh-perinon/06.jpg",
      "/portfolio/restoran-aristarh-perinon/07.jpg",
      "/portfolio/restoran-aristarh-perinon/08.jpg",
      "/portfolio/restoran-aristarh-perinon/09.jpg",
      "/portfolio/restoran-aristarh-perinon/10.jpg",
    ],
  },
  {
    slug: "bar-bolshaya-ryba-krasnodar",
    title: "Бар «Большая Рыба» у парка Галицкого",
    location: "Краснодар",
    objectType: "Коммерция",
    category: "restorany",
    style: "Индустриальный характер, узнаваемый фасад",
    year: "2023",
    summary:
      "Комплексная работа для бара «Большая Рыба»: узнаваемый фасад с неоновой вывеской и интерьер с голубыми банкетками, который держит внимание гостя весь вечер.",
    task:
      "Создать заведение, узнаваемое издалека в жилом квартале: яркий фасад и интерьер с характером, не теряющийся среди соседних заведений.",
    solution: [
      "Фасад с неоновой вывеской и кирпичной кладкой сделан главным ориентиром квартала — заведение видно и узнаваемо ещё на подходе.",
      "Внутри — голубые банкетки, скульптурные арт-объекты и патинированный металл держат единый характер зала от бара до дальних лож.",
      "Свет и мебель расставлены так, чтобы заведение одинаково хорошо работало и днём, и вечером.",
    ],
    materials: [
      "Кирпич и металл фасада",
      "Неоновая вывеска по авторской графике",
      "Дерево и бархат в интерьере",
      "Скульптурные арт-объекты в декоре",
    ],
    servicesUsed: ["dizayn-proekt", "realizatsiya", "dekorirovanie"],
    cover: "/portfolio/bar-bolshaya-ryba-krasnodar/cover.jpg",
    gallery: [
      "/portfolio/bar-bolshaya-ryba-krasnodar/01.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/02.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/03.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/04.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/05.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/06.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/07.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/08.jpg",
    ],
  },
  {
    slug: "yoga-tsentr-shakti-benidorm",
    title: "Йога-центр Shakti",
    location: "Бенидорм, Испания",
    objectType: "Коммерция",
    category: "restorany",
    style: "Средиземноморская этника",
    year: "2023",
    summary:
      "Европейский проект студии: зал для практик с подвесными гамаками, ресторан и лаунж-зона центра Shakti — тёплое, тактильное пространство без «фитнес-клубной» стерильности.",
    task:
      "Создать пространство практик, в котором средиземноморская архитектура встречается с восточной традицией — с фактурами, приятными глазу и рукам, а не только функциональными.",
    solution: [
      "Зал для практик решён в натуральных материалах: деревянные балки, плетёные гамаки для аэройоги и мягкий естественный свет через большие окна.",
      "Ресторанная зона центра оформлена в марокканской традиции — мозаичная плитка, подвесные светильники, орнаментальная роспись стен.",
      "Студия вела весь комплекс: от входной группы с фирменным символом центра до графики и общего сценария освещения.",
    ],
    materials: [
      "Дерево и балочные потолки",
      "Ручная плитка с орнаментом",
      "Известковые штукатурки",
      "Текстиль и гамаки для практик",
    ],
    servicesUsed: ["dizayn-proekt", "dekorirovanie"],
    cover: "/portfolio/yoga-tsentr-shakti-benidorm/cover.jpg",
    gallery: [
      "/portfolio/yoga-tsentr-shakti-benidorm/01.jpg",
      "/portfolio/yoga-tsentr-shakti-benidorm/02.jpg",
      "/portfolio/yoga-tsentr-shakti-benidorm/03.jpg",
      "/portfolio/yoga-tsentr-shakti-benidorm/04.jpg",
    ],
  },
  {
    slug: "ofis-gt-group",
    title: "Офис GT Group",
    location: "Москва",
    objectType: "Коммерция",
    category: "ofisy",
    style: "Деловой минимализм с тёплым деревом",
    year: "2024",
    summary:
      "Штаб-квартира компании GT Group: лобби с фирменным знаком, кабинеты руководителей, переговорные и приватные лаунж-зоны в едином материальном языке.",
    task:
      "Сделать офис аргументом работодателя и партнёра: пространство, которое презентует компанию с порога и держит статус во всех кабинетах — без «офисной» безликости.",
    solution: [
      "Лобби с мраморным полом и фирменным знаком компании решено как первый кадр бренда — свет и материалы работают на узнаваемость.",
      "Кабинеты и переговорные объединены общим языком тёплого дерева и латуни, но каждый получил собственный характер — библиотека, каминная зона, лаунж с авторским рельефом.",
      "Дополнительные пространства — атриум со стеклянной крышей и приёмная зона — продолжают материальную палитру офиса и снимают его формальность.",
    ],
    materials: [
      "Мрамор и терраццо в лобби",
      "Шпон тёмного дерева",
      "Латунь в деталях света и мебели",
      "Авторские рельефные панно",
    ],
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "realizatsiya"],
    cover: "/portfolio/ofis-gt-group/cover.jpg",
    gallery: [
      "/portfolio/ofis-gt-group/01.jpg",
      "/portfolio/ofis-gt-group/02.jpg",
      "/portfolio/ofis-gt-group/03.jpg",
      "/portfolio/ofis-gt-group/04.jpg",
      "/portfolio/ofis-gt-group/05.jpg",
      "/portfolio/ofis-gt-group/06.jpg",
      "/portfolio/ofis-gt-group/07.jpg",
      "/portfolio/ofis-gt-group/08.jpg",
      "/portfolio/ofis-gt-group/09.jpg",
      "/portfolio/ofis-gt-group/10.jpg",
      "/portfolio/ofis-gt-group/11.jpg",
      "/portfolio/ofis-gt-group/12.jpg",
      "/portfolio/ofis-gt-group/13.jpg",
    ],
  },
  {
    slug: "ofis-polymetal-spb",
    title: "«Полиметалл»: офис и конференц-зал",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "mop-kompleksy",
    style: "Репрезентативный корпоративный минимализм",
    year: "2022",
    summary:
      "Рабочие пространства и конференц-зал для «Полиметалла»: открытые кабинеты, переговорные и амфитеатр для презентаций на несколько сотен человек.",
    task:
      "Спроектировать офис и конференц-зал крупной компании так, чтобы масштаб пространства работал на статус, а не на ощущение пустоты — с акустикой и светом под разные форматы событий.",
    solution: [
      "Открытые кабинеты решены в спокойной палитре дерева и текстиля — рабочие места объединены общим ритмом света без визуального шума.",
      "Амфитеатр конференц-зала спроектирован с вертикальным озеленением и акустическими панелями — пространство одинаково хорошо работает для презентаций и общих собраний.",
      "Фирменная графика компании интегрирована в архитектуру зала, а не добавлена поверх готового интерьера.",
    ],
    materials: [
      "Шпон дерева и акустические панели",
      "Терраццо и керамогранит",
      "Вертикальное озеленение",
      "Металл в деталях мебели",
    ],
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "realizatsiya"],
    cover: "/portfolio/ofis-polymetal-spb/cover.jpg",
    gallery: [
      "/portfolio/ofis-polymetal-spb/01.jpg",
      "/portfolio/ofis-polymetal-spb/02.jpg",
      "/portfolio/ofis-polymetal-spb/03.jpg",
      "/portfolio/ofis-polymetal-spb/04.jpg",
      "/portfolio/ofis-polymetal-spb/05.jpg",
    ],
  },
  {
    slug: "galereya-tc-spb",
    title: "ТЦ «Галерея»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "mop-kompleksy",
    style: "Общественное пространство торгового комплекса",
    year: "2022",
    summary:
      "Общественные зоны торгового центра «Галерея»: светлый атриум с колоннами и озеленением, навигация и зоны отдыха для посетителей.",
    task:
      "Сделать места общего пользования крупного торгового комплекса приятными для долгого пребывания — не просто транзитным коридором между магазинами.",
    solution: [
      "Атриум решён светлым и просторным — колонны, зелень и мягкий рассеянный свет снимают ощущение «торгового конвейера».",
      "Зоны отдыха встроены прямо в общий поток движения — посетитель не ищет их специально.",
    ],
    materials: ["Светлый камень и керамогранит", "Озеленение атриума", "Металл в отделке колонн"],
    servicesUsed: ["dizayn-proekt", "realizatsiya"],
    cover: "/portfolio/galereya-tc-spb/cover.jpg",
    gallery: ["/portfolio/galereya-tc-spb/01.jpg"],
  },

  // ---------- РЕСТОРАНЫ (заглушки) ----------
  stub({
    slug: "restoran-yusi",
    title: "Ресторан + фасад ЮСИ",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "restorany",
    year: "2024",
    servicesUsed: ["dizayn-proekt", "realizatsiya"],
    subject: "Ресторан",
    cover: poolCover(0),
    gallery: poolGallery(0),
  }),
  stub({
    slug: "restoran-sloy",
    title: "«Слой»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "restorany",
    year: "2023",
    servicesUsed: ["dizayn-proekt", "dekorirovanie"],
    subject: "Ресторан",
    cover: poolCover(1),
    gallery: poolGallery(1),
  }),
  stub({
    slug: "park-otel-optina-pustyn",
    title: "Парк-отель «Оптина Пустынь»",
    location: "Калужская область",
    objectType: "Коммерция",
    category: "restorany",
    year: "2022",
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "realizatsiya"],
    subject: "Парк-отель",
    cover: poolCover(2),
    gallery: poolGallery(2),
  }),

  // ---------- ОФИСЫ (заглушки) ----------
  stub({
    slug: "ofis-gazprom",
    title: "Офис «Газпром»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "ofisy",
    year: "2023",
    servicesUsed: ["dizayn-proekt", "realizatsiya"],
    subject: "Офис",
    cover: poolCover(3),
    gallery: poolGallery(3),
  }),
  stub({
    slug: "ofis-kupriyanova",
    title: "Офис Куприянова",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "ofisy",
    year: "2024",
    servicesUsed: ["dizayn-proekt", "komplektatsiya"],
    subject: "Офис",
    cover: poolCover(4),
    gallery: poolGallery(4),
  }),
  stub({
    slug: "ofis-mihaila",
    title: "Офис Михаила",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "ofisy",
    year: "2025",
    servicesUsed: ["dizayn-proekt", "komplektatsiya"],
    subject: "Офис",
    cover: poolCover(5),
    gallery: poolGallery(5),
  }),

  // ---------- МОП И КОММЕРЧЕСКИЕ КОМПЛЕКСЫ (заглушки) ----------
  stub({
    slug: "glavstroy",
    title: "«Главстрой»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "mop-kompleksy",
    year: "2023",
    servicesUsed: ["dizayn-proekt", "realizatsiya"],
    subject: "Комплекс",
    cover: poolCover(6),
    gallery: poolGallery(6),
  }),
  stub({
    slug: "zum",
    title: "«Зум»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "mop-kompleksy",
    year: "2024",
    servicesUsed: ["dizayn-proekt", "realizatsiya"],
    subject: "Комплекс",
    cover: poolCover(7),
    gallery: poolGallery(7),
  }),
  stub({
    slug: "fasad-zapesotskiy",
    title: "Фасад «Запесоцкий»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    category: "mop-kompleksy",
    year: "2023",
    servicesUsed: ["dizayn-proekt"],
    subject: "Фасад",
    cover: poolCover(8),
    gallery: poolGallery(8),
  }),

  // ---------- ЧАСТНЫЕ ДОМА (заглушки) ----------
  stub({
    slug: "cherny-dom",
    title: "Чёрный дом",
    location: "Краснодар",
    objectType: "Дом",
    category: "chastnye-doma",
    year: "2024",
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "realizatsiya"],
    subject: "Дом",
    cover: poolCover(9),
    gallery: poolGallery(9),
  }),
  stub({
    slug: "vabi-sabi",
    title: "Ваби-саби",
    location: "Санкт-Петербург",
    objectType: "Дом",
    category: "chastnye-doma",
    year: "2025",
    servicesUsed: ["dizayn-proekt", "komplektatsiya"],
    subject: "Дом",
    cover: poolCover(0),
    gallery: poolGallery(3),
  }),
  stub({
    slug: "dimon",
    title: "«Димон»",
    location: "Санкт-Петербург",
    objectType: "Дом",
    category: "chastnye-doma",
    year: "2023",
    servicesUsed: ["dizayn-proekt", "realizatsiya"],
    subject: "Дом",
    cover: poolCover(1),
    gallery: poolGallery(4),
  }),
  stub({
    slug: "shale",
    title: "Шале",
    location: "Сочи",
    objectType: "Дом",
    category: "chastnye-doma",
    year: "2024",
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "realizatsiya"],
    subject: "Дом",
    cover: poolCover(2),
    gallery: poolGallery(5),
  }),
  stub({
    slug: "millenium",
    title: "«Миллениум»",
    location: "Санкт-Петербург",
    objectType: "Дом",
    category: "chastnye-doma",
    year: "2022",
    servicesUsed: ["dizayn-proekt", "komplektatsiya"],
    subject: "Дом",
    cover: poolCover(3),
    gallery: poolGallery(6),
  }),

  // ---------- КВАРТИРЫ (заглушки) ----------
  stub({
    slug: "tri-vetra",
    title: "«Три ветра»",
    location: "Санкт-Петербург",
    objectType: "Квартира",
    category: "kvartiry",
    year: "2023",
    servicesUsed: ["dizayn-proekt", "komplektatsiya"],
    subject: "Квартира",
    cover: poolCover(4),
    gallery: poolGallery(7),
  }),
  stub({
    slug: "kvartira-studenta",
    title: "Квартира студента",
    location: "Санкт-Петербург",
    objectType: "Квартира",
    category: "kvartiry",
    year: "2025",
    servicesUsed: ["dizayn-proekt", "dekorirovanie"],
    subject: "Квартира",
    cover: poolCover(5),
    gallery: poolGallery(8),
  }),
  stub({
    slug: "kvartira-oli",
    title: "Квартира Оли",
    location: "Санкт-Петербург",
    objectType: "Квартира",
    category: "kvartiry",
    year: "2024",
    servicesUsed: ["dizayn-proekt", "komplektatsiya"],
    subject: "Квартира-студия",
    cover: poolCover(6),
    gallery: poolGallery(9),
  }),

  // ---------- ДЕКОР (заглушка) ----------
  stub({
    slug: "dekor-dom-kreslavskih",
    title: "Декор. Дом Креславских",
    location: "Санкт-Петербург",
    objectType: "Дом",
    category: "dekor",
    year: "2023",
    servicesUsed: ["dekorirovanie"],
    subject: "Проект",
    cover: poolCover(7),
    gallery: poolGallery(0),
  }),

  // ---------- АВТОРСКИЕ КОНЦЕПЦИИ (заглушка-коллекция) ----------
  stub({
    slug: "avtorskie-kontseptsii",
    title: "Авторские концепции",
    location: "Студия ATRIUM",
    objectType: "Концепт",
    category: "avtorskie-kontseptsii",
    year: "2023–2026",
    servicesUsed: ["dizayn-proekt"],
    subject: "Коллекция эскизов и идей",
    cover: poolCover(8),
    gallery: poolGallery(1),
  }),
];

export const objectTypes = ["Все объекты", "Квартира", "Дом", "Коммерция", "Концепт"] as const;
