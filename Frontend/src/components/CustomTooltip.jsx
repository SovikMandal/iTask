import React from "react";

const CustomTooltip = ({ active, payload, data }) => {
  if (active && payload && payload.length) {
    const current = payload[0];

    const totalSum = data.reduce((acc, cur) => acc + cur.count, 0);

    const percentage = totalSum > 0 
      ? ((current.value / totalSum) * 100).toFixed(1)
      : 0;

    return (
      <div className="bg-gradient-to-br from-white to-gray-50 text-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-4 h-4 rounded-full ring-2 ring-gray-300 ring-opacity-60"
            style={{ backgroundColor: current.color }}
          ></div>
          <p className="text-sm font-bold text-gray-800">{current.name}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Tasks:</span>
            <span className="text-sm font-semibold text-gray-800">{current.value}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Percentage:</span>
            <span className="text-sm font-semibold text-blue-600">{percentage}%</span>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
