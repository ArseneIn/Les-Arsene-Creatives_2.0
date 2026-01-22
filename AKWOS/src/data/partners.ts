import { getAssetPath } from '../utils/assets';

export interface PartnerItem {
    id: string;
    name: string;
    logo: string;
    category: string;
}

export const partners: PartnerItem[] = [
    {
        id: "2",
        name: "MIGEPROF",
        logo: getAssetPath("images/partners/migeprof-new.png"),
        category: "Government"
    },
    {
        id: "3",
        name: "CECI",
        logo: getAssetPath("images/partners/ceci.png"),
        category: "NGO"
    },
    {
        id: "4",
        name: "Kvinna till Kvinna",
        logo: getAssetPath("images/partners/kvinna.png"),
        category: "NGO"
    },
    {
        id: "5",
        name: "PLAY International",
        logo: getAssetPath("images/partners/play.png"),
        category: "NGO"
    },
    {
        id: "6",
        name: "SOL Foundation",
        logo: getAssetPath("images/partners/sol.png"),
        category: "Foundation"
    },
    {
        id: "7",
        name: "WIHOGORA",
        logo: getAssetPath("images/partners/wihogora.png"),
        category: "NGO"
    }
];
