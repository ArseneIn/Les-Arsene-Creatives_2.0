<?php
require_once 'db_connect.php';

// Initial Data from Frontend
$hero_title = "DIGITAL ALCHEMY";
$hero_subtitle = "We engineer growth for SMEs through custom SaaS and precision marketing. Enterprise-grade power, tailored for you.";

$services = [
    ["icon" => "Globe", "title" => "SaaS & Automation", "desc" => "Custom platforms that streamline your business."],
    ["icon" => "Zap", "title" => "Growth Marketing", "desc" => "SEO & Ads that drive measurable ROI."],
    ["icon" => "Layout", "title" => "Experience Design", "desc" => "Intuitive UI/UX for web and mobile."],
    ["icon" => "ArrowUpRight", "title" => "Brand Strategy", "desc" => "Positioning your business for success."]
];

$portfolio = [
    [
        "title" => "FinTech Dashboard",
        "category" => "UI/UX Design",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuCCkzjPWQBonERsnJk9qyLU3nKlLo8GVLFUQbgoTAqgt3m7dBf8PuyCRL9fusWSChYd_IYSX6x9_4s8aVvyq6SZQJDxYN5cxsgtmT25DBs960AI38vUCSjLm0yyuEyd0ZRxn00cQTKT-KMlQZgv5yxzzGizCEZnVOsrPy4pm9HQ-fYVbHzdQ8ObUQH--QRGpr7B84Kft1krZPTeazrghZz_rABcEKs1yLfoy0ECUJyPX2lBomNl5OC2In_L2btKrMWsmW3_j8lwonhU"
    ],
    [
        "title" => "Nexus Brand Identity",
        "category" => "Branding",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuDPsTuT3Rc7U2z0-4E_Q8HIQzE3jacT0bWEskJ_G2_FnVosvf9Il1TTxaXcOGerVI9uALl2LAwbH5ohpFbshQinHGgy4yHmwr_KYaMCvKWtq0DOT9-8ATrb6NicqvR4jfZYMvD7gkjHThLLVhMhgoLPaseqbynLgGzd_7BV8hztN0TxElza0nkLov0_FJoOu_ymCyLG7vjtVusDtqj-mmSZjuiRntqMZ9ANUQx-oha7twcpsfgaoHnrxhmZEHR5NeP92XG1z5KCd-Fg"
    ]
];

$testimonials = [
    [
        "quote" => "Les Arsene transformed our vague ideas into a digital powerhouse. Our conversion rates doubled within a month.",
        "author" => "Sarah Jenkins",
        "role" => "CEO, TechFlow",
        "image" => "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
    ],
    [
        "quote" => "The level of precision and creativity they bring is unmatched. Truly digital alchemy at work.",
        "author" => "David Chen",
        "role" => "Founder, Nexus Stream",
        "image" => "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
    ],
    [
        "quote" => "A long-term partner that understands business growth as well as they understand code.",
        "author" => "Elena Rodriguez",
        "role" => "Marketing Director, Aura",
        "image" => "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
    ]
];

$team_members = [
    // Founders
    [
        "name" => "Arsene Lupin",
        "role" => "Co-Founder & Creative Director",
        "superpower" => "The Visionary Architect",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuBeI-uFC_I15qom9EU03EDAjxDh9jRrEUQr1QewlX--Zimmr6MF-28Rm5sLnaxwOoWPH-QueXtx8kU_nepcGPn-to6ilhy9EtGJ-FKE1AMC4tpp-K_hxuACrB2UyaxHHMzi-wEThpSk2SnrPvFcRseLGDSsxhLisyphyw40VBISu-REoMSZo0pnZ378OBfG9PFQf6flumDkV7OBiANrzm1p1fSf3uoTe0SBgwb0K2Tod7L87KvTJZnFTwkpw9ajs6X8RU-xfQpgpUMR",
        "category" => "Design" // Added for consistency
    ],
    [
        "name" => "Arsene Wenger",
        "role" => "Co-Founder & Lead Strategist",
        "superpower" => "The Master Tactician",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuCPGSicHucW6gG-3QUOW59y1E2cJJWMnSEIa_XjckiIPwdtjLMWATUDieWyGPo-7-Ee8yEFJcPr9LNR1EGqBQ4xymaSl-PsYff2VCWWLnYOrnOQfUXT3nF2lcTdZCMa56uZaEOYlNsaGsF0WRInqPGm1Q4ghlpCy4ohIY9rbO8RcUJjz8hs52lyoloeKZAJ2p3jxCJWfDzafRrPuD5WmGHHCHM35Eh5kRuj2a79JSgY7QUmvbjczdSdjK9NR5Scu_QfuigQPHmW54j7",
        "category" => "Strategy"
    ],
    // Squad
    [
        "name" => "Elena Rostova",
        "role" => "Sr. Product Designer",
        "strength" => "Pixel Perfectionist",
        "category" => "Design",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuA1xlQl61uHnnUKUh7dL3UTp3kyGVW79uIcYA3umIP-KWevZsIQ7xVt5wYAC_0gdZhSe3MhuduoEZoWy7MMR5M9jhWIBbPnwSWDIt_gUP1dOwSK8Z0BfkJoUGIxaQ678hA6jc6bY8t6vpi35MQxw1C-THAyxDt7VNcU-JgeRNuFf7m55iBc2nOQ1oi8V_EDAjcZAz7yracd1PQQo80Xq1srvMzNGolN_t_27jtpzyF2JvgZNX_nOtqJBcp3kFjimy4wa7sYWRyrrTXa"
    ],
    [
        "name" => "Marcus Chen",
        "role" => "Lead Developer",
        "strength" => "Code Whisperer",
        "category" => "Development",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuDPpiXQWjv2ufALgIqL3SG3Bfln6YbbhwX8_zIm1jjnT9eFfivVnJVxee5Fx05x0lKQeoNPfFh63EJNTER7hBnhWy7QvbhGWchfcdyioV6mDHSr4t5ldVONjGYd0uXPR4XLZxu2Us-2zO5faKprTbz3bAh6aQpk1mFuSPTDoPqlGYdl2BO0K6JUSnDYFhUeD9whb5w_3E5GVDj-Ga6181pWtK3tJLRMcXGsDl7CaTYrq8tFV1ENb8nCXTLSV3MHL5BlQD39yRL4-lN3"
    ],
    [
        "name" => "Sarah Jenkins",
        "role" => "Motion Director",
        "strength" => "The Keyframe Wizard",
        "category" => "Motion",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuA27mWQG_o_qpxGDfFayFnCQlQRccGhTe9kl4Ff7pHMkkqBJh4uMXPcxBNN5iqNwZeamk8PdppcCOBwbEZXSqm8gProebztg-wfk8gnD0W5qaN5wsjFo99JgmFZ7BaU39ff2_R3fnda9Od241MlklKZb_Wcbn84dLL68DyBe7BSxbGha_8tl1D9bh-4kvPHV-s48Yv2Um5IwOWv5FTNjDEH23-4uRh-QjQ9tYAKcMvRFN0jfmKYi76HEJnXG49cvBVY6Y_Ft9t7ampx"
    ],
    [
        "name" => "David Okonjo",
        "role" => "Brand Strategist",
        "strength" => "Insight Hunter",
        "category" => "Strategy",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuBPksaTxWNM9qy1RC4ndtlxRWLYer2uxBv_FL3hppt19f9tedwPKStt6Tz0lzo82JF7NuzcOPmLkt90KXTHg1xlI-KRiuRkOsLBAps1RgzEB3TI_XjaYF_YgSy2ahNjsO2QiN0sFkXJq3YvtUfjAfeP4CtvnXIWKl-X9b3U4adSAxLGkCXu4TDvL0pOwrgBDe_gUuSV2rR-PV4FAKSA5q2AJKDMEYdGRkAujUK__wZH3-BSXsZNdUvuVnIiztXHq9Ofo9QxCFVBS7ii"
    ],
    [
        "name" => "Priya Patel",
        "role" => "UX Researcher",
        "strength" => "Empathy Engine",
        "category" => "Strategy",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuDeVyhOncfqYQ4s54NEQQCF9zqgJsZy1hbXQnTyEOEpC2VcB0UlPhsJFqNCdJ7gauxOddeY8697ooHp-ZIW7tcgC1AEJhJEIPVqZ2HlM-up3vVVfEP1dEzKVyYjK3MWkWDwk7YzJzjQL6K6be_P8Br2C-sQT1cvty_QGGMRXmKgBner6lAbP7N2e_sRoVjvmrkPALj1oWp1djjsafbCfd5a8n4cNQb1_GxdmCWv3pIHCeV4qNVcwmBrYLI6U6is4YdUsePO_S_hcGN1"
    ],
    [
        "name" => "Julian Ross",
        "role" => "3D Artist",
        "strength" => "Polygon Master",
        "category" => "Motion",
        "image" => "https://lh3.googleusercontent.com/aida-public/AB6AXuAFQBFEJcLnXcHvE7v3Dwff9XPNhB-zVEeeuDo_BOu-TmjzIDOs_Xk0mpwAhZMgTi90manObl7HKCO4jethrimHBhfFQ0vcr2ejMWMeEYEFJn0rPEGjv9rvpDyIA_06t3OmKWeApZb0RpixxPAfAN9qxV65DaOHoTIDLtQLO_utjK6YNAfr5JxyI4fzj2EZ-03ZBkeaQBY4BpAbZBS9_lpy3cUkAjaZ_bqIZ8WMJ2RLlr11fIMxD6gEHfTT6ccjBUDJLZgm63xSnUaN"
    ]
];


// Helper function to insert or update
function seedData($conn, $key, $value) {
    // Check if exists
    $check = $conn->prepare("SELECT id FROM cms_content WHERE key_name = ?");
    $check->bind_param("s", $key);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows == 0) {
        $stmt = $conn->prepare("INSERT INTO cms_content (key_name, value) VALUES (?, ?)");
        $stmt->bind_param("ss", $key, $value);
        if ($stmt->execute()) {
            echo "Inserted: $key <br>";
        } else {
            echo "Error inserting $key: " . $stmt->error . "<br>";
        }
    } else {
        echo "Skipped: $key (Already exists) <br>";
    }
}

echo "<h2>Seeding Database...</h2>";

seedData($conn, 'hero_title', $hero_title);
seedData($conn, 'hero_subtitle', $hero_subtitle);
seedData($conn, 'services', json_encode($services));
seedData($conn, 'portfolio_items', json_encode($portfolio)); // KEY MATCHES FRONTEND
seedData($conn, 'testimonials', json_encode($testimonials));
seedData($conn, 'team_members', json_encode($team_members));

echo "<h3>Done! Delete this file from your server after use.</h3>";
?>
