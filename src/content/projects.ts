export type Project = {
  slug: string;
  title: string;
  location: string;
  objectType: "Квартира" | "Дом" | "Коммерция";
  style: string;
  area?: string;
  year: string;
  summary: string;
  task: string;
  solution: string[];
  materials: string[];
  servicesUsed: string[]; // слаги услуг из services.ts
  cover: string;
  gallery: string[];
  quote?: { text: string; author: string };
};

// Реальные проекты студии из портфолио (фото — из архива портфолио ATRIUM, 2026).
// Названия и годы части объектов — временные: точные даты и подписи
// уточняются вторым заходом вместе с полным «сырым» архивом работ студии.
export const projects: Project[] = [
  {
    slug: "rezidentsiya-art-deco-spb",
    title: "Резиденция в стиле ар-деко",
    location: "Санкт-Петербург",
    objectType: "Дом",
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
    slug: "dom-s-basseynom-sochi",
    title: "Дом с бассейном",
    location: "Сочи",
    objectType: "Дом",
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
    cover: "/portfolio/dom-s-basseynom-sochi/cover.jpg",
    gallery: [
      "/portfolio/dom-s-basseynom-sochi/01.jpg",
      "/portfolio/dom-s-basseynom-sochi/02.jpg",
      "/portfolio/dom-s-basseynom-sochi/03.jpg",
      "/portfolio/dom-s-basseynom-sochi/04.jpg",
      "/portfolio/dom-s-basseynom-sochi/05.jpg",
      "/portfolio/dom-s-basseynom-sochi/06.jpg",
      "/portfolio/dom-s-basseynom-sochi/07.jpg",
      "/portfolio/dom-s-basseynom-sochi/08.jpg",
      "/portfolio/dom-s-basseynom-sochi/09.jpg",
      "/portfolio/dom-s-basseynom-sochi/10.jpg",
      "/portfolio/dom-s-basseynom-sochi/11.jpg",
      "/portfolio/dom-s-basseynom-sochi/12.jpg",
      "/portfolio/dom-s-basseynom-sochi/13.jpg",
    ],
  },
  {
    slug: "kvartira-alicante",
    title: "Квартира в Аликанте",
    location: "Аликанте, Испания",
    objectType: "Квартира",
    style: "Средиземноморский минимализм",
    year: "2023",
    summary:
      "Светлая европейская квартира для жизни у моря: белые стены, натуральные текстуры и мебель из ротанга вместо тяжёлого декора.",
    task:
      "Сделать квартиру, которая работает как продолжение отпуска: лёгкую, светлую, без плотной меблировки — с акцентом на дневной свет и фактуру природных материалов.",
    solution: [
      "Палитра построена на белом и натуральном дереве: стены оставлены свободными, а характер комнатам задают текстуры — ротанг, лён, зелень.",
      "Ванные комнаты получили тёплый акцент: золотая фурнитура, круглые зеркала и мрамор на фоне светлой плитки.",
      "Мебель подобрана по принципу «отпускной» лёгкости — плетёные кресла, низкие столики, минимум декора на поверхностях.",
    ],
    materials: [
      "Известковая штукатурка светлых тонов",
      "Ротанг и плетёная мебель",
      "Мрамор и золотая фурнитура в санузлах",
      "Лён в текстиле",
    ],
    servicesUsed: ["dizayn-proekt", "komplektatsiya", "dekorirovanie"],
    cover: "/portfolio/kvartira-alicante/cover.jpg",
    gallery: [
      "/portfolio/kvartira-alicante/01.jpg",
      "/portfolio/kvartira-alicante/02.jpg",
      "/portfolio/kvartira-alicante/03.jpg",
      "/portfolio/kvartira-alicante/04.jpg",
      "/portfolio/kvartira-alicante/05.jpg",
    ],
  },
  {
    slug: "restoran-aristarh-perinon",
    title: "Ресторан «Аристарх Периньон»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
    style: "Тёплый эклектизм: лофт, зелень, винная классика",
    year: "2024",
    summary:
      "Многозальный ресторанный комплекс с зимним садом, винным баром Cabernet и залами разного характера — от кирпичного лофта до камерной гостиной.",
    task:
      "Собрать под одной вывеской несколько залов с разным настроением так, чтобы гость узнавал бренд в любом из них — без ощущения набора случайных интерьеров.",
    solution: [
      "Каждый зал получил свой сюжет — зимний сад с живой зеленью, винный бар с галереей бутылок, кирпичный лофт с арками — при этом свет, мебель и графика держат общий стиль.",
      "Фирменный барельеф с головой барана на кирпичной стене стал визитной карточкой входной группы и главным «фотогеничным» местом ресторана.",
      "Барная стойка Cabernet decorated с подсветкой и винным шкафом решена как отдельная сцена внутри общего пространства.",
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
      "/portfolio/restoran-aristarh-perinon/11.jpg",
      "/portfolio/restoran-aristarh-perinon/12.jpg",
      "/portfolio/restoran-aristarh-perinon/13.jpg",
    ],
  },
  {
    slug: "bar-bolshaya-ryba-krasnodar",
    title: "Бар «Большая Рыба»",
    location: "Краснодар",
    objectType: "Коммерция",
    style: "Индустриальный характер, узнаваемый фасад",
    year: "2023",
    summary:
      "Комплексная работа для бара «Большая Рыба»: узнаваемый фасад с неоновой вывеской, летняя терраса и несколько залов внутри с разным характером.",
    task:
      "Создать заведение, узнаваемое издалека в жилом квартале: яркий фасад, работающая большую часть года терраса и интерьер, который держит внимание гостя весь вечер.",
    solution: [
      "Фасад с неоновой вывеской и кирпичной кладкой сделан главным ориентиром квартала — заведение видно и узнаваемо ещё на подходе.",
      "Терраса под стеклянной крышей спроектирована как продолжение зала: та же палитра мебели и света стирает границу между «внутри» и «снаружи».",
      "Внутри — несколько залов с разным настроением: от голубых банкеток у бара до камерных лож с деревянными балками.",
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
      "/portfolio/bar-bolshaya-ryba-krasnodar/09.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/10.jpg",
      "/portfolio/bar-bolshaya-ryba-krasnodar/11.jpg",
    ],
  },
  {
    slug: "yoga-tsentr-shakti-benidorm",
    title: "Йога-центр Shakti",
    location: "Бенидорм, Испания",
    objectType: "Коммерция",
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
    title: "Офис и конференц-зал «Полиметалл»",
    location: "Санкт-Петербург",
    objectType: "Коммерция",
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
];

export const objectTypes = ["Все объекты", "Квартира", "Дом", "Коммерция"] as const;
