export interface PracticeModuleContent {
    id: string;
    title: string;
    text: string;
    duration: number; // in seconds
}

export const PRACTICE_MODULES_CONTENT: Record<string, PracticeModuleContent> = {
    'home-row': {
        id: 'home-row',
        title: 'Home Row Mastery',
        text: "asdf jkl; asdf jkl; asdf jkl; aa ss dd ff jj kk ll ;; asdf jkl; dad sad lad fad; ask jak; all fall; asdf jkl; asdf jkl;",
        duration: 60
    },
    'common-words': {
        id: 'common-words',
        title: 'Top 100 Common Words',
        text: "the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us",
        duration: 60
    },
    'capitalization': {
        id: 'capitalization',
        title: 'Shift Key & Capitals',
        text: "The Quick Brown Fox Jumps Over The Lazy Dog. New York City, Paris, London, and Tokyo are major cities. January, February, March, April, May, June, July, August, September, October, November, December. Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Alice and Bob went to the Google headquarters in Mountain View, California.",
        duration: 120
    },
    'punctuation': {
        id: 'punctuation',
        title: 'Punctuation Precision',
        text: "Hello, world! How are you doing today? I'm doing great; thanks for asking. \"To be, or not to be: that is the question.\" Wait... did you say 'pizza'? Yes, I did! (It's my favorite food.) 100% accurate typing is the goal. user@example.com is a fake email address. http://www.example.com",
        duration: 120
    },
    'numbers': {
        id: 'numbers',
        title: 'Number Row',
        text: "1 2 3 4 5 6 7 8 9 0 10 11 12 13 14 15 1990 2000 2023 2024. 1st 2nd 3rd 4th 5th. 1+1=2 5*5=25 100/10=10. The year is 2025. My phone number is 555-0199. 123 Main St. Apt 4B. 50% off! $19.99 is the price.",
        duration: 180
    },
    'code-snippets': {
        id: 'code-snippets',
        title: 'Code Syntax (JS/TS)',
        text: "const greeting = 'Hello World'; function add(a, b) { return a + b; } if (x > 0) { console.log('Positive'); } else { console.log('Negative'); } const array = [1, 2, 3].map(n => n * 2); interface User { id: number; name: string; } import React from 'react'; export default function App() { return <div>App</div>; }",
        duration: 300
    }
};

export const DEFAULT_TEXT = "The rapid development of digital communication has transformed how we share information across the globe. Mastering the keyboard is a fundamental skill for academic and professional success in the twenty-first century. As students navigate through increasingly complex digital landscapes, the ability to translate thoughts to text with speed and precision becomes a critical advantage. This standardized assessment measures both technical proficiency and cognitive processing speed.";
