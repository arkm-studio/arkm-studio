import { Metadata } from "next";
import classNames from "classnames/bind";
import { Language } from "@/app/_lib/config/i18n";
import {
  getPageDictionary,
  homeDictionary,
  mainLayoutDictionary,
} from "@/app/_utils/dictionary";
import { HomeDictionary } from "@/app/_types/dictionary/home.types";
import { UIProvider } from "@/app/_context/UIContext";
import { Hero } from "@/app/_modules/Hero";
import SolutionsModule from "@/app/_modules/SolutionsModule";
import ShaderBackground from "@/app/_modules/ShaderBackground";
import MethodologyPreview from "@/app/_modules/MethodologyPreview";
import WorkExperienceSection from "@/app/_modules/WorkExperience";
import ContactSection from "@/app/_modules/ContactSection";
import Snackbar from "@/app/_components/Snackbar";
import GlowBackground from "@/app/_components/GlowBackground";
import styles from "./page.module.scss";
import { MainLayoutDictionary } from "@/app/_types/dictionary/mainLayout.types";

const cx = classNames.bind(styles);

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Language };
}): Promise<Metadata> {
  const dictionary = await getPageDictionary<HomeDictionary>(
    homeDictionary,
    lang
  );
  const meta = dictionary.meta;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

export default async function Home({
  params: { lang },
}: {
  params: { lang: Language };
}) {
  const dictionary = await getPageDictionary<HomeDictionary>(
    homeDictionary,
    lang
  );

  // Get main layout dictionary for contact section
  const mainLayoutDict = await getPageDictionary<MainLayoutDictionary>(
    mainLayoutDictionary,
    lang
  );

  return (
    <UIProvider>
      <div className={cx("home-page")}>
        <ShaderBackground>
          <Hero
            dictionary={dictionary.hero}
            projectFormDictionary={dictionary.forms.projectForm}
          />
          <SolutionsModule
            dictionary={dictionary.solutions}
            customAnchorId="abilities"
          />
        </ShaderBackground>

        <GlowBackground variant="nebula">
          <MethodologyPreview
            dictionary={dictionary.methodology}
            customAnchorId="method"
          />

          <WorkExperienceSection
            customAnchorId="experience"
            dictionary={dictionary.workExperience}
          />
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
