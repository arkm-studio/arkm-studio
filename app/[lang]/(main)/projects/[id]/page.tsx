import ProjectDetails from "@/app/_components/ProjectDetails";
import { Language } from "@/app/_lib/config/i18n";
import { PortfolioDictionary } from "@/app/_types/dictionary/portfolio.types";
import { ProjectDetailsDictionary } from "@/app/_types/dictionary/projectDetails.types";
import {
  getPageDictionary,
  portfolioDictionary,
  projectDetailsDictionary,
} from "@/app/_utils/dictionary";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: {
    lang: Language;
    id: string;
  };
}

export async function generateStaticParams() {
  // English is the default locale
  const portfolioDictionary = await import(
    "@/app/_lib/locales/en/portfolio.json"
  );

  return portfolioDictionary.default.projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { lang, id } = params;

  // Get dictionary
  const portfolioDictionaryData = await getPageDictionary<PortfolioDictionary>(
    portfolioDictionary,
    lang
  );

  const project = portfolioDictionaryData.projects.find(
    (project) => project.id === id
  );

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Project Details`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, id } = params;

  // Get portfolioDictionary
  const portfolioDictionaryData = await getPageDictionary<PortfolioDictionary>(
    portfolioDictionary,
    lang
  );

  // Get projectDetailsDictionary
  const projectDetailsDictionaryData =
    await getPageDictionary<ProjectDetailsDictionary>(
      projectDetailsDictionary,
      lang
    );

  const project = portfolioDictionaryData.projects.find(
    (project) => project.id === id
  );

  if (!project) {
    notFound();
  }

  // Map project data to ProjectDetailsProps exactly matching the component interface
  const projectDetailsData = {
    title: project.title,
    description: project.description,
    introText: project.introText,
    client: project.client || "",
    projectType: project.projectType || "",
    platform: project.platform || "",
    expertise: project.expertise || [],
    technologies: project.technologies.map((tech) => ({ name: tech })),
    whatWeDid: project.whatWeDid || [],
    finalProduct: project.finalProduct || "",
    projectUrl: project.liveUrl || "",
    images: {
      featured: project.images[0]?.src || "",
      gallery: project.images.slice(1).map((img) => img.src),
    },
    studioName: "José Pablo Karam Dolores.",
    year: new Date().getFullYear().toString(),
    // Labels from projectDetailsDictionary
    whatWeDidLabel: projectDetailsDictionaryData.whatWeDidLabel,
    finalProductLabel: projectDetailsDictionaryData.finalProductLabel,
    seeWorkLabel: projectDetailsDictionaryData.seeWorkLabel,
    clientLabel: projectDetailsDictionaryData.clientLabel,
    projectTypeLabel: projectDetailsDictionaryData.projectTypeLabel,
    platformLabel: projectDetailsDictionaryData.platformLabel,
    expertiseLabel: projectDetailsDictionaryData.expertiseLabel,
    technologyLabel: projectDetailsDictionaryData.technologyLabel,
  };

  return <ProjectDetails {...projectDetailsData} />;
}
