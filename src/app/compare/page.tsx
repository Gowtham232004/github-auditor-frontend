'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, ArrowRight, Trophy } from 'lucide-react';
import { githubAPI } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ScoreGauge from '@/components/ScoreGauge';

export default function ComparePage() {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [loading, setLoading] = useState(false);
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);

  const handleCompare = async () => {
    if (!username1 || !username2) {
      alert('Please enter both usernames');
      return;
    }

    setLoading(true);
    try {
      const [result1, result2] = await Promise.all([
        githubAPI.analyzeProfile(username1),
        githubAPI.analyzeProfile(username2),
      ]);
      
      setData1(result1);
      setData2(result2);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ComparisonCard = ({ label, value1, value2 }: any) => {
    const winner = value1 > value2 ? 1 : value1 < value2 ? 2 : 0;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
          {label}
        </h4>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className={`text-center ${winner === 1 ? 'text-green-600 font-bold' : ''}`}>
            <div className="text-3xl">{value1}</div>
            {winner === 1 && <Trophy className="w-5 h-5 mx-auto mt-2 text-yellow-500" />}
          </div>
          
          <div className="text-center text-gray-400">vs</div>
          
          <div className={`text-center ${winner === 2 ? 'text-green-600 font-bold' : ''}`}>
            <div className="text-3xl">{value2}</div>
            {winner === 2 && <Trophy className="w-5 h-5 mx-auto mt-2 text-yellow-500" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <GitCompare className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Compare GitHub Profiles
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Side-by-side comparison of two GitHub profiles
          </p>
        </motion.div>

        {/* Input Section */}
        {!data1 && !data2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  First GitHub Username
                </label>
                <input
                  type="text"
                  value={username1}
                  onChange={(e) => setUsername1(e.target.value)}
                  placeholder="e.g., torvalds"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="text-center text-gray-400">
                <div className="inline-block">VS</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Second GitHub Username
                </label>
                <input
                  type="text"
                  value={username2}
                  onChange={(e) => setUsername2(e.target.value)}
                  placeholder="e.g., gvanrossum"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleCompare}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Comparing...' : 'Compare Profiles'}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner message="Comparing profiles..." />}

        {/* Comparison Results */}
        {data1 && data2 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header with usernames */}
            <div className="grid grid-cols-3 gap-4 items-center mb-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {username1}
                </h2>
              </div>
              <div className="text-center text-gray-400 font-bold">VS</div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {username2}
                </h2>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ComparisonCard
                label="Public Repositories"
                value1={data1.profile?.public_repos || 0}
                value2={data2.profile?.public_repos || 0}
              />
              <ComparisonCard
                label="Followers"
                value1={data1.profile?.followers || 0}
                value2={data2.profile?.followers || 0}
              />
              <ComparisonCard
                label="Total Stars"
                value1={data1.statistics?.total_stars || 0}
                value2={data2.statistics?.total_stars || 0}
              />
              <ComparisonCard
                label="Total Forks"
                value1={data1.statistics?.total_forks || 0}
                value2={data2.statistics?.total_forks || 0}
              />
              <ComparisonCard
                label="Original Repos"
                value1={data1.statistics?.original_repos || 0}
                value2={data2.statistics?.original_repos || 0}
              />
              <ComparisonCard
                label="Languages"
                value1={Object.keys(data1.statistics?.languages || {}).length}
                value2={Object.keys(data2.statistics?.languages || {}).length}
              />
            </div>

            {/* Reset button */}
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  setData1(null);
                  setData2(null);
                  setUsername1('');
                  setUsername2('');
                }}
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Compare Different Profiles
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}