// src/app/[lang]/layout.tsx
import type { Metadata } from "next";
import { languages, type Language } from "../_lib/config/i18n";
import { LanguageProvider } from "../_context/LanguageContext";
import { inter } from "../_lib/fonts";
import GoogleAnalytics from "../_components/GoogleAnalytics";
import "@/app/_styles/globals.scss";

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: {
    template: "%s - ARKM Studio",
    default: "ARKM Studio",
  },
  authors: [{ name: "ARKM Studio" }],
  creator: "ARKM Studio",
  publisher: "ARKM Studio",
};

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const validLang = languages.includes(lang as Language)
    ? (lang as Language)
    : "en";

  return (
    <html lang={validLang}>
      <head>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/mke4enw.css"
          // as="style"
        />
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <LanguageProvider lang={validLang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
