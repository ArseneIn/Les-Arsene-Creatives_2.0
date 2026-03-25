import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.getAttribute('role') === 'button'
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isVisible]);

    if (typeof window === 'undefined') return null;

    const variants = {
        default: {
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
            width: 16,
            height: 16,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            mixBlendMode: 'difference' as const,
            border: '0px solid rgba(255, 255, 255, 0)',
            opacity: isVisible ? 1 : 0
        },
        hover: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            width: 48,
            height: 48,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(2px)',
            opacity: isVisible ? 1 : 0
        },
        clicking: {
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            border: '2px solid rgba(255, 154, 18, 0.8)',
            opacity: isVisible ? 1 : 0
        }
    };

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block"
                animate={isClicking ? 'clicking' : isHovering ? 'hover' : 'default'}
                variants={variants}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5
                }}
            />
            {/* Outer subtle glow trailing slightly behind */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] hidden md:block bg-accent blur-[30px] opacity-20"
                animate={{
                    x: mousePosition.x - 60,
                    y: mousePosition.y - 60,
                    width: 120,
                    height: 120,
                    opacity: isHovering && isVisible ? 0.3 : 0
                }}
                transition={{
                    type: 'tween',
                    ease: 'backOut',
                    duration: 0.5
                }}
            />
        </>
    );
};

export default CustomCursor;
