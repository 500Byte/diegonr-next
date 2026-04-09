'use client'

import { useEffect } from 'react'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { Analytics } from '@vercel/analytics/react'

// Custom analytics hook for tracking events
export function useAnalytics() {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    // Google Analytics 4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters)
    }

    // Vercel Analytics tracking
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', { name: eventName, data: parameters })
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, parameters)
    }
  }

  const trackPageView = (pageName: string) => {
    trackEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href,
    })
  }

  const trackProjectView = (projectId: string, projectName: string) => {
    trackEvent('project_view', {
      project_id: projectId,
      project_name: projectName,
      content_type: 'project',
    })
  }

  const trackBlogView = (postId: string, postTitle: string) => {
    trackEvent('blog_view', {
      post_id: postId,
      post_title: postTitle,
      content_type: 'blog_post',
    })
  }

  const trackContactForm = (formType: 'contact' | 'newsletter') => {
    trackEvent('form_submit', {
      form_type: formType,
      form_name: formType === 'contact' ? 'contact_form' : 'newsletter_signup',
    })
  }

  const trackServiceView = (serviceId: string, serviceName: string) => {
    trackEvent('service_view', {
      service_id: serviceId,
      service_name: serviceName,
      content_type: 'service',
    })
  }

  const trackSocialClick = (platform: string, url: string) => {
    trackEvent('social_click', {
      platform: platform,
      url: url,
      link_type: 'social_media',
    })
  }

  const trackDownload = (fileName: string, fileType: string) => {
    trackEvent('file_download', {
      file_name: fileName,
      file_type: fileType,
      link_type: 'download',
    })
  }

  return {
    trackEvent,
    trackPageView,
    trackProjectView,
    trackBlogView,
    trackContactForm,
    trackServiceView,
    trackSocialClick,
    trackDownload,
  }
}

// Analytics provider component
export function AnalyticsProvider() {
  return (
    <>
      {/* Google Analytics */}
      <GoogleAnalytics
        gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        trackPageViews
      />

      {/* Vercel Analytics */}
      <Analytics />
    </>
  )
}

// Web Vitals tracking component
export function WebVitals() {
  useEffect(() => {
    // Web Vitals tracking - simplified for now
    // TODO: Implement proper web vitals tracking
    if (typeof window !== 'undefined') {
      // Basic performance tracking
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'LCP',
                value: entry.startTime,
                event_category: 'Web Vitals',
              })
            }
          }
        }
      })

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.log('Web Vitals tracking not fully supported')
      }

      return () => observer.disconnect()
    }
  }, [])

  return null
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Track navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      const firstPaint = performance.getEntriesByName('first-paint')[0] as PerformanceEntry
      const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry

      // Track performance metrics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_metrics', {
          load_time: loadTime,
          dom_content_loaded: domContentLoaded,
          first_paint: firstPaint?.startTime,
          first_contentful_paint: firstContentfulPaint?.startTime,
        })
      }
    }

    // Track errors
    const handleError = (event: ErrorEvent) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'javascript_error', {
          error_message: event.message,
          error_filename: event.filename,
          error_lineno: event.lineno,
          error_colno: event.colno,
        })
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'unhandled_promise_rejection', {
          error_message: event.reason?.toString(),
        })
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])
}

// Type declarations for global objects
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}