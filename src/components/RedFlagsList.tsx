'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { RedFlag } from '@/types';

interface RedFlagsListProps {
  redFlags: RedFlag[];
}

export default function RedFlagsList({ redFlags }: RedFlagsListProps) {
  if (redFlags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center"
      >
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
          No Red Flags Detected!
        </h3>
        <p className="text-green-600 dark:text-green-300">
          This profile shows healthy development patterns.
        </p>
      </motion.div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-4 flex items-center">
        <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
        Red Flags Detected ({redFlags.length})
      </h3>

      {redFlags.map((flag, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${getSeverityColor(flag.severity)} border rounded-lg p-4 flex items-start space-x-3`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getSeverityIcon(flag.severity)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {flag.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                flag.severity === 'high' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                flag.severity === 'medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' :
                'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
              }`}>
                {flag.severity.toUpperCase()}
              </span>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300">
              {flag.message}
            </p>
            
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Score Impact: {flag.score_impact} points
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}