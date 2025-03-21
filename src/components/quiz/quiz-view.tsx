"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { DeleteQuizButton } from "./quiz-delete-button";

// Type definitions based on your Prisma schema
type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
};

type Question = {
  id: string;
  text: string;
  explanation?: string | null;
  quizId: string;
  userAnswer?: string | null;
  options: Option[];
};

type TopicInsight = {
  id: string;
  topic: string;
  insight: string;
  reportId: string;
};

type ResourceLink = {
  id: string;
  topic: string;
  url: string;
  reportId: string;
};

type Report = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  summary: string;
  topicInsights: TopicInsight[];
  resourceLinks: ResourceLink[];
};

type Quiz = {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  attempted: boolean;
  numQuestions: number;
  correctQuestions?: number | null;
  timeLimit: number; // in seconds
  score?: number | null;
  questions: Question[];
  report?: Report | null;
  reportId?: string | null;
};

export default function QuizComponent({ quiz }: { quiz: Quiz }) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  // const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60);
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add this ref to ensure we have access to the latest selectedOptions state
  const selectedOptionsRef = useRef(selectedOptions);

  // Update the ref whenever selectedOptions changes
  useEffect(() => {
    selectedOptionsRef.current = selectedOptions;
  }, [selectedOptions]);

  // Format time for display in hours:minutes:seconds format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer effect
  useEffect(() => {
    if (quiz.attempted) return; // Don't run timer if quiz already attempted

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use the ref to access the most up-to-date selectedOptions
          submitQuiz(selectedOptionsRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.attempted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle option selection
  const handleOptionSelect = (questionId: string, optionId: string) => {
    if (quiz.attempted) return; // Don't allow changes if quiz already attempted

    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Navigate between questions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // New function to handle the actual submission
  const submitQuiz = async (options: Record<string, string>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Calculate correct answers and prepare data for submission
      const answeredQuestions = quiz.questions.map((question) => ({
        id: question.id,
        userAnswer: options[question.id] || null,
      }));

      // Calculate score
      const correctAnswers = quiz.questions.filter((question) => {
        const selectedOptionId = options[question.id];
        if (!selectedOptionId) return false;

        const selectedOption = question.options.find(
          (opt) => opt.id === selectedOptionId
        );
        return selectedOption?.isCorrect || false;
      }).length;

      const score = (correctAnswers / quiz.questions.length) * 100;

      // Make API call to save the attempt
      const response = await fetch(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answeredQuestions,
          correctAnswers,
          score,
          timeSpent: quiz.timeLimit - timeRemaining,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      // Reload the page to get the updated quiz with results
      router.refresh();
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("There was an error submitting your quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit quiz handler for button click
  const handleSubmit = () => {
    submitQuiz(selectedOptions);
  };

  // Render current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <DeleteQuizButton quizId={quiz.id} />
              <Badge
                variant={
                  quiz.difficulty === "easy"
                    ? "default"
                    : quiz.difficulty === "medium"
                    ? "secondary"
                    : "destructive"
                }
              >
                {quiz.difficulty}
              </Badge>
            </div>
          </div>

          {!quiz.attempted && (
            <div className="bg-amber-100 p-4 rounded-md flex items-center gap-2 mt-4">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-700">
                  Time Remaining: {formatTime(timeRemaining)}
                </p>
                <p className="text-sm text-amber-600">
                  Your quiz will be automatically submitted when the timer ends
                </p>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {quiz.attempted && quiz.report ? (
            // Report View
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  Quiz Performance Summary
                </h3>
                <div className="flex gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {quiz.score?.toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-600">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {quiz.correctQuestions}
                    </div>
                    <div className="text-sm text-slate-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {quiz.numQuestions - (quiz.correctQuestions || 0)}
                    </div>
                    <div className="text-sm text-slate-600">Incorrect</div>
                  </div>
                </div>
                <p className="text-slate-700">{quiz.report.summary}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Topic Insights</h3>
                <div className="space-y-3">
                  {quiz.report.topicInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className="bg-white p-3 rounded-md shadow-sm border"
                    >
                      <div className="font-medium text-blue-700">
                        {insight.topic}
                      </div>
                      <p className="text-sm text-slate-700">
                        {insight.insight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Resource Links</h3>
                <div className="space-y-2">
                  {quiz.report.resourceLinks.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 bg-white rounded border hover:bg-blue-50 transition"
                    >
                      <div className="font-medium">{resource.topic}</div>
                      <div className="text-xs text-blue-600 truncate">
                        {resource.url}
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Questions with answers */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Review Questions</h3>
                <div className="space-y-6">
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">
                        {index + 1}. {question.text}
                      </h4>
                      <div className="space-y-2 ml-4">
                        {question.options.map((option) => {
                          const isUserSelected =
                            question.userAnswer === option.id;
                          let bgColor = "";
                          let borderColor = "";
                          let icon = null;

                          if (option.isCorrect) {
                            // Correct option is always green
                            bgColor = "bg-green-50";
                            borderColor = "border-green-200";
                            icon = (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            );
                          } else if (isUserSelected) {
                            // User selected wrong option
                            bgColor = "bg-red-50";
                            borderColor = "border-red-200";
                            icon = <XCircle className="h-5 w-5 text-red-500" />;
                          }

                          return (
                            <div
                              key={option.id}
                              className={`flex items-center gap-2 p-2 border rounded ${bgColor} ${borderColor} ${
                                isUserSelected ? "border-2" : ""
                              }`}
                            >
                              {icon && <div>{icon}</div>}
                              <div>{option.text}</div>
                              {isUserSelected && !option.isCorrect && (
                                <div className="ml-auto text-xs text-red-500 font-medium">
                                  Your answer
                                </div>
                              )}
                              {option.isCorrect && !isUserSelected && (
                                <div className="ml-auto text-xs text-green-500 font-medium">
                                  Correct answer
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {question.explanation && (
                        <div className="mt-3 bg-blue-50 p-3 rounded text-sm">
                          <div className="font-medium">Explanation:</div>
                          <div>{question.explanation}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Quiz Taking View
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm text-slate-500">
                <span>
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <span>
                  {Object.keys(selectedOptions).length} of{" "}
                  {quiz.questions.length} answered
                </span>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4">
                  {currentQuestion.text}
                </h3>
                <div className="space-y-3 ml-2">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedOptions[currentQuestion.id] === option.id
                          ? "bg-blue-50 border-blue-300"
                          : "hover:bg-slate-50"
                      }`}
                      onClick={() =>
                        handleOptionSelect(currentQuestion.id, option.id)
                      }
                    >
                      {option.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>

                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <Button onClick={goToNextQuestion}>Next</Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {!quiz.attempted && (
          <CardFooter>
            <div className="w-full">
              <Separator className="my-2" />
              <div className="mt-4 grid grid-cols-10 gap-1">
                {quiz.questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`h-8 w-full flex items-center justify-center rounded-md cursor-pointer text-sm ${
                      currentQuestionIndex === index
                        ? "bg-blue-600 text-white"
                        : selectedOptions[q.id]
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
