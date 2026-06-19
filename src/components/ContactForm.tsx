"use client"

import { Magnetic } from '@/components/Magnetic'
import { zodResolver } from '@hookform/resolvers/zod'
import { Turnstile } from '@marsidev/react-turnstile'
import { AlertCircle, Briefcase, CheckCircle, Mail, MessageSquare, Send, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface ContactFormProps {
  toEmail?: string; // kept for backwards compat but unused
}

export function ContactForm({ toEmail }: ContactFormProps) {
  const t = useTranslations('ContactForm')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  // Define schema inside component to access translations
  const contactSchema = useMemo(() => z.object({
    name: z.string().trim().min(2, t('validation.name_min')).max(50, t('validation.name_max')),
    email: z.string().trim().email(t('validation.email_invalid')),
    company: z.string().trim().optional(),
    subject: z.string().trim().min(5, t('validation.subject_min')).max(100, t('validation.subject_max')),
    message: z.string().trim().min(20, t('validation.message_min')).max(1000, t('validation.message_max')),
    // honeypot — must stay empty; real users never see or fill this field
    website: z.string().max(0).optional(),
    service: z.enum(['development', 'design', 'ai', 'consulting', 'other'], {
      error: t('validation.service_required'),
    }),
    budget: z.enum(['small', 'medium', 'large', 'enterprise', 'discuss'], {
      error: t('validation.budget_required'),
    }),
    timeline: z.enum(['asap', '1month', '3months', '6months', 'flexible'], {
      error: t('validation.timeline_required'),
    }),
  }), [t])

  type ContactFormData = z.infer<typeof contactSchema>

  // Translated options
  const services = [
    { id: 'development', label: t('services.development'), value: 'development' as const },
    { id: 'design', label: t('services.design'), value: 'design' as const },
    { id: 'ai', label: t('services.ai'), value: 'ai' as const },
    { id: 'consulting', label: t('services.consulting'), value: 'consulting' as const },
    { id: 'other', label: t('services.other'), value: 'other' as const },
  ]

  const budgets = [
    { id: 'small', label: t('budgets.small'), value: 'small' as const },
    { id: 'medium', label: t('budgets.medium'), value: 'medium' as const },
    { id: 'large', label: t('budgets.large'), value: 'large' as const },
    { id: 'enterprise', label: t('budgets.enterprise'), value: 'enterprise' as const },
    { id: 'discuss', label: t('budgets.discuss'), value: 'discuss' as const },
  ]

  const timelines = [
    { id: 'asap', label: t('timelines.asap'), value: 'asap' as const },
    { id: '1month', label: t('timelines.1month'), value: '1month' as const },
    { id: '3months', label: t('timelines.3months'), value: '3months' as const },
    { id: '6months', label: t('timelines.6months'), value: '6months' as const },
    { id: 'flexible', label: t('timelines.flexible'), value: 'flexible' as const },
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    // guard against double submits (e.g. Enter key firing while button is disabled)
    if (isSubmitting) return

    // honeypot tripped — silently pretend success, do not send
    if (data.website) {
      setSubmitStatus('success')
      reset()
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const payload = {
        name: data.name,
        email: data.email,
        company: data.company || '',
        subject: data.subject,
        message: data.message,
        service: services.find(s => s.value === data.service)?.label || data.service,
        budget: budgets.find(b => b.value === data.budget)?.label || data.budget,
        timeline: timelines.find(tm => tm.value === data.timeline)?.label || data.timeline,
        'cf-turnstile-response': turnstileToken,
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error sending contact form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-swiss-white/10 rounded-full mb-6">
          <MessageSquare className="w-8 h-8 text-swiss-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-medium mb-4">
          {t('title')}
        </h3>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Honeypot field — hidden from sighted users and screen readers, bots tend to fill it */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            {...register('website')}
            type="text"
            id="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              {t('fields.name.label')}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                {...register('name')}
                type="text"
                id="name"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                placeholder={t('fields.name.placeholder')}
              />
            </div>
            {errors.name && (
              <p id="name-error" role="alert" className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              {t('fields.email.label')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                {...register('email')}
                type="email"
                id="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                placeholder={t('fields.email.placeholder')}
              />
            </div>
            {errors.email && (
              <p id="email-error" role="alert" className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
            {t('fields.company.label')}
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...register('company')}
              type="text"
              id="company"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              placeholder={t('fields.company.placeholder')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
            {t('fields.service.label')}
          </label>
          <select
            {...register('service')}
            id="service"
            defaultValue=""
            aria-invalid={errors.service ? 'true' : 'false'}
            aria-describedby={errors.service ? 'service-error' : undefined}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
          >
            <option value="" className="bg-swiss-black">{t('fields.service.placeholder')}</option>
            {services.map((service) => (
              <option key={service.id} value={service.value} className="bg-swiss-black">
                {service.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p id="service-error" role="alert" className="text-error text-sm mt-1">{errors.service.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              {t('fields.budget.label')}
            </label>
            <select
              {...register('budget')}
              id="budget"
              defaultValue=""
              aria-invalid={errors.budget ? 'true' : 'false'}
              aria-describedby={errors.budget ? 'budget-error' : undefined}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="" className="bg-swiss-black">{t('fields.budget.placeholder')}</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.value} className="bg-swiss-black">
                  {budget.label}
                </option>
              ))}
            </select>
            {errors.budget && (
              <p id="budget-error" role="alert" className="text-error text-sm mt-1">{errors.budget.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              {t('fields.timeline.label')}
            </label>
            <select
              {...register('timeline')}
              id="timeline"
              defaultValue=""
              aria-invalid={errors.timeline ? 'true' : 'false'}
              aria-describedby={errors.timeline ? 'timeline-error' : undefined}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="" className="bg-swiss-black">{t('fields.timeline.placeholder')}</option>
              {timelines.map((timeline) => (
                <option key={timeline.id} value={timeline.value} className="bg-swiss-black">
                  {timeline.label}
                </option>
              ))}
            </select>
            {errors.timeline && (
              <p id="timeline-error" role="alert" className="text-error text-sm mt-1">{errors.timeline.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
            {t('fields.subject.label')}
          </label>
          <input
            {...register('subject')}
            type="text"
            id="subject"
            aria-invalid={errors.subject ? 'true' : 'false'}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
            placeholder={t('fields.subject.placeholder')}
          />
          {errors.subject && (
            <p id="subject-error" role="alert" className="text-error text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
            {t('fields.message.label')}
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
            placeholder={t('fields.message.placeholder')}
          />
          {errors.message && (
            <p id="message-error" role="alert" className="text-error text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <div className="pt-4">
          <div className="flex justify-center mb-4">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
          <div id="form-status" aria-live="polite" aria-atomic="true" className="sr-only">
            {submitStatus === 'success' && t('aria.success')}
            {submitStatus === 'error' && t('aria.error')}
            {isSubmitting && t('aria.sending')}
          </div>
          <Magnetic strength={0.01}>
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              aria-describedby={submitStatus !== 'idle' ? 'form-status' : undefined}
              className="group w-full md:w-auto px-8 py-4 bg-swiss-white text-swiss-black font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-swiss-black/30 border-t-swiss-black rounded-full animate-spin" />
                  {t('submit_sending')}
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {t('submit_success')}
                </>
              ) : submitStatus === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  {t('submit_error')}
                </>
              ) : (
                <>
                  {t('submit')}
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </Magnetic>
        </div>

        <p className="text-white/40 text-sm text-center">
          {t('privacy_note')}
        </p>
      </form>
    </div>
  )
}