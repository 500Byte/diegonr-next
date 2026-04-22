import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import emailjs from '@emailjs/browser'
import { Magnetic } from '@/components/Magnetic'
import { Send, CheckCircle, AlertCircle, MessageSquare, User, Mail, Briefcase } from 'lucide-react'
import { useTranslations } from 'next-intl'

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es demasiado largo'),
  email: z.string().email('Email inválido'),
  company: z.string().optional(),
  subject: z.string().min(5, 'El asunto debe tener al menos 5 caracteres').max(100, 'El asunto es demasiado largo'),
  message: z.string().min(20, 'El mensaje debe tener al menos 20 caracteres').max(1000, 'El mensaje es demasiado largo'),
  service: z.enum(['development', 'design', 'ai', 'consulting', 'other']).refine(val => val, {
    message: 'Selecciona un servicio',
  }),
  budget: z.enum(['small', 'medium', 'large', 'enterprise', 'discuss']).refine(val => val, {
    message: 'Selecciona un rango de presupuesto',
  }),
  timeline: z.enum(['asap', '1month', '3months', '6months', 'flexible']).refine(val => val, {
    message: 'Selecciona un timeline',
  }),
})

type ContactFormData = z.infer<typeof contactSchema>

const services = [
  { id: 'development', label: 'Desarrollo Web/App', value: 'development' as const },
  { id: 'design', label: 'Diseño UX/UI', value: 'design' as const },
  { id: 'ai', label: 'Inteligencia Artificial', value: 'ai' as const },
  { id: 'consulting', label: 'Consultoría Técnica', value: 'consulting' as const },
  { id: 'other', label: 'Otro', value: 'other' as const },
]

const budgets = [
  { id: 'small', label: '< €5,000', value: 'small' as const },
  { id: 'medium', label: '€5,000 - €15,000', value: 'medium' as const },
  { id: 'large', label: '€15,000 - €50,000', value: 'large' as const },
  { id: 'enterprise', label: '> €50,000', value: 'enterprise' as const },
  { id: 'discuss', label: 'A discutir', value: 'discuss' as const },
]

const timelines = [
  { id: 'asap', label: 'Lo antes posible', value: 'asap' as const },
  { id: '1month', label: '1 mes', value: '1month' as const },
  { id: '3months', label: '2-3 meses', value: '3months' as const },
  { id: '6months', label: '3-6 meses', value: '6months' as const },
  { id: 'flexible', label: 'Flexible', value: 'flexible' as const },
]

export function ContactForm() {
  const t = useTranslations('ContactForm')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Configurar EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID || ''
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

      if (!serviceId || !templateId || !publicKey) {
        console.warn('EmailJS no configurado para contacto. Simulando envío...')
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSubmitStatus('success')
        reset()
        return
      }

      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        company: data.company || 'No especificada',
        subject: data.subject,
        message: data.message,
        service: services.find(s => s.value === data.service)?.label || data.service,
        budget: budgets.find(b => b.value === data.budget)?.label || data.budget,
        timeline: timelines.find(t => t.value === data.timeline)?.label || data.timeline,
        to_email: 'diego@diegonr.com',
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error enviando formulario de contacto:', error)
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
          Hablemos de tu Proyecto
        </h3>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          Cuéntame sobre tu idea. Estoy aquí para ayudarte a hacerla realidad.
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              Nombre *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Tu nombre completo"
              />
            </div>
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
            Empresa (Opcional)
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...register('company')}
              type="text"
              id="company"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="Nombre de tu empresa"
            />
          </div>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
            Servicio de Interés *
          </label>
          <select
            {...register('service')}
            id="service"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
          >
            <option value="" className="bg-swiss-black">Selecciona un servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.value} className="bg-swiss-black">
                {service.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="text-error text-sm mt-1">{errors.service.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              Presupuesto *
            </label>
            <select
              {...register('budget')}
              id="budget"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="" className="bg-swiss-black">Selecciona presupuesto</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.value} className="bg-swiss-black">
                  {budget.label}
                </option>
              ))}
            </select>
            {errors.budget && (
              <p className="text-error text-sm mt-1">{errors.budget.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              Timeline *
            </label>
            <select
              {...register('timeline')}
              id="timeline"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="" className="bg-swiss-black">Selecciona timeline</option>
              {timelines.map((timeline) => (
                <option key={timeline.id} value={timeline.value} className="bg-swiss-black">
                  {timeline.label}
                </option>
              ))}
            </select>
            {errors.timeline && (
              <p className="text-error text-sm mt-1">{errors.timeline.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
            Asunto *
          </label>
          <input
            {...register('subject')}
            type="text"
            id="subject"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="Breve descripción del proyecto"
          />
          {errors.subject && (
            <p className="text-error text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
            Mensaje *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={6}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
            placeholder="Cuéntame más sobre tu proyecto, objetivos, desafíos, etc."
          />
          {errors.message && (
            <p className="text-error text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <div className="pt-4">
          <div id="form-status" aria-live="polite" aria-atomic="true" className="sr-only">
            {submitStatus === 'success' && 'Mensaje enviado correctamente'}
            {submitStatus === 'error' && 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'}
            {isSubmitting && 'Enviando mensaje...'}
          </div>
          <Magnetic strength={0.3}>
            <button
              type="submit"
              disabled={isSubmitting}
              aria-describedby={submitStatus !== 'idle' ? 'form-status' : undefined}
              className="group w-full md:w-auto px-8 py-4 bg-swiss-white text-swiss-black font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-swiss-black/30 border-t-swiss-black rounded-full animate-spin" />
                  Enviando...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  ¡Mensaje Enviado!
                </>
              ) : submitStatus === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Error - Reintentar
                </>
              ) : (
                <>
                  Enviar Mensaje
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </Magnetic>
        </div>

        <p className="text-white/40 text-sm text-center">
          Responderé a tu mensaje en menos de 24 horas. Todos los datos están seguros y protegidos.
        </p>
      </form>
    </div>
  )
}