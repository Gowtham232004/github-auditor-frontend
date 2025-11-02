'use client';

import Link from 'next/link';
import { Github, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800"
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Shield className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GitAuditor
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link 
              href="/analyze"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Analyze
            </Link>

            <Link 
              href="/compare"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Compare
            </Link>

            <Link 
              href="/history"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              History
            </Link>
            
            <a
              href="https://github.com/yourusername/github-auditor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium hidden md:inline">GitHub</span>
            </a>

            <Link
              href="/analyze"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}