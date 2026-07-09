import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { studio } from "@/content/studio";

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
    "Разрабатываем интерьеры в стиле винтажа и ретрофутуризма. Полный цикл: от дизайн-проекта до готового помещения — комплектация, реализация, декор, арт-объекты. Студия в Ташкенте.",
  keywords: [
    "дизайн интерьера Ташкент",
    "дизайн-проект",
    "комплектация интерьера",
    "студия дизайна интерьера",
    "дизайнер интерьера Ташкент",
    "арт-объекты на заказ",
    "винтаж и ретрофутуризм",
    "ATRIUM",
  ],
  authors: [{ name: studio.founder }],
  openGraph: {
    title: `${studio.name} — студия дизайна интерьеров | Дизайн-проект и комплектация под ключ`,
    description: studio.description,
    url: studio.url,
    siteName: studio.name,
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: studio.url,
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
    address: {
      "@type": "PostalAddress",
      addressLocality: studio.city,
      addressCountry: "UZ",
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
