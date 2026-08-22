import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { studio } from "@/content/studio";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(studio.url),
  title: {
    default: `${studio.name} — студия дизайна интерьеров | Дизайн-проект и комплектация под ключ`,
    template: `%s — ${studio.name}`,
  },
  description:
    "Полный дизайн-проект и комплектация премиальных интерьеров под ключ: жилые и коммерческие объекты в Москве, Санкт-Петербурге, Сочи, Ташкенте и Аликанте. Реализация, декорирование, авторские барельефы, керамика, витражи, чеканка, литьё стекла и подбор искусства.",
  keywords: [
    "дизайн интерьера",
    "дизайн-проект",
    "комплектация интерьера",
    "студия дизайна интерьера",
    "дизайнер интерьера Санкт-Петербург",
    "дизайнер интерьера Москва",
    "барельефы витражи керамика",
    "чеканка литьё стекла фьюзинг",
    "подбор искусства для интерьера",
    "скульптура и живопись в интерьер",
    "ATRIUM",
  ],
  authors: [{ name: studio.founder }],
  openGraph: {
    title: `${studio.name} — студия дизайна интерьеров | Дизайн-проект и комплектация под ключ`,
    description: studio.description,
    url: "/",
    siteName: studio.name,
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${studio.name} — студия дизайна интерьеров`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${studio.name} — студия дизайна интерьеров`,
    description: studio.description,
    images: [DEFAULT_OG_IMAGE],
  },
  // Только для главной. Каждая внутренняя страница объявляет свой canonical
  // через buildMetadata — иначе Next наследует этот и объявит все страницы
  // копиями главной.
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: studio.fullName,
    url: studio.url,
    description: studio.description,
    founder: {
      "@type": "Person",
      name: studio.founder,
      jobTitle: studio.founderRole,
    },
    areaServed: studio.geo,
    email: studio.contacts.email,
    telephone: studio.contacts.whatsappDisplay,
    sameAs: [
      studio.contacts.telegram,
      studio.contacts.instagram,
      studio.contacts.whatsapp,
    ],
  };

  return (
    <html lang="ru" className="h-full">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased min-h-full flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
