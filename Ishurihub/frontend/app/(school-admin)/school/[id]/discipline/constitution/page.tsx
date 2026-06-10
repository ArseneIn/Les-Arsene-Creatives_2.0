"use client";

import { useParams } from "next/navigation";
import ConstitutionTab from "@/components/discipline/ConstitutionTab";

export default function ConstitutionPage() {
    const params = useParams();
    const schoolId = params.id as string;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">School Constitution</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage the predefined rules, merits, and sanctions for the school.</p>
            </div>
            <ConstitutionTab schoolId={schoolId} />
        </div>
    );
}
