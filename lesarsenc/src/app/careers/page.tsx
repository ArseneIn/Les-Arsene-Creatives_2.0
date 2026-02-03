import type { Metadata } from 'next';
import CareersClient from './CareersClient';

export const metadata: Metadata = {
    title: 'Careers | Les Arsene Creatives',
    description: 'Join the revolution. We are looking for visionaries, rebels, and pixel-perfect obsessives to build the future with us.',
};

export default function Careers() {
    return <CareersClient />;
}
