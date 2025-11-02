'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface StatsChartProps {
  languages?: Record<string, number>;
  commitHours?: Record<string, number>;
  type?: 'languages' | 'commits';
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#f43f5e'];

export default function StatsChart({ languages, commitHours, type = 'languages' }: StatsChartProps) {
  if (type === 'languages' && languages) {
    // Prepare data for pie chart
    const data = Object.entries(languages)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Top 7 languages

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Language Distribution
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: any) => `${props.name ?? 'Unknown'} ${((props.percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend with counts */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {data.map((lang, index) => (
            <div key={lang.name} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {lang.name}: <span className="font-semibold">{lang.value}</span> repos
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (type === 'commits' && commitHours) {
    // Prepare data for bar chart
    const data = Object.entries(commitHours)
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        commits: count,
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Commit Activity by Hour
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="hour" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar 
              dataKey="commits" 
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Analysis */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Pattern Analysis:</span>{' '}
            {getMostActiveHour(commitHours)}
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
}

function getMostActiveHour(commitHours: Record<string, number>): string {
  const entries = Object.entries(commitHours);
  if (entries.length === 0) return 'No data available';

  const [hour, count] = entries.reduce((max, curr) => 
    curr[1] > max[1] ? curr : max
  );

  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  const percentage = ((count / total) * 100).toFixed(1);

  return `Most commits at ${hour}:00 (${percentage}% of total)`;
}