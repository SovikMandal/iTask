import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({ data, colors }) => {
  const hasData = data && data.length > 0 && data.some(item => item.count > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[325px] rounded-lg ">
        <div className="text-center p-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-gray-500 text-lg font-medium">
            No Chart Data
          </h3>
          
          <p className="text-gray-400 text-sm mt-2 mb-4 max-w-xs mx-auto leading-relaxed">
            Your task distribution chart will appear here once you have created/assigned some tasks.
          </p>

          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-blue-300 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-green-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie 
          data={data} 
          dataKey="count" 
          nameKey="status" 
          cx="50%" 
          cy="50%" 
          outerRadius={130} 
          innerRadius={100} 
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={colors[index % colors.length]} 
            />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip data={data}/>} />

        <Legend content={<CustomLegend />}/>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomPieChart;