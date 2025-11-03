'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Download, Mail, Share2 } from 'lucide-react';

import api, { githubAPI } from '@/lib/api';
import { DeepAnalysis } from '@/types';

import LoadingSpinner from '@/components/LoadingSpinner';
import ProfileCard from '@/components/ProfileCard';
import ScoreGauge from '@/components/ScoreGauge';
import RedFlagsList from '@/components/RedFlagsList';
import RepoCard from '@/components/RepoCard';
import StatsChart from '@/components/StatsCharts';
import AIInsights from '@/components/AIInsights';

export default function ResultsPage() {
  const params = useParams();
  const username = params.username as string;

  const [data, setData] = useState<DeepAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
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

  const handleShare = async () => {
    const shareData = {
      title: `${username}'s GitHub Analysis`,
      text: `Authenticity Score: ${data?.overall_authenticity_score}/100`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  const handleEmailReport = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setSending(true);
    try {
      const response = await api.post('/email-report', null, {
        params: { 
          username, 
          email: recipientEmail 
        }
      });
      
      alert('📧 Email report sent successfully! Check your inbox.');
      setEmailDialogOpen(false);
      setRecipientEmail(''); // Clear the input
    } catch (error: any) {
      console.error('Email error:', error);
      alert(error.message || 'Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleExportJSON = () => {
    if (!data) return;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${username}-github-analysis.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

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
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button
  onClick={() => setEmailDialogOpen(true)}
  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  <Mail className="w-4 h-4" />
  <span>Email Report</span>
  {emailDialogOpen && (
  <div 
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setEmailDialogOpen(false)}
  >
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center mb-6">
        <Mail className="w-6 h-6 text-blue-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Email Report</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Send the complete analysis report to your email. The report includes:
      </p>
      
      <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
        <li>✓ Authenticity score and assessment</li>
        <li>✓ All red flags and concerns</li>
        <li>✓ Profile statistics</li>
        <li>✓ Hiring recommendation</li>
      </ul>
      
      <input
        type="email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        placeholder="your-email@example.com"
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-6 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />
      
      <div className="flex space-x-4">
        <button
          onClick={handleEmailReport}
          disabled={sending || !recipientEmail}
          className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
            sending || !recipientEmail
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {sending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            '📧 Send Email'
          )}
        </button>
        <button
          onClick={() => {
            setEmailDialogOpen(false);
            setRecipientEmail('');
          }}
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
</button>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:shadow-md transition-all">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={handleExportJSON}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg text-gray-900 dark:text-white"
                >
                  Download JSON
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg text-gray-900 dark:text-white"
                >
                  Print as PDF
                </button>
              </div>
            </div>
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

          {/* AI Insights Section */}
          {data.ai_insights && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <AIInsights 
                insights={{
                  summary: data.ai_insights.summary,
                  generated_by: data.ai_insights.generated_by,
                  confidence: data.ai_insights.confidence,
                }}
                recommendation={data.ai_insights.recommendation}
                behaviorPatterns={data.ai_insights.behavior_patterns}
              />
            </div>
          )}

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
