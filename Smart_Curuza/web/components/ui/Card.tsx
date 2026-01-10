import React from 'react';
import { cn } from '@/lib/utils';

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cn(`bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6`, className)}
            {...props}
        >
            {children}
        </div>
    );
};
