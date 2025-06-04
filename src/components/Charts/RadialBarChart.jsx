import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function RadialBarChart({ percent }) {
    const data = [{ name: 'Progress', value: percent, fill: '#3b82f6' }];

    return (
        <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                data={data}
                startAngle={180}
                endAngle={0}
            >
                <RadialBar dataKey="value" cornerRadius={10} />
            </RadialBarChart>
        </ResponsiveContainer>
    );
}