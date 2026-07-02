import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFacilitator } from '../context/FacilitatorContext';
import { useInstitution } from '../context/InstitutionContext';
import api from '../api/axios';
import { ADVANCED_WORD_POOL, generate10FastFingersText } from '../data/advancedWordPool';


interface LibraryText {
    id: string;
    title: string;
    source: string;
    level: number;
    complexity: string;
    wordCount: number;
    estimatedTimeMin: number;
    coverImg: string;
    excerpt: string;
    content: string;
}

interface LiveStudent {
    userId: string;
    name: string;
    status: 'Submitted' | 'Not Started';
    wpm: number | null;
    accuracy: number | null;
    passed: boolean | null;
    submittedAt: string | null;
}

interface LiveData {
    assignmentId: string;
    title: string;
    dueDate: string;
    passWpm: number;
    passAccuracy: number;
    totalStudents: number;
    submitted: number;
    students: LiveStudent[];
}

const MOCK_LIBRARY_TEXTS = [
    {
        id: 'lib_1',
        title: 'The Velveteen Rabbit',
        source: 'Margery Williams',
        level: 1,
        complexity: 'Easy',
        wordCount: 364,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: '"What is REAL?" asked the Rabbit one day, when they were lying side by side near the nursery fender...',
        content: '"What is REAL?" asked the Rabbit one day, when they were lying side by side near the nursery fender...'
    },
    {
        id: 'lib_2',
        title: 'The Scale of the Universe',
        source: 'NASA Science',
        level: 1,
        complexity: 'Medium',
        wordCount: 690,
        estimatedTimeMin: 6,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8-rmXu2ZtPul-xNuKjMxc7Q0pTR2COZUn8EQ6Pn22RALtntDwVBzHOkuS3FEDpjuEUqqZFi6r3scVmZJnx6II9ti_Nx6IRPO-FM7QmuiDkn_jWbiAbeXXiwyRApBiGIpG3xS7niw8MGsrKLbk5CkIGdBdG8FGzuY8Ls6OqAgk_G4iCmLU2T1JT50_LpmyvlhEmTkeCor3mGYalKar9ACq_2Q2jzZTXJx0VB4rUSWAEMb9aq6iDhGBudg0AbN8c7eVi4RhxmX4hiFv',
        excerpt: 'The universe is vast beyond comprehension. To understand its scale, we must first look at our own solar system as a mere speck...',
        content: 'The universe is vast beyond comprehension. To understand its scale, we must first look at our own solar system as a mere speck... The universe is vast beyond comprehension. To understand its scale, we must first look at our own solar system as a mere speck...'
    },
    {
        id: 'lib_tm_2',
        title: 'Typing Master: Top Row Intro',
        source: 'Typing Master Lesson 2',
        level: 1,
        complexity: 'Easy',
        wordCount: 212,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'we type standard top row letters and key stretches for both hands. your left hand reaches quickly for q and w and e and r and t...',
        content: 'we type standard top row letters and key stretches for both hands. your left hand reaches quickly for q and w and e and r and t while your right hand reaches smoothly for y and u and i and o and p. write down the proper path to reach the quiet territory where pretty trees grow. our priority is to return standard reports to our power team. try to output sweet poetry with high precision to support your daily speed. touch typing top row reaches requires your fingers to return to home row anchors instantly after every quick stretch. stay relaxed and quiet. we type standard top row letters and key stretches for both hands. your left hand reaches quickly for q and w and e and r and t while your right hand reaches smoothly for y and u and i and o and p. write down the proper path to reach the quiet territory where pretty trees grow. our priority is to return standard reports to our power team. try to output sweet poetry with high precision to support your daily speed. touch typing top row reaches requires your fingers to return to home row anchors instantly after every quick stretch. stay relaxed and quiet.'
    },
    {
        id: 'lib_tm_3',
        title: 'Typing Master: Bottom Row Intro',
        source: 'Typing Master Lesson 3',
        level: 1,
        complexity: 'Easy',
        wordCount: 222,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'bottom row typing exercises require correct resting posture for both hands. your left pinky reaches down for z while your ring finger...',
        content: 'bottom row typing exercises require correct resting posture for both hands. your left pinky reaches down for z while your ring finger reaches down for x and middle reaches down for c and index reaches down for v and b. on your right hand, fingers stretch down for n and m and comma and period and slash keys. move your hands back to the home row after every bottom row entry. practice makes normal movements natural. can you type the bottom row with zero errors? six very nice brown cats ran past my quiet cabin on a sunny day. never move your wrists when typing bottom keys. bottom row typing exercises require correct resting posture for both hands. your left pinky reaches down for z while your ring finger reaches down for x and middle reaches down for c and index reaches down for v and b. on your right hand, fingers stretch down for n and m and comma and period and slash keys. move your hands back to the home row after every bottom row entry. practice makes normal movements natural. can you type the bottom row with zero errors? six very nice brown cats ran past my quiet cabin on a sunny day. never move your wrists when typing bottom keys.'
    },
    {
        id: 'lib_tm_4',
        title: 'Typing Master: The Space Bar & Rhythm',
        source: 'Typing Master Lesson 4',
        level: 1,
        complexity: 'Easy',
        wordCount: 212,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'the space bar is pressed with your right or left thumb to maintain a natural fluid rhythm. typing is not just about moving fast...',
        content: 'the space bar is pressed with your right or left thumb to maintain a natural fluid rhythm. typing is not just about moving fast; it is about establishing a steady beat like a heartbeat. standard home row anchors asdf and jkl; keep your hands in a secure position. the quick brown fox jumps over the lazy dog in Kigali. as you type, listen to the consistent sound of the keys hitting the board. every space separates thoughts and words, creating clear and beautiful sentences for everyone to read. relaxed shoulders and a straight posture will support your rhythmic touch typing practice. the space bar is pressed with your right or left thumb to maintain a natural fluid rhythm. typing is not just about moving fast; it is about establishing a steady beat like a heartbeat. standard home row anchors asdf and jkl; keep your hands in a secure position. the quick brown fox jumps over the lazy dog in Kigali. as you type, listen to the consistent sound of the keys hitting the board. every space separates thoughts and words, creating clear and beautiful sentences for everyone to read. relaxed shoulders and a straight posture will support your rhythmic touch typing practice.'
    },
    {
        id: 'lib_tm_5',
        title: 'Typing Master: Left Hand Independence',
        source: 'Typing Master Lesson 5',
        level: 1,
        complexity: 'Medium',
        wordCount: 212,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'we see red cats and dogs running fast on the wet grass. water falls down rapidly from the great brick wall near the safe cafe...',
        content: 'we see red cats and dogs running fast on the wet grass. water falls down rapidly from the great brick wall near the safe cafe. sad, glad, dad, bad, deaf, safe, cafe, estate, crates, and cats are all typed mostly with your left hand. left hand independence is important to balance your typing load. the red cat ate a sweet strawberry in the green garden. we created a safe, standard test for our power team. standard left hand keys a, s, d, f, q, w, e, r, t, z, x, c, v, b should be typed without moving your hand position. we see red cats and dogs running fast on the wet grass. water falls down rapidly from the great brick wall near the safe cafe. sad, glad, dad, bad, deaf, safe, cafe, estate, crates, and cats are all typed mostly with your left hand. left hand independence is important to balance your typing load. the red cat ate a sweet strawberry in the green garden. we created a safe, standard test for our power team. standard left hand keys a, s, d, f, q, w, e, r, t, z, x, c, v, b should be typed without moving your hand position.'
    },
    {
        id: 'lib_tm_6',
        title: 'Typing Master: Right Hand Dexterity',
        source: 'Typing Master Lesson 6',
        level: 1,
        complexity: 'Medium',
        wordCount: 212,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'you look like a million green lemons popping up in my lovely garden pool on a sunny July afternoon. right hand dexterity requires...',
        content: 'you look like a million green lemons popping up in my lovely garden pool on a sunny July afternoon. right hand dexterity requires steady practice to master pinky and ring finger keys y, u, i, o, p, h, j, k, l, semi, n, m, comma, and period. pink pumpkins grow in my family garden near Kigali. you should look at the monitor and only use your sense of touch to feel the keyboard layout. your right thumb should press the space bar for excellent rhythm. keeping your hands in a balanced home position will allow your typing speed to grow. you look like a million green lemons popping up in my lovely garden pool on a sunny July afternoon. right hand dexterity requires steady practice to master pinky and ring finger keys y, u, i, o, p, h, j, k, l, semi, n, m, comma, and period. pink pumpkins grow in my family garden near Kigali. you should look at the monitor and only use your sense of touch to feel the keyboard layout. your right thumb should press the space bar for excellent rhythm. keeping your hands in a balanced home position will allow your typing speed to grow.'
    },
    {
        id: 'lib_tm_8',
        title: 'Typing Master: Shift Key Practice',
        source: 'Typing Master Lesson 8',
        level: 1,
        complexity: 'Medium',
        wordCount: 206,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'The sun is shining bright today in Kigali and we are learning professional touch typing skills on the keyboard. Alice and Bob...',
        content: 'The sun is shining bright today in Kigali and we are learning professional touch typing skills on the keyboard. Alice and Bob visited Paris in July. Kepler College is situated in Rwanda, East Africa, where students practice typing daily. United Nations reports show rapid growth in digital skills across Africa. Saturday and Sunday are great days to practice touch typing at home. Let us use the Shift key correctly: press the opposite Shift key with your pinky while your other hand strikes the letter key. This builds speed and prevents finger fatigue. Yes, practice makes a master! The sun is shining bright today in Kigali and we are learning professional touch typing skills on the keyboard. Alice and Bob visited Paris in July. Kepler College is situated in Rwanda, East Africa, where students practice typing daily. United Nations reports show rapid growth in digital skills across Africa. Saturday and Sunday are great days to practice touch typing at home. Let us use the Shift key correctly: press the opposite Shift key with your pinky while your other hand strikes the letter key. This builds speed and prevents finger fatigue. Yes, practice makes a master!'
    },
    {
        id: 'lib_tm_9',
        title: 'Typing Master: Number Row Practice',
        source: 'Typing Master Lesson 9',
        level: 1,
        complexity: 'Medium',
        wordCount: 202,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'The system reported 102 active connections, 45 pending updates, and 378 resolved items within 24 hours of operation...',
        content: 'The system reported 102 active connections, 45 pending updates, and 378 resolved items within 24 hours of operation. Our office address is 9876 Boulevard Road, Suite 40, where 15 employees typed 350 words in 10 minutes. In the year 2024, our team completed 12 major sprints. The temperature dropped from 78 degrees to 53 degrees by 9:00 PM. Please remember that typing numbers requires keeping your home row anchor secure while stretching your fingers up to the number row. Practice dialing 123, 456, 789, and 0 to master the number row reaches! The system reported 102 active connections, 45 pending updates, and 378 resolved items within 24 hours of operation. Our office address is 9876 Boulevard Road, Suite 40, where 15 employees typed 350 words in 10 minutes. In the year 2024, our team completed 12 major sprints. The temperature dropped from 78 degrees to 53 degrees by 9:00 PM. Please remember that typing numbers requires keeping your home row anchor secure while stretching your fingers up to the number row. Practice dialing 123, 456, 789, and 0 to master the number row reaches!'
    },
    {
        id: 'lib_tm_10',
        title: 'Typing Master: Paragraph Flow',
        source: 'Typing Master Lesson 10',
        level: 1,
        complexity: 'Medium',
        wordCount: 208,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'Success in professional touch typing is the sum of small, regular drills repeated day in and day out with accurate rhythm...',
        content: 'Success in professional touch typing is the sum of small, regular drills repeated day in and day out with accurate rhythm. Speed naturally follows precision, so stay relaxed and keep practicing. As you type longer paragraphs, maintain a continuous flow of thoughts without pausing between words. Let your fingers glide over the home row anchors as you focus on the center of the screen. Touch typing is a wonderful digital skill that will save you thousands of hours over your lifetime. Stay patient, keep your back straight, and celebrate every small improvement you make daily on your learning journey. Success in professional touch typing is the sum of small, regular drills repeated day in and day out with accurate rhythm. Speed naturally follows precision, so stay relaxed and keep practicing. As you type longer paragraphs, maintain a continuous flow of thoughts without pausing between words. Let your fingers glide over the home row anchors as you focus on the center of the screen. Touch typing is a wonderful digital skill that will save you thousands of hours over your lifetime. Stay patient, keep your back straight, and celebrate every small improvement you make daily on your learning journey.'
    },
    {
        id: 'lib_tm_11',
        title: 'Typing Master: Index Finger Reaches',
        source: 'Typing Master Lesson 11',
        level: 1,
        complexity: 'Easy',
        wordCount: 210,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'the quick index finger reaches for g and h with t and y and also v and b typing standard patterns very fast...',
        content: 'the quick index finger reaches for g and h with t and y and also v and b typing standard patterns very fast. index fingers are the most active fingers on the keyboard, handling multiple central keys. practice striking g and h firmly while keeping your pinky fingers anchored on a and semi. the brave traveler hiked through the green valleys and high mountains to find the golden river. index fingers also reach for 4, 5, 6, and 7 on the number row. keep your wrists steady and let your index fingers move smoothly between rows. practice daily to achieve high speed. the quick index finger reaches for g and h with t and y and also v and b typing standard patterns very fast. index fingers are the most active fingers on the keyboard, handling multiple central keys. practice striking g and h firmly while keeping your pinky fingers anchored on a and semi. the brave traveler hiked through the green valleys and high mountains to find the golden river. index fingers also reach for 4, 5, 6, and 7 on the number row. keep your wrists steady and let your index fingers move smoothly between rows. practice daily to achieve high speed.'
    },
    {
        id: 'lib_tm_12',
        title: 'Typing Master: Pinky Finger Stretch',
        source: 'Typing Master Lesson 12',
        level: 1,
        complexity: 'Medium',
        wordCount: 202,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'pinky fingers reach out wide for q and p and z and slash keys while keeping home row anchor placement secure...',
        content: 'pinky fingers reach out wide for q and p and z and slash keys while keeping home row anchor placement secure. because the pinky is the weakest finger, it requires dedicated practice to build strike strength and reach accuracy. always return your pinky fingers to the home keys a and semi after stretching for outer keys. the quiet queen typed a long post about her favorite purple plants. touch typing punctuation marks like slash, colon, semi, and period is essential for writing clean code and beautiful documents. keep practicing the pinky stretches to achieve perfect keyboard balance. pinky fingers reach out wide for q and p and z and slash keys while keeping home row anchor placement secure. because the pinky is the weakest finger, it requires dedicated practice to build strike strength and reach accuracy. always return your pinky fingers to the home keys a and semi after stretching for outer keys. the quiet queen typed a long post about her favorite purple plants. touch typing punctuation marks like slash, colon, semi, and period is essential for writing clean code and beautiful documents. keep practicing the pinky stretches to achieve perfect keyboard balance.'
    },
    {
        id: 'lib_tm_13',
        title: 'Typing Master: Double Letter Warm-up',
        source: 'Typing Master Lesson 13',
        level: 1,
        complexity: 'Easy',
        wordCount: 202,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'keep a good book at the pool side and feel the cool wind fall upon the green grass of the sweet garden...',
        content: 'keep a good book at the pool side and feel the cool wind fall upon the green grass of the sweet garden. double letters require a quick, rhythmic double strike of the same key without losing your typing balance. look at the yellow balloon floating high in the deep blue sky. our team will meet soon to coordinate the next steps for our school project. typing double letters like ee, oo, ll, ss, and tt is an excellent warm-up exercise for your fingers. stay relaxed, look at the screen, and feel the natural bounce of the keys. keep a good book at the pool side and feel the cool wind fall upon the green grass of the sweet garden. double letters require a quick, rhythmic double strike of the same key without losing your typing balance. look at the yellow balloon floating high in the deep blue sky. our team will meet soon to coordinate the next steps for our school project. typing double letters like ee, oo, ll, ss, and tt is an excellent warm-up exercise for your fingers. stay relaxed, look at the screen, and feel the natural bounce of the keys.'
    },
    {
        id: 'lib_tm_14',
        title: 'Typing Master: Easy Sentence Sprint',
        source: 'Typing Master Lesson 14',
        level: 1,
        complexity: 'Easy',
        wordCount: 200,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'she saw a red car run down the hot street as fast as the blue bird flew up into the deep dark sky...',
        content: 'she saw a red car run down the hot street as fast as the blue bird flew up into the deep dark sky. the little cat sat on the warm rug near the small window waiting for her kind friend. we had a wonderful time walking through the green forest on a sunny summer day. simple words and easy lowercase sentences are perfect to build your basic speed and accuracy. focus on maintaining a fluid movement without stopping or looking down at your keyboard layout. typing is easy when you stay relaxed and practice regularly. she saw a red car run down the hot street as fast as the blue bird flew up into the deep dark sky. the little cat sat on the warm rug near the small window waiting for her kind friend. we had a wonderful time walking through the green forest on a sunny summer day. simple words and easy lowercase sentences are perfect to build your basic speed and accuracy. focus on maintaining a fluid movement without stopping or looking down at your keyboard layout. typing is easy when you stay relaxed and practice regularly.'
    },
    {
        id: 'lib_tm_15',
        title: 'Typing Master: Level 1 Milestone',
        source: 'Typing Master Lesson 15',
        level: 1,
        complexity: 'Medium',
        wordCount: 202,
        estimatedTimeMin: 4,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'Practice makes a master typist. Keep your head straight, shoulders relaxed, elbows close, and stay focused on natural accuracy first...',
        content: 'Practice makes a master typist. Keep your head straight, shoulders relaxed, elbows close, and stay focused on natural accuracy first. Speed will follow your patience and daily rhythm. This milestone test marks your graduation from basic drills to advanced text typing. You have learned home row anchors, top row reaches, bottom row coordinates, shift key alternating capitals, numbers, and basic punctuation marks. Celebrate this wonderful milestone as you prepare to transition to Level 2 advanced sprints. Keep practicing with dedication, stay relaxed, look at the screen, and let your fingers glide effortlessly over the keyboard! Practice makes a master typist. Keep your head straight, shoulders relaxed, elbows close, and stay focused on natural accuracy first. Speed will follow your patience and daily rhythm. This milestone test marks your graduation from basic drills to advanced text typing. You have learned home row anchors, top row reaches, bottom row coordinates, shift key alternating capitals, numbers, and basic punctuation marks. Celebrate this wonderful milestone as you prepare to transition to Level 2 advanced sprints. Keep practicing with dedication, stay relaxed, look at the screen, and let your fingers glide effortlessly over the keyboard!'
    },
    {
        id: 'lib_3',
        title: 'Introduction to Python',
        source: 'Technical Typing',
        level: 2,
        complexity: 'Hard',
        wordCount: 820,
        estimatedTimeMin: 10,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'def calculate_area(radius): return 3.14159 * radius ** 2. This function demonstrates basic syntax in Python...',
        content: 'Python is one of the most popular programming languages in the world today. It was created by Guido van Rossum and first released in 1991. Python emphasizes code readability and simplicity, making it an excellent choice for beginners and experienced developers alike. The language uses indentation to define blocks of code, which enforces clean and organized formatting. def calculate_area(radius): return 3.14159 * radius ** 2. This function demonstrates basic syntax in Python. Variables in Python do not require explicit type declarations; the interpreter determines the type automatically. Python supports multiple programming paradigms, including procedural, object-oriented, and functional programming. Lists, tuples, and dictionaries are the primary data structures used to organize collections of values. A list is mutable, meaning you can change its contents after creation. A tuple is immutable, which means once defined, it cannot be modified. Dictionaries store key-value pairs and provide fast lookup operations. Python has a vast standard library that includes modules for file handling, networking, mathematics, and data manipulation. The popular frameworks Django and Flask are used to build powerful web applications quickly. NumPy and Pandas are widely used libraries for scientific computing and data analysis. Writing clean, well-documented Python code requires following the PEP 8 style guide, which provides conventions for naming variables, structuring functions, and adding meaningful comments. Functions are defined using the def keyword, and they can accept parameters, return values, and be nested inside other functions. Object-oriented programming in Python involves defining classes with attributes and methods. The init method serves as the constructor, initializing new instances of the class. Inheritance allows one class to acquire the properties of another, promoting code reuse and modular design. Python is widely used in artificial intelligence, machine learning, web development, automation, and scientific research.'
    },
    {
        id: 'lib_4',
        title: 'Cybersecurity Principles',
        source: 'InfoSec Basics',
        level: 2,
        complexity: 'Hard',
        wordCount: 760,
        estimatedTimeMin: 8,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'Authentication, Authorization, and Accounting (AAA) form the core of any secure system architecture...',
        content: 'Authentication, Authorization, and Accounting form the core of any secure system architecture. These three pillars define who can access a system, what they are permitted to do, and how their activities are tracked over time. Cybersecurity has become one of the most critical fields in the modern digital economy. Every organization, from small businesses to global enterprises, must defend against an ever-growing range of threats. Phishing attacks involve deceptive emails that trick users into revealing their credentials or downloading malicious software. Ransomware is a type of malware that encrypts a victim\'s data and demands payment for the decryption key. Social engineering exploits human psychology rather than technical vulnerabilities to gain unauthorized access. Strong password policies require a minimum length, a mix of uppercase and lowercase letters, numbers, and special characters. Multi-factor authentication adds an additional verification layer beyond the password, dramatically reducing unauthorized access risk. Encryption converts readable data into an unreadable format using mathematical algorithms, ensuring that only authorized parties can access sensitive information. Firewalls monitor and control incoming and outgoing network traffic based on predetermined security rules. Intrusion detection systems analyze network patterns and generate alerts when suspicious activity is detected. Regular software updates and patch management are essential practices because attackers frequently exploit known vulnerabilities in outdated systems. A security audit involves a comprehensive review of an organization\'s information systems to evaluate their design, implementation, and effectiveness. Zero-trust architecture assumes that no user or device is inherently trustworthy, requiring continuous verification of every access request. Endpoint protection solutions monitor individual devices for signs of compromise or malicious behavior. Data backup strategies ensure business continuity in the event of a successful cyberattack or hardware failure. Building a culture of cybersecurity awareness within an organization is just as important as deploying technical defenses.'
    },
    {
        id: 'lib_5',
        title: 'The Art of Professional Communication',
        source: 'Business Writing Today',
        level: 2,
        complexity: 'Hard',
        wordCount: 720,
        estimatedTimeMin: 8,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'Effective professional communication is the foundation upon which successful careers and organizations are built...',
        content: 'Effective professional communication is the foundation upon which successful careers and organizations are built. Whether you are drafting a formal report, composing a business email, or presenting data to a senior leadership team, the clarity and precision of your message determines how well it is received. In the modern workplace, written communication has become more important than ever before. Teams collaborate across time zones and countries, relying almost entirely on written exchanges to coordinate their efforts and share progress. A well-written email should have a clear subject line that accurately summarizes its purpose. The opening paragraph must state the main point immediately, without burying the critical information beneath unnecessary background. Professional tone requires balancing warmth and formality; you want to sound approachable without appearing unprofessional. Avoid jargon and technical acronyms unless you are certain that your audience is familiar with them. Spell-check tools are helpful, but they cannot catch all errors; always proofread your documents carefully before submitting or sending them. Using the active voice makes your writing stronger and more direct. Instead of writing "The report was submitted by the team," write "The team submitted the report." Short paragraphs and bullet points improve readability, especially when your audience is likely to skim rather than read every word carefully. In formal reports, the executive summary provides a concise overview of findings and recommendations, allowing decision-makers to grasp the main conclusions quickly. Charts, graphs, and tables can make complex data more accessible and persuasive. Practice writing every day to develop your vocabulary, sharpen your style, and build the confidence needed to communicate effectively in any professional context.'
    },
    {
        id: 'lib_6',
        title: 'Global Economics and Trade',
        source: 'World Economic Review',
        level: 2,
        complexity: 'Hard',
        wordCount: 750,
        estimatedTimeMin: 8,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'International trade has been the engine of global prosperity for centuries, linking economies across continents...',
        content: 'International trade has been the engine of global prosperity for centuries, linking economies across continents and cultures in an intricate web of exchange. When countries specialize in producing goods and services in which they hold a comparative advantage, overall economic output increases, benefiting consumers worldwide through lower prices and greater variety. The World Trade Organization, established in 1995, serves as the primary international body for negotiating trade rules and resolving disputes between member nations. Tariffs are taxes imposed on imported goods, raising their prices and reducing their competitiveness relative to domestically produced alternatives. Free trade agreements seek to eliminate or reduce these barriers, creating larger, more integrated markets. Supply chains have become extraordinarily complex, with components often crossing multiple borders before a finished product reaches the consumer. The COVID-19 pandemic exposed the fragility of many global supply chains, prompting businesses and governments to rethink the risks of excessive dependence on single-source suppliers. Inflation, interest rates, and currency exchange rates all influence the competitiveness of a nation\'s exports and the cost of its imports. Emerging markets in Africa, Southeast Asia, and Latin America have attracted significant foreign direct investment, accelerating infrastructure development and creating new employment opportunities. Technology is reshaping trade by enabling digital goods and services to cross borders instantly without physical transportation. E-commerce platforms allow small businesses in developing countries to reach international customers directly. However, trade also raises concerns about labor standards, environmental regulations, and the displacement of workers in industries that cannot compete with cheaper foreign alternatives. Policymakers must balance the benefits of open trade with the social responsibility of protecting vulnerable communities from its disruptions.'
    },
    {
        id: 'lib_7',
        title: 'Climate Change and the Environment',
        source: 'Environmental Science Digest',
        level: 2,
        complexity: 'Hard',
        wordCount: 740,
        estimatedTimeMin: 8,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'Climate change is one of the defining challenges of our generation, driven primarily by the release of greenhouse gases...',
        content: 'Climate change is one of the defining challenges of our generation, driven primarily by the release of greenhouse gases from human industrial activity, deforestation, and agriculture. Carbon dioxide, methane, and nitrous oxide trap heat in the Earth\'s atmosphere, causing average global temperatures to rise at an unprecedented rate. Scientists from around the world have documented accelerating ice melt in the Arctic and Antarctic regions, rising sea levels threatening coastal communities, and increasing frequency of extreme weather events such as hurricanes, droughts, floods, and wildfires. The Intergovernmental Panel on Climate Change has warned that limiting global warming to 1.5 degrees Celsius above pre-industrial levels requires dramatic and rapid reductions in greenhouse gas emissions across all sectors of the economy. Renewable energy sources such as solar, wind, and hydropower are rapidly becoming cost-competitive with fossil fuels, offering a pathway to decarbonize electricity generation. Electric vehicles are replacing internal combustion engine cars in many markets, reducing transportation-related emissions significantly. Sustainable agriculture practices, including crop rotation, reduced tillage, and precision irrigation, can lower the environmental impact of food production while maintaining yields. Reforestation and afforestation projects help absorb carbon dioxide and restore biodiversity lost to deforestation. Carbon pricing mechanisms, including carbon taxes and cap-and-trade systems, create economic incentives for companies to invest in cleaner technologies. International cooperation is essential because climate change is a global problem that transcends national borders. The Paris Agreement, signed by nearly every country in the world, represents a landmark commitment to collective action. Individual choices also matter; reducing meat consumption, minimizing single-use plastic, and choosing energy-efficient appliances all contribute to a lower carbon footprint.'
    },
    {
        id: 'lib_8',
        title: 'Modern Healthcare and Medicine',
        source: 'Health Sciences Quarterly',
        level: 2,
        complexity: 'Hard',
        wordCount: 730,
        estimatedTimeMin: 8,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'The rapid advancement of medical technology has transformed how diseases are diagnosed, treated, and prevented...',
        content: 'The rapid advancement of medical technology has transformed how diseases are diagnosed, treated, and prevented over the past century. What once required lengthy hospital stays can now be performed as outpatient procedures in a matter of hours. Vaccines have eradicated or dramatically reduced the impact of diseases that once killed millions, including smallpox, polio, and measles. Antibiotics revolutionized the treatment of bacterial infections when they were first introduced in the mid-twentieth century, saving countless lives. However, the overuse and misuse of antibiotics have contributed to the rise of antibiotic-resistant bacteria, which pose a growing threat to global public health. Genomic medicine is opening new frontiers in personalized healthcare, allowing doctors to tailor treatments to a patient\'s unique genetic profile. Cancer therapies have advanced significantly, with targeted drugs attacking tumors based on their specific molecular characteristics rather than applying broad chemotherapy to all dividing cells. Artificial intelligence is beginning to assist radiologists in detecting tumors and other abnormalities in medical imaging, often matching or exceeding the accuracy of experienced specialists. Telemedicine has expanded access to healthcare by allowing patients in remote areas to consult with specialists via video call. Preventive medicine emphasizes lifestyle changes, regular screenings, and early interventions to reduce the incidence of chronic diseases such as diabetes, heart disease, and hypertension. Nutrition, physical activity, adequate sleep, and stress management are recognized as foundational pillars of long-term health. Mental health has gained increasing recognition as an integral component of overall wellbeing. Access to affordable, high-quality healthcare remains a persistent challenge in many parts of the world, requiring sustained political will and financial commitment to address systemic inequalities.'
    },
    {
        id: 'lib_9',
        title: 'The History of the Internet',
        source: 'Digital History Journal',
        level: 2,
        complexity: 'Hard',
        wordCount: 710,
        estimatedTimeMin: 8,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'The internet began as a military research project and evolved into the global communications backbone it is today...',
        content: 'The internet began as a military research project called ARPANET, developed in the late 1960s by the United States Department of Defense to create a communication network that could survive a nuclear attack by automatically rerouting data through alternative paths. Early internet communication was limited to universities and government research institutions, used primarily for sharing academic papers and sending electronic messages between researchers. Tim Berners-Lee invented the World Wide Web in 1989, proposing a system of hyperlinked documents that could be accessed through a browser using standardized protocols. This invention transformed the internet from a technical tool used by specialists into an accessible platform for billions of ordinary people. The 1990s saw the rapid commercialization of the internet, with companies like Amazon, Google, and eBay pioneering new business models built entirely around digital commerce and information retrieval. Broadband connections replaced slow dial-up modems, enabling users to stream video, make voice calls, and download large files efficiently. Social media platforms emerged in the early 2000s, fundamentally changing how people communicate, share information, and form communities across geographic boundaries. Smartphones placed the internet in everyone\'s pocket, enabling constant connectivity and creating new industries around mobile applications and location-based services. Cloud computing allows businesses and individuals to store and process data on remote servers rather than local hardware, improving flexibility and reducing costs. Artificial intelligence, powered by vast amounts of data generated online, is now embedded in search engines, recommendation systems, and voice assistants. The internet has democratized access to knowledge, entertainment, and economic opportunity on an unprecedented scale. However, it also raises serious concerns about privacy, misinformation, cybercrime, and the concentration of market power among a handful of technology giants.'
    },
    {
        id: 'lib_10',
        title: 'Leadership and Organizational Culture',
        source: 'Harvard Management Review',
        level: 2,
        complexity: 'Hard',
        wordCount: 700,
        estimatedTimeMin: 8,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'Great leaders do not simply manage tasks; they inspire people, shape culture, and create conditions in which teams thrive...',
        content: 'Great leaders do not simply manage tasks; they inspire people, shape culture, and create conditions in which teams can thrive and achieve extraordinary results. Leadership is not a title or a position; it is a set of behaviors and mindsets that can be developed and practiced by anyone willing to invest in their own growth. Effective leaders communicate a compelling vision clearly and consistently, helping every member of the team understand how their individual contribution connects to the larger organizational purpose. They listen actively, seeking diverse perspectives before making decisions, and remain open to changing course when new evidence emerges. Trust is the foundation of every high-performing team. Leaders build trust through consistent behavior, honest communication, and a demonstrated commitment to the wellbeing of those they lead. Psychological safety, the belief that one can speak up, ask questions, and make mistakes without fear of punishment, is a critical driver of innovation and learning within organizations. Organizational culture is shaped by the behaviors that are rewarded, tolerated, or discouraged over time. Culture is not defined by values posted on a wall; it is revealed in the decisions made when things are difficult and the rules are ambiguous. Servant leadership places the needs of the team above the ego of the leader, creating cultures of accountability, respect, and continuous improvement. Coaching and mentoring are essential tools through which experienced leaders develop the next generation of talent. Diversity and inclusion efforts, when genuinely embraced, bring a richer variety of ideas and perspectives that lead to better problem-solving and more creative outcomes. The most resilient organizations combine ambitious goals with the psychological flexibility to learn from setbacks and adapt rapidly to changing circumstances.'
    },
    {
        id: 'lib_11',
        title: "Africa's Digital Revolution",
        source: 'African Business Perspectives',
        level: 2,
        complexity: 'Hard',
        wordCount: 720,
        estimatedTimeMin: 8,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCskkYe5oA8piZHk9uIAyymNvBfIx0JZOIBZrosWzW7lClN_mXpawD3BQW435OmrAy70YSt0mYeLrysWHZxs6EF5emh-CuDF9Wt3BAIoByo9Uidkh0OvknKQLIqdvl-78G-7kuJKaBIx55Af8Z_9ZtN12g4u6ZNMjL_2TcbI4QAGY-zo8v2o5Me8lex33TXxyP7ZqKqDQ0LhOrctikV_ma_N8eEcZi8-fuXEEnmyLJBdQ0UeUL2Ok7v1gfpqWgFB-Xjq_bST9nX1FAk',
        excerpt: 'Africa is experiencing a remarkable digital transformation, driven by mobile technology, young entrepreneurs, and growing connectivity...',
        content: 'Africa is experiencing a remarkable digital transformation driven by mobile technology, a young and entrepreneurial population, and rapidly expanding internet connectivity. The continent has leapfrogged traditional infrastructure stages, going straight from no banking to mobile banking, and from no telephone lines to widespread smartphone adoption. Mobile money services like M-Pesa in Kenya have enabled millions of previously unbanked citizens to save, transfer, and receive funds securely using only a basic mobile phone. Rwanda has positioned itself as a technology hub through deliberate government investment in fiber-optic infrastructure, digital literacy programs, and a business-friendly regulatory environment. Startups in Lagos, Nairobi, Cairo, and Johannesburg are attracting record levels of venture capital investment, building solutions tailored specifically to the unique challenges and opportunities of African markets. The rise of the gig economy is creating new earning opportunities for young graduates who can offer skills in graphic design, software development, data entry, and digital marketing through global freelancing platforms. E-commerce is growing rapidly, with platforms connecting millions of buyers and sellers across borders. Digital health applications are bringing medical consultations and pharmacy services to remote communities that previously had no reliable access to healthcare. Agricultural technology startups are helping smallholder farmers access market price data, weather forecasts, and financial services via smartphone. Education technology companies are delivering quality learning content to students in rural areas where qualified teachers are scarce. The African Union Digital Transformation Strategy aims to create a single digital market across the continent, facilitating cross-border trade and data flows. With more than half of its population under the age of 25, Africa\'s demographic advantage positions it to become one of the most dynamic digital economies of the twenty-first century.'
    },
    {
        id: 'lib_tm_10fastfingers',
        title: '10 Fast Fingers Advanced Sprint',
        source: 'Typespire Engine',
        level: 2,
        complexity: 'Hard',
        wordCount: 150,
        estimatedTimeMin: 2,
        coverImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsB8B_l7JsRKngrUdfsAzNU1zSIoGhomjQppoX23ANXPj0fpcqv4v-NZCM89bj04YLo3Q9LY3zyyGXZ_1IfEo98_5tg9CNmzrAu-gvEbD6ZFrpQYjD_L_Y5YvDvw2m5ZCDc1Hugl2G8GGfIsEJJyri6JjdBno5uZWoEGJpT9b9v_-gatn-gRlKdLfDZdHxJVsOz3jQBS2iWOQw-xKMVaF9C1cQjwIXx1XdOK5rKhNXYQ16zJDgnN0lpLBRwJ0niHTidyWRr3SjoN9J',
        excerpt: 'Dynamic 10 Fast Fingers words generator. Click to generate a unique combination of advanced unrelated words for a fair classroom competition!',
        content: '10_fast_fingers_dynamic'
    }
];

const FacilitatorTestLaunch: React.FC = () => {
    const navigate = useNavigate();
    const { publishAssignment, students, sections, assignments } = useFacilitator();
    const { settings } = useInstitution();

    const [testLevel, setTestLevel] = useState<1 | 2>(1);
    
    // Library vs Custom Mode
    const [sourceMode, setSourceMode] = useState<'library' | 'custom'>('library');
    const [selectedLibraryId, setSelectedLibraryId] = useState<string>('lib_1');
    const [generatedDynamicText, setGeneratedDynamicText] = useState('');

    useEffect(() => {
        if (selectedLibraryId === 'lib_tm_10fastfingers') {
            if (!generatedDynamicText) {
                setGeneratedDynamicText(generate10FastFingersText(ADVANCED_WORD_POOL, 150));
            }
        } else {
            setGeneratedDynamicText('');
        }
    }, [selectedLibraryId, generatedDynamicText]);

    const [searchQuery, setSearchQuery] = useState('');
    
    // Custom Text State
    const [customTitle, setCustomTitle] = useState('');
    const [customContent, setCustomContent] = useState('');

    const [targetSection, setTargetSection] = useState('');
    const [assignmentMode, setAssignmentMode] = useState<'section' | 'students'>('section');
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [timeLimit, setTimeLimit] = useState('1');
    const [allowedTrials, setAllowedTrials] = useState('');
    const [accessWindow, setAccessWindow] = useState('1440'); // default: 1 day in minutes
    const [bypassCriteria, setBypassCriteria] = useState(false);
    const [restrictToAttended, setRestrictToAttended] = useState(false);
    const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [previewingText, setPreviewingText] = useState<LibraryText | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    
    const [successPopup, setSuccessPopup] = useState<{show: boolean, count: number}>({show: false, count: 0});
    const [monitorAssignmentId, setMonitorAssignmentId] = useState<string | null>(null);
    const [liveData, setLiveData] = useState<LiveData | null>(null);
    const [liveLoading, setLiveLoading] = useState(false);

    const fetchLiveData = useCallback(async (id: string) => {
        setLiveLoading(true);
        try {
            const res = await api.get(`/assignment/${id}/live`);
            setLiveData(res.data);
        } catch (err) {
            console.error('Failed to fetch live data', err);
        } finally {
            setLiveLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!monitorAssignmentId) return;
        fetchLiveData(monitorAssignmentId);
        const interval = setInterval(() => fetchLiveData(monitorAssignmentId), 10000);
        return () => clearInterval(interval);
    }, [monitorAssignmentId, fetchLiveData]);

    // Derived states
    const filteredLibrary = useMemo(() => {
        return MOCK_LIBRARY_TEXTS.filter(t => 
            t.level === testLevel && 
            t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [testLevel, searchQuery]);

    const activeLibraryText = MOCK_LIBRARY_TEXTS.find(t => t.id === selectedLibraryId);
    
    // Reset selection if test level changes and current selection doesn't match
    React.useEffect(() => {
        const firstMatch = MOCK_LIBRARY_TEXTS.find(t => t.level === testLevel);
        if (firstMatch) {
            setSelectedLibraryId(firstMatch.id);
        }
    }, [testLevel]);

    const customWordCount = useMemo(() => {
        return customContent.trim() ? customContent.trim().split(/\s+/).length : 0;
    }, [customContent]);

    const customEstimatedTime = useMemo(() => {
        return Math.max(1, Math.ceil(customWordCount / 40));
    }, [customWordCount]);

    const handlePublish = (e: React.FormEvent) => {
        e.preventDefault();

        if (assignmentMode === 'section' && !targetSection) {
            alert('Please select a target section.');
            return;
        }

        if (assignmentMode === 'students' && selectedStudentIds.length === 0) {
            alert('Please select at least one student.');
            return;
        }

        // Ensure we have a payload
        let finalTitle = '';
        let finalContent = '';

        if (sourceMode === 'library') {
            if (!activeLibraryText) return alert("Please select a library text.");
            finalTitle = activeLibraryText.title;
            finalContent = activeLibraryText.id === 'lib_tm_10fastfingers' ? generatedDynamicText : activeLibraryText.content;
        } else {
            if (!customTitle.trim() || !customContent.trim()) {
                return alert("Please provide a Title and Text for your Custom Assignment.");
            }
            if (customWordCount < 10) {
                return alert("Custom text must be at least 10 words long.");
            }
            finalTitle = customTitle;
            finalContent = customContent;
        }

        let finalStudentIds: string[] | undefined = undefined;
        let finalSectionId: string | undefined = undefined;

        if (assignmentMode === 'section') {
            finalSectionId = targetSection;
            // BUSINESS LOGIC:
            // - Beginners (Practicing) = Level 0
            // - Completed Practice = Level 1
            // - High Performers = Level 2
            const eligibleStudents = students.filter(s => {
                if (s.sectionId !== targetSection) return false;
                
                if (bypassCriteria) return true; // Developer testing bypass toggle!
                
                let studentLevel = 0; // Beginner

                // If they have completed practice (mocked via levelProgress) or met the school's Level 1 threshold
                if (s.levelProgress >= 100 || s.currentWpm >= settings.level1Wpm) {
                    studentLevel = 1;
                }
                
                // If they have met the school's Level 2 threshold
                if (s.currentWpm >= settings.level2Wpm) {
                    studentLevel = 2;
                }

                // Strictly match the test level being assigned
                return studentLevel === testLevel;
            });

            if (eligibleStudents.length === 0) {
                alert(`Cannot publish. No students in this section match Level ${testLevel} criteria.`);
                return;
            }
            finalStudentIds = eligibleStudents.map(s => s.id);
        } else {
            finalStudentIds = selectedStudentIds;
        }

        publishAssignment({
            title: finalTitle,
            text: finalContent,
            sectionId: finalSectionId,
            studentIds: finalStudentIds,
            dueDate: new Date(Date.now() + parseInt(accessWindow) * 60 * 1000).toISOString(),
            level: testLevel,
            duration: timeLimit === '0' ? 0 : parseInt(timeLimit) * 60,
            maxAttempts: allowedTrials ? parseInt(allowedTrials) : undefined,
            wpmRequirement: testLevel === 1 ? settings?.level1Wpm : settings?.level2Wpm,
            accuracyRequirement: settings?.requiredAccuracy,
            bypassLevel: bypassCriteria,
            attendanceDate: (assignmentMode === 'section' && restrictToAttended) ? selectedAttendanceDate : undefined
        });

        setSuccessPopup({ show: true, count: finalStudentIds.length });
    };

    return (
        <>
            {successPopup.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#0b1e2d] p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full mb-5 bg-[#33B974]/10 text-[#33B974]">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Published Successfully</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            This test has been successfully dispatched to <strong className="text-slate-900 dark:text-white">{successPopup.count}</strong> eligible students.
                        </p>
                        <button
                            onClick={() => navigate('/facilitator')}
                            className="w-full bg-[#094A71] hover:bg-[#094A71]/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#929bc9]">
                <Link to="/facilitator" className="hover:text-primary transition-colors">Dashboard</Link>
                <span>/</span>
                <span className="text-slate-900 dark:text-white">New Test</span>
            </div>

            {/* Page Heading */}
            <div className="flex flex-wrap justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex min-w-72 flex-col gap-1.5">
                    <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight font-heading">Create Test Session</h1>
                    <p className="text-slate-500 dark:text-[#929bc9] text-sm md:text-base font-normal">Build and launch a new typing assessment in three simple steps.</p>
                </div>
            </div>

            {/* ── Step Indicator ── */}
            <div className="flex items-center gap-0 mt-2 mb-2">
                {[
                    { num: 1, label: 'Choose Content' },
                    { num: 2, label: 'Select Audience' },
                    { num: 3, label: 'Rules & Launch' },
                ].map((step, idx) => (
                    <React.Fragment key={step.num}>
                        <button
                            type="button"
                            onClick={() => {
                                // Only allow going back to already-visited steps
                                if (step.num < currentStep) setCurrentStep(step.num);
                            }}
                            className={`flex items-center gap-2.5 group transition-all ${step.num < currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            <div className={`relative flex items-center justify-center w-9 h-9 rounded-full font-black text-sm border-2 transition-all duration-300 ${
                                currentStep === step.num
                                    ? 'border-primary bg-primary text-[#111422] shadow-lg shadow-primary/30 scale-110'
                                    : currentStep > step.num
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark text-slate-400 dark:text-[#929bc9]'
                            }`}>
                                {currentStep > step.num
                                    ? <span className="material-symbols-outlined text-[16px] font-black">check</span>
                                    : step.num
                                }
                                {currentStep === step.num && (
                                    <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-30" />
                                )}
                            </div>
                            <span className={`text-xs font-bold hidden sm:block transition-colors ${
                                currentStep === step.num
                                    ? 'text-slate-900 dark:text-white'
                                    : currentStep > step.num
                                        ? 'text-primary'
                                        : 'text-slate-400 dark:text-[#929bc9]'
                            }`}>
                                {step.label}
                            </span>
                        </button>
                        {idx < 2 && (
                            <div className={`flex-1 mx-3 h-0.5 rounded-full transition-all duration-500 max-w-[80px] ${
                                currentStep > step.num ? 'bg-primary' : 'bg-slate-200 dark:bg-[#323b67]'
                            }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* ── Live Summary Bar ── */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-xs font-bold text-slate-500 dark:text-[#929bc9] overflow-hidden">
                <span className="material-symbols-outlined text-[16px] text-primary">summarize</span>
                <span className="font-black text-primary uppercase tracking-wider text-[9px]">Mission Brief</span>
                <span className="mx-1 text-slate-200 dark:text-[#323b67]">|</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${testLevel === 2 ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-[#094A71]/10 text-[#094A71]'}`}>
                    Level {testLevel} — {testLevel === 2 ? 'Survival' : 'Standard'}
                </span>
                <span className="text-slate-300 dark:text-[#323b67]">·</span>
                <span className="truncate max-w-[200px]">
                    {sourceMode === 'library'
                        ? (activeLibraryText?.title || '—')
                        : (customTitle || 'Custom Text')}
                </span>
                <span className="text-slate-300 dark:text-[#323b67]">·</span>
                <span>
                    {assignmentMode === 'section'
                        ? (sections.find(s => s.id === targetSection)
                            ? `${sections.find(s => s.id === targetSection)?.name}`
                            : 'No section')
                        : `${selectedStudentIds.length} students`}
                </span>
                <span className="text-slate-300 dark:text-[#323b67]">·</span>
                <span>{timeLimit === '0' ? 'Unlimited' : `${timeLimit} min`}</span>
            </div>

            {/* ── STEP CONTENT ── */}
            <div className="relative overflow-hidden min-h-[420px]">

                {/* ────────── STEP 1: CONTENT ────────── */}
                <div className={`transition-all duration-400 ${currentStep === 1 ? 'opacity-100 translate-x-0' : currentStep > 1 ? 'opacity-0 -translate-x-8 absolute inset-0 pointer-events-none' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'}`}>
                    {/* Level Selector */}
                    <div className="mb-6">
                        <p className="text-xs font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest mb-3">Test Difficulty Level</p>
                        <div className="grid grid-cols-2 gap-3 max-w-sm">
                            <button
                                type="button"
                                onClick={() => setTestLevel(1)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                    testLevel === 1
                                        ? 'border-[#094A71] bg-[#094A71]/5 dark:bg-[#094A71]/10 shadow-md'
                                        : 'border-slate-200 dark:border-[#323b67] hover:border-[#094A71]/30 bg-white dark:bg-card-dark'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${testLevel === 1 ? 'text-[#094A71]' : 'text-slate-400'}`}>school</span>
                                <div className="text-left">
                                    <p className={`text-sm font-black ${testLevel === 1 ? 'text-[#094A71]' : 'text-slate-600 dark:text-slate-300'}`}>Level 1</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Standard</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTestLevel(2)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                                    testLevel === 2
                                        ? 'border-red-500 bg-red-500/5 dark:bg-red-500/10 shadow-md'
                                        : 'border-slate-200 dark:border-[#323b67] hover:border-red-300 bg-white dark:bg-card-dark'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-2xl ${testLevel === 2 ? 'text-red-500' : 'text-slate-400'}`}>flash_on</span>
                                <div className="text-left">
                                    <p className={`text-sm font-black ${testLevel === 2 ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}>Level 2</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Survival</p>
                                </div>
                            </button>
                        </div>
                        {testLevel === 2 && (
                            <p className="mt-2 text-[10px] text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2 max-w-sm">
                                ⚡ Students get 60s, no backspace, and only 3 errors allowed.
                            </p>
                        )}
                    </div>

                    {/* Source Tabs */}
                    <div className="border-b border-slate-200 dark:border-[#323b67] mb-6">
                        <div className="flex gap-6">
                            <button
                                onClick={() => setSourceMode('library')}
                                className={`flex items-center gap-2 border-b-2 pb-3 px-1 font-bold text-sm transition-all ${sourceMode === 'library' ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-[#929bc9] hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-lg">library_books</span>
                                Text Library
                            </button>
                            <button
                                onClick={() => setSourceMode('custom')}
                                className={`flex items-center gap-2 border-b-2 pb-3 px-1 font-bold text-sm transition-all ${sourceMode === 'custom' ? 'border-primary text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-[#929bc9] hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <span className="material-symbols-outlined text-lg">edit_note</span>
                                Custom Text
                            </button>
                        </div>
                    </div>

                    {sourceMode === 'library' ? (
                        <div className="flex flex-col gap-4">
                            {/* Search Bar */}
                            <div className="relative flex w-full items-stretch rounded-xl border border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark focus-within:border-primary/60 transition-all p-1 shadow-sm">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#929bc9] text-[20px]">search</span>
                                <input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 bg-transparent text-slate-900 dark:text-white focus:outline-0 placeholder:text-slate-400 dark:placeholder:text-[#929bc9] text-sm font-normal"
                                    placeholder={`Search Level ${testLevel} library texts by title...`}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-xs font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Level {testLevel} Recommended Texts</p>
                                <span className="text-[10px] font-bold bg-slate-100 dark:bg-[#323b67] text-slate-500 dark:text-[#929bc9] px-2 py-0.5 rounded-full">{filteredLibrary.length} available</span>
                            </div>

                            <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
                                {filteredLibrary.map(test => (
                                    <div
                                        key={test.id}
                                        onClick={() => setSelectedLibraryId(test.id)}
                                        className={`relative group flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover-scale active-scale shadow-sm hover:shadow-md ${
                                            selectedLibraryId === test.id
                                                ? 'border-primary bg-primary/5 dark:bg-primary/5'
                                                : 'border-slate-200 dark:border-[#323b67] bg-white dark:bg-card-dark'
                                        }`}
                                    >
                                        {selectedLibraryId === test.id && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[#111422] shadow-sm">
                                                    <span className="material-symbols-outlined text-sm font-black">check</span>
                                                </div>
                                            </div>
                                        )}
                                        <div
                                            className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-slate-100 dark:bg-[#323b67] bg-cover bg-center border border-slate-200/50 dark:border-[#323b67]/50 shadow-sm"
                                            style={{ backgroundImage: `url('${test.coverImg}')` }}
                                        />
                                        <div className="flex flex-col gap-1.5 flex-1 pr-8">
                                            <h3 className="text-slate-900 dark:text-white font-bold text-lg group-hover:text-primary transition-colors duration-200 tracking-tight font-heading">{test.title}</h3>
                                            <p className="text-slate-400 dark:text-[#929bc9] text-xs font-semibold">by {test.source}</p>
                                            <div className="flex flex-wrap items-center justify-between gap-3.5 mt-2">
                                                <div className="flex flex-wrap items-center gap-3.5">
                                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm ${
                                                        test.complexity === 'Easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                        test.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400' :
                                                        'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                                                    }`}>
                                                        {test.complexity}
                                                    </span>
                                                    <span className="text-xs text-slate-400 dark:text-[#929bc9] flex items-center gap-1 font-bold">
                                                        <span className="material-symbols-outlined text-[14px]">schedule</span> {test.estimatedTimeMin} min
                                                    </span>
                                                    <span className="text-xs text-slate-400 dark:text-[#929bc9] font-bold">{test.wordCount} words</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (test.id === 'lib_tm_10fastfingers' && !generatedDynamicText) {
                                                            setGeneratedDynamicText(generate10FastFingersText(ADVANCED_WORD_POOL, 150));
                                                        }
                                                        setPreviewingText(test);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#323b67]/80 hover:border-[#094A71]/50 text-slate-500 dark:text-[#929bc9] hover:text-[#094A71] bg-slate-50 dark:bg-[#232948] transition-all text-xs font-bold font-heading hover-scale active-scale shadow-sm shrink-0"
                                                >
                                                    <span className="material-symbols-outlined text-sm font-black">visibility</span>
                                                    Quick Preview
                                                </button>
                                            </div>
                                            <p className={`text-slate-500 dark:text-[#929bc9]/80 text-sm mt-3 line-clamp-2 leading-relaxed ${test.level === 2 ? 'font-mono text-[13px] bg-slate-50 dark:bg-black/20 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800' : ''}`}>
                                                {test.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {filteredLibrary.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 dark:text-[#929bc9] border border-dashed border-slate-200 dark:border-[#323b67] rounded-xl bg-slate-50/50 dark:bg-[#232948]/50">
                                        No texts found for Level {testLevel} matching your search.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 bg-white dark:bg-card-dark border border-slate-200 dark:border-[#323b67] p-6 rounded-2xl shadow-sm">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">Custom Text Editor</h3>
                                <p className="text-sm text-slate-500 dark:text-[#929bc9]">Provide your own content for the typing test. The system will automatically calculate the metrics.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Test Title</label>
                                <input
                                    type="text"
                                    required
                                    value={customTitle}
                                    onChange={(e) => setCustomTitle(e.target.value)}
                                    placeholder="e.g., Weekly Custom Assessment"
                                    className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-semibold outline-none focus:border-primary/60 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Text Content</label>
                                <textarea
                                    required
                                    value={customContent}
                                    onChange={(e) => setCustomContent(e.target.value)}
                                    placeholder="Paste or type the text you want students to type here..."
                                    rows={8}
                                    className="w-full rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-3 px-4 text-sm font-mono outline-none focus:border-primary/60 transition-colors custom-scrollbar"
                                />
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-[#232948] rounded-xl border border-slate-100 dark:border-[#323b67]">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Word Count</span>
                                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{customWordCount}</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Estimated Time</span>
                                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{customEstimatedTime} min</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ────────── STEP 2: AUDIENCE ────────── */}
                <div className={`transition-all duration-400 ${currentStep === 2 ? 'opacity-100 translate-x-0' : currentStep > 2 ? 'opacity-0 -translate-x-8 absolute inset-0 pointer-events-none' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'}`}>
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading mb-1">Who receives this test?</h2>
                            <p className="text-sm text-slate-500 dark:text-[#929bc9]">Choose to assign to an entire class section or hand-pick specific students.</p>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex bg-slate-100 dark:bg-[#232948] p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-inner w-fit">
                            <button
                                type="button"
                                onClick={() => setAssignmentMode('section')}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 hover-scale active-scale ${
                                    assignmentMode === 'section'
                                        ? 'bg-white dark:bg-card-dark text-primary shadow-md'
                                        : 'text-slate-500 dark:text-[#929bc9] hover:text-slate-950 dark:hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">groups</span>
                                Entire Section
                            </button>
                            <button
                                type="button"
                                onClick={() => setAssignmentMode('students')}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 hover-scale active-scale ${
                                    assignmentMode === 'students'
                                        ? 'bg-white dark:bg-card-dark text-primary shadow-md'
                                        : 'text-slate-500 dark:text-[#929bc9] hover:text-slate-950 dark:hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">person_check</span>
                                Pick Students
                            </button>
                        </div>

                        {/* Section Picker */}
                        {assignmentMode === 'section' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Target Class Section</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] focus:border-primary/60 text-slate-900 dark:text-white py-3.5 px-4 pr-10 text-sm font-semibold outline-none"
                                            value={targetSection}
                                            onChange={(e) => setTargetSection(e.target.value)}
                                        >
                                            <option disabled value="">Select a class section...</option>
                                            {sections?.map(section => (
                                                <option key={section.id} value={section.id}>
                                                    {section.intakeName ? `${section.intakeName} — ` : ''}{section.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[#929bc9]">
                                            <span className="material-symbols-outlined">expand_more</span>
                                        </div>
                                    </div>
                                    {targetSection && (
                                        <p className="text-[10px] text-primary font-bold flex items-center gap-1 mt-0.5">
                                            <span className="material-symbols-outlined text-[12px]">info</span>
                                            Only students matching Level {testLevel} criteria will receive the test.
                                        </p>
                                    )}
                                </div>

                                {/* Attendance Toggle */}
                                <div className="flex flex-col gap-3 p-4 rounded-2xl border border-slate-200 dark:border-[#323b67] bg-slate-50/50 dark:bg-[#323b67]/10">
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <div
                                            onClick={() => setRestrictToAttended(!restrictToAttended)}
                                            className={`relative w-10 h-5 rounded-full transition-all duration-200 cursor-pointer ${restrictToAttended ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                        >
                                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${restrictToAttended ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">Restrict to Attended Students</p>
                                            <p className="text-[10px] text-slate-500 dark:text-[#929bc9] font-medium mt-0.5">
                                                Only publish to students marked present on the selected class date.
                                            </p>
                                        </div>
                                    </label>

                                    {restrictToAttended && (
                                        <div className="flex flex-col gap-1.5 mt-1 animate-in slide-in-from-top-1 duration-200 border-t border-slate-200 dark:border-[#323b67] pt-3">
                                            <label className="text-[9px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Attendance Date</label>
                                            <input
                                                type="date"
                                                value={selectedAttendanceDate}
                                                onChange={(e) => setSelectedAttendanceDate(e.target.value)}
                                                className="w-full max-w-xs bg-white dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-750 dark:text-white rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-primary/60"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Bypass Toggle */}
                                <div className="flex items-start gap-3 bg-[#094A71]/5 dark:bg-[#094A71]/10 border border-[#094A71]/15 p-4 rounded-2xl">
                                    <input
                                        id="bypass-criteria-toggle"
                                        type="checkbox"
                                        className="mt-0.5 rounded text-[#094A71] focus:ring-[#094A71]/30 bg-white dark:bg-card-dark border-slate-300 dark:border-slate-800 h-4 w-4 cursor-pointer"
                                        checked={bypassCriteria}
                                        onChange={(e) => setBypassCriteria(e.target.checked)}
                                    />
                                    <div className="flex flex-col gap-0.5 cursor-pointer select-none" onClick={() => setBypassCriteria(!bypassCriteria)}>
                                        <label htmlFor="bypass-criteria-toggle" className="text-[10px] font-black text-[#094A71] dark:text-blue-400 uppercase tracking-widest cursor-pointer">
                                            Bypass Criteria (Testing Mode)
                                        </label>
                                        <p className="text-[9px] text-slate-500 dark:text-[#929bc9] leading-relaxed font-semibold">
                                            Instantly publishes to all targeted students even if they do not match the Level {testLevel} requirements.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Student Picker */}
                        {assignmentMode === 'students' && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider">Select Students</label>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-wider">{selectedStudentIds.length} selected</span>
                                </div>
                                <div className="overflow-y-auto bg-slate-50 dark:bg-[#232948] rounded-2xl border border-slate-200 dark:border-[#323b67] p-2 flex flex-col gap-1 max-h-80 custom-scrollbar">
                                    {students.map(student => (
                                        <label key={student.id} className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-card-dark rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                            <input
                                                type="checkbox"
                                                className="rounded text-primary focus:ring-primary bg-white dark:bg-card-dark border-slate-300 dark:border-slate-800 h-4 w-4"
                                                checked={selectedStudentIds.includes(student.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedStudentIds(prev => [...prev, student.id]);
                                                    } else {
                                                        setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
                                                    }
                                                }}
                                            />
                                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs uppercase shrink-0">
                                                {student.name?.[0] || 'S'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-[#929bc9] uppercase font-bold">{student.major}</span>
                                            </div>
                                        </label>
                                    ))}
                                    {students.length === 0 && (
                                        <p className="text-xs text-slate-400 dark:text-[#929bc9] p-4 text-center">No active student records.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ────────── STEP 3: RULES & LAUNCH ────────── */}
                <div className={`transition-all duration-400 ${currentStep === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Controls */}
                        <div className="flex flex-col gap-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading mb-1">Set the rules</h2>
                                <p className="text-sm text-slate-500 dark:text-[#929bc9]">Configure time limits, attempts, and access window before launching.</p>
                            </div>

                            {/* Time Limit */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider flex justify-between">
                                    <span>Time Limit</span>
                                    <span className="text-[10px] font-black text-slate-400/80">Default: 1 min</span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] focus:border-primary/60 text-slate-900 dark:text-white py-3 px-4 pr-10 text-sm font-semibold outline-none"
                                        value={timeLimit}
                                        onChange={(e) => setTimeLimit(e.target.value)}
                                    >
                                        <option value="1">1 Minute</option>
                                        <option value="2">2 Minutes</option>
                                        <option value="3">3 Minutes</option>
                                        <option value="5">5 Minutes</option>
                                        <option value="0">Unlimited</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[#929bc9]">
                                        <span className="material-symbols-outlined text-sm">timer</span>
                                    </div>
                                </div>
                            </div>

                            {/* Allowed Attempts */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider flex items-center gap-1">
                                    <span>Allowed Attempts</span>
                                    <span className="material-symbols-outlined text-sm text-slate-400 cursor-help" title="Number of attempts allowed for this test session">info</span>
                                </label>
                                <div className="flex items-center bg-slate-50 dark:bg-[#232948] rounded-xl px-4 py-1.5 border border-slate-200 dark:border-[#323b67] focus-within:border-primary/60">
                                    <input
                                        className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white font-bold text-sm py-2 focus:outline-none"
                                        min="1"
                                        placeholder="Unlimited Attempts"
                                        type="number"
                                        value={allowedTrials}
                                        onChange={(e) => setAllowedTrials(e.target.value)}
                                    />
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black shrink-0 ml-2">Attempts</span>
                                </div>
                            </div>

                            {/* Access Window */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 dark:text-[#929bc9] uppercase tracking-wider flex items-center gap-1">
                                    <span>Access Window</span>
                                    <span className="material-symbols-outlined text-sm text-slate-400 cursor-help" title="How long students have to access and complete this test from now">info</span>
                                </label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl bg-slate-50 dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] focus:border-primary/60 text-slate-900 dark:text-white py-3 px-4 pr-10 text-sm font-semibold outline-none"
                                        value={accessWindow}
                                        onChange={(e) => setAccessWindow(e.target.value)}
                                    >
                                        <option value="10">10 Minutes</option>
                                        <option value="30">30 Minutes</option>
                                        <option value="60">1 Hour</option>
                                        <option value="180">3 Hours</option>
                                        <option value="1440">1 Day</option>
                                        <option value="4320">3 Days</option>
                                        <option value="10080">1 Week</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 dark:text-[#929bc9]">
                                        <span className="material-symbols-outlined text-sm">event_available</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 dark:text-[#929bc9] font-semibold">After this period, the test locks and marks absent students as <span className="text-rose-500 font-black">Missing</span>.</p>
                            </div>
                        </div>

                        {/* Right: Mission Brief */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white font-heading mb-1">Mission Brief</h2>
                                <p className="text-sm text-slate-500 dark:text-[#929bc9]">Review before you deploy.</p>
                            </div>

                            <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-[#323b67] rounded-2xl overflow-hidden shadow-sm">
                                {/* Header accent */}
                                <div className={`h-1.5 w-full ${testLevel === 2 ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gradient-to-r from-primary to-emerald-400'}`} />

                                <div className="p-5 flex flex-col gap-4">
                                    {/* Text */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#323b67] bg-cover bg-center shrink-0 mt-0.5" style={{ backgroundImage: `url('${activeLibraryText?.coverImg || ''}')` }} />
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest mb-0.5">Test Content</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                                {sourceMode === 'library' ? (activeLibraryText?.title || '—') : (customTitle || 'Custom Text')}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${testLevel === 2 ? 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-[#094A71]/10 text-[#094A71]'}`}>
                                                    Level {testLevel} — {testLevel === 2 ? 'Survival' : 'Standard'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {sourceMode === 'library' ? `${activeLibraryText?.wordCount || 0} words` : `${customWordCount} words`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100 dark:border-[#323b67]/45" />

                                    {/* Audience */}
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">groups</span>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest mb-0.5">Audience</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                {assignmentMode === 'section'
                                                    ? (sections.find(s => s.id === targetSection)?.name || 'No section selected')
                                                    : `${selectedStudentIds.length} student${selectedStudentIds.length !== 1 ? 's' : ''} selected`}
                                            </p>
                                            {assignmentMode === 'section' && restrictToAttended && (
                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">event_available</span>
                                                    Attendance filter: {selectedAttendanceDate}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <hr className="border-slate-100 dark:border-[#323b67]/45" />

                                    {/* Rules */}
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest mb-1">Time Limit</p>
                                            <p className="text-base font-black text-slate-900 dark:text-white">{timeLimit === '0' ? '∞' : `${timeLimit}m`}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest mb-1">Attempts</p>
                                            <p className="text-base font-black text-slate-900 dark:text-white">{allowedTrials || '∞'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest mb-1">Window</p>
                                            <p className="text-base font-black text-slate-900 dark:text-white">
                                                {accessWindow === '60' ? '1h' : accessWindow === '1440' ? '1d' : accessWindow === '10080' ? '1w' : `${accessWindow}m`}
                                            </p>
                                        </div>
                                    </div>

                                    {bypassCriteria && (
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#094A71] dark:text-blue-400 bg-[#094A71]/5 dark:bg-[#094A71]/10 border border-[#094A71]/15 px-3 py-2 rounded-xl">
                                            <span className="material-symbols-outlined text-[14px]">construction</span>
                                            Bypass criteria enabled
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Publish Button */}
                            <form onSubmit={handlePublish}>
                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 px-4 text-base font-black text-white shadow-lg shadow-primary/25 hover:bg-emerald-600 transition-all hover-scale active-scale glow-primary font-heading"
                                >
                                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                                    Publish Test
                                </button>
                                <Link
                                    to="/facilitator"
                                    className="flex w-full items-center justify-center rounded-2xl bg-transparent border border-slate-300 dark:border-[#323b67] py-3.5 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover-scale active-scale font-heading mt-3"
                                >
                                    Cancel
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Step Navigation ── */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#323b67]/45 mt-2">
                <button
                    type="button"
                    onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                    disabled={currentStep === 1}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#323b67] text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-[#232948] transition-all hover-scale active-scale disabled:opacity-30 disabled:pointer-events-none"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back
                </button>

                <span className="text-xs text-slate-400 dark:text-[#929bc9] font-bold hidden sm:block">
                    Step {currentStep} of 3
                </span>

                {currentStep < 3 ? (
                    <button
                        type="button"
                        onClick={() => {
                            if (currentStep === 1) {
                                if (sourceMode === 'library' && !activeLibraryText) {
                                    alert('Please select a text from the library.'); return;
                                }
                                if (sourceMode === 'custom' && (!customTitle.trim() || !customContent.trim())) {
                                    alert('Please provide a title and text content.'); return;
                                }
                            }
                            if (currentStep === 2) {
                                if (assignmentMode === 'section' && !targetSection) {
                                    alert('Please select a target section.'); return;
                                }
                                if (assignmentMode === 'students' && selectedStudentIds.length === 0) {
                                    alert('Please select at least one student.'); return;
                                }
                            }
                            setCurrentStep(s => Math.min(3, s + 1));
                        }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-black text-sm shadow-md shadow-primary/20 hover:bg-emerald-600 transition-all hover-scale active-scale"
                    >
                        Next
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                ) : (
                    <div className="w-24" /> // spacer when on step 3 (publish button is in the content)
                )}
            </div>

            <div className="h-6" />

            {/* ── Live Monitor ── */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-heading flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-2xl">monitor_heart</span>
                            Live Test Monitor
                        </h2>
                        <p className="text-slate-500 dark:text-[#929bc9] text-sm mt-1">Select an active assignment to watch real-time submission progress. Auto-refreshes every 10s.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={monitorAssignmentId || ''}
                                onChange={e => {
                                    const val = e.target.value || null;
                                    setMonitorAssignmentId(val);
                                    setLiveData(null);
                                }}
                                className="appearance-none rounded-xl bg-white dark:bg-[#232948] border border-slate-200 dark:border-[#323b67] text-slate-900 dark:text-white py-2.5 pl-4 pr-10 text-sm font-semibold outline-none focus:border-primary/60 min-w-[220px]"
                            >
                                <option value="">Select assignment to monitor...</option>
                                {assignments.map(a => (
                                    <option key={a.id} value={a.id}>{a.title}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </div>
                        </div>
                        {monitorAssignmentId && (
                            <button
                                onClick={() => fetchLiveData(monitorAssignmentId)}
                                disabled={liveLoading}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-[#323b67] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#232948] transition-all"
                            >
                                <span className={`material-symbols-outlined text-[18px] ${liveLoading ? 'animate-spin' : ''}`}>refresh</span>
                            </button>
                        )}
                    </div>
                </div>

                {!monitorAssignmentId ? (
                    <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-black/10 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">sensors</span>
                        <p className="font-semibold text-sm">Select an assignment above to start monitoring</p>
                    </div>
                ) : liveData ? (
                    <div className="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-[#323b67] shadow-sm overflow-hidden">
                        {/* Monitor Header */}
                        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-slate-100 dark:border-[#323b67] bg-slate-50/60 dark:bg-[#232948]/60">
                            <div>
                                <p className="text-xs font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-wider mb-0.5">Monitoring</p>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">{liveData.title}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Pass threshold: ≥{liveData.passWpm} WPM · ≥{liveData.passAccuracy}% accuracy</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{liveData.submitted}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{liveData.totalStudents - liveData.submitted}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-primary font-mono">
                                        {liveData.students.filter(s => s.passed === true).length}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passed</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-5 pt-4 pb-2">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
                                <span>Submission Progress</span>
                                <span>{liveData.submitted}/{liveData.totalStudents}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-700"
                                    style={{ width: `${liveData.totalStudents > 0 ? (liveData.submitted / liveData.totalStudents) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Student Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[550px]">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-[#323b67]">
                                        <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-slate-400">Student</th>
                                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">WPM</th>
                                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Accuracy</th>
                                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Result</th>
                                        <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Submitted At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-[#323b67]/50">
                                    {liveData.students.map(student => (
                                        <tr key={student.userId} className="hover:bg-slate-50 dark:hover:bg-[#232948] transition-colors">
                                            <td className="py-3.5 px-5 font-bold text-sm text-slate-900 dark:text-white">{student.name}</td>
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                                    student.status === 'Submitted'
                                                        ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                                                }`}>
                                                    <span className="material-symbols-outlined text-[11px]">
                                                        {student.status === 'Submitted' ? 'check_circle' : 'hourglass_empty'}
                                                    </span>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono font-bold text-sm text-slate-700 dark:text-slate-200">
                                                {student.wpm !== null ? student.wpm : '—'}
                                            </td>
                                            <td className={`py-3.5 px-4 font-mono font-bold text-sm ${
                                                student.accuracy !== null
                                                    ? student.accuracy >= liveData.passAccuracy ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                                                    : 'text-slate-400'
                                            }`}>
                                                {student.accuracy !== null ? `${student.accuracy.toFixed(1)}%` : '—'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {student.passed === null ? (
                                                    <span className="text-slate-300 dark:text-slate-600 text-xs font-bold">—</span>
                                                ) : student.passed ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                                                        <span className="material-symbols-outlined text-[11px]">verified</span> Pass
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400">
                                                        <span className="material-symbols-outlined text-[11px]">close</span> Fail
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                                                {student.submittedAt
                                                    ? new Date(student.submittedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-5 py-3 border-t border-slate-100 dark:border-[#323b67] flex items-center gap-2 text-xs text-slate-400">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live · auto-refreshing every 10 seconds
                            {liveLoading && <span className="material-symbols-outlined text-[13px] animate-spin ml-1">sync</span>}
                        </div>
                    </div>
                ) : liveLoading ? (
                    <div className="flex items-center justify-center h-48 gap-3 text-slate-400">
                        <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
                        <span className="font-semibold">Loading live data...</span>
                    </div>
                ) : null}
            </div>

            <div className="h-20"></div>

            {previewingText && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061824]/80 backdrop-blur-sm animate-in fade-in duration-300 p-4">
                    <div 
                        className="bg-white dark:bg-card-dark rounded-2xl border-2 border-[#094A71]/25 dark:border-[#094A71]/20 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#323b67]/45">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#323b67] bg-cover bg-center border border-slate-200/50 dark:border-[#323b67]/50 shadow-sm" style={{ backgroundImage: `url('${previewingText.coverImg}')` }}></div>
                                <div>
                                    <h3 className="text-slate-900 dark:text-white font-black text-lg leading-tight font-heading">{previewingText.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-[#929bc9] font-medium mt-0.5">by {previewingText.source} · Level {previewingText.level}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewingText(null)}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#232948] dark:hover:bg-[#323b67] flex items-center justify-center text-slate-500 dark:text-[#929bc9] hover:text-slate-800 dark:hover:text-white transition-all hover-scale active-scale"
                            >
                                <span className="material-symbols-outlined text-lg font-black">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
                            {/* Stats */}
                            <div className="flex flex-wrap gap-3">
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                                    previewingText.complexity === 'Easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                    previewingText.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400' :
                                    'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
                                }`}>
                                    {previewingText.complexity} Complexity
                                </span>
                                <span className="text-xs text-slate-500 dark:text-[#929bc9] font-bold bg-slate-50 dark:bg-[#232948] border border-slate-100 dark:border-[#323b67] px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">schedule</span> {previewingText.estimatedTimeMin} min estimated
                                </span>
                                <span className="text-xs text-slate-500 dark:text-[#929bc9] font-bold bg-slate-50 dark:bg-[#232948] border border-slate-100 dark:border-[#323b67] px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">segment</span> {previewingText.wordCount} words
                                </span>
                            </div>

                            {/* Title & Actions */}
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-black text-slate-400 dark:text-[#929bc9] uppercase tracking-widest">Full Test Passage</p>
                                {previewingText.id === 'lib_tm_10fastfingers' && (
                                    <button
                                        type="button"
                                        onClick={() => setGeneratedDynamicText(generate10FastFingersText(ADVANCED_WORD_POOL, 150))}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#094A71]/10 text-[#094A71] hover:bg-[#094A71]/20 rounded-xl transition-all hover-scale active-scale font-heading"
                                    >
                                        <span className="material-symbols-outlined text-sm font-black animate-spin-hover">refresh</span>
                                        Regenerate Word Combo
                                    </button>
                                )}
                            </div>

                            {/* Main Content Area */}
                            <div className="bg-slate-50 dark:bg-black/25 p-5 rounded-xl border border-slate-100 dark:border-slate-800 overflow-y-auto max-h-60 custom-scrollbar">
                                <p className="text-sm font-mono text-slate-700 dark:text-[#929bc9] leading-relaxed select-all">
                                    {previewingText.id === 'lib_tm_10fastfingers' ? generatedDynamicText : previewingText.content}
                                </p>
                            </div>

                            {previewingText.id === 'lib_tm_10fastfingers' && (
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-[#929bc9] font-semibold">
                                    <span className="material-symbols-outlined text-sm text-[#33B974]">info</span>
                                    <span>Includes capitalized words (~12%) and ALL CAPS words (~6%) to test Shift key mastery!</span>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-[#323b67]/45 flex justify-end gap-3 bg-slate-50 dark:bg-black/10">
                            <button
                                type="button"
                                onClick={() => setPreviewingText(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#323b67] text-slate-600 dark:text-[#929bc9] hover:bg-slate-100 dark:hover:bg-[#232948] transition-all text-sm font-bold font-heading hover-scale active-scale animate-in fade-in duration-100"
                            >
                                Close Preview
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedLibraryId(previewingText.id);
                                    setPreviewingText(null);
                                }}
                                className="px-5 py-2.5 rounded-xl bg-[#094A71] hover:bg-[#083e5f] text-white transition-all text-sm font-bold font-heading hover-scale active-scale shadow-md flex items-center gap-1.5"
                            >
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Select and Use Test
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="h-20"></div>
        </>
    );
};

export default FacilitatorTestLaunch;
