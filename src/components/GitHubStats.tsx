'use client'

import React from 'react'
import { GitBranch, Star, GitFork, Calendar } from 'lucide-react'

interface GitHubStats {
  repos: number
  stars: number
  forks: number
  followers: number
  following: number
  contributions: number
  languages: Array<{ name: string; percentage: number; color: string }>
  recentRepos: Array<{
    name: string
    description: string
    stars: number
    forks: number
    language: string
    updatedAt: string
    url: string
  }>
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
}

// Static/Mock data
const staticStats: GitHubStats = {
  repos: 42,
  stars: 156,
  forks: 89,
  followers: 234,
  following: 45,
  contributions: 1247,
  languages: [
    { name: 'TypeScript', percentage: 45, color: languageColors.TypeScript },
    { name: 'JavaScript', percentage: 25, color: languageColors.JavaScript },
    { name: 'Python', percentage: 20, color: languageColors.Python },
    { name: 'Go', percentage: 10, color: languageColors.Go },
  ],
  recentRepos: [
    {
      name: 'next-portfolio',
      description: 'Modern portfolio built with Next.js 14',
      stars: 23,
      forks: 12,
      language: 'TypeScript',
      updatedAt: '2024-01-15',
      url: 'https://github.com/diegonr/next-portfolio',
    },
    {
      name: 'ai-chatbot',
      description: 'AI-powered chatbot with React and OpenAI',
      stars: 45,
      forks: 28,
      language: 'JavaScript',
      updatedAt: '2024-01-10',
      url: 'https://github.com/diegonr/ai-chatbot',
    },
    {
      name: 'solution-architecture',
      description: 'Enterprise grade architecture patterns and documentation',
      stars: 88,
      forks: 49,
      language: 'Go',
      updatedAt: '2023-12-28',
      url: 'https://github.com/diegonr/solution-architecture',
    },
  ],
}

export function GitHubStats() {
  const stats = staticStats

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <GitBranch className="w-6 h-6 text-white" />
        <h3 className="text-xl font-medium">GitHub Stats</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{stats.repos}</div>
          <div className="text-sm text-white/60">Repositorios</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{stats.stars}</div>
          <div className="text-sm text-white/60">Estrellas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{stats.followers}</div>
          <div className="text-sm text-white/60">Seguidores</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{stats.contributions || '1.2k'}</div>
          <div className="text-sm text-white/60">Contribuciones</div>
        </div>
      </div>

      {/* Language Chart */}
      <div className="mb-8">
        <h4 className="text-sm font-mono text-white/60 uppercase tracking-widest mb-4">Lenguajes Principales</h4>
        <div className="space-y-3">
          {stats.languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-sm text-white/80 flex-1">{lang.name}</span>
              <span className="text-sm text-white/60">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Repos */}
      <div>
        <h4 className="text-sm font-mono text-white/60 uppercase tracking-widest mb-4">Proyectos Recientes</h4>
        <div className="space-y-4">
          {stats.recentRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="font-medium text-white group-hover:text-white/80 transition-colors">
                  {repo.name}
                </h5>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    {repo.forks}
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/60 mb-2 line-clamp-2">{repo.description}</p>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: languageColors[repo.language] || '#586069' }}
                />
                {repo.language}
                <span className="mx-2">•</span>
                <Calendar className="w-3 h-3" />
                {repo.updatedAt}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}