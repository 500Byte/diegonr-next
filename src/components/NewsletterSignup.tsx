import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import emailjs from '@emailjs/browser'
import { Magnetic } from '@/components/Magnetic'
import { ArrowRight, Mail, CheckCircle, AlertCircle } from 'lucide-react'

const newsletterSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'El email es requerido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre es demasiado largo'),
  interests: z.array(z.string()).min(1, 'Selecciona al menos un interés'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

const interests = [
  { id: 'development', label: 'Desarrollo Web', value: 'development' },
  { id: 'ai', label: 'Inteligencia Artificial', value: 'ai' },
  { id: 'design', label: 'Diseño UX/UI', value: 'design' },
  { id: 'consulting', label: 'Consultoría', value: 'consulting' },
]

export function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      interests: [],
    },
  })

  const selectedInterests = watch('interests')

  const toggleInterest = (interest: string) => {
    const current = selectedInterests || []
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest]
    setValue('interests', updated)
  }

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Configurar EmailJS (estos valores deberían estar en variables de entorno)
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''

      if (!serviceId || !templateId || !publicKey) {
        console.warn('EmailJS no configurado. Simulando envío...')
        // Simular envío exitoso para desarrollo
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSubmitStatus('success')
        reset()
        return
      }

      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        interests: data.interests.join(', '),
        to_email: 'diego@diegonr.com', // Cambiar por el email real
        message: `Nuevo suscriptor: ${data.name} (${data.email}) interesado en: ${data.interests.join(', ')}`,
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error enviando newsletter:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-swiss-white/10 rounded-full mb-6">
          <Mail className="w-8 h-8 text-swiss-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-medium mb-4">
          Mantente Actualizado
        </h3>
        <p className="text-white/60 text-lg max-w-md mx-auto">
          Recibe las últimas actualizaciones sobre mis proyectos, artículos técnicos y oportunidades de colaboración.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              Nombre
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="Tu nombre"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-mono text-white/60 uppercase tracking-widest mb-4">
            Intereses
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interests.map((interest) => (
              <button
                key={interest.id}
                type="button"
                onClick={() => toggleInterest(interest.value)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedInterests?.includes(interest.value)
                    ? 'border-swiss-white bg-swiss-white text-swiss-black'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                }`}
              >
                {interest.label}
              </button>
            ))}
          </div>
          {errors.interests && (
            <p className="text-red-400 text-sm mt-2">{errors.interests.message}</p>
          )}
        </div>

        <div className="pt-4">
          <Magnetic strength={0.3}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full md:w-auto px-8 py-4 bg-swiss-white text-swiss-black font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-swiss-black/30 border-t-swiss-black rounded-full animate-spin" />
                  Enviando...
                </>
              ) : submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  ¡Suscrito!
                </>
              ) : submitStatus === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Error - Reintentar
                </>
              ) : (
                <>
                  Suscribirse
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </Magnetic>
        </div>

        <p className="text-white/40 text-sm text-center">
          Respetamos tu privacidad. Puedes darte de baja en cualquier momento.
        </p>
      </form>
    </div>
  )
}