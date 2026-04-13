"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthContext } from "@/context/AuthContext";
import FeatureGate from "@/components/auth/FeatureGate";
import LoadingScreen from "../system/LoadingScreen";

interface StudentUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  studentRecord?: {
    grade: string;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  grade: string;
}

interface DisciplineRecord {
  id: string;
  type: string;
  points: number;
  comment?: string;
  date: string;
}

interface BorrowingRecord {
  id: string;
  borrowedAt: string;
  dueDate?: string;
  book?: {
    title: string;
  };
}

interface DisciplineData {
  points: number;
  records: DisciplineRecord[];
}

interface LibraryData {
  active: BorrowingRecord[];
  history: BorrowingRecord[];
}

export default function StudentDashboard() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const schoolId = params.id as string;

  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    attendance: 0,
    finance: { balance: 0, paid: 0, total: 0 },
    overallProgress: 0,
  });
  const [discipline, setDiscipline] = useState<DisciplineData>({ points: 100, records: [] });
  const [library, setLibrary] = useState<LibraryData>({ active: [], history: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!schoolId) return;
      try {
        const enabledFeatures = user?.school?.features || [];
        const [coursesRes, financeRes, disciplineRes, libraryRes] = await Promise.all([
          api.get('/holiday-lms/courses', { params: { grade: (user as StudentUser)?.studentRecord?.grade || 'S3' } }),
          enabledFeatures.includes('finance') 
            ? api.get(`/finance/student/${user?.id}/summary`).catch(() => ({ data: { balance: 500, paid: 1500, total: 2000 } }))
            : Promise.resolve({ data: { balance: 0, paid: 0, total: 0 } }),
          enabledFeatures.includes('discipline')
            ? api.get(`/discipline/student/${user?.id}`).catch(() => ({ data: { points: 100, records: [] } }))
            : Promise.resolve({ data: { points: 0, records: [] } }),
          enabledFeatures.includes('library')
            ? api.get(`/library/student/${user?.id}`).catch(() => ({ data: { active: [], history: [] } }))
            : Promise.resolve({ data: { active: [], history: [] } }),
        ]);

        setCourses(coursesRes.data);
        setStats(prev => ({
          ...prev,
          finance: financeRes.data,
        }));
        setDiscipline(disciplineRes.data);
        setLibrary(libraryRes.data);
      } catch (error) {
        console.error("Failed to fetch student data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [schoolId, user]);

  if (isLoading) {
    return <LoadingScreen message="Preparing your learning portal..." fullScreen={false} />;
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-[#0f172a] min-h-full">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            You have <span className="text-primary font-bold">{courses.length} courses</span> available for this academic break.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Date</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[32px]">calendar_today</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 group hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined">event_available</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Attendance Score</h3>
          </div>
          <div className="flex items-end justify-between">
            <h4 className="text-3xl font-black text-gray-900 dark:text-white">94%</h4>
            <div className="w-24 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[94%] transition-all"></div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 font-medium">You&apos;ve missed only 2 sessions this month.</p>
        </div>

        {/* Finance Card */}
        <FeatureGate feature="finance">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Fee Balance</h3>
            </div>
            <div className="flex items-end justify-between">
              <h4 className="text-3xl font-black text-gray-900 dark:text-white">
                ${stats.finance.balance}
              </h4>
              <span className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black rounded-lg uppercase tracking-tighter">
                Outstanding
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">Next payment due by end of month.</p>
          </div>
        </FeatureGate>

        {/* Course Progress Card */}
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 group hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Holiday Progress</h3>
          </div>
          <div className="flex items-end justify-between">
            <h4 className="text-3xl font-black text-gray-900 dark:text-white">0%</h4>
            <div className="size-10 rounded-full border-4 border-purple-500/20 border-t-purple-500 flex items-center justify-center text-[10px] font-black">
              0%
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 font-medium">Start your first course to track progress.</p>
        </div>

        {/* Discipline Card */}
        <FeatureGate feature="discipline">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 group hover:border-amber-500/30 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Conduct Points</h3>
            </div>
            <div className="flex items-end justify-between">
              <h4 className="text-3xl font-black text-gray-900 dark:text-white">{discipline.points}</h4>
              <span className={`px-2 py-1 ${discipline.points >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} text-[10px] font-black rounded-lg uppercase`}>
                {discipline.points >= 80 ? 'Excellent' : 'At Risk'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">You have {discipline.records.length} total incidents recorded.</p>
          </div>
        </FeatureGate>

        {/* Library Card */}
        <FeatureGate feature="library">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined">local_library</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Library Books</h3>
            </div>
            <div className="flex items-end justify-between">
              <h4 className="text-3xl font-black text-gray-900 dark:text-white">{library.active.length}</h4>
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-lg uppercase">
                Borrowed
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-medium">{library.active.length > 0 ? 'Visit library to return books.' : 'No active borrowings.'}</p>
          </div>
        </FeatureGate>
      </div>

      {/* Holiday LMS Section */}
      <FeatureGate feature="holiday-lms">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Holiday Packages</h2>
              <p className="text-sm text-gray-500 font-medium">Learn and earn certificates during your academic break.</p>
            </div>
            <button className="px-4 py-2 text-primary font-bold hover:bg-primary/5 rounded-xl transition-colors flex items-center gap-1">
               View All Packages
               <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                onClick={() => router.push(`/school/${schoolId}/student/lms/${course.id}`)}
                className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="h-40 bg-gradient-to-br from-primary/10 to-indigo-500/10 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                   <span className="material-symbols-outlined text-primary/30 text-[80px] group-hover:scale-110 transition-transform">menu_book</span>
                   <div className="absolute top-3 left-3 px-3 py-1 bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-primary">
                      {course.grade}
                   </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 font-medium leading-relaxed">
                  {course.description || "No description provided for this package."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                    Progressive
                  </div>
                  <span className="text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-full">
                    Start Course
                  </span>
                </div>
              </div>
            ))}

            {courses.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                 <span className="material-symbols-outlined text-6xl mb-4 opacity-20">inventory_2</span>
                 <p className="text-lg font-bold">No packages assigned yet.</p>
                 <p className="text-sm font-medium">Check back later or contact your school admin.</p>
              </div>
            )}
          </div>
        </div>
      </FeatureGate>

      {/* Library & Discipline Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Borrowings */}
        <FeatureGate feature="library" fallback={<div className="lg:col-span-2 hidden"></div>}>
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Active Borrowings</h3>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-full uppercase">
                {library.active.length} Books
              </span>
            </div>
            
            <div className="space-y-4">
              {library.active.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all text-gray-900 dark:text-white">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <span className="material-symbols-outlined">book</span>
                    </div>
                    <div>
                      <h4 className="font-bold">{record.book?.title}</h4>
                      <p className="text-xs text-gray-500">Borrowed: {new Date(record.borrowedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase block mb-1">Due Date</span>
                    <p className="text-sm font-bold">
                      {record.dueDate ? new Date(record.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}

              {library.active.length === 0 && (
                <div className="py-8 text-center text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">auto_stories</span>
                  <p className="font-bold">No active borrowings</p>
                </div>
              )}
            </div>
          </div>
        </FeatureGate>

        {/* Conduct Summary */}
        <FeatureGate feature="discipline">
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-6">Conduct History</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-gray-100 dark:before:bg-white/5">
              {discipline.records.map((record) => (
                <div key={record.id} className="relative pl-10">
                  <div className={`absolute left-1 top-1 size-9 rounded-full border-4 border-white dark:border-[#1e293b] flex items-center justify-center z-10 ${
                    record.points > 10 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}>
                    <span className="material-symbols-outlined text-white text-sm">
                      {record.points > 10 ? 'priority_high' : 'check'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{record.type}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{record.comment || 'No description provided.'}</p>
                    <p className="text-[10px] font-black text-primary uppercase mt-2">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}

              {discipline.records.length === 0 && (
                <div className="py-8 text-center text-gray-400 relative">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">verified</span>
                  <p className="font-bold">Clear Record</p>
                  <p className="text-xs">No disciplinary incidents reported.</p>
                </div>
              )}
            </div>
          </div>
        </FeatureGate>
      </div>

      {/* Announcements / Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl border border-gray-100 dark:border-white/5">
             <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Upcoming School Events</h3>
             <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                    <div className="size-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex flex-col items-center justify-center text-amber-600">
                       <span className="text-[10px] font-black uppercase">Apr</span>
                       <span className="text-lg font-black">{12 + i}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Main Campus Open Day {i}</h4>
                      <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-tighter">09:00 AM • Main Hall</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-primary rounded-3xl p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight whitespace-pre-line">Need Help with{"\n"}Your Courses?</h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[240px]">
                    Access our 24/7 student support for any technical or academic issues.
                  </p>
                </div>
                <button className="mt-8 px-6 py-3 bg-white text-primary font-black rounded-2xl shadow-xl shadow-black/10 hover:scale-105 transition-transform w-fit">
                   Contact Support
                </button>
             </div>
             <span className="absolute bottom-4 right-4 material-symbols-outlined text-[100px] opacity-10">support_agent</span>
          </div>
      </div>
    </div>
  );
}
