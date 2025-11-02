'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (username: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  loading = false,
  placeholder = 'Enter GitHub username...' 
}: SearchBarProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    // GitHub username validation
    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubUsernameRegex.test(username.trim())) {
      setError('Invalid GitHub username format');
      return;
    }

    setError('');
    onSearch(username.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            ) : (
              <Search className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Input */}
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            placeholder={placeholder}
            disabled={loading}
            className={`
              w-full pl-14 pr-32 py-4 text-lg
              bg-white dark:bg-gray-800
              border-2 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
              rounded-full
              focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
              focus:ring-4 focus:ring-blue-500/20
              text-gray-900 dark:text-white
              placeholder-gray-400
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg
            `}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className={`
              absolute right-2 top-1/2 -translate-y-1/2
              px-6 py-2.5
              bg-gradient-to-r from-blue-600 to-purple-600
              text-white font-medium rounded-full
              hover:shadow-lg hover:scale-105
              active:scale-95
              transition-all
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            `}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-red-600 dark:text-red-400 text-sm pl-4"
          >
            {error}
          </motion.div>
        )}

        {/* Example usernames */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          Try examples:{' '}
          <button
            type="button"
            onClick={() => setUsername('torvalds')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            torvalds
          </button>
          {', '}
          <button
            type="button"
            onClick={() => setUsername('gvanrossum')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            gvanrossum
          </button>
          {', '}
          <button
            type="button"
            onClick={() => setUsername('octocat')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            octocat
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}