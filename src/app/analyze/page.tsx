'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { githubAPI } from '@/lib/api';
import { Zap, Shield, BarChart, Clock } from 'lucide-react';

function AnalyzePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState(0);

  const stages = [
    'Fetching GitHub profile...',
    'Analyzing repositories...',
    'Cloning repositories...',
    'Analyzing commit patterns...',
    'Detecting red flags...',
    'Calculating authenticity score...',
  ];

  const handleAnalysis = async (username: string) => {
    setLoading(true);
    setError('');
    setStage(0);

    try {
      // Simulate stage progression
      const stageInterval = setInterval(() => {
        setStage((prev) => Math.min(prev + 1, stages.length - 1));
      }, 5000); // Increased to 5 seconds per stage for more realistic timing

      // Perform deep analysis with extended timeout
      const result = await githubAPI.analyzeDeep(username, 3);

      clearInterval(stageInterval);
      
      // Navigate to results page
      router.push(`/results/${username}`);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analyze GitHub Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enter any GitHub username to get a comprehensive authenticity analysis
          </p>
        </motion.div>

        {/* Search Bar */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar onSearch={handleAnalysis} loading={loading} />
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
          >
            <h3 className="text-red-900 dark:text-red-100 font-bold mb-2">
              Analysis Failed
            </h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => {
                setError('');
                setLoading(false);
              }}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-2xl mx-auto mt-12">
            <LoadingSpinner
              message="Analyzing GitHub Profile"
              stages={stages}
              currentStage={stage}
            />
          </div>
        )}

        {/* Features Grid */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Fast Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get results in 20-40 seconds with our optimized analysis engine
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Deep Scanning
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Analyzes commit patterns, authorship, and code quality
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Detailed Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get comprehensive reports with red flags and recommendations
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                Historical Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Track changes over time and compare multiple analyses
              </p>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        {!loading && !error && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="max-w-3xl mx-auto mt-16 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6"
            >
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    ⏱️ Analysis Time Notice
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Analysis time varies based on repository size and activity. Small profiles may take 20-40 seconds, 
                    while profiles with large repositories (like the Linux kernel) can take 10-15 minutes. 
                    Please be patient while we perform a thorough analysis.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-3xl mx-auto mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                What We Analyze
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Commit frequency and patterns over time</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Code authorship and collaboration indicators</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Repository quality and documentation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Suspicious behavior detection (bulk uploads, portfolio farming)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Commit message quality and consistency</span>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default AnalyzePage;