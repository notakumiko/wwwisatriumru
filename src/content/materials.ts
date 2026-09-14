export type MaterialItem = {
  slug: string;
  title: string;
  description: string;
  img: string;
  comingSoon?: boolean;
};

// «Комплектация / Арт-материалы» — авторские техники и материалы студии,
// которые можно увидеть и потрогать вживую в шоу-руме.
export const artMaterials: MaterialItem[] = [
  {
    slug: "vystavki",
    title: "Фото с выставок",
    description: "Картины и объекты современного искусства, курируемые студией.",
    img: "/portfolio/_placeholder/ph-conservatory.jpg",
    comingSoon: true,
  },
  {
    slug: "keramika-avtorskaya",
    title: "Керамика авторская",
    description: "Вазы и мини-скульптуры ручной работы — единичные изделия студии.",
    img: "/craft-keramika.jpg",
  },
  {
    slug: "setki-olya",
    title: "Оля — авторские сетки",
    description: "Декоративные сетки для ресторанов и мест общего пользования.",
    img: "/portfolio/_placeholder/ph-relief-panel-silver.jpg",
  },
  {
    slug: "metall-nikita",
    title: "Металл (Никита)",
    description: "Окисленные арт-объекты и панно ручной чеканки.",
    img: "/craft-chekanka.jpg",
  },
  {
    slug: "steklo-dilizhans",
    title: "Стекло «Дилижанс»",
    description: "Витраж и фьюзинг — панели литьевого стекла ручной работы.",
    img: "/craft-vitrazhi.jpg",
  },
  {
    slug: "otdelka-galina",
    title: "Отделка и тонировки (Галина)",
    description: "Авторские тонировки и декоративные покрытия по дереву и штукатурке.",
    img: "/portfolio/_placeholder/ph-relief-panel-gold.jpg",
  },
  {
    slug: "zerkalo-glaz",
    title: "Зеркало «Глаз»",
    description: "Авторский зеркальный объект — акцент для холла или гостиной.",
    img: "/portfolio/_placeholder/ph-pendant-lights.jpg",
  },
];

export type ComplectationRow = {
  slug: string;
  photo: string;
  name: string;
  brand: string;
  specs: string;
  price: string;
  leadTime: string;
};

// Таблица комплектации — пример позиций. PLACEHOLDER: данные условные,
// реальные позиции и цены добавляются по мере комплектации конкретного объекта.
export const complectationCatalog: ComplectationRow[] = [
  {
    slug: "holodilnik",
    photo: "/portfolio/_placeholder/ph-bathroom-marble.jpg",
    name: "Холодильник встраиваемый",
    brand: "Liebherr",
    specs: "2 компрессора, No Frost, 178 см",
    price: "от 320 000 ₽",
    leadTime: "4–6 недель",
  },
  {
    slug: "stiralnaya-mashina",
    photo: "/portfolio/_placeholder/ph-bathroom-glass.jpg",
    name: "Стиральная машина встраиваемая",
    brand: "Miele",
    specs: "9 кг, пар, сушка",
    price: "от 180 000 ₽",
    leadTime: "3–5 недель",
  },
  {
    slug: "smesitel",
    photo: "/portfolio/_placeholder/ph-bathroom-vanity.jpg",
    name: "Смеситель для ванной",
    brand: "Dornbracht",
    specs: "латунь, PVD-покрытие",
    price: "от 95 000 ₽",
    leadTime: "6–8 недель",
  },
  {
    slug: "sanfayans",
    photo: "/portfolio/_placeholder/ph-restaurant-arch.jpg",
    name: "Унитаз подвесной",
    brand: "Villeroy & Boch",
    specs: "безободковый, комплект инсталляции",
    price: "от 140 000 ₽",
    leadTime: "5–7 недель",
  },
  {
    slug: "svet",
    photo: "/portfolio/_placeholder/ph-pendant-lights.jpg",
    name: "Подвесной светильник",
    brand: "Vibia",
    specs: "на заказ, латунь, стекло",
    price: "от 210 000 ₽",
    leadTime: "8–10 недель",
  },
];

// «Представительство» — партнёры-поставщики студии по комплектации объектов.
export const partners: MaterialItem[] = [
  {
    slug: "kraski-shtukaturka",
    title: "Краски и штукатурка",
    description: "Декоративные покрытия и колеровка от проверенных производителей.",
    img: "/portfolio/_placeholder/ph-bathroom-marble.jpg",
  },
  {
    slug: "kuhni-korpusnaya-mebel",
    title: "Кухни и корпусная мебель",
    description: "Кухни и встроенная мебель под размеры и стиль проекта.",
    img: "/portfolio/_placeholder/ph-bathroom-glass.jpg",
  },
  {
    slug: "divany",
    title: "Диваны",
    description: "Мягкая мебель от партнёрских фабрик — на заказ и в наличии.",
    img: "/portfolio/_placeholder/ph-bathroom-vanity.jpg",
  },
  {
    slug: "plintusa",
    title: "Плинтуса",
    description: "Скрытые и классические плинтуса под разные типы отделки пола.",
    img: "/portfolio/_placeholder/ph-restaurant-arch.jpg",
  },
  {
    slug: "paneli",
    title: "Панели",
    description: "Веер декоративных панелей и пластиков для стен и мебели.",
    img: "/portfolio/_placeholder/ph-restaurant-shelf.jpg",
  },
];
