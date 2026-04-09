'use server';

import { z } from 'zod';

// Schema for contact form validation
const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function sendContactForm(formData: FormData) {
  try {
    // Extract form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    // Validate data
    const validatedData = contactSchema.parse(rawData);

    // Here you would integrate with your email service
    // For now, we'll just log the data and simulate success
    console.log('Contact form submission:', validatedData);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you would send the email here
    // Example with a service like Resend, SendGrid, etc.:
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@tu-dominio.com',
        to: 'hola@diego.dev',
        subject: `Nuevo mensaje de contacto: ${validatedData.name}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    */

    return { success: true, message: 'Mensaje enviado correctamente' };
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Datos inválidos',
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }))
      };
    }

    return {
      success: false,
      message: 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
    };
  }
}