// Update the ProjectData interface to include missing properties
export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string; // Added
  introText: string; // Added
  client?: string;
  projectType?: string;
  platform?: string;
  expertise?: string[];
  technologies: string[];
  featuredImage: ProjectImage;
  images: ProjectImage[];
  whatWeDid?: string[];
  finalProduct?: string;
  liveUrl?: string;
  githubUrl?: string;
  labels?: any;
}

export interface PortfolioDictionary {
  title: string;
  subtitle?: string;
  projects: ProjectData[];
}
