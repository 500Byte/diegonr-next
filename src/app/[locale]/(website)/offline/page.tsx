'use client'

import React from 'react'
import Link from 'next/link'
import { SwissContainer } from '@/components/Layout'
import { Magnetic } from '@/components/Magnetic'
import { ArrowLeft, WifiOff } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="page-content min-h-screen flex items-center justify-center">
      <SwissContainer>
        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-8">
            <WifiOff className="w-12 h-12 text-white" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-medium">
              Sin Conexión
            </h1>
            <p className="text-xl text-white/60 max-w-md mx-auto">
              Parece que has perdido la conexión a internet. No te preocupes, puedes explorar algunas secciones que ya has visitado.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Magnetic strength={0.2}>
              <Link
                href="/"
                className="px-8 py-4 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors flex items-center gap-3"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Inicio
              </Link>
            </Magnetic>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-8 py-4 border border-white/20 text-white font-medium rounded-lg hover:border-white/40 transition-colors"
            >
              Reintentar Conexión
            </button>
          </div>

          <div className="pt-16 space-y-4">
            <p className="text-white/40 text-sm">
              Páginas disponibles sin conexión:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/about" className="text-white/60 hover:text-white transition-colors">
                Sobre Mí
              </Link>
              <Link href="/projects" className="text-white/60 hover:text-white transition-colors">
                Proyectos
              </Link>
              <Link href="/services" className="text-white/60 hover:text-white transition-colors">
                Servicios
              </Link>
              <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </SwissContainer>
    </div>
  )
}