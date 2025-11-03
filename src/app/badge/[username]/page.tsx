'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Copy, Check } from 'lucide-react';

export default function BadgePage() {
  const params = useParams();
  const username = params.username as string;
  const [copied, setCopied] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const badgeUrl = `${baseUrl}/api/badge/${username}`;
  const resultsUrl = `${baseUrl}/results/${username}`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const codes = {
    markdown: `[![GitHub Authenticity](${badgeUrl})](${resultsUrl})`,
    html: `<a href="${resultsUrl}"><img src="${badgeUrl}" alt="${username}'s GitHub Authenticity" /></a>`,
    url: badgeUrl,
    readme: `## 🔍 GitHub Authenticity Score\n\n[![GitHub Authenticity](${badgeUrl})](${resultsUrl})\n\nVerified by [GitHub Auditor](${baseUrl})`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/results/${username}`}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Results</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🏆 Your GitHub Authenticity Badge
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Showcase your verified GitHub profile authenticity score
          </p>
        </div>

        {/* Badge Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Badge Preview
          </h2>
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-6 inline-block">
              <img 
                src={badgeUrl} 
                alt={`${username}'s GitHub Authenticity Badge`}
                className="w-auto h-auto"
              />
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            This badge updates automatically with your latest analysis
          </p>
        </div>

        {/* Integration Codes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📋 Add to Your Profile
          </h2>
          
          <div className="space-y-6">
            {/* GitHub README (Featured) */}
            <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center justify-between mb-3">
                <label className="text-base font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>🌟</span>
                  <span>GitHub README (Recommended)</span>
                </label>
                <button
                  onClick={() => copyToClipboard(codes.readme, 'readme')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  {copied === 'readme' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-white dark:bg-gray-900 p-4 rounded-lg text-xs overflow-x-auto">
                <code className="text-gray-800 dark:text-gray-200">{codes.readme}</code>
              </pre>
            </div>

            {/* Markdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-base font-semibold text-gray-900 dark:text-white">
                  Markdown (Simple)
                </label>
                <button
                  onClick={() => copyToClipboard(codes.markdown, 'markdown')}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  {copied === 'markdown' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">
                <code className="text-gray-800 dark:text-gray-200">{codes.markdown}</code>
              </pre>
            </div>

            {/* HTML */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-base font-semibold text-gray-900 dark:text-white">
                  HTML (Website)
                </label>
                <button
                  onClick={() => copyToClipboard(codes.html, 'html')}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  {copied === 'html' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">
                <code className="text-gray-800 dark:text-gray-200">{codes.html}</code>
              </pre>
            </div>

            {/* Direct URL */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-base font-semibold text-gray-900 dark:text-white">
                  Badge URL (Direct Link)
                </label>
                <button
                  onClick={() => copyToClipboard(codes.url, 'url')}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  {copied === 'url' ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">
                <code className="text-gray-800 dark:text-gray-200">{codes.url}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📚 How to Use
          </h2>
          <ol className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex space-x-3">
              <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
              <span>Copy the <strong>GitHub README</strong> code above (recommended)</span>
            </li>
            <li className="flex space-x-3">
              <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
              <span>Go to your GitHub profile repository (username/username)</span>
            </li>
            <li className="flex space-x-3">
              <span className="font-bold text-blue-600 dark:text-blue-400">3.</span>
              <span>Edit your README.md file</span>
            </li>
            <li className="flex space-x-3">
              <span className="font-bold text-blue-600 dark:text-blue-400">4.</span>
              <span>Paste the code where you want the badge to appear</span>
            </li>
            <li className="flex space-x-3">
              <span className="font-bold text-blue-600 dark:text-blue-400">5.</span>
              <span>Commit and push - your badge will appear instantly! 🎉</span>
            </li>
          </ol>

          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Pro Tip:</strong> The badge automatically updates when you run a new analysis,
              so your authenticity score is always current!
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href={`/results/${username}`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
          >
            View Full Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}
