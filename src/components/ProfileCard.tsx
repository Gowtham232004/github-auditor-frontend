'use client';

import { motion } from 'framer-motion';
import { MapPin, Link as LinkIcon, Building, Calendar, Users, Code } from 'lucide-react';
import { GitHubProfile, Statistics } from '@/types';
import Image from 'next/image';

interface ProfileCardProps {
  profile: GitHubProfile;
  statistics?: Statistics;
}

export default function ProfileCard({ profile, statistics }: ProfileCardProps) {
  const createdDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex-shrink-0"
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          {/* Name & Username */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              {profile.name || profile.username}
            </motion.h2>
            <motion.a
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              href={profile.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-lg"
            >
              @{profile.username}
            </motion.a>
          </div>

          {/* Bio */}
          {profile.bio && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 text-lg"
            >
              {profile.bio}
            </motion.p>
          )}

          {/* Details Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 pt-4"
          >
            {profile.location && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.company && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Building className="w-4 h-4" />
                <span>{profile.company}</span>
              </div>
            )}

            {profile.blog && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 truncate"
                >
                  {profile.blog}
                </a>
              </div>
            )}

            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Joined {createdDate}</span>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-6 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.public_repos}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.followers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile.following}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
            </div>

            {statistics && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {statistics.total_stars}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Stars</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {statistics.total_forks}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Forks</div>
                </div>
              </>
            )}
          </motion.div>

          {/* Most Used Language */}
          {statistics?.most_used_language && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center space-x-2 pt-2"
            >
              <Code className="w-5 h-5 text-purple-600" />
              <span className="text-gray-700 dark:text-gray-300">
                Most used: <span className="font-semibold text-purple-600">{statistics.most_used_language}</span>
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}