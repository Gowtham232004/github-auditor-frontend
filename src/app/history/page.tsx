'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { History, User, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { githubAPI } from '@/lib/api';

export default function HistoryPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const data = await githubAPI.getHistory();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (username: string) => {
    if (!confirm(`Are you sure you want to delete the analysis for ${username}?`)) {
      return;
    }

    setDeleting(username);
    try {
      // Call delete API endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/profile/${username}`, {
        method: 'DELETE',
      });
      
      // Refresh the list
      await fetchHistory();
      alert(`Deleted analysis for ${username}`);
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete analysis. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <History className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analysis History
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {profiles.length} profiles analyzed so far
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <User className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {profiles.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Profiles</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {profiles.reduce((sum, p) => sum + p.followers, 0).toLocaleString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Followers</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <Calendar className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {profiles.length > 0
                ? new Date(profiles[0].analyzed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'N/A'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Last Analysis</div>
          </motion.div>
        </div>

        {/* Profiles List */}
        {profiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              No Analysis History Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Start analyzing profiles to see them here
            </p>
            <Link
              href="/analyze"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
            >
              Analyze Your First Profile
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.username}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Link href={`/results/${profile.username}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {profile.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {profile.name || profile.username}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{profile.username}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Repos</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {profile.public_repos}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {profile.followers}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Analyzed {new Date(profile.analyzed_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
                
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(profile.username);
                  }}
                  disabled={deleting === profile.username}
                  className="absolute top-4 right-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
                  title="Delete analysis"
                >
                  {deleting === profile.username ? (
                    <div className="animate-spin w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}