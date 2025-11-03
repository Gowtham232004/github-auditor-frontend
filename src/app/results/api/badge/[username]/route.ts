import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ username: string }> }
) {
  const { username } = await context.params;
  
  // Fetch analysis from backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const response = await fetch(`${API_URL}/profile/${username}`);
    
    if (!response.ok) {
      throw new Error('Profile not found');
    }
    
    const data = await response.json();
    const score = data.overall_authenticity_score || data.statistics?.authenticity_score || 0;
    const repoCount = data.repositories_analyzed || data.statistics?.repositories_analyzed || 0;
    
    // Count red flags from all repositories
    let redFlagCount = 0;
    if (data.repository_analyses && Array.isArray(data.repository_analyses)) {
      redFlagCount = data.repository_analyses.reduce((sum: number, repo: any) => {
        return sum + (repo.analysis?.red_flags?.length || 0);
      }, 0);
    } else if (data.statistics?.total_red_flags) {
      redFlagCount = data.statistics.total_red_flags;
    }
    
    // Determine color and badge tier based on score
    const getBadgeInfo = (score: number) => {
      if (score >= 90) return { color: '#10b981', tier: '⭐ Elite', bgColor: '#065f46' }; // Green
      if (score >= 80) return { color: '#3b82f6', tier: '✓ Trusted', bgColor: '#1e40af' }; // Blue
      if (score >= 60) return { color: '#f59e0b', tier: '! Moderate', bgColor: '#b45309' }; // Yellow
      if (score >= 40) return { color: '#ef4444', tier: '⚠ Low', bgColor: '#991b1b' }; // Red
      return { color: '#6b7280', tier: '✗ Risky', bgColor: '#374151' }; // Gray
    };
    
    const { color, tier, bgColor } = getBadgeInfo(score);
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Generate enhanced SVG badge with animations and unique styling
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="240" height="120" viewBox="0 0 240 120">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.7" />
          </linearGradient>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
            <stop offset="100%" style="stop-color:${bgColor};stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="${color}" opacity="0.1"/>
          </pattern>
        </defs>
        
        <!-- Background with gradient -->
        <rect width="240" height="120" rx="10" fill="url(#bgGrad)"/>
        <rect width="240" height="120" rx="10" fill="url(#dots)"/>
        
        <!-- Border with glow -->
        <rect width="236" height="116" x="2" y="2" rx="8" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>
        
        <!-- GitHub Auditor Logo/Title -->
        <text x="120" y="25" font-family="'Segoe UI', Arial, sans-serif" font-size="16" fill="#fff" font-weight="bold" text-anchor="middle">
          🔍 GitHub Auditor
        </text>
        
        <!-- Username -->
        <text x="120" y="45" font-family="'Segoe UI', Arial, sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">
          @${username}
        </text>
        
        <!-- Score Circle -->
        <circle cx="60" cy="80" r="25" fill="url(#grad1)" filter="url(#glow)"/>
        <circle cx="60" cy="80" r="20" fill="${bgColor}" opacity="0.9"/>
        <text x="60" y="87" font-family="'Segoe UI', Arial, sans-serif" font-size="20" fill="#fff" font-weight="bold" text-anchor="middle">
          ${score}
        </text>
        <text x="60" y="98" font-family="'Segoe UI', Arial, sans-serif" font-size="8" fill="#d1d5db" text-anchor="middle">
          SCORE
        </text>
        
        <!-- Tier Badge -->
        <rect x="100" y="65" width="130" height="30" rx="5" fill="${color}" opacity="0.2"/>
        <rect x="100" y="65" width="130" height="30" rx="5" fill="none" stroke="${color}" stroke-width="1.5"/>
        <text x="165" y="85" font-family="'Segoe UI', Arial, sans-serif" font-size="14" fill="${color}" font-weight="bold" text-anchor="middle">
          ${tier}
        </text>
        
        <!-- Stats Footer -->
        <text x="20" y="112" font-family="'Segoe UI', Arial, sans-serif" font-size="9" fill="#9ca3af">
          📦 ${repoCount} repos
        </text>
        <text x="100" y="112" font-family="'Segoe UI', Arial, sans-serif" font-size="9" fill="#9ca3af">
          🚩 ${redFlagCount} flags
        </text>
        <text x="180" y="112" font-family="'Segoe UI', Arial, sans-serif" font-size="9" fill="#6b7280">
          ${timestamp}
        </text>
      </svg>
    `;
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
    
  } catch (error) {
    // Return error badge
    const errorSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="35">
        <rect width="180" height="35" rx="5" fill="#ef4444"/>
        <text x="90" y="22" font-family="Arial" font-size="14" fill="#fff" font-weight="bold" text-anchor="middle">
          Not Analyzed
        </text>
      </svg>
    `;
    
    return new NextResponse(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}