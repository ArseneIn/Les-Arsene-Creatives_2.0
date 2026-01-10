import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-gradient-gold text-onyx hover:opacity-90 shadow-gold border border-transparent',
            secondary: 'bg-onyx text-white hover:bg-jet border border-transparent',
            outline: 'border-2 border-onyx text-onyx hover:bg-onyx hover:text-white',
            ghost: 'bg-transparent text-onyx hover:bg-platinum border border-transparent',
            danger: 'bg-red-100 text-red-700 hover:bg-red-200 border border-transparent'
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    `rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2`,
                    `disabled:opacity-70 disabled:cursor-not-allowed`,
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';
