export interface QuizGenerationInput {
  title: string;
  numQuestions: number;
  description: string;
  difficulty: string;
}

export interface GenerateQuizFromDocumentInput {
  file: Base64URLString;
  difficulty: string;
  numQuestions: number;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  text: string;
  explanation?: string;
  options?: QuestionOption[];
}

export interface GeneratedQuiz {
  title: string;
  description: string;
  difficulty: string; // Added to match schema
  questions: Question[];
  reportId: string; // Added to match the schema relationship
}

export interface CreateQuizFormData {
  title: string;
  description: string;
  questionTypes: string[];
  difficulty: string;
  numQuestions: number;
  fileInput?: File | null; // Changed from string to File | null to better represent file input
  fileName?: string; // Added to match schema
  userId: string; // Added to match schema
  reportId: string; // Added to match required relation
}

// Adding additional interfaces to match schema models
export interface TopicInsight {
  topic: string;
  insight: string;
}

export interface ResourceLink {
  topic: string;
  url: string;
}

export interface Report {
  summary: string;
  topicInsights: TopicInsight[];
  resourceLinks: ResourceLink[];
}
