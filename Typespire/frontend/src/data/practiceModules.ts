export interface PracticeModuleContent {
    id: string;
    stageNumber: number;
    title: string;
    description: string;
    keysTaught: string[];
    fingerHint: string;
    defaultWpm: number;
    defaultAccuracy: number;
    practiceText: string;
    duration: number; // in seconds
    unlockRequires: string | null; // id of previous stage
    isFunctionalKey: boolean;
    icon: string;
}

export const PRACTICE_STAGES: PracticeModuleContent[] = [
    {
        id: 'stage-01',
        stageNumber: 1,
        title: 'Home Row: Anchor Keys',
        description: 'Start where your fingers rest. Master the four anchor home row keys used most in typing.',
        keysTaught: ['f', 'j', 'd', 'k'],
        fingerHint: 'Place your left index finger on F, right index on J. Middle fingers rest on D and K.',
        defaultWpm: 20,
        defaultAccuracy: 90,
        practiceText: 'fjdk fjdk dkfj fdjk jfkd kdfj fd jk fj dk fjdk jfkd fdjk kdfj djfk fjdk fd jk jfdk dfkj kjfd',
        duration: 60,
        unlockRequires: null,
        isFunctionalKey: false,
        icon: 'keyboard_alt',
    },
    {
        id: 'stage-02',
        stageNumber: 2,
        title: 'Home Row: Full Row',
        description: 'Expand from anchor keys to the complete home row. Add ring and pinky fingers to the mix.',
        keysTaught: ['s', 'l', 'a', ';'],
        fingerHint: 'Left ring on S, left pinky on A. Right ring on L, right pinky on semicolon.',
        defaultWpm: 22,
        defaultAccuracy: 90,
        practiceText: 'asdf jkl; asdf jkl; asdfjkl; dad sad lad fall ask all; salad flask jacks flask dads lads salsa kale',
        duration: 60,
        unlockRequires: 'stage-01',
        isFunctionalKey: false,
        icon: 'space_bar',
    },
    {
        id: 'stage-03',
        stageNumber: 3,
        title: 'Top Row: Center Keys',
        description: 'Reach up to the top row center keys. These are the most common letters in English.',
        keysTaught: ['r', 'u', 'e', 'i'],
        fingerHint: 'Stretch your left index up to R, right index up to U. Middle fingers reach E and I.',
        defaultWpm: 25,
        defaultAccuracy: 92,
        practiceText: 'fire rule ride duel rife used rude fuel tier iure fire duel rise fuel ride rife rule user fire tied',
        duration: 60,
        unlockRequires: 'stage-02',
        isFunctionalKey: false,
        icon: 'keyboard_double_arrow_up',
    },
    {
        id: 'stage-04',
        stageNumber: 4,
        title: 'Top Row: Outer Keys',
        description: 'Complete the top row by reaching the outer keys with ring and pinky fingers.',
        keysTaught: ['w', 'o', 'q', 'p'],
        fingerHint: 'Left ring stretches to W, left pinky to Q. Right ring reaches O, right pinky to P.',
        defaultWpm: 26,
        defaultAccuracy: 92,
        practiceText: 'word power work quote power wolf owe pore wore quote wolf work power word woe pore owe wolf quote wore',
        duration: 60,
        unlockRequires: 'stage-03',
        isFunctionalKey: false,
        icon: 'keyboard_double_arrow_up',
    },
    {
        id: 'stage-05',
        stageNumber: 5,
        title: 'Bottom Row: Inner Keys',
        description: 'Drop down to the bottom row. Train your index and middle fingers on the inner bottom keys.',
        keysTaught: ['v', 'm', 'c', ','],
        fingerHint: 'Left index curls down to V, right index to M. Middle fingers cover C and comma.',
        defaultWpm: 28,
        defaultAccuracy: 93,
        practiceText: 'come move civic mice mice come vice mice come move civic come move mice vice come move civic mice come',
        duration: 60,
        unlockRequires: 'stage-04',
        isFunctionalKey: false,
        icon: 'keyboard_double_arrow_down',
    },
    {
        id: 'stage-06',
        stageNumber: 6,
        title: 'Bottom Row: Outer Keys',
        description: 'Complete the bottom row with the less-common but essential outer reach keys.',
        keysTaught: ['x', '.', 'z', '/'],
        fingerHint: 'Left ring reaches X, left pinky stretches to Z. Right ring covers period, right pinky reaches slash.',
        defaultWpm: 28,
        defaultAccuracy: 93,
        practiceText: 'fox.zip axe.zone ox/zip fizz.box zone/fox axe.zero box/zip fizz.zone fox axe zone.zip box fizz zone',
        duration: 60,
        unlockRequires: 'stage-05',
        isFunctionalKey: false,
        icon: 'keyboard_double_arrow_down',
    },
    {
        id: 'stage-07',
        stageNumber: 7,
        title: '⌨ Functional: Caps Lock',
        description: 'Learn to use Caps Lock to type sustained uppercase text without holding Shift.',
        keysTaught: ['CapsLock'],
        fingerHint: 'Your left pinky rests just above A. Press it once to lock uppercase, once more to release.',
        defaultWpm: 25,
        defaultAccuracy: 90,
        practiceText: 'WORD FIRE RULE COME MOVE POWER WORK FOX AXLE ZONE QUIZ PORE WOLF DICE FIVE RIVER CORAL OCEAN LAKE',
        duration: 60,
        unlockRequires: 'stage-06',
        isFunctionalKey: true,
        icon: 'keyboard_capslock',
    },
    {
        id: 'stage-08',
        stageNumber: 8,
        title: '⌨ Functional: Shift Key',
        description: 'Master targeted capitalization using both Left and Right Shift keys for proper sentence structure.',
        keysTaught: ['Shift'],
        fingerHint: 'For a right-hand letter, use LEFT Shift with your left pinky. For a left-hand letter, use RIGHT Shift.',
        defaultWpm: 28,
        defaultAccuracy: 92,
        practiceText: 'The Fox ran. Mary saw Joe. David and Alice walked. Lake Shore Drive. Real men Read. Fire works well.',
        duration: 60,
        unlockRequires: 'stage-07',
        isFunctionalKey: true,
        icon: 'keyboard_arrow_up',
    },
    {
        id: 'stage-09',
        stageNumber: 9,
        title: 'Number Row',
        description: 'Reach up to the number row without looking down. Build a strong reach habit for digits.',
        keysTaught: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        fingerHint: 'Keep home row fingers anchored and stretch each finger straight up to its corresponding digit.',
        defaultWpm: 25,
        defaultAccuracy: 90,
        practiceText: '1 2 3 4 5 6 7 8 9 0 10 23 45 67 89 100 2024 50 365 1st 2nd 3rd 4th 5th 1990 2000 2025 404 200',
        duration: 60,
        unlockRequires: 'stage-08',
        isFunctionalKey: false,
        icon: 'pin',
    },
    {
        id: 'stage-10',
        stageNumber: 10,
        title: 'Common Word Fluency',
        description: 'Flow through the 100 most common English words. Build muscle memory for everyday vocabulary.',
        keysTaught: [],
        fingerHint: 'Focus on smooth rhythm and consistent finger return to home row after each word.',
        defaultWpm: 35,
        defaultAccuracy: 93,
        practiceText: 'the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some',
        duration: 90,
        unlockRequires: 'stage-09',
        isFunctionalKey: false,
        icon: 'text_fields',
    },
    {
        id: 'stage-11',
        stageNumber: 11,
        title: 'Mixed-Case Vocabulary',
        description: 'Real-world typing with proper nouns, sentences, and mixed capitalization patterns.',
        keysTaught: [],
        fingerHint: 'Anticipate capital letters. Shift early, release cleanly. Do not rush the transition.',
        defaultWpm: 40,
        defaultAccuracy: 94,
        practiceText: 'Alice and Bob walked to Lake Shore. David played for Real Madrid. Mary Johnson read The Great Gatsby. Paris, London, and Tokyo are iconic cities. James said Hello to Dr. Kim every morning.',
        duration: 90,
        unlockRequires: 'stage-10',
        isFunctionalKey: false,
        icon: 'sort_by_alpha',
    },
    {
        id: 'stage-12',
        stageNumber: 12,
        title: 'Complete Mastery Flow',
        description: 'Full keyboard integration. Long-form prose with punctuation, numbers, and capitals. This is the final challenge.',
        keysTaught: [],
        fingerHint: 'This is the ultimate test. Keep your wrists relaxed, eyes on the text, and trust your training.',
        defaultWpm: 45,
        defaultAccuracy: 95,
        practiceText: 'The rapid development of digital communication has transformed how we share information across the globe. In 2024, over 5 billion people use the internet daily. Mastering the keyboard — at 50+ WPM with 95% accuracy — is now a fundamental skill for academic and professional success. Alice, Bob, and Carol all passed their Level 2 exam on their first attempt.',
        duration: 120,
        unlockRequires: 'stage-11',
        isFunctionalKey: false,
        icon: 'emoji_events',
    },
];

// Lookup map by id for fast access
export const PRACTICE_STAGES_MAP: Record<string, PracticeModuleContent> = Object.fromEntries(
    PRACTICE_STAGES.map(s => [s.id, s])
);

// Legacy compatibility — keep PRACTICE_MODULES_CONTENT and DEFAULT_TEXT for TypingTest.tsx fallback
export const PRACTICE_MODULES_CONTENT: Record<string, { id: string; title: string; text: string; duration: number }> = Object.fromEntries(
    PRACTICE_STAGES.map(s => [s.id, { id: s.id, title: s.title, text: s.practiceText, duration: s.duration }])
);

export const DEFAULT_TEXT = "The rapid development of digital communication has transformed how we share information across the globe. Mastering the keyboard is a fundamental skill for academic and professional success in the twenty-first century. As students navigate through increasingly complex digital landscapes, the ability to translate thoughts to text with speed and precision becomes a critical advantage. This standardized assessment measures both technical proficiency and cognitive processing speed.";
