import {
  MetaContent,
  AccessibilityLabels,
  FilterOptions,
  PageHeader,
  ProjectFilters,
} from "./base.types";

export interface StatsItem {
  label: string;
  tooltip: string;
  aria: string;
  description: string;
}

export interface DashboardStats {
  group: AccessibilityLabels;
  items: {
    activeProjects: StatsItem;
    completed: StatsItem;
    overallProgress: StatsItem;
    notifications: StatsItem;
  };
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectSection {
  title: string;
  subtitle: string;
  empty: string;
  aria: string;
  actions: Record<string, string>;
  filters: ProjectFilters;
  sortOptions: Record<string, string>;
  viewOptions: Record<string, string>;
  labels: Record<string, string>;
  links: Record<string, ProjectLink>;
  statuses: Record<string, string>;
}

export interface FilesSection {
  title: string;
  subtitle: string;
  empty: string;
  aria: string;
  actions: Record<string, string>;
  filters: FilterOptions;
  labels: Record<string, string>;
}

export interface NotificationsSection {
  title: string;
  subtitle: string;
  empty: string;
  aria: string;
  actions: Record<string, string>;
  types: Record<string, string>;
  filters: FilterOptions;
  timeLabels: Record<string, string>;
}

export interface DashboardDictionary {
  meta: MetaContent;
  header: PageHeader;
  stats: DashboardStats;
  sections: {
    projects: ProjectSection;
    recentFiles: FilesSection;
    notifications: NotificationsSection;
  };
  tooltips: Record<string, string>;
  messages: Record<string, string>;
  errors: Record<string, string>;
  accessibility: Record<string, string>;
  dialogs: {
    refresh: {
      title: string;
      message: string;
      confirm: string;
      cancel: string;
    };
    settings: {
      title: string;
      save: string;
      cancel: string;
    };
  };
}
