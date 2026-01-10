import 'lucide-react-native';

declare module 'lucide-react-native' {
    export interface LucideProps {
        color?: string;
        stroke?: string;
        strokeWidth?: number;
        size?: number | string;
        style?: any;
    }
}
