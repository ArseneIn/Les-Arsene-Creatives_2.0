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

// ─────────────────────────────────────────────────────────────────────────────
// Curriculum Definition (Vowel-First)
// ─────────────────────────────────────────────────────────────────────────────

const rawModules = [
    {
        id: 'mod-1',
        title: 'Foundations: J, F & Space',
        description: 'Establish your anchor points on the home row.',
        icon: 'pan_tool',
        keys: ['j', 'f', ' '],
        hint: 'Right index on J, Left index on F. Use thumb for Space.'
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
        description: 'Unlock more vowels to drastically increase word combinations.',
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
        title: 'Course Capstone Review',
        description: 'Comprehensive review of all learned keys.',
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
    
    const isCapstone = mod.id === 'mod-5';
    
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

        // Stage 3: Word Combinations
        const wordId = `stage-${moduleNumber}-words`;
        const wordLevel: SubLevel = {
            id: wordId,
            stageNumber: `${moduleNumber}.3`,
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
