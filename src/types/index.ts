// types/index.ts
// TypeScript type definitions

export interface GitHubProfile {
  username: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  company: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  profile_url: string;
  avatar_url: string | null;
}

export interface Statistics {
  total_repos: number;
  total_stars: number;
  total_forks: number;
  most_used_language: string | null;
  average_stars: number;
  forked_repos: number;
  original_repos: number;
  fork_ratio: number;
  languages: Record<string, number>;
}

export interface RedFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  score_impact: number;
}

export interface CommitAnalysis {
  total_commits: number;
  unique_authors: number;
  top_author: string;
  top_author_commits: number;
  first_commit_date: string;
  last_commit_date: string;
  days_active: number;
  commits_per_day: number;
  most_active_hour: number;
  most_active_day: string;
  hour_concentration: number;
  avg_commit_size: number;
  max_commit_size: number;
  median_commit_size: number;
  generic_message_ratio: number;
  commit_hours_distribution: Record<string, number>;
  commit_days_distribution: Record<string, number>;
  authors: Record<string, number>;
}

export interface RepositoryAnalysis {
  repo_name: string;
  repo_url: string;
  commit_analysis: CommitAnalysis;
  red_flags: RedFlag[];
  authenticity_score: number;
  analyzed_at: string;
}

export interface ProfileAnalysis {
  username: string;
  analyzed_at: string;
  saved_to_database: boolean;
  data: {
    profile: GitHubProfile;
    statistics: Statistics;
    repositories_analyzed: number;
  };
}

export interface AIInsight {
  summary: string;
  generated_by: string;
  confidence: 'high' | 'medium' | 'low';
  recommendation?: string;
  behavior_patterns?: string;
}

export interface DeepAnalysis {
  username: string;
  profile: GitHubProfile;
  statistics: Statistics;
  repositories_analyzed: number;
  repository_analyses: Array<{
    repo_name: string;
    analysis?: {
      commit_analysis: CommitAnalysis;
      red_flags: RedFlag[];
      authenticity_score: number;
    };
    error?: string;
  }>;
  overall_authenticity_score: number;
  analysis_time_seconds: number;
  analyzed_at: string;
  ai_insights?: AIInsight;
}