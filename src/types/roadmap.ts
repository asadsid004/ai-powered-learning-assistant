export type ResourceType =
  | "COURSE"
  | "YOUTUBE"
  | "TUTORIAL"
  | "BOOK"
  | "VIDEO"
  | "ARTICLE"
  | "OTHER";

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  durationInDays: number;
  order: number;
  progress: number;
  isCompleted: boolean;
  tasks: Task[];
  resources: Resource[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  goal: string;
  durationInWeeks: number;
  progress: number;
  milestones: Milestone[];
}
