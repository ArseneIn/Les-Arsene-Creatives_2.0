import { cn } from '@/lib/utils';

interface BatchYieldCardProps {
    productName: string;
    shopName: string;
    costPrice: number;
    targetRevenue: number;
    currentRevenue: number;
}

const BatchYieldCard = ({ productName, shopName, costPrice, targetRevenue, currentRevenue }: BatchYieldCardProps) => {
    const percentage = Math.min(100, Math.max(0, (currentRevenue / targetRevenue) * 100));
    const isProfit = currentRevenue > costPrice;

    let barColor = 'bg-primary';
    if (percentage >= 100) barColor = 'bg-success';
    else if (percentage < 50) barColor = 'bg-warning';

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">{productName}</h4>
                    <p className="text-sm text-gray-500">{shopName}</p>
                </div>
                <div className={cn("px-2 py-1 rounded text-xs font-medium", isProfit ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")}>
                    {isProfit ? 'In Profit' : 'Recovering Cost'}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">{percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={cn("h-2.5 rounded-full transition-all duration-500", barColor)} style={{ width: `${percentage}%` }}></div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="text-gray-500 text-xs">Cost</p>
                    <p className="font-medium">{costPrice.toLocaleString()} RWF</p>
                </div>
                <div>
                    <p className="text-gray-500 text-xs">Current</p>
                    <p className="font-medium">{currentRevenue.toLocaleString()} RWF</p>
                </div>
                <div>
                    <p className="text-gray-500 text-xs">Target</p>
                    <p className="font-medium">{targetRevenue.toLocaleString()} RWF</p>
                </div>
            </div>
        </div>
    );
};

export default BatchYieldCard;
