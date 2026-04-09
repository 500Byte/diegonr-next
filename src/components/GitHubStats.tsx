'use client'

import React, { useEffect, useState } from 'react'
import { Octokit } from '@octokit/rest'
import { GitBranch, Star, GitFork, Eye, Calendar, Code } from 'lucide-react'

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

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        // For demo purposes, using mock data when no token is provided
        // In production, use environment variables for GitHub token
        const useMockData = !process.env.NEXT_PUBLIC_GITHUB_TOKEN

        if (useMockData) {
          // Mock data for development
          setStats({
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
            ],
          })
          setLoading(false)
          return
        }

        const octokit = new Octokit({
          auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
        })

        // Fetch user data
        const { data: user } = await octokit.users.getByUsername({
          username: 'diegonr',
        })

        // Fetch repositories
        const { data: repos } = await octokit.repos.listForUser({
          username: 'diegonr',
          sort: 'updated',
          per_page: 10,
        })

        // Calculate stats
        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
        const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0)

        // Get language stats
        const languageStats: Record<string, number> = {}
        repos.forEach(repo => {
          if (repo.language) {
            languageStats[repo.language] = (languageStats[repo.language] || 0) + 1
          }
        })

        const totalRepos = Object.values(languageStats).reduce((sum, count) => sum + count, 0)
        const languages = Object.entries(languageStats)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / totalRepos) * 100),
            color: languageColors[name] || '#586069',
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 4)

        // Recent repos
        const recentRepos = repos.slice(0, 3).map(repo => ({
          name: repo.name,
          description: repo.description || 'No description available',
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          language: repo.language || 'Unknown',
          updatedAt: repo.updated_at ? repo.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
          url: repo.html_url,
        }))

        setStats({
          repos: user.public_repos,
          stars: totalStars,
          forks: totalForks,
          followers: user.followers,
          following: user.following,
          contributions: 0, // Would need GitHub API v4 for contributions
          languages,
          recentRepos,
        })
      } catch (err) {
        console.error('Error fetching GitHub stats:', err)
        setError('Error al cargar estadísticas de GitHub')
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="text-center text-white/60">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No se pudieron cargar las estadísticas de GitHub</p>
        </div>
      </div>
    )
  }

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