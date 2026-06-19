import { PortableText, PortableTextComponents } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { createImageUrlBuilder } from '@sanity/image-url';
import { cn } from '@/lib/utils';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

const builder = createImageUrlBuilder({ projectId, dataset });

const urlFor = (source: any) => builder.image(source);
import { ResearchTable } from './ResearchTable';
import { ResearchCallout } from './ResearchCallout';
import { CodeBlock } from './CodeBlock';

const defaultComponents: PortableTextComponents = {
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
    blockquote: ({ children }) => <blockquote className="border-l-2 border-white/30 pl-4 py-2 italic mb-6 text-white/70">{children}</blockquote>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || '';
      if (href.startsWith('/')) {
        return (
          <Link href={href} className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
          {children}
        </a>
      );
    },
    code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-sm">{children}</code>,
  },
  types: {
    image: () => null,
    codeBlock: ({ value }) => {
      if (!value?.code) return null;
      return (
        <CodeBlock
          code={value.code}
          language={value.language}
          filename={value.filename}
        />
      );
    },
    table: ({ value }) => {
      if (!value?.headers || !value?.rows) return null;
      return (
        <ResearchTable
          caption={value.caption}
          headers={value.headers}
          rows={value.rows}
        />
      );
    },
    callout: ({ value }) => {
      if (!value?.content) return null;
      return (
        <ResearchCallout
          variant={value.variant}
          title={value.title}
          content={value.content}
        />
      );
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
};

export function DocumentRenderer({ 
  field,
  images = [],
  onImageClick,
  className
}: { 
  field: PortableTextBlock[] | null | undefined;
  images?: { src: string; alt: string }[];
  onImageClick?: (index: number) => void;
  className?: string;
}) {
  if (!field) return null;

  const isProse = className?.includes('prose');

  const components: PortableTextComponents = {
    ...(isProse ? {} : defaultComponents),
    block: isProse ? {} : defaultComponents.block,
    listItem: isProse 
      ? { bullet: ({ children }) => <li className="ml-4">{children}</li>, number: ({ children }) => <li className="ml-4">{children}</li> } 
      : defaultComponents.listItem,
    marks: {
      link: ({ children, value }) => {
        const href = value?.href || '';
        const linkClass = isProse ? undefined : "text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors";
        if (href.startsWith('/')) {
          return (
            <Link href={href} className={linkClass}>
              {children}
            </Link>
          );
        }
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {children}
          </a>
        );
      },
      code: isProse ? ({ children }) => <code>{children}</code> : defaultComponents.marks?.code,
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) return null;
        const src = urlFor(value).url();
        const alt = value.alt || 'Research image';
        const index = images.findIndex(img => img.src === src);
        
        return (
          <div
            className={cn(
              "relative w-full my-8 group cursor-pointer",
              isProse && "not-prose"
            )}
            onClick={() => onImageClick?.(index !== -1 ? index : 0)}
            role="button"
            tabIndex={0}
            aria-label={`View ${alt} in full size`}
            onKeyDown={(e) => e.key === 'Enter' && onImageClick?.(index !== -1 ? index : 0)}
          >
            <div className="relative w-full aspect-video bg-white/5 overflow-hidden border border-white/10">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover grayscale transition-transform duration-500 group-hover:grayscale-0 group-hover:scale-105"
              />
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity">
                <ZoomIn className="w-6 h-6 text-white" />
              </div>
            </div>
            {alt && (
              <p className="mt-3 text-white/40 font-mono text-[10px] uppercase tracking-widest">
                {alt}
              </p>
            )}
          </div>
        );
      },
      codeBlock: ({ value }) => {
        if (!value?.code) return null;
        const content = (
          <CodeBlock
            code={value.code}
            language={value.language}
            filename={value.filename}
          />
        );
        return isProse ? <div className="not-prose">{content}</div> : content;
      },
      table: ({ value }) => {
        if (!value?.headers || !value?.rows) return null;
        const content = (
          <ResearchTable
            caption={value.caption}
            headers={value.headers}
            rows={value.rows}
          />
        );
        return isProse ? <div className="not-prose">{content}</div> : content;
      },
      callout: ({ value }) => {
        if (!value?.content) return null;
        const content = (
          <ResearchCallout
            variant={value.variant}
            title={value.title}
            content={value.content}
          />
        );
        return isProse ? <div className="not-prose">{content}</div> : content;
      },
    },
  };

  return (
    <div className={className}>
      <PortableText
        value={field}
        components={components}
      />
    </div>
  );
}
