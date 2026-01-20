export interface PartnerItem {
    id: string;
    name: string;
    logo: string;
    category?: "Government" | "NGO" | "Corporate" | "Foundation" | "Other";
    website?: string;
}

export const initialPartners: PartnerItem[] = [
    {
        id: "1",
        name: "Ministry of Sports",
        logo: "/images/partners/minisports.png",
        category: "Government"
    },
    {
        id: "2",
        name: "MIGEPROF",
        logo: "/images/partners/migeprof-new.png",
        category: "Government"
    },
    {
        id: "3",
        name: "CECI",
        logo: "/images/partners/ceci.png",
        category: "NGO"
    },
    {
        id: "4",
        name: "Kvinna till Kvinna",
        logo: "/images/partners/kvinna.png",
        category: "NGO"
    },
    {
        id: "5",
        name: "PLAY International",
        logo: "/images/partners/play.png",
        category: "NGO"
    },
    {
        id: "6",
        name: "SOL Foundation",
        logo: "/images/partners/sol.png",
        category: "Foundation"
    },
    {
        id: "7",
        name: "WIHOGORA",
        logo: "/images/partners/wihogora.png",
        category: "NGO"
    }
];
