'use client';

import { motion } from 'framer-motion';
import { GitCommit, Users, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface RepoCardProps {
  repoName: string;
  analysis?: {
    commit_analysis: {
      total_commits: number;
      unique_authors: number;
      days_active: number;
      commits_per_day: number;
      most_active_day: string;
    };
    red_flags: Array<{
      type: string;
      severity: string;
      message: string;
    }>;
    authenticity_score: number;
  };
  error?: string;
  index?: number;
}

export default function RepoCard({ repoName, analysis, error, index = 0 }: RepoCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 50) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div>
            <h3 className="font-bold text-red-900 dark:text-red-100">{repoName}</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!analysis) return null;

  const score = analysis.authenticity_score;
  const commitData = analysis.commit_analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${getScoreBg(score)} border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              📦 {repoName}
            </h3>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <GitCommit className="w-4 h-4" />
                <span>{commitData.total_commits} commits</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{commitData.unique_authors} authors</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{commitData.days_active} days active</span>
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">score</div>
          </div>
        </div>

        {/* Red Flags Summary */}
        {analysis.red_flags.length > 0 && (
          <div className="mt-4 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              {analysis.red_flags.length} red flag{analysis.red_flags.length !== 1 ? 's' : ''} detected
            </span>
          </div>
        )}

        {analysis.red_flags.length === 0 && (
          <div className="mt-4 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              No red flags
            </span>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 p-6"
        >
          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Commits per Day</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {commitData.commits_per_day.toFixed(2)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Most Active Day</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {commitData.most_active_day}
              </div>
            </div>
          </div>

          {/* Red Flags List */}
          {analysis.red_flags.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Red Flags:</h4>
              {analysis.red_flags.map((flag, i) => (
                <div
                  key={i}
                  className="text-sm p-2 bg-red-100 dark:bg-red-900/30 rounded border-l-4 border-red-500"
                >
                  <div className="font-medium text-red-900 dark:text-red-100">
                    {flag.type.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div className="text-red-700 dark:text-red-300">{flag.message}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Click hint */}
      <div className="px-6 pb-3 text-center text-xs text-gray-500 dark:text-gray-400">
        {expanded ? '▲ Click to collapse' : '▼ Click for details'}
      </div>
    </motion.div>
  );
}