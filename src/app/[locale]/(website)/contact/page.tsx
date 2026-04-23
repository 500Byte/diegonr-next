"use client";

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { SwissContainer } from '@/components/Layout';
import { FadeIn } from '@/components/animations/text-reveal';
import { ContactForm } from '@/components/ContactForm';
import { NewsletterSignup } from '@/components/NewsletterSignup';

export default function ContactPage() {
  return (
    <div data-barba-namespace="contact" className="page-content">
      <PageHeader
        title="CONTACTO"
        subtitle="Hablemos de tu proyecto"
        description="¿Tienes una idea innovadora? Estoy listo para ayudarte a convertirla en una realidad digital."
      />

      <section className="py-24 md:py-48">
        <SwissContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <FadeIn>
                <ContactForm />
              </FadeIn>
            </div>

            {/* Contact Info & Newsletter */}
            <div className="lg:col-span-5 space-y-16">
              <FadeIn delay={0.3}>
                <div className="space-y-4">
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Email Directo</p>
                  <a href="mailto:hola@diegonr.com" className="text-2xl md:text-3xl font-light hover:text-white/60 transition-colors">hola@diegonr.com</a>
                </div>
                <div className="space-y-4 pt-12">
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Redes Sociales</p>
                  <div className="flex flex-col gap-4">
                    <a href="https://linkedin.com/in/diegonr" target="_blank" rel="noopener noreferrer" className="text-xl font-light hover:text-white/60 transition-colors w-fit">LinkedIn</a>
                    <a href="https://github.com/diegonr" target="_blank" rel="noopener noreferrer" className="text-xl font-light hover:text-white/60 transition-colors w-fit">GitHub</a>
                    <a href="https://twitter.com/diegonr" target="_blank" rel="noopener noreferrer" className="text-xl font-light hover:text-white/60 transition-colors w-fit">Twitter</a>
                  </div>
                </div>
              </FadeIn>

              {/* Newsletter Signup */}
              <FadeIn delay={0.6}>
                <div className="pt-8 border-t border-white/10">
                  <NewsletterSignup />
                </div>
              </FadeIn>
            </div>
          </div>
        </SwissContainer>
      </section>
    </div>
  );
}
