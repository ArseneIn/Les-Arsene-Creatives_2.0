import { mockTransactions } from '@/lib/mockData';
import { Clock } from 'lucide-react';

const TransactionFeed = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Live Transactions</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0">
                        <div className="p-2 bg-gray-50 rounded-full">
                            <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <p className="text-sm font-medium text-gray-900">{tx.shop}</p>
                                <span className="text-xs font-bold text-gray-900">{tx.amount.toLocaleString()} RWF</span>
                            </div>
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-gray-500">{tx.method}</p>
                                <p className="text-xs text-gray-400">{tx.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionFeed;
