import { PortableText, PortableTextComponents } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';
import { urlFor } from '../lib/sanity';
import { ResearchTable } from './ResearchTable';
import { ResearchCallout } from './ResearchCallout';
import { CodeBlock } from './CodeBlock';

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

export function DocumentRenderer({ field }: { field: PortableTextBlock[] | null | undefined }) {
  if (!field) return null;
  
  return (
    <PortableText
      value={field}
      components={components}
    />
  );
}
