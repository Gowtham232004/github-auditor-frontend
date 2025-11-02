'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Share2 } from 'lucide-react';

import { githubAPI } from '@/lib/api';
import { DeepAnalysis } from '@/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import ProfileCard from '@/components/ProfileCard';
import ScoreGauge from '@/components/ScoreGauge';
import RedFlagsList from '@/components/RedFlagsList';
import RepoCard from '@/components/RepoCard';
import StatsChart from '@/components/StatsCharts';

export default function ResultsPage() {
  const params = useParams();
  const username = params.username as string;

  const [data, setData] = useState<DeepAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Try to get from stored data first
        try {
          const stored = await githubAPI.getRepoAnalyses(username);
          // If we have stored data, use the latest deep analysis
          if (stored && stored.repositories && stored.repositories.length > 0) {
            // Construct a DeepAnalysis-like object from stored data
            // This is a fallback; ideally we'd store the full deep analysis
          }
        } catch (e) {
          // No stored data, will trigger new analysis below
        }

        // Fetch fresh deep analysis
        const result = await githubAPI.analyzeDeep(username, 3);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <LoadingSpinner message="Loading results..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {error || 'No Results Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error || `No analysis data found for ${username}`}
          </p>
          <Link
            href="/analyze"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
          >
            Analyze Again
          </Link>
        </div>
      </div>
    );
  }

  // Collect all red flags from all repositories
  const allRedFlags = data.repository_analyses
    .flatMap((repo) => repo.analysis?.red_flags || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/analyze"
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Search</span>
          </Link>

          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md transition-all">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md transition-all">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Profile Card */}
          <ProfileCard profile={data.profile} statistics={data.statistics} />

          {/* Score Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              Overall Authenticity Score
            </h2>
            <div className="flex justify-center">
              <ScoreGauge score={data.overall_authenticity_score} />
            </div>
            <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
              <p className="text-lg">
                Analyzed {data.repositories_analyzed} repositories in{' '}
                <span className="font-semibold">{data.analysis_time_seconds}s</span>
              </p>
            </div>
          </div>

          {/* Red Flags Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <RedFlagsList redFlags={allRedFlags} />
          </div>

          {/* Repository Analyses */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Repository Analysis ({data.repositories_analyzed})
            </h2>
            <div className="space-y-4">
              {data.repository_analyses.map((repo, index) => (
                <RepoCard
                  key={repo.repo_name}
                  repoName={repo.repo_name}
                  analysis={repo.analysis}
                  error={repo.error}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {data.statistics.languages && (
              <StatsChart 
                languages={data.statistics.languages} 
                type="languages" 
              />
            )}

            {data.repository_analyses[0]?.analysis?.commit_analysis?.commit_hours_distribution && (
              <StatsChart
                commitHours={data.repository_analyses[0].analysis.commit_analysis.commit_hours_distribution}
                type="commits"
              />
            )}
          </div>

          {/* Metadata */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Analysis completed on{' '}
              {new Date(data.analyzed_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}