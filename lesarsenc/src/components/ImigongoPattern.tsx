export default function ImigongoPattern({ className, opacity = 0.03 }: { className?: string, opacity?: number }) {
    return (
        <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`} style={{ opacity }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="imigongo-zigzag" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
                        {/* Bold Zigzag Pattern */}
                        <path d="M0 0 L50 50 L100 0" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="square" />
                        <path d="M0 100 L50 150 L100 100" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="square" />
                        <path d="M0 -100 L50 -50 L100 -100" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="square" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#imigongo-zigzag)" />
            </svg>
        </div>
    );
}
