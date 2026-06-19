import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_TO_EMAIL = process.env.CONTACT_FORM_TO_EMAIL || 'diegolnr3@gmail.com';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FORM_FROM_EMAIL || 'onboarding@resend.dev';
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';

interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  service?: string;
  budget?: string;
  timeline?: string;
  'cf-turnstile-response'?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) {
    console.warn('Turnstile not configured — skipping verification');
    return true;
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });

  const data = await res.json() as { success: boolean };
  return data.success === true;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as ContactPayload;

    // Basic server-side validation
    if (!data.name?.trim() || !data.email?.trim() || !data.subject?.trim() || !data.message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Honeypot check — if filled, silently pretend success
    if ((data as any).website) {
      return NextResponse.json({ ok: true });
    }

    // Verify Turnstile token
    const turnstileToken = data['cf-turnstile-response'];
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Captcha required' },
        { status: 400 }
      );
    }

    const turnstileValid = await verifyTurnstile(turnstileToken);
    if (!turnstileValid) {
      return NextResponse.json(
        { error: 'Captcha verification failed' },
        { status: 403 }
      );
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 16px;">
          Nuevo mensaje de contacto
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; vertical-align: top;">Nombre</td>
            <td style="padding: 8px 0;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Email</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
          </tr>
          ${data.company ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Empresa</td>
            <td style="padding: 8px 0;">${escapeHtml(data.company)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Servicio</td>
            <td style="padding: 8px 0;">${escapeHtml(data.service || '—')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Presupuesto</td>
            <td style="padding: 8px 0;">${escapeHtml(data.budget || '—')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Timeline</td>
            <td style="padding: 8px 0;">${escapeHtml(data.timeline || '—')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Asunto</td>
            <td style="padding: 8px 0;">${escapeHtml(data.subject)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Mensaje</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(data.message)}</td>
          </tr>
        </table>
        <hr style="margin-top: 24px; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 12px; color: #888;">
          Enviado desde el formulario de contacto de diegonr.com
        </p>
      </div>
    `;

    await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: data.email.trim(),
      subject: `[Contact] ${data.subject}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
