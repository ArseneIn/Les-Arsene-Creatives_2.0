export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background-light dark:bg-background-dark">
            <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border border-primary/30 rounded-full border-t-transparent animate-spin"></div>
                <span className="font-syne font-bold text-lg text-gray-900 dark:text-white animate-pulse">A</span>
            </div>
        </div>
    );
}
