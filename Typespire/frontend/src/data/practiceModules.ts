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
    "flake", "snake", "shake", "brake", "drake", "crate", "slate", "plate", "skate"
].map(w => w.toLowerCase());

export interface SubLevel {
    id: string;
    stageNumber: string; // e.g., '1.1'
    title: string;
    description: string;
    keysTaught: string[];
    fingerHint: string;
    defaultWpm: number;
    defaultAccuracy: number;
    practiceText: string;
    duration: number; // in seconds
    unlockRequires: string | null; // id of previous sub-level
    isFunctionalKey: boolean;
    icon: string;
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
 * Generates practice text combining the provided keys.
 */
function generateDrillText(keys: string[], length: number = 80): string {
    if (keys.length === 0) return 'f j f j';
    let text = '';
    for (let i = 0; i < length; i++) {
        if (i > 0 && i % 5 === 0) {
            text += ' ';
        } else {
            text += keys[Math.floor(Math.random() * keys.length)];
        }
    }
    return text.trim();
}

/**
 * Generates practice text using real English words that contain ONLY the allowed keys.
 */
function generateCumulativeWords(allowedKeys: string[], wordCount: number = 20): string {
    const allowedSet = new Set(allowedKeys);
    const validWords = WORD_POOL.filter(word => {
        // Must be at least 2 chars to be a good drill, unless it's 'a' or 'i'
        if (word.length < 2 && word !== 'a' && word !== 'i') return false;
        
        for (const char of word) {
            if (!allowedSet.has(char)) {
                return false;
            }
        }
        return true;
    });

    if (validWords.length === 0) {
        // Fallback if not enough keys are unlocked to form words (e.g., Module 1 only has f, j, d, k)
        // Generate pseudo-words of lengths 2 to 4
        let fallbackText = [];
        for (let i = 0; i < wordCount; i++) {
            const wordLen = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
            let word = '';
            for (let j = 0; j < wordLen; j++) {
                word += allowedKeys[Math.floor(Math.random() * allowedKeys.length)];
            }
            fallbackText.push(word);
        }
        return fallbackText.join(' ');
    }

    let text = [];
    for (let i = 0; i < wordCount; i++) {
        text.push(validWords[Math.floor(Math.random() * validWords.length)]);
    }
    return text.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Curriculum Definition
// ─────────────────────────────────────────────────────────────────────────────

const rawModules = [
    {
        id: 'mod-1',
        title: 'Home Row: Anchors',
        description: 'Master the foundation of typing with your index and middle fingers.',
        icon: 'pan_tool',
        lessons: [
            { id: '1.1', keys: ['f', 'j'], hint: 'Index fingers. Left on F, Right on J.' },
            { id: '1.2', keys: ['d', 'k'], hint: 'Middle fingers. Left on D, Right on K.' }
        ]
    },
    {
        id: 'mod-2',
        title: 'Home Row: Extensions',
        description: 'Complete the home row by bringing in your ring and pinky fingers.',
        icon: 'keyboard_alt',
        lessons: [
            { id: '2.1', keys: ['s', 'l'], hint: 'Ring fingers. Left on S, Right on L.' },
            { id: '2.2', keys: ['a', ';'], hint: 'Pinky fingers. Left on A, Right on Semicolon.' }
        ]
    },
    {
        id: 'mod-3',
        title: 'Top Row: Center',
        description: 'Reach up with your index and middle fingers.',
        icon: 'arrow_upward',
        lessons: [
            { id: '3.1', keys: ['r', 'u'], hint: 'Index fingers stretch up to R and U.' },
            { id: '3.2', keys: ['e', 'i'], hint: 'Middle fingers stretch up to E and I.' }
        ]
    },
    {
        id: 'mod-4',
        title: 'Top Row: Extensions',
        description: 'Complete the top row with your outer fingers.',
        icon: 'flight_takeoff',
        lessons: [
            { id: '4.1', keys: ['w', 'o'], hint: 'Ring fingers stretch up to W and O.' },
            { id: '4.2', keys: ['q', 'p'], hint: 'Pinky fingers stretch up to Q and P.' }
        ]
    },
    {
        id: 'mod-5',
        title: 'Bottom Row: Inner',
        description: 'Reach down to the bottom row.',
        icon: 'arrow_downward',
        lessons: [
            { id: '5.1', keys: ['v', 'm'], hint: 'Index fingers stretch down to V and M.' },
            { id: '5.2', keys: ['c', ','], hint: 'Middle fingers stretch down to C and Comma.' }
        ]
    },
    {
        id: 'mod-6',
        title: 'Bottom Row: Extensions',
        description: 'The final letter keys on the bottom row.',
        icon: 'done_all',
        lessons: [
            { id: '6.1', keys: ['x', '.'], hint: 'Ring fingers stretch down to X and Period.' },
            { id: '6.2', keys: ['z', '/'], hint: 'Pinky fingers stretch down to Z and Slash.' }
        ]
    }
];

export const PRACTICE_MODULES: PracticeModule[] = [];
export const PRACTICE_STAGES: SubLevel[] = [];

let cumulativeKeys: string[] = [];
let previousSubLevelId: string | null = null;

rawModules.forEach((mod, modIndex) => {
    const moduleNumber = modIndex + 1;
    const subLevels: SubLevel[] = [];
    let moduleKeys: string[] = [];

    mod.lessons.forEach((lesson, lessonIndex) => {
        const subLvlId = `stage-${lesson.id.replace('.', '-')}`;
        cumulativeKeys = [...new Set([...cumulativeKeys, ...lesson.keys])];
        moduleKeys = [...new Set([...moduleKeys, ...lesson.keys])];

        // 1. Tutorial & Drill for the specific keys
        const tutorialLevel: SubLevel = {
            id: subLvlId,
            stageNumber: lesson.id,
            title: `Learn Keys: ${lesson.keys.map(k => k.toUpperCase()).join(' & ')}`,
            description: `Focus on mastering the ${lesson.keys.map(k => k.toUpperCase()).join(', ')} keys.`,
            keysTaught: lesson.keys,
            fingerHint: lesson.hint,
            defaultWpm: 15 + (moduleNumber * 2),
            defaultAccuracy: 90,
            practiceText: generateDrillText(lesson.keys, 60),
            duration: 45,
            unlockRequires: previousSubLevelId,
            isFunctionalKey: true, // Acts as a trigger for the tutorial modal
            icon: 'touch_app'
        };
        
        subLevels.push(tutorialLevel);
        PRACTICE_STAGES.push(tutorialLevel);
        previousSubLevelId = subLvlId;
    });

    // 2. Combination Drill for the module
    const comboId = `stage-${moduleNumber}-combo`;
    const comboLevel: SubLevel = {
        id: comboId,
        stageNumber: `${moduleNumber}.3`,
        title: `Module ${moduleNumber} Combination`,
        description: `Combine all keys learned in this module to build muscle memory.`,
        keysTaught: moduleKeys,
        fingerHint: 'Use the correct fingers for all keys learned so far.',
        defaultWpm: 18 + (moduleNumber * 2),
        defaultAccuracy: 90,
        practiceText: generateDrillText(moduleKeys, 80),
        duration: 60,
        unlockRequires: previousSubLevelId,
        isFunctionalKey: false,
        icon: 'join_inner'
    };
    subLevels.push(comboLevel);
    PRACTICE_STAGES.push(comboLevel);
    previousSubLevelId = comboId;

    // 3. Cumulative Word Drill
    const wordId = `stage-${moduleNumber}-words`;
    const wordLevel: SubLevel = {
        id: wordId,
        stageNumber: `${moduleNumber}.4`,
        title: `Word Drill: Cumulative`,
        description: `Practice typing actual words using ONLY the keys you've unlocked so far.`,
        keysTaught: cumulativeKeys,
        fingerHint: 'Type the words smoothly without looking down.',
        defaultWpm: 20 + (moduleNumber * 2),
        defaultAccuracy: 90,
        practiceText: generateCumulativeWords(cumulativeKeys, 25),
        duration: 60,
        unlockRequires: previousSubLevelId,
        isFunctionalKey: false,
        icon: 'text_snippet'
    };
    subLevels.push(wordLevel);
    PRACTICE_STAGES.push(wordLevel);
    previousSubLevelId = wordId;

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
