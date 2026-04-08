"use client";

import { useState } from "react";
import api from "@/lib/api";

interface Question {
  id: string;
  text: string;
  options: string[];
  points: number;
}

interface QuizViewerProps {
  activityId: string;
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function QuizViewer({ activityId, questions, onComplete }: QuizViewerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; completed: boolean } | null>(null);

  const handleSelect = (questionId: string, option: string) => {
    if (result) return;
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/holiday-lms/activities/complete', {
        activityId,
        responses: answers
      });
      
      setResult({
        score: parseFloat(response.data.score),
        completed: true
      });
      onComplete(parseFloat(response.data.score));
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("There was an error submitting your quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl">
        <div className="size-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[48px]">check_circle</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight text-center">Quiz Completed!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center font-medium leading-relaxed">
          Your responses have been recorded and marked.
        </p>
        
        <div className="bg-gray-50 dark:bg-black/20 p-8 rounded-2xl w-full max-w-sm flex flex-col items-center border border-gray-100 dark:border-white/5">
           <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Your Score</p>
           <h3 className={`text-5xl font-black ${result.score >= 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
             {Math.round(result.score)}%
           </h3>
        </div>

        <p className="mt-8 text-xs font-bold text-gray-400">
          The next activity is now unlocked in your sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex gap-4 mb-6">
              <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black shrink-0">
                {idx + 1}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{q.text}</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-3 ml-12">
              {q.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(q.id, option)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                    answers[q.id] === option
                      ? 'bg-primary/5 border-primary text-primary shadow-inner shadow-primary/5'
                      : 'bg-gray-50/50 dark:bg-black/5 border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:border-primary/30'
                  }`}
                >
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    answers[q.id] === option ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answers[q.id] === option && <div className="size-2.5 rounded-full bg-primary" />}
                  </div>
                  <span className="text-sm font-semibold">{option}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-12 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
        >
          {isSubmitting ? (
            <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">send</span>
          )}
          <span>{isSubmitting ? "Submitting..." : "Submit All Answers"}</span>
        </button>
      </div>
    </div>
  );
}
