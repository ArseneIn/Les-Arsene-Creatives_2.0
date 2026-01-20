export interface ResourceItem {
    id: string;
    title: string;
    year: string;
    type: "Annual Report" | "Strategic Plan" | "Policy Brief" | "Research" | "Conference Report" | "Training Report" | "Newsletter" | "Other";
    size: string;
    ext: string;
    image?: string;
    gradient?: string;
    color: string;
    downloadUrl: string;
}

export const initialResources: ResourceItem[] = [
    {
        id: "1",
        title: "Peace and Sport Final Report 2023",
        year: "2023",
        type: "Annual Report",
        size: "2.9 MB",
        ext: "PDF",
        image: "",
        gradient: "bg-gradient-to-tr from-blue-900 to-primary",
        color: "text-red-500",
        downloadUrl: "/documents/RP-Peace-and-Sport-Final-Report-2023.pdf"
    },
    {
        id: "2",
        title: "IDRW Data Analysis Report: CECI & AKWOS",
        year: "2025",
        type: "Research",
        size: "5.7 MB",
        ext: "PDF",
        image: "",
        gradient: "bg-gradient-to-tr from-purple-900 to-purple-600",
        color: "text-red-500",
        downloadUrl: "/documents/BR-KTK_AKWOS_CECI-IDRW-Data-Analysis-20251017.pdf"
    },
    {
        id: "3",
        title: "UNSCR 1325 Convening Event Report",
        year: "2025",
        type: "Policy Brief",
        size: "4.5 MB",
        ext: "PDF",
        image: "",
        gradient: "bg-gradient-to-tr from-emerald-900 to-emerald-600",
        color: "text-red-500",
        downloadUrl: "/documents/AB-AKWOS-UNSCR-1325-Convening-Event-20250904-.pdf"
    },
    {
        id: "4",
        title: "International Conf. on Gender Equity in Sports",
        year: "2024",
        type: "Conference Report",
        size: "0.7 MB",
        ext: "PDF",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCdAkibs4s_207DpEY-c3ajai3rpXuDR5bb7f4QB080YK7SjYth33HzaHWNq0m6U2aKPwDQbdAEiJ-F0zl6OaHjSOABaMhNL7Auqvfq6TZF3C8-_NdLMJLnFGiBNQdyYZnL9oUiJhYTSsmvqYWW0s1auRKIdI4JZN4PgM34u3DXw99QfV0lts0FXwKNZM2UiVs1G0KvHLTCtUwlTGqw0xaU1oEcJu3x61DBm0-aam_7KEXADt4LQ38RKNFTZjjbSX-RNfmsVGz8h4",
        color: "text-red-500",
        downloadUrl: "/documents/RP-AKWOS-International-Conference-on-Gender-Equity-in-Sports-for-Social-Change.pdf"
    },
    {
        id: "5",
        title: "Dufatanye Programme Monitoring Review",
        year: "2025",
        type: "Strategic Plan",
        size: "7.4 MB",
        ext: "PDF",
        image: "",
        gradient: "bg-gradient-to-tr from-orange-900 to-orange-600",
        color: "text-red-500",
        downloadUrl: "/documents/RP-AKWOS-Dufatanye-Monitoring-Programme-Review-Meetings-August-2025.pdf"
    },
    {
        id: "6",
        title: "Wihogora Psychosocial Centre Training",
        year: "2025",
        type: "Training Report",
        size: "5.4 MB",
        ext: "PDF",
        image: "",
        gradient: "bg-gradient-to-bl from-blue-800 to-gray-900",
        color: "text-red-500",
        downloadUrl: "/documents/SR-AKWOS-Training-Wihogora-Psychosocial-Centre-202512-.pdf"
    },
    {
        id: "7",
        title: "ANOCA Magazine: Tribute to Thomas Bach",
        year: "2025",
        type: "Newsletter",
        size: "10.7 MB",
        ext: "PDF",
        image: "",
        gradient: "bg-gradient-to-r from-yellow-700 to-yellow-500",
        color: "text-red-500",
        downloadUrl: "/documents/ANOCA_Magazine-Tribute-Thomas-Bach.pdf"
    },
    {
        id: "8",
        title: "Dufatanye Refresher TOT Analysis",
        year: "2025",
        type: "Research",
        size: "2.6 MB",
        ext: "PDF",
        image: "",
        gradient: "bg-gradient-to-tr from-purple-800 to-indigo-600",
        color: "text-red-500",
        downloadUrl: "/documents/RP-Dufatanye-Refresher-TOT-Analysis-202508.pdf"
    }
];
