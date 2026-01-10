const LiveMap = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
            <div className="z-10 text-center">
                <p className="text-gray-500 font-medium">Live Merchant Map</p>
                <p className="text-xs text-gray-400 mt-1">(Google Maps Integration Placeholder)</p>
            </div>
            {/* Mock Pins */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-success rounded-full animate-pulse delay-75"></div>
            <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-warning rounded-full animate-pulse delay-150"></div>
        </div>
    );
};

export default LiveMap;
