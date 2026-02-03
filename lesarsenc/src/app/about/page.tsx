import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
    title: 'About Us | Les Arsene Creatives',
    description: 'Meet the team behind the agency. Two Arsenes, one vision: combining digital architecture and bold creativity to build brand legacies.',
};

export default function About() {
    return <AboutClient />;
}
