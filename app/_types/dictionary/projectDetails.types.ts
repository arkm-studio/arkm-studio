export interface Technology {
  name: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectImages {
  featured: string;
  gallery: string[];
}

export interface ProjectDetailsData {
  title: string;
  description: string;
  introText: string;
  client: string;
  projectType: string;
  platform: string;
  expertise: string[];
  technologies: Technology[];
  whatWeDid: string[];
  finalProduct: string;
  projectUrl: string;
  images: ProjectImages;
  studioName: string;
  year: string;
}

export interface ProjectDetailsLabels {
  contactLabel: string;
  studioLabel: string;
  portfolioLabel: string;
  clientsLabel: string;
  servicesLabel: string;
  backLabel: string;
  whatWeDidLabel: string;
  finalProductLabel: string;
  seeWorkLabel: string;
  clientLabel: string;
  projectTypeLabel: string;
  platformLabel: string;
  expertiseLabel: string;
  technologyLabel: string;
}

// ProjectDetailsDictionary is just the labels
export type ProjectDetailsDictionary = ProjectDetailsLabels;
