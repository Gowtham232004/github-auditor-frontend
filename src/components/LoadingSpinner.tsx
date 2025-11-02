'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  stages?: string[];
  currentStage?: number;
}

export default function LoadingSpinner({ 
  message = 'Analyzing...', 
  stages = [],
  currentStage = 0 
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Spinning loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-16 h-16 text-blue-600" />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {message}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          This may take 20-40 seconds...
        </p>
      </motion.div>

      {/* Progress stages */}
      {stages.length > 0 && (
        <div className="w-full max-w-md space-y-2">
          {stages.map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                index < currentStage
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : index === currentStage
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStage
                  ? 'bg-green-500'
                  : index === currentStage
                  ? 'bg-blue-500 animate-pulse'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {index < currentStage ? (
                  <span className="text-white text-sm">✓</span>
                ) : (
                  <span className="text-white text-xs">{index + 1}</span>
                )}
              </div>
              
              <span className={`text-sm font-medium ${
                index <= currentStage
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {stage}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Animated dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}