export default function Skeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-lg ${className}`} />
    );
}
