import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import Link from 'next/link'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-white/80 leading-relaxed font-light">
        {children}
      </p>
    ),
    h1: ({ children }) => <h1 className="font-medium text-white tracking-tighter mb-6 mt-12 text-4xl md:text-5xl">{children}</h1>,
    h2: ({ children }) => <h2 className="font-medium text-white tracking-tighter mb-6 mt-12 text-3xl md:text-4xl">{children}</h2>,
    h3: ({ children }) => <h3 className="font-medium text-white tracking-tighter mb-6 mt-12 text-2xl md:text-3xl">{children}</h3>,
    h4: ({ children }) => <h4 className="font-medium text-white tracking-tighter mb-6 mt-12 text-xl md:text-2xl">{children}</h4>,
    h5: ({ children }) => <h5 className="font-medium text-white tracking-tighter mb-6 mt-12 text-lg md:text-xl">{children}</h5>,
    h6: ({ children }) => <h6 className="font-medium text-white tracking-tighter mb-6 mt-12 text-base md:text-lg">{children}</h6>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || ''
      if (href.startsWith('http')) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
            {children}
          </a>
        )
      }
      return (
        <Link href={href} className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
          {children}
        </Link>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <Image
          src={urlFor(value).url()}
          alt={value.alt || ' '}
          width={1200}
          height={800}
          className="rounded-lg w-full h-auto object-cover my-8 border border-white/10"
        />
      )
    },
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-outside mb-6 ml-4 text-white/80 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside mb-6 ml-4 text-white/80 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-2">{children}</li>,
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },
}

export function DocumentRenderer({ value }: { value: any }) {
  if (!value) return null
  
  return (
    <PortableText
      value={value}
      components={components}
    />
  )
}
