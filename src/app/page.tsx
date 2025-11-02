'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Search, BarChart3, AlertTriangle, Github, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <Header/>
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Shield className="w-24 h-24 mx-auto text-blue-600" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            GitHub Auditor
          </motion.h1>

        
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8"
          >
            Detect fake GitHub profiles and portfolio farming with AI-powered analysis
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-12"
          >
            Analyze commit patterns, detect suspicious behavior, and get an authenticity score in seconds
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/analyze"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Start Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="https://github.com/yourusername/github-auditor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white"
        >
          How It Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              1. Enter Username
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Simply enter any GitHub username to begin the analysis. We'll fetch all public profile and repository data.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              2. Deep Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI analyzes commit patterns, time distributions, authorship, and code quality to detect suspicious behavior.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              3. Get Results
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive a comprehensive authenticity score (0-100) with detailed red flags and recommendations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-xl opacity-90">Profiles Analyzed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-5xl font-bold mb-2">95%</div>
              <div className="text-xl opacity-90">Accuracy Rate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-5xl font-bold mb-2">30s</div>
              <div className="text-xl opacity-90">Average Analysis Time</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-5xl font-bold mb-2">Free</div>
              <div className="text-xl opacity-90">Open Source</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Ready to Verify GitHub Profiles?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Start analyzing profiles now and detect portfolio farming in seconds.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}