"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import QuizViewer from "./QuizViewer";

interface Activity {
  id: string;
  title: string;
  type: 'READING' | 'VIDEO' | 'QUIZ';
  content: string;
  orderIndex: number;
  isCompleted: boolean;
  isLocked: boolean;
  quizQuestions?: { id: string; text: string; options: string[]; points: number }[];
}

interface Course {
  id: string;
  title: string;
  activities: Activity[];
}

export default function CoursePlayer() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.id as string;
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  const videoRef = useRef<HTMLIFrameElement>(null);

  const fetchCourse = useCallback(async () => {
    try {
      const response = await api.get(`/holiday-lms/courses/${courseId}`);
      setCourse(response.data);
      if (!currentActivityId && response.data.activities.length > 0) {
        // Find first unlocked or first non-completed activity
        const firstActive = response.data.activities.find((a: Activity) => !a.isCompleted && !a.isLocked) 
                          || response.data.activities[0];
        setCurrentActivityId(firstActive.id);
      }
    } catch (error) {
      console.error("Failed to fetch course player data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, currentActivityId]);

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId, fetchCourse]);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!currentActivityId) return;
      try {
        const response = await api.get(`/holiday-lms/activities/${currentActivityId}`);
        setCurrentActivity(response.data);
      } catch (error) {
        console.error("Failed to fetch activity content:", error);
      }
    };
    fetchActivity();
  }, [currentActivityId]);

  const markAsComplete = async () => {
    if (!currentActivityId || isCompleting) return;
    setIsCompleting(true);
    try {
      await api.post('/holiday-lms/activities/complete', { activityId: currentActivityId });
      // Refresh course data to update sidebar status
      await fetchCourse();
    } catch (error) {
      console.error("Failed to mark activity as complete:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
         <span className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-80 bg-white dark:bg-[#1e293b] border-r border-gray-100 dark:border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100 dark:border-white/5">
           <button 
             onClick={() => router.push(`/school/${schoolId}/student/dashboard`)}
             className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:opacity-70 transition-opacity"
           >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Dashboard
           </button>
           <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{course.title}</h2>
           <div className="mt-4 w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${(course.activities.filter(a => a.isCompleted).length / course.activities.length) * 100}%` }}
              />
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 text-right">
              {Math.round((course.activities.filter(a => a.isCompleted).length / course.activities.length) * 100)}% Complete
           </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {course.activities.map((activity, idx) => (
              <button
                key={activity.id}
                disabled={activity.isLocked}
                onClick={() => setCurrentActivityId(activity.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left relative group ${
                  currentActivityId === activity.id 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
                  : 'hover:bg-gray-50 dark:hover:bg-white/5'
                } ${activity.isLocked ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                   activity.isCompleted 
                   ? 'bg-emerald-500/20 text-emerald-500' 
                   : currentActivityId === activity.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                }`}>
                   <span className="text-xs font-black">{idx + 1}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black uppercase tracking-tighter mb-0.5 ${
                    currentActivityId === activity.id ? 'text-primary' : 'text-gray-400 font-bold'
                  }`}>
                    {activity.type}
                  </p>
                  <p className="text-sm font-bold truncate pr-6">{activity.title}</p>
                </div>

                {activity.isCompleted && (
                   <span className="material-symbols-outlined text-emerald-500 text-[18px] absolute right-4">check_circle</span>
                )}
                {activity.isLocked && (
                   <span className="material-symbols-outlined text-gray-400 text-[18px] absolute right-4">lock</span>
                )}
              </button>
            ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <div className="p-8 lg:p-12">
          {currentActivity ? (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                  {currentActivity.title}
                </h1>
                <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                   <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">
                        {currentActivity.type === 'READING' ? 'menu_book' : currentActivity.type === 'VIDEO' ? 'play_circle' : 'quiz'}
                      </span>
                      {currentActivity.type === 'READING' ? 'Reading Material' : currentActivity.type === 'VIDEO' ? 'Video Lesson' : 'Knowledge Quiz'}
                   </div>
                   {currentActivity.isCompleted && (
                     <div className="text-emerald-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Completed
                     </div>
                   )}
                </div>
              </div>

              {/* Content Renderers */}
              <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
                {currentActivity.type === 'READING' && (
                  <div className="p-8 lg:p-12">
                    <div className="prose prose-blue dark:prose-invert max-w-none prose-h1:text-3xl prose-h1:font-black prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed">
                       {/* Simplified reading renderer for now, using pre for markdown structure demo */}
                       <div className="whitespace-pre-wrap font-sans text-lg">
                         {currentActivity.content}
                       </div>
                    </div>
                    {!currentActivity.isCompleted && (
                      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex justify-center">
                        <button
                          onClick={markAsComplete}
                          disabled={isCompleting}
                          className="px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                          {isCompleting ? "Saving..." : "Mark as Finished"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {currentActivity.type === 'VIDEO' && (
                  <div className="aspect-video w-full bg-black flex items-center justify-center">
                    <iframe
                      ref={videoRef}
                      className="w-full h-full"
                      src={`${currentActivity.content}${currentActivity.content.includes('?') ? '&' : '?'}autoplay=0&controls=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => {
                        // In a real app, we'd use the YouTube Player API to detect finishing
                        // For this demo, we'll mark as complete after a timeout or manual button
                      }}
                    />
                    {/* Manual button for video completion in dev/demo */}
                    <div className="absolute bottom-4 right-4 z-20">
                         {!currentActivity.isCompleted && (
                            <button 
                                onClick={markAsComplete}
                                className="px-4 py-2 bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs font-black hover:bg-black transition-colors"
                            >
                                Finish Video
                            </button>
                         )}
                    </div>
                  </div>
                )}

                {currentActivity.type === 'QUIZ' && (
                  <div className="p-8 lg:p-12">
                     <QuizViewer 
                       activityId={currentActivity.id} 
                       questions={currentActivity.quizQuestions || []} 
                       onComplete={() => fetchCourse()} 
                     />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
               <span className="material-symbols-outlined text-6xl mb-4 animate-pulse">auto_stories</span>
               <p className="text-xl font-bold">Select an activity to begin learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
