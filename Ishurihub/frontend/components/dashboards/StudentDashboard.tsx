"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthContext } from "@/context/AuthContext";
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

  const enabledFeatures = user?.school?.features || [];

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-[#0f172a] min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Welcome back, {user?.name || 'Student'}. Here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative hidden md:block">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={() => router.push(`/school/${schoolId}/student/pocket-money`)}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <span className="hidden sm:inline">My Wallet</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Attendance Card */}
        <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-blue-500/20 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">event_available</span>
            </div>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg">
              Stable
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Score</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">94%</h3>
          </div>
        </div>

        {/* Finance Card */}
        {enabledFeatures.includes('finance') && (
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-emerald-500/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg">
                Outstanding
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fee Balance</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                ${stats.finance.balance}
              </h3>
            </div>
          </div>
        )}


        {/* Conduct Points */}
        {enabledFeatures.includes('discipline') && (
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-amber-500/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${
                discipline.points >= 80 ? 'text-green-600 bg-green-50 dark:bg-green-500/10' : 'text-red-600 bg-red-50 dark:bg-red-500/10'
              }`}>
                {discipline.points >= 80 ? 'Excellent' : 'At Risk'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conduct Points</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{discipline.points}</h3>
            </div>
          </div>
        )}

        {/* Library Card */}
        {enabledFeatures.includes('library') && (
          <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-indigo-500/20 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">local_library</span>
              </div>
              <span className="flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg">
                Borrowed
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Library Books</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{library.active.length}</h3>
            </div>
          </div>
        )}
      </div>

      {/* Holiday LMS Section */}
      {enabledFeatures.includes('holiday-lms') && (
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Holiday Packages</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Learn and earn certificates during your academic break</p>
            </div>
            <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
               View All Packages
               <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                onClick={() => router.push(`/school/${schoolId}/student/lms/${course.id}`)}
                className="bg-gray-50/50 dark:bg-slate-900/40 p-5 rounded-2xl border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-[#1e293b] hover:shadow-md hover:border-primary/20 hover:scale-[1.01] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[300px]"
              >
                <div>
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-indigo-500/10 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                     <span className="material-symbols-outlined text-primary/30 text-[60px] group-hover:scale-110 transition-transform">menu_book</span>
                     <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/70 dark:bg-black/35 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-primary">
                        {course.grade}
                     </div>
                  </div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 font-medium leading-relaxed">
                    {course.description || "No description provided for this package."}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                    <span className="material-symbols-outlined text-[14px]">play_circle</span>
                    Progressive
                  </div>
                  <span className="text-[10px] font-black text-primary px-2.5 py-1 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    Start Course
                  </span>
                </div>
              </div>
            ))}

            {courses.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                 <span className="material-symbols-outlined text-5xl mb-4 opacity-20">inventory_2</span>
                 <p className="text-base font-bold text-gray-900 dark:text-white">No packages assigned yet.</p>
                 <p className="text-xs text-gray-500 mt-1 font-medium">Check back later or contact your school admin.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Library & Discipline Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Borrowings */}
        {enabledFeatures.includes('library') && (
          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Borrowings</h3>
              <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg uppercase">
                {library.active.length} Books
              </span>
            </div>
            
            <div className="space-y-4">
              {library.active.map((record) => (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-900/40 rounded-xl border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-[#1e293b] hover:border-primary/20 hover:shadow-sm transition-all duration-300 text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <span className="material-symbols-outlined">book</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{record.book?.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Borrowed: {new Date(record.borrowedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase block mb-0.5">Due Date</span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white bg-white dark:bg-[#1e293b] px-2 py-0.5 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm inline-block">
                      {record.dueDate ? new Date(record.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}

              {library.active.length === 0 && (
                <div className="py-8 text-center text-gray-400">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">auto_stories</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">No active borrowings</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conduct Summary */}
        {enabledFeatures.includes('discipline') && (
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Conduct History</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-[15px] before:w-0.5 before:bg-gray-100 dark:before:bg-white/5 flex-1">
              {discipline.records.map((record) => (
                <div key={record.id} className="relative pl-8">
                  <div className={`absolute left-1.5 top-1 size-6 rounded-full border-4 border-white dark:border-[#1e293b] flex items-center justify-center z-10 ${
                    record.points > 10 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}>
                    <span className="material-symbols-outlined text-white text-[10px] font-bold">
                      {record.points > 10 ? 'priority_high' : 'check'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-xs">{record.type}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{record.comment || 'No description provided.'}</p>
                    <p className="text-[9px] font-bold text-primary uppercase mt-1.5">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}

              {discipline.records.length === 0 && (
                <div className="py-8 text-center text-gray-400 relative">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-20">verified</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Clear Record</p>
                  <p className="text-xs mt-1">No disciplinary incidents reported.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Announcements & Support Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming School Events */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Upcoming School Events</h3>
             <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4 p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-white/10">
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

          {/* Contact Support Banner */}
          <div className="bg-gradient-to-br from-indigo-500 to-primary rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-primary/20">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
             <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight whitespace-pre-line">Need Help with{"\n"}Your Courses?</h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[240px]">
                    Access our 24/7 student support for any technical or academic issues.
                  </p>
                </div>
                <button className="mt-8 px-6 py-3 bg-white text-primary font-black rounded-2xl shadow-xl shadow-black/10 hover:scale-105 transition-transform w-fit text-sm">
                   Contact Support
                 </button>
             </div>
             <span className="absolute bottom-4 right-4 material-symbols-outlined text-[100px] opacity-10">support_agent</span>
          </div>
      </div>
    </div>
  );
}
