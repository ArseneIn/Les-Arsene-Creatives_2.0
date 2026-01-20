export interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: "Press Release" | "Publications" | "Feature" | "Announcement" | "The New Times" | "General";
    image: string;
    tag: string;
    desc: string;
    featured?: boolean;
}

export const initialNews: NewsItem[] = [
    {
        id: "1",
        title: "AKWOS Launches New District Program to Reach 5,000 Girls",
        date: "Oct 24, 2023",
        category: "Press Release",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAheSBC1DkDZOLtWx_ry2QarWRiVLnhQCAI9Vpfo_TlGEty1zwj-FTkITEzwhQsvlnb6_niOJsbe8briYaJGZrh_eBsOzH_eEpKHs2mCRAxQccx-kJU0W-DW0TnAJePjCXt-KpteOM4xIkS38zAZGUsTIMzO8iOlTK881MeXWUB7RhANKAENKdqHQYjf_808cakX4hrYKq5s3-NedSEQF0Wz1kqkoR7-tjNJaJ4pWlMfVbzJzCF998i4dQ-wXI8XjZxOCGt7ynofKs",
        tag: "Impact",
        desc: "The new initiative targets rural districts in the Northern Province, providing equipment, coaching, and life skills workshops."
    },
    {
        id: "2",
        title: "Q3 Impact Report Released: Sustainable Growth in Sports",
        date: "Oct 10, 2023",
        category: "Publications",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3RbUoltwebUEKBZVrYA4o9p-vc4QF1KWCd1B3Hd6oRq7rYHyiJUCrrqEyL29rtdfF8OEycRMmqGAWLc4bPDak2Dppm7_puYsSfWih-J1M7MHdqVVX3zhVfZzB9SYCaGTGNnNhM3CiSiUijALJMPOt_6YM5zGhqkUDv2RyLdjiBWBqwa5zwhWEn2STBoR3K-JN75mwlhoiIGIlKsu3WWlvEd2xf7g8cChCiV25gMKRNZtxIq7870suVA9V83i88oZCKq0DzqrZVlI",
        tag: "Report",
        desc: "Our latest quarterly analysis shows a 20% increase in program retention and community engagement across all active regions."
    },
    {
        id: "3",
        title: "Changing Narratives: How AKWOS is Redefining Women's Roles",
        date: "Sep 28, 2023",
        category: "The New Times",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoDHXY7HNRnlmX3iQVS94nYeao03wlVf75Sq8IqaINs5Q73WBDsug_gsnpoJmh22ZAuVcc7hzZFdC5MDLDj8H9Utcdwm5d2FFVdXB4SGHXH42BLUEZnF6gShbYud2ddpHOHBIAwniZQ70zuLpWRgnnI0LWjJUVvkOgqGzKirq3vtSOYaGIyaEHOS2PQKVBTKYqj5gTMKCxElquOVjEPM-0YjtFwTxXjQXLxYCpBkRVIOsMjiNjl8Nf2pqZ9qqbwTtfHkXpngxlfso",
        tag: "Feature",
        desc: "An in-depth look at the cultural shifts occurring in communities where women's sports programs have taken root."
    },
    {
        id: "4",
        title: "AKWOS Receives Grant for 'Health Through Sport' Initiative",
        date: "Sep 15, 2023",
        category: "Press Release",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVFXX0bRdOlsIJtdja9dregUAkwmwPeQ9TwQtmXGvQJem7OZnrrpXhk2Qo18-faMaLg8PcdR2JnDweRRNntomULUycKGGE_cnYBXLus8KHpjl-7BENYk7ybsWWwTLGrphjnANsdtwcWjBXfr-w5c9bfHM04H_WOyjE5OIEajVmnmr1MaerAvAvXrhvR9bnKlrcCAHZiU5Ml8pxKrnA_VN046HbIq3-j8ymmB1MClgnPw3sfEAqZ2oZnkFYMG6kZ2T3TQ4I3AFadpo",
        tag: "Announcement",
        desc: "Major funding secured to integrate reproductive health education into daily sports activities for teenage girls."
    }
];
