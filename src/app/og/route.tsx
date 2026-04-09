import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || 'Diego NR'
  const subtitle = searchParams.get('subtitle') || 'Solutions Architect & Full-Stack Developer'
  const type = searchParams.get('type') || 'website'

  // Truncate title if too long
  const displayTitle = title.length > 50 ? title.substring(0, 47) + '...' : title

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1a1a1a 0%, transparent 50%)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
            maxWidth: '900px',
          }}
        >
          {/* Type badge */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '24px',
            }}
          >
            {type}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#ffffff',
              margin: '0 0 16px 0',
              lineHeight: '1.1',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            {displayTitle}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '24px',
              fontWeight: '400',
              color: 'rgba(255,255,255,0.8)',
              margin: '0',
              textAlign: 'center',
              maxWidth: '700px',
            }}
          >
            {subtitle}
          </p>

          {/* Brand */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'monospace',
              }}
            >
              DIEGO NR
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}