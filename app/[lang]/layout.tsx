import { languages, type Language } from "@/app/_lib/config/i18n";
import { LanguageProvider } from "@/app/_context/LanguageContext";

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const validLang = languages.includes(lang as Language)
    ? (lang as Language)
    : "en";

  return <LanguageProvider lang={validLang}>{children}</LanguageProvider>;
}
