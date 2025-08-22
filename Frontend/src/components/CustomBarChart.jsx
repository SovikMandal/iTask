import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell} from 'recharts';

const CustomBarChart = ({data}) => {

    const getBarColor = (entry) => {
        switch(entry?.priority) {
            case 'Low':
                return '#00BC7D'
            
            case 'Medium':
                return '#FE9900'

            case 'High':
                return '#FF1F57'

            default:
                return '#00BC7D'
        }
    };

    const getBarGradient = (entry) => {
        switch(entry?.priority) {
            case 'Low':
                return 'url(#lowGradient)'
            
            case 'Medium':
                return 'url(#mediumGradient)'

            case 'High':
                return 'url(#highGradient)'

            default:
                return 'url(#lowGradient)'
        }
    };

    const customTooltip = ({ active, payload, label }) => {
        if(active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className='bg-white border border-gray-200 p-4 rounded-xl shadow-lg backdrop-blur-sm'>
                    <div className='flex items-center gap-2 mb-2'>
                        <div 
                            className='w-3 h-3 rounded-full' 
                            style={{ backgroundColor: getBarColor(data) }}
                        ></div>
                        <p className='text-sm font-bold text-gray-800'>{data.priority} Priority</p>
                    </div>
                    <div className='space-y-1'>
                        <p className='text-xs text-gray-600'>
                            Tasks: <span className='font-semibold text-gray-900'>{data.count}</span>
                        </p>
                        <p className='text-xs text-gray-500'>
                            {data.count === 1 ? 'task' : 'tasks'} assigned
                        </p>
                    </div>
                </div>
            )
        }
        return null;
    }

    const customLabel = (entry) => {
        if (entry.count > 0) {
            return entry.count;
        }
        return null;
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[325px]">
                <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-500 text-lg font-medium">No priority data available</p>
                    <p className="text-gray-400 text-sm mt-2">Create some tasks to see priority distribution</p>
                </div>
            </div>
        );
    }

    const filteredData = data.filter(item => item.count > 0);

    if (filteredData.length === 0) {
        return (
            <div className="flex items-center justify-center h-[325px]">
                <div className="text-center">
                    <div className="text-6xl mb-4">📈</div>
                    <p className="text-gray-500 text-lg font-medium">All priorities are empty</p>
                    <p className="text-gray-400 text-sm mt-2">Assign priorities to tasks to see the distribution</p>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-white h-[325px] flex flex-col'>
            <div className='flex-1'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                        data={data} 
                        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                        barCategoryGap="25%"
                    >

                        <defs>
                            <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00BC7D" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#00BC7D" stopOpacity={0.6}/>
                            </linearGradient>
                            <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FE9900" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#FE9900" stopOpacity={0.6}/>
                            </linearGradient>
                            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF1F57" stopOpacity={0.9}/>
                                <stop offset="100%" stopColor="#FF1F57" stopOpacity={0.6}/>
                            </linearGradient>
                        </defs>

                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke='#f0f0f0'
                            vertical={false}
                        />

                        <XAxis
                            dataKey='priority'
                            tick={{ 
                                fill: '#64748b', 
                                fontSize: 12, 
                                fontWeight: 500 
                            }}
                            tickLine={false}
                            axisLine={false}
                            dy={5}
                        />

                        <YAxis 
                            tick={{ 
                                fill: '#64748b', 
                                fontSize: 11 
                            }} 
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 'dataMax + 1']}
                        />

                        <Tooltip 
                            content={customTooltip} 
                            cursor={{
                                fill: 'rgba(59, 130, 246, 0.1)',
                                stroke: 'rgba(59, 130, 246, 0.3)',
                                strokeWidth: 1
                            }}
                        />

                        <Bar
                            dataKey='count'
                            radius={[6, 6, 0, 0]}
                            maxBarSize={50}
                            label={{
                                position: 'top',
                                fill: '#374151',
                                fontSize: 11,
                                fontWeight: 600,
                                formatter: customLabel
                            }}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={getBarColor(entry)}
                                    style={{
                                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className='flex justify-center gap-4 py-2 h-12 items-center'>
                {data.map((item, index) => (
                    <div key={index} className='flex items-center gap-1.5'>
                        <div 
                            className='w-3 h-3 rounded-full shadow-sm' 
                            style={{ backgroundColor: getBarColor(item) }}
                        ></div>
                        <span className='text-xs font-medium text-gray-700'>
                            {item.priority}
                        </span>
                        <span className='text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full'>
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomBarChart;