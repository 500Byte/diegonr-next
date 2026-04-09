'use client'

import React, { useEffect, useState } from 'react'
import { GitBranch, Linkedin, Twitter, ExternalLink, Calendar, MessageCircle, Heart, Repeat2 } from 'lucide-react'

interface SocialActivity {
  id: string
  platform: 'github' | 'linkedin' | 'twitter'
  type: 'commit' | 'post' | 'tweet' | 'project'
  title: string
  description?: string
  url: string
  timestamp: string
  metadata?: {
    stars?: number
    forks?: number
    likes?: number
    retweets?: number
    comments?: number
  }
}

export function SocialActivityFeed() {
  const [activities, setActivities] = useState<SocialActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for development - in production, fetch from APIs
    const mockActivities: SocialActivity[] = [
      {
        id: '1',
        platform: 'github',
        type: 'commit',
        title: 'Updated portfolio with new PWA features',
        description: 'Added service worker, manifest, and offline capabilities',
        url: 'https://github.com/diegonr/next-portfolio',
        timestamp: '2024-01-15T10:30:00Z',
        metadata: { stars: 23, forks: 12 }
      },
      {
        id: '2',
        platform: 'linkedin',
        type: 'post',
        title: 'Compartiendo mi experiencia con Next.js 14',
        description: 'Las nuevas features de App Router han revolucionado el desarrollo web moderno...',
        url: 'https://linkedin.com/feed/update/urn:li:activity:123456',
        timestamp: '2024-01-14T15:45:00Z',
        metadata: { likes: 45, comments: 12 }
      },
      {
        id: '3',
        platform: 'twitter',
        type: 'tweet',
        title: '¡Nuevo artículo sobre IA en desarrollo web!',
        description: 'Explorando cómo la inteligencia artificial está transformando el desarrollo frontend...',
        url: 'https://twitter.com/diegonr/status/1234567890',
        timestamp: '2024-01-13T09:20:00Z',
        metadata: { likes: 23, retweets: 8 }
      },
      {
        id: '4',
        platform: 'github',
        type: 'project',
        title: 'Lanzado: AI Chatbot con React',
        description: 'Chatbot inteligente construido con React, OpenAI API y WebSockets',
        url: 'https://github.com/diegonr/ai-chatbot',
        timestamp: '2024-01-12T14:15:00Z',
        metadata: { stars: 45, forks: 28 }
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities)
      setLoading(false)
    }, 1000)
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return <GitBranch className="w-4 h-4" />
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />
      case 'twitter':
        return <Twitter className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'github':
        return 'text-gray-300'
      case 'linkedin':
        return 'text-blue-400'
      case 'twitter':
        return 'text-blue-500'
      default:
        return 'text-white'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `hace ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `hace ${diffInDays}d`
    }
  }

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3 p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-white/10 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-6 h-6 text-white" />
        <h3 className="text-xl font-medium">Actividad Reciente</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <a
            key={activity.id}
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-full bg-white/10 ${getPlatformColor(activity.platform)}`}>
                {getPlatformIcon(activity.platform)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white group-hover:text-white/80 transition-colors line-clamp-1">
                  {activity.title}
                </h4>
                <div className="flex items-center gap-2 text-sm text-white/60 mt-1">
                  <span className="capitalize">{activity.platform}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors flex-shrink-0" />
            </div>

            {activity.description && (
              <p className="text-sm text-white/60 line-clamp-2 mb-3">
                {activity.description}
              </p>
            )}

            {activity.metadata && (
              <div className="flex items-center gap-4 text-xs text-white/40">
                {activity.metadata.stars !== undefined && (
                  <span className="flex items-center gap-1">
                    ⭐ {activity.metadata.stars}
                  </span>
                )}
                {activity.metadata.forks !== undefined && (
                  <span className="flex items-center gap-1">
                    🍴 {activity.metadata.forks}
                  </span>
                )}
                {activity.metadata.likes !== undefined && (
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {activity.metadata.likes}
                  </span>
                )}
                {activity.metadata.retweets !== undefined && (
                  <span className="flex items-center gap-1">
                    <Repeat2 className="w-3 h-3" />
                    {activity.metadata.retweets}
                  </span>
                )}
                {activity.metadata.comments !== undefined && (
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {activity.metadata.comments}
                  </span>
                )}
              </div>
            )}
          </a>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-sm text-white/40 text-center">
          Actualizado automáticamente desde mis perfiles sociales
        </p>
      </div>
    </div>
  )
}