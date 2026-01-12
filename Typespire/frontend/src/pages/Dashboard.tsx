
const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Average Speed</h3>
                    <p className="text-3xl font-bold text-primary mt-2">42 <span className="text-sm text-gray-400 font-normal">WPM</span></p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Accuracy</h3>
                    <p className="text-3xl font-bold text-secondary mt-2">96%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Tests Completed</h3>
                    <p className="text-3xl font-bold text-accent mt-2">12</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                </div>
                <div className="p-6">
                    <p className="text-gray-500">No recent tests found.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
