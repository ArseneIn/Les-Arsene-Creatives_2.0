import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
}

const KpiCard = ({ title, value, change, icon: Icon, trend, color = 'gold' }: KpiCardProps & { color?: 'gold' | 'blue' | 'green' | 'red' }) => {

    // Map colors to Tailwind classes
    const colorStyles = {
        gold: {
            bar: 'bg-yellow-400',
            iconBg: 'bg-yellow-400/10',
            iconText: 'text-yellow-600',
            border: 'group-hover:border-yellow-400/50'
        },
        blue: {
            bar: 'bg-blue-500',
            iconBg: 'bg-blue-500/10',
            iconText: 'text-blue-600',
            border: 'group-hover:border-blue-500/50'
        },
        green: {
            bar: 'bg-emerald-500',
            iconBg: 'bg-emerald-500/10',
            iconText: 'text-emerald-600',
            border: 'group-hover:border-emerald-500/50'
        },
        red: {
            bar: 'bg-rose-500',
            iconBg: 'bg-rose-500/10',
            iconText: 'text-rose-600',
            border: 'group-hover:border-rose-500/50'
        }
    };

    const styles = colorStyles[color] || colorStyles.gold;

    // Simple Sparkline Path Generator
    const getSparklinePath = (trend: 'up' | 'down' | 'neutral') => {
        if (trend === 'up') return "M0 20 Q10 18 20 15 T40 10 T60 5 T80 0";
        if (trend === 'down') return "M0 0 Q10 5 20 10 T40 15 T60 18 T80 20";
        return "M0 10 L80 10";
    };

    const sparklineColor = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#9CA3AF';

    return (
        <div className={cn(
            "relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col",
            "border-t-4 border-t-yellow-400" // Always Gold Top Border
        )}>
            <div className="p-5 relative z-10 flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider font-heading">{title}</p>
                        <h3 className="text-3xl font-bold text-jet mt-2 tracking-tight">{value}</h3>
                    </div>
                    {/* Icon with Gold Background */}
                    <div className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 bg-yellow-400/10">
                        <Icon className="w-6 h-6 text-yellow-600" />
                    </div>
                </div>
            </div>

            {/* Sparkline Background */}
            <div className="absolute bottom-12 right-0 opacity-10 pointer-events-none">
                <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d={getSparklinePath(trend || 'neutral')} stroke={sparklineColor} strokeWidth="4" strokeLinecap="round" />
                </svg>
            </div>

            {/* Footer for Trends */}
            {change && (
                <div className="bg-gray-50/80 px-5 py-3 border-t border-gray-100 flex items-center gap-2 relative z-10 mt-auto">
                    <span
                        className={cn(
                            "font-bold text-sm flex items-center gap-1",
                            trend === 'up' ? "text-emerald-600" : trend === 'down' ? "text-rose-600" : "text-gray-600"
                        )}
                    >
                        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
                    </span>
                    <span className="text-gray-400 text-xs font-medium">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default KpiCard;
