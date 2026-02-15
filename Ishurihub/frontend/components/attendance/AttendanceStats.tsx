"use client";

interface AttendanceStatsProps {
    stats: {
        total: number;
        present: number;
        absent: number;
        late: number;
        attendanceRate: number;
        date: string;
    };
}

export default function AttendanceStats({ stats }: AttendanceStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Present */}
            <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
                <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Total Present</h3>
                    <span className="material-symbols-outlined text-green-600" style={{ fontSize: '16px' }}>check_circle</span>
                </div>
                <div className="p-6 pt-0">
                    <div className="text-2xl font-bold">{stats.present}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.attendanceRate.toFixed(1)}% Attendance Rate
                    </p>
                </div>
            </div>

            {/* Absent */}
            <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
                <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Absent</h3>
                    <span className="material-symbols-outlined text-red-600" style={{ fontSize: '16px' }}>cancel</span>
                </div>
                <div className="p-6 pt-0">
                    <div className="text-2xl font-bold">{stats.absent}</div>
                    <p className="text-xs text-muted-foreground">
                        Students absent today
                    </p>
                </div>
            </div>

            {/* Late */}
            <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
                <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Late</h3>
                    <span className="material-symbols-outlined text-yellow-600" style={{ fontSize: '16px' }}>schedule</span>
                </div>
                <div className="p-6 pt-0">
                    <div className="text-2xl font-bold">{stats.late}</div>
                    <p className="text-xs text-muted-foreground">
                        Arrived late
                    </p>
                </div>
            </div>

            {/* Total Students */}
            <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
                <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                    <h3 className="tracking-tight text-sm font-medium">Total Students</h3>
                    <span className="material-symbols-outlined text-slate-500" style={{ fontSize: '16px' }}>group</span>
                </div>
                <div className="p-6 pt-0">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">
                        Registered students
                    </p>
                </div>
            </div>
        </div>
    );
}
