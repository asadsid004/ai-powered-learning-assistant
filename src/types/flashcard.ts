export interface FlashcardGenerationInput {
  title: string;
  description?: string;
  numFlashcards?: number;
}

export interface GenerateFlashcardFromDocumentInput {
  file: Base64URLString; // Document file
  numFlashcards: number;
}

export interface Flashcard {
  front: string;
  back: string;
  hint?: string;
}

export interface FlashcardSet {
  title: string;
  description: string;
  flashcards: Flashcard[];
}
