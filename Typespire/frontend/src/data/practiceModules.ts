// Common English words for cumulative word drills
const WORD_POOL = [
    "a", "all", "am", "an", "and", "any", "are", "as", "at", "be", "boy", "but", "by",
    "can", "car", "cat", "day", "did", "do", "dog", "eat", "for", "get", "go", "good",
    "had", "has", "have", "he", "her", "him", "his", "how", "I", "if", "in", "is", "it",
    "let", "like", "look", "man", "me", "my", "no", "not", "now", "of", "off", "old",
    "on", "one", "or", "our", "out", "put", "run", "saw", "say", "see", "she", "sit",
    "so", "some", "sun", "ten", "the", "to", "too", "two", "up", "us", "use", "was",
    "we", "who", "why", "yes", "you", "bad", "red", "dad", "sad", "mad", "glad", "fad",
    "fall", "tall", "wall", "hall", "ask", "mask", "task", "flask", "add", "lad",
    "salad", "lass", "glass", "class", "flass", "safari", "dark", "park", "bark", "mark",
    "lark", "shark", "spark", "stark", "star", "far", "jar", "tar", "bar", "car", "par",
    "art", "part", "dart", "cart", "mart", "tart", "smart", "start", "chart", "heart",
    "half", "calf", "leaf", "deaf", "safe", "cafe", "sale", "tale", "male", "pale",
    "scale", "whale", "stale", "fake", "take", "make", "bake", "cake", "lake", "wake",
    "flake", "snake", "shake", "brake", "drake", "crate", "slate", "plate", "skate",
    // Adding more words to utilize vowels (u, e, i) effectively
    "juice", "free", "reduce", "need", "kid", "ice", "guide", "nice", "nine", "gene",
    "green", "grid", "ride", "run", "ring", "urge", "rug", "fun", "figure", "end",
    "edge", "egg", "dig", "dinner", "feed", "feel", "find", "fine", "fire", "king"
].map(w => w.toLowerCase());

export interface SubLevel {
    id: string;
    stageNumber: string;
    title: string;
    description: string;
    keysTaught: string[];
    fingerHint: string;
    defaultWpm: number;
    defaultAccuracy: number;
    generateText: () => string; // Dynamic text generation function
    duration: number; // in seconds
    unlockRequires: string | null; // id of previous sub-level
    isFunctionalKey: boolean;
    icon: string;
    practiceType?: 'letters' | 'falling' | 'words';
}

export interface PracticeModule {
    id: string;
    moduleNumber: number;
    title: string;
    description: string;
    icon: string;
    subLevels: SubLevel[];
}

/**
 * Generates isolated letter sequences for Letter Mode.
 */
function generateLetterDrillText(keys: string[]): string {
    const letters = keys.filter(k => k !== ' ');
    const textChunks: string[] = [];
    
    // Phase 1: 5 repetitions of each new letter (space separated)
    for (const char of letters) {
        textChunks.push((char + ' ').repeat(5).trim());
    }
    
    // Phase 2: Mixed random jumble of the new keys
    if (letters.length > 1) {
        let mixed = '';
        for(let j = 0; j < 15; j++) {
            mixed += letters[Math.floor(Math.random() * letters.length)] + ' ';
        }
        textChunks.push(mixed.trim());
    }
    
    return textChunks.join(' ');
}

/**
 * Generates practice text using real English words that contain ONLY the allowed keys.
 */
function generateCumulativeWords(allowedKeys: string[], wordCount: number = 20): string {
    const allowedSet = new Set(allowedKeys);
    
    const validWords = WORD_POOL.filter(word => {
        if (word.length < 2 && word !== 'a' && word !== 'i') return false;
        for (const char of word) {
            if (!allowedSet.has(char.toLowerCase())) return false;
        }
        return true;
    });

    const text = [];
    if (validWords.length === 0) {
        const fallbackKeys = allowedKeys.filter(k => k !== ' ');
        for (let i = 0; i < wordCount; i++) {
            const wordLen = Math.floor(Math.random() * 3) + 2; 
            let word = '';
            for (let j = 0; j < wordLen; j++) {
                word += fallbackKeys[Math.floor(Math.random() * fallbackKeys.length)];
            }
            text.push(word);
        }
    } else {
        for (let i = 0; i < wordCount; i++) {
            text.push(validWords[Math.floor(Math.random() * validWords.length)]);
        }
    }
    return text.join(' ');
}

/**
 * Generates rhythmic bigram and trigram patterns utilizing ONLY allowed keys.
 */
function generateNGramText(allowedKeys: string[], patternCount: number = 18): string {
    const allowedSet = new Set(allowedKeys.map(k => k.toLowerCase()));
    
    // High-frequency English bigrams and trigrams
    const commonNGrams = [
        "th", "he", "in", "er", "an", "re", "on", "es", "at", "ed", "nd", "ha", 
        "en", "ou", "to", "ng", "it", "is", "or", "as", "te", "et", "al", "ar", 
        "st", "se", "ff", "jj", "fj", "jf", "ur", "ru", "uk", "ku", "kr", "rk",
        "de", "ed", "di", "id", "ki", "ik", "fe", "ef", "ce", "ec", "ge", "eg",
        "en", "ne", "cg", "gc", "the", "and", "ing", "ent", "ion", "her", "for", 
        "tha", "ter", "was", "has", "red", "fed", "ded", "dec", "rec", "ice", "run"
    ];
    
    const validNGrams = commonNGrams.filter(pattern => {
        for (const char of pattern) {
            if (!allowedSet.has(char)) return false;
        }
        return true;
    });
    
    const chunks: string[] = [];
    if (validNGrams.length === 0) {
        const cleanKeys = allowedKeys.filter(k => k !== ' ');
        for (let i = 0; i < patternCount; i++) {
            const k1 = cleanKeys[Math.floor(Math.random() * cleanKeys.length)];
            const k2 = cleanKeys[Math.floor(Math.random() * cleanKeys.length)];
            const pattern = k1 + k2;
            chunks.push((pattern + ' ').repeat(3).trim());
        }
    } else {
        // Select random patterns and repeat them rhythmically
        const selectedCount = Math.min(validNGrams.length, 6);
        const shuffled = [...validNGrams].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < selectedCount; i++) {
            chunks.push((shuffled[i] + ' ').repeat(3).trim());
        }
        
        // Add a few mixed ones
        let mixed = '';
        for (let i = 0; i < 8; i++) {
            mixed += validNGrams[Math.floor(Math.random() * validNGrams.length)] + ' ';
        }
        chunks.push(mixed.trim());
    }
    
    return chunks.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Paragraph Drills Data & Generator
// ─────────────────────────────────────────────────────────────────────────────

const PARAGRAPH_POOLS: Record<string, string[]> = {
    'mod-2': [
        "ruff fur juror junk",
        "junk fur jury ruff",
        "juror ruff junk fur",
        "jury ruff fur junk",
        "fur junk ruff juror"
    ],
    'mod-3': [
        "rude dude ride deer",
        "free red deer ride",
        "kid ride red deer",
        "duke feed red deer",
        "kid feed red duck",
        "rude duke ride red duck",
        "fire red deer ride"
    ],
    'mod-4': [
        "nice green gene run in grid",
        "nine green kings run in red engine",
        "nice kid dig in green rug",
        "dinner is nice green juice",
        "green ring in red ice",
        "nice gene in dinner figure",
        "king find nice ring in rug"
    ],
    'mod-5': [
        "dan slide in clean glass",
        "glad dad sing a line",
        "all girls are nice and glad",
        "sad lad fall in dark lane",
        "safari is a grand ride"
    ],
    'mod-6': [
        "we will grow and prosper",
        "poor people work on poor land",
        "we spin and win raw gold",
        "quick people walk slow",
        "wild dogs prowl in dark woods"
    ],
    'mod-7': [
        "many happy kids play in matching shirts",
        "we must try to work hard today",
        "white ducks fly high in sky",
        "young men write many smart letters",
        "mother makes warm milk for home"
    ],
    'mod-8': [
        "the quick brown fox jumps over the lazy dog",
        "brave citizens vocalize extreme joy",
        "crazy zebra walks very quickly down path",
        "six heavy boxes fell off moving wagon"
    ]
};

/**
 * Generates capitalized, punctuated flowing paragraphs using only unlocked keys.
 */
function generateParagraphDrillText(moduleId: string, allowedKeys: string[]): string {
    const hasDot = allowedKeys.includes('.');
    const pool = PARAGRAPH_POOLS[moduleId];
    if (!pool) {
        // Fallback: build randomized logical-looking sentence structures
        const words = generateCumulativeWords(allowedKeys, 24).split(' ');
        const sentences = [];
        for (let i = 0; i < words.length; i += 6) {
            const chunk = words.slice(i, i + 6);
            if (chunk.length > 0) {
                chunk[0] = chunk[0].charAt(0).toUpperCase() + chunk[0].slice(1);
                sentences.push(chunk.join(' ') + (hasDot ? '.' : ''));
            }
        }
        return sentences.join(' ');
    }
    
    // Shuffle and pick 4 sentences
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    return selected.map(s => {
        const clean = s.trim().toLowerCase();
        return clean.charAt(0).toUpperCase() + clean.slice(1) + (hasDot ? '.' : '');
    }).join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Curriculum Definition (Vowel-First)
// ─────────────────────────────────────────────────────────────────────────────

const rawModules = [
    {
        id: 'mod-1',
        title: 'Foundations: Home Row Basics',
        description: 'Establish your anchor points by learning all standard keys on the home row.',
        icon: 'pan_tool',
        keys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', ' '],
        hint: 'Left hand rests on A, S, D, F. Right hand rests on J, K, L, ;. Use thumb for Space.'
    },
    {
        id: 'mod-2',
        title: 'First Vowel & Extensions: U, R, K',
        description: 'Expand your reach to the top row and introduce the first vowel.',
        icon: 'keyboard_alt',
        keys: ['u', 'r', 'k'],
        hint: 'Right index stretches to U, Left index to R, Right middle on K.'
    },
    {
        id: 'mod-3',
        title: 'Core Vowels: D, E, I',
        description: 'Unlock more vowels and the Shift key to drastically increase word combinations.',
        icon: 'spellcheck',
        keys: ['d', 'e', 'i'],
        hint: 'Left middle stretches to E, Right middle stretches to I, Left middle rests on D.'
    },
    {
        id: 'mod-4',
        title: 'Consonant Expansion: C, G, N',
        description: 'Introduce crucial consonants for word building.',
        icon: 'text_format',
        keys: ['c', 'g', 'n'],
        hint: 'Left middle down to C, Left index right to G, Right index down to N.'
    },
    {
        id: 'mod-5',
        title: 'Home Row Vowels & Anchors: A, S, L',
        description: 'Establish crucial home row anchors and key vowels.',
        icon: 'grid_view',
        keys: ['a', 's', 'l'],
        hint: 'Left pinky on A, Left ring on S, Right ring on L.'
    },
    {
        id: 'mod-6',
        title: 'Top Row Extensions: O, P, Q, W',
        description: 'Master far-reaching top row letters for advanced typing.',
        icon: 'keyboard',
        keys: ['o', 'p', 'q', 'w'],
        hint: 'Right ring on O, Right pinky on P, Left pinky on Q, Left ring on W.'
    },
    {
        id: 'mod-7',
        title: 'Inner Index Reaches: H, T, Y, M',
        description: 'Introduce center row reaches and essential bottom keys.',
        icon: 'align_horizontal_center',
        keys: ['h', 't', 'y', 'm'],
        hint: 'Right index left to H, Left index up-right to T, Right index up-left to Y, Right index down-left to M.'
    },
    {
        id: 'mod-8',
        title: 'Bottom Row & Pinky: B, V, X, Z',
        description: 'Conquer the final set of letters on the bottom row, commas, and periods.',
        icon: 'border_bottom',
        keys: ['b', 'v', 'x', 'z', ',', '.'],
        hint: 'Left index down-right to B, Left index down-right to V, Left ring down-right to X, Left pinky down-right to Z, Right middle down to comma, Right ring down to period.'
    },
    {
        id: 'mod-9',
        title: 'Course Capstone Review',
        description: 'Comprehensive review of all learned keys across the entire keyboard.',
        icon: 'workspace_premium',
        keys: [], 
        hint: 'Combine all your skills for the final test.'
    }
];

export const PRACTICE_MODULES: PracticeModule[] = [];
export const PRACTICE_STAGES: SubLevel[] = [];

let cumulativeKeys: string[] = [];
let previousSubLevelId: string | null = null;

rawModules.forEach((mod, modIndex) => {
    const moduleNumber = modIndex + 1;
    const subLevels: SubLevel[] = [];
    
    // Update cumulative keys
    if (mod.keys.length > 0) {
        cumulativeKeys = [...new Set([...cumulativeKeys, ...mod.keys])];
    }
    
    const isCapstone = mod.id === 'mod-9';
    
    // Capture the current state of cumulative keys for this specific module
    const currentAllowedKeys = [...cumulativeKeys];
    
    if (isCapstone) {
        const capstoneId = `stage-capstone`;
        const capstoneLevel: SubLevel = {
            id: capstoneId,
            stageNumber: `5.1`,
            title: `Ultimate Word Mastery`,
            description: `Type real words utilizing every single key you've learned.`,
            keysTaught: currentAllowedKeys,
            fingerHint: 'Stay relaxed and trust your muscle memory.',
            defaultWpm: 35,
            defaultAccuracy: 95,
            generateText: () => generateCumulativeWords(currentAllowedKeys, 40),
            duration: 90,
            unlockRequires: previousSubLevelId,
            isFunctionalKey: false,
            icon: 'emoji_events',
            practiceType: 'words'
        };
        subLevels.push(capstoneLevel);
        PRACTICE_STAGES.push(capstoneLevel);
        previousSubLevelId = capstoneId;
    } else {
        // Stage 0: Shift Key Tutorial (Only for Module 3!)
        if (moduleNumber === 3) {
            const shiftId = `stage-3-shift`;
            const shiftLevel: SubLevel = {
                id: shiftId,
                stageNumber: `3.0`,
                title: `Shift Key Tutorial`,
                description: `Learn how to hold Shift to type capitalized characters and letters.`,
                keysTaught: ['Shift', 'RShift'],
                fingerHint: `Left pinky hits Left Shift, Right pinky hits Right Shift. Keep your posture tall.`,
                defaultWpm: 8,
                defaultAccuracy: 90,
                generateText: () => "Fred red deer ride free",
                duration: 40,
                unlockRequires: previousSubLevelId,
                isFunctionalKey: true,
                icon: 'keyboard_capslock',
                practiceType: 'words'
            };
            subLevels.push(shiftLevel);
            PRACTICE_STAGES.push(shiftLevel);
            previousSubLevelId = shiftId;
        }

        // Stage 1: Letter Mastery
        const letterId = `stage-${moduleNumber}-letters`;
        const letterLevel: SubLevel = {
            id: letterId,
            stageNumber: `${moduleNumber}.1`,
            title: `Learn Letters: ${mod.keys.map(k => k === ' ' ? 'Space' : k.toUpperCase()).join(', ')}`,
            description: `Focus purely on muscle memory for individual keys.`,
            keysTaught: mod.keys,
            fingerHint: mod.hint,
            defaultWpm: 5, // Keep extremely low for pure letter learning
            defaultAccuracy: 90,
            generateText: () => generateLetterDrillText(mod.keys),
            duration: 30,
            unlockRequires: previousSubLevelId,
            isFunctionalKey: moduleNumber === 1,
            icon: 'touch_app',
            practiceType: 'letters'
        };
        subLevels.push(letterLevel);
        PRACTICE_STAGES.push(letterLevel);
        previousSubLevelId = letterId;

        // Stage 2: Falling Letters
        const fallingId = `stage-${moduleNumber}-falling`;
        const fallingLevel: SubLevel = {
            id: fallingId,
            stageNumber: `${moduleNumber}.2`,
            title: `Falling Letters`,
            description: `Reinforce positioning with falling letter drills.`,
            keysTaught: mod.keys,
            fingerHint: mod.hint,
            defaultWpm: 8,
            defaultAccuracy: 90,
            generateText: () => {
                // Remove all spaces for falling mode to build accuracy without space clicking
                const text = generateLetterDrillText(mod.keys);
                return text.replace(/\s+/g, '');
            },
            duration: 45,
            unlockRequires: previousSubLevelId,
            isFunctionalKey: false,
            icon: 'keyboard_capslock',
            practiceType: 'falling'
        };
        subLevels.push(fallingLevel);
        PRACTICE_STAGES.push(fallingLevel);
        previousSubLevelId = fallingId;

        // Stage 3: N-Gram Patterns
        const ngramId = `stage-${moduleNumber}-ngrams`;
        const ngramLevel: SubLevel = {
            id: ngramId,
            stageNumber: `${moduleNumber}.3`,
            title: `N-Gram Patterns`,
            description: `Master common bigrams and trigrams utilizing these keys.`,
            keysTaught: currentAllowedKeys,
            fingerHint: `Build hand tempo by sweeps of common key pairings.`,
            defaultWpm: 8 + (moduleNumber * 1),
            defaultAccuracy: 90,
            generateText: () => generateNGramText(currentAllowedKeys),
            duration: 50,
            unlockRequires: previousSubLevelId,
            isFunctionalKey: false,
            icon: 'stream',
            practiceType: 'words'
        };
        subLevels.push(ngramLevel);
        PRACTICE_STAGES.push(ngramLevel);
        previousSubLevelId = ngramId;

        // Stage 4: Word Combinations
        const wordId = `stage-${moduleNumber}-words`;
        const wordLevel: SubLevel = {
            id: wordId,
            stageNumber: `${moduleNumber}.4`,
            title: `Word Combinations`,
            description: `Combine ${mod.keys.map(k => k === ' ' ? 'Space' : k.toUpperCase()).join(', ')} into real words.`,
            keysTaught: currentAllowedKeys,
            fingerHint: `Integrate the new keys with everything you've learned so far.`,
            defaultWpm: 10 + (moduleNumber * 2), // e.g. Mod 1 = 12 WPM, Mod 2 = 14 WPM
            defaultAccuracy: 90,
            generateText: () => generateCumulativeWords(currentAllowedKeys, 25),
            duration: 60,
            unlockRequires: previousSubLevelId,
            isFunctionalKey: false,
            icon: 'text_snippet',
            practiceType: 'words'
        };
        subLevels.push(wordLevel);
        PRACTICE_STAGES.push(wordLevel);
        previousSubLevelId = wordId;

        // Stage 5: Paragraph Drills (Module 2+ onwards, once we have vowels and enough consonants!)
        if (moduleNumber >= 2) {
            const paragraphId = `stage-${moduleNumber}-paragraphs`;
            const paragraphLevel: SubLevel = {
                id: paragraphId,
                stageNumber: `${moduleNumber}.5`,
                title: `Paragraph Drills`,
                description: `Type logically sounding paragraphs using all learned keys.`,
                keysTaught: currentAllowedKeys,
                fingerHint: `Focus on stamina, capitalization, and flowing punctuation.`,
                defaultWpm: 12 + (moduleNumber * 2),
                defaultAccuracy: 92, // slightly higher threshold for final module mastery
                generateText: () => generateParagraphDrillText(mod.id, currentAllowedKeys),
                duration: 75,
                unlockRequires: previousSubLevelId,
                isFunctionalKey: false,
                icon: 'subject',
                practiceType: 'words'
            };
            subLevels.push(paragraphLevel);
            PRACTICE_STAGES.push(paragraphLevel);
            previousSubLevelId = paragraphId;
        }
    }

    PRACTICE_MODULES.push({
        id: mod.id,
        moduleNumber,
        title: mod.title,
        description: mod.description,
        icon: mod.icon,
        subLevels
    });
});

export const PRACTICE_STAGES_MAP: Record<string, SubLevel> = {};
PRACTICE_STAGES.forEach(stage => {
    PRACTICE_STAGES_MAP[stage.id] = stage;
});
