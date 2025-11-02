'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ScoreGauge({ score, size = 'lg' }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Animate score counting up
    let start = 0;
    const end = score;
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return { from: '#10b981', to: '#059669', text: 'Authentic', emoji: '✅' };
    if (score >= 50) return { from: '#f59e0b', to: '#d97706', text: 'Questionable', emoji: '⚠' };
    return { from: '#ef4444', to: '#dc2626', text: 'Suspicious', emoji: '🚩' };
  };

  const color = getColor();
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, type: 'spring' }}
        className={`relative ${sizeClasses[size]}`}
      >
        {/* Background circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="90"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color.from} />
              <stop offset="100%" stopColor={color.to} />
            </linearGradient>
          </defs>
        </svg>

        {/* Score text in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <div className="text-6xl font-bold" style={{ color: color.from }}>
              {displayScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              out of 100
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <div className="text-3xl mb-2">{color.emoji}</div>
        <div className="text-2xl font-bold" style={{ color: color.from }}>
          {color.text}
        </div>
      </motion.div>
    </div>
  );
}