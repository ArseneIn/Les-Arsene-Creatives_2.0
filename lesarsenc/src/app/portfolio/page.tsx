import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';

export const metadata: Metadata = {
    title: 'Selected Works | Les Arsene Creatives',
    description: 'A curation of our finest digital craftsmanship. Digital Empires, Brand Identities, and Web Applications.',
};

export default function Portfolio() {
    return <PortfolioClient />;
}
