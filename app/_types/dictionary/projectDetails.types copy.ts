// Tipos base
// export type ThemeType = 'light' | 'dark' | 'custom';
// export type StatusValue = 'inProgress' | 'onHold' | 'completed' | 'cancelled';
// export type IconName = 'Clock' | 'GitPullRequest' | 'Target' | 'Users' | 'LoaderCircle' | 'Pause' | 'CheckCircle' | 'XCircle';
// export type ViewOption = 'year' | 'month' | 'week';
// export type ContentExtension = 'pdf' | 'doc' | 'docx' | 'fig' | 'sketch' | 'xlsx' | 'xls' | 'csv' | 'png' | 'jpg' | 'jpeg';
export type ThemeType = string;
export type StatusValue = string;
export type IconName = string;
export type ViewOption = string;
export type ContentExtension = string;

// Meta
export interface ProjectDetailsMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
}

// Header
export interface ProjectDetailsHeader {
  title: string;
  subtitle: string;
  aria: string;
}

// Project Header
export interface ProjectMetric {
  label: string;
  icon: IconName;
  variant: string;
  tooltip: string;
  complete?: string; // Para milestones
  active?: string; // Para teamMembers
}

export interface ProjectStatus {
  label: string;
  value: StatusValue;
  icon: IconName;
  color: string;
}

export interface ProjectHeaderProgress {
  label: string;
  trend: string;
  percentage: string;
}

export interface ProjectHeaderOwner {
  label: string;
}

export interface ProjectHeaderGroup {
  aria: string;
  label: string;
}

export interface ProjectHeaderDictionary {
  group: ProjectHeaderGroup;
  progress: ProjectHeaderProgress;
  owner: ProjectHeaderOwner;
  metrics: {
    timeline: ProjectMetric;
    milestones: ProjectMetric;
    deliverables: ProjectMetric;
    teamMembers: ProjectMetric;
  };
  statuses: {
    inProgress: ProjectStatus;
    onHold: ProjectStatus;
    completed: ProjectStatus;
    cancelled: ProjectStatus;
  };
}

// Tabs
export interface ProjectTab {
  label: string;
  index: number;
  title: string;
}

export interface ProjectTabs {
  timeline: ProjectTab;
  deliverables: ProjectTab;
}

// Gantt View
export interface GanttViewOption {
  value: ViewOption;
  label: string;
}

export interface StatusLegendItem {
  label: string;
  color: string;
}

export interface StageCardLabels {
  dependencies: string;
  milestones: string;
}

export interface GanttTimelineHeader {
  weekDays: {
    short: string[];
    long: string[];
  };
  months: {
    short: string[];
    long: string[];
  };
  aria: {
    weekendDay: string;
    monthStart: string;
  };
}

export interface GanttViewDictionary {
  controls: {
    viewOptions: GanttViewOption[];
    statusLegend: StatusLegendItem[];
  };
  timeline: {
    header: GanttTimelineHeader;
  };
  stageCard: {
    labels: StageCardLabels;
  };
}

// Deliverables View
export interface CardLabels {
  dueDate: string;
  contents: string;
  items: string;
  noContent: string;
  additionalInfo: string;
  viewDetails: string;
  hideDetails: string;
}

export interface ToggleDetailsActions {
  show: string;
  hide: string;
}

export interface ContentType {
  extensions?: ContentExtension[];
  label: string;
}

export interface ContentTypes {
  document: ContentType;
  design: ContentType;
  spreadsheet: ContentType;
  image: ContentType;
  component: ContentType;
  other: ContentType;
}

export interface DeliverableCardDictionary {
  labels: CardLabels;
  actions: {
    toggleDetails: ToggleDetailsActions;
  };
}

export interface DeliverablesViewDictionary {
  texts: {
    deliverable: string;
    deliverables: string;
  };
  card: DeliverableCardDictionary;
  contentTypes: ContentTypes;
}

// Messages & Errors
export interface ConfirmActions {
  deleteDeliverable: string;
  removeTeamMember: string;
}

export interface ProjectMessages {
  loading: string;
  error: string;
  noData: string;
  confirmActions: ConfirmActions;
}

export interface ProjectErrors {
  loadFailed: string;
  updateFailed: string;
  insufficientPermissions: string;
}

// Accessibility
export interface ProjectAccessibility {
  timelineTab: string;
  deliverablesTab: string;
  ganttGrid: string;
  stageList: string;
  deliverablesList: string;
}

// Interfaz principal del diccionario
export interface ProjectDetailsDictionary {
  meta: ProjectDetailsMeta;
  header: ProjectDetailsHeader;
  projectHeader: ProjectHeaderDictionary;
  tabs: ProjectTabs;
  ganttView: GanttViewDictionary;
  deliverablesView: DeliverablesViewDictionary;
  messages: ProjectMessages;
  errors: ProjectErrors;
  accessibility: ProjectAccessibility;
}

// Tipo para el soporte de idiomas
export type ProjectDetailsLanguage = "es" | "en";

// Diccionario completo con soporte multiidioma
export type ProjectDetailsI18nDictionary = Record<
  ProjectDetailsLanguage,
  ProjectDetailsDictionary
>;
