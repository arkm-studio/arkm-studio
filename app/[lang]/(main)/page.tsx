import { Metadata } from "next";
import classNames from "classnames/bind";
import { Language } from "@/app/_lib/config/i18n";
import {
  getPageDictionary,
  homeDictionary,
  mainLayoutDictionary,
  portfolioDictionary,
} from "@/app/_utils/dictionary";
import { HomeDictionary } from "@/app/_types/dictionary/home.types";
import { UIProvider } from "@/app/_context/UIContext";
import { Hero } from "@/app/_modules/Hero";
import SolutionsModule from "@/app/_modules/SolutionsModule";
import ShaderBackground from "@/app/_modules/ShaderBackground";
import MethodologyPreview from "@/app/_modules/MethodologyPreview";
import WorkExperienceSection from "@/app/_modules/WorkExperience";
import ContactSection from "@/app/_modules/ContactSection";
import ProjectCarousel from "@/app/_components/ProjectCarousel"; // Importamos el componente
import Snackbar from "@/app/_components/Snackbar";
import GlowBackground from "@/app/_components/GlowBackground";
import styles from "./page.module.scss";
import { MainLayoutDictionary } from "@/app/_types/dictionary/mainLayout.types";
import {
  PortfolioDictionary,
  ProjectImage,
} from "@/app/_types/dictionary/portfolio.types";

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

  const portfolioDict = await getPageDictionary<PortfolioDictionary>(
    portfolioDictionary,
    lang
  );

  // Get main layout dictionary for contact section
  const mainLayoutDict = await getPageDictionary<MainLayoutDictionary>(
    mainLayoutDictionary,
    lang
  );

  // Formatear los datos para el componente de proyectos correctamente
  const projectsData = portfolioDict.projects.map((project) => {
    // Helper function to extract image src safely
    const getImageSrc = (image: string | ProjectImage | undefined): string => {
      if (!image) return "/images/placeholder-project.jpg";

      // If it's already a string, return it
      if (typeof image === "string") return image;

      // If it's a ProjectImage object, extract the src
      if (typeof image === "object" && "src" in image) return image.src;

      // Fallback
      return "/images/placeholder-project.jpg";
    };

    return {
      id: project.id,
      title: project.title,
      featured_image: getImageSrc(project.featuredImage),
      slug: project.id,
      client: project.client,
      projectType: project.projectType,
    };
  });

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
          {/* Componente de carrusel */}
          <ProjectCarousel
            title={portfolioDict.title || "Success Stories"}
            subtitle={
              portfolioDict.subtitle ||
              "OUR PORTFOLIO SPEAKS LOUDER THAN WORDS. IT'S A SHOWCASE OF SUCCESS STORIES, A TESTAMENT TO OUR COLLABORATIVE APPROACH, AND A PREVIEW OF WHAT WE CAN BRING TO YOUR DIGITAL TABLE."
            }
            projects={projectsData}
            customAnchorId="portfolio"
          />

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
