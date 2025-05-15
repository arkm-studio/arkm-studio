import { Metadata } from "next";
import { Language } from "@/app/_lib/config/i18n";
import {
  getPageDictionary,
  portfolioDictionary,
  homeDictionary,
  mainLayoutDictionary,
} from "@/app/_utils/dictionary";
import { HomeDictionary } from "@/app/_types/dictionary/home.types";
import { UIProvider } from "@/app/_context/UIContext";
import Snackbar from "@/app/_components/Snackbar";
import PortfolioModule from "@/app/_modules/PortfolioModule";
import GlowBackground from "@/app/_components/GlowBackground";
import styles from "./page.module.scss";
import classNames from "classnames/bind";
import { PortfolioDictionary } from "@/app/_types/dictionary/portfolio.types";
import ContactSection from "@/app/_modules/ContactSection";
import { MainLayoutDictionary } from "@/app/_types/dictionary/mainLayout.types";

const cx = classNames.bind(styles);

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Language };
}): Promise<Metadata> {
  const homeDictionaryData = await getPageDictionary<HomeDictionary>(
    homeDictionary,
    lang
  );

  const meta = homeDictionaryData.meta;

  return {
    title: `Portfolio | ${meta.title}`,
    description: "Explore my web development projects and technical expertise.",
    keywords: [
      ...meta.keywords,
      "portfolio",
      "projects",
      "case studies",
      "web development portfolio",
    ],
    authors: meta.authors,
    creator: meta.creator,
    publisher: meta.publisher,
    openGraph: {
      title: `Portfolio | ${meta.title}`,
      description:
        "Explore my web development projects and technical expertise.",
      type: "website",
    },
  };
}

export default async function PortfolioPage({
  params: { lang },
}: {
  params: { lang: Language };
}) {
  const portfolioDictionaryData = await getPageDictionary<PortfolioDictionary>(
    portfolioDictionary,
    lang
  );

  // Get main layout dictionary for contact section
  const mainLayoutDict = await getPageDictionary<MainLayoutDictionary>(
    mainLayoutDictionary,
    lang
  );

  return (
    <UIProvider>
      <div className={cx("portfolio-page")}>
        <GlowBackground
          variant="gradient-black"
          className={cx("portfolio-page__glow")}
        >
          <PortfolioModule dictionary={portfolioDictionaryData} />
        </GlowBackground>
        <ContactSection
          dictionary={mainLayoutDict.contact}
          customAnchorId="contact"
        />
      </div>
      <Snackbar duration={6000} position="top" />
    </UIProvider>
  );
}
