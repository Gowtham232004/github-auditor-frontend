import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  
  // Fetch analysis from backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  try {
    const response = await fetch(`${API_URL}/profile/${username}`);
    
    if (!response.ok) {
      throw new Error('Profile not found');
    }
    
    const data = await response.json();
    const score = data.statistics?.authenticity_score || 0;
    
    // Determine color based on score
    const getColor = (score: number) => {
      if (score >= 80) return '#10b981'; // Green
      if (score >= 50) return '#f59e0b'; // Yellow
      return '#ef4444'; // Red
    };
    
    const color = getColor(score);
    
    // Generate SVG badge
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="35" viewBox="0 0 180 35">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        
        <rect width="180" height="35" rx="5" fill="#1f2937"/>
        
        <text x="10" y="22" font-family="Arial" font-size="14" fill="#fff" font-weight="bold">
          Authenticity
        </text>
        
        <rect x="110" y="0" width="70" height="35" rx="5" fill="url(#grad)"/>
        
        <text x="145" y="22" font-family="Arial" font-size="18" fill="#fff" font-weight="bold" text-anchor="middle">
          ${score}
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