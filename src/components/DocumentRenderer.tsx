import { DocumentRenderer as KeystaticDocumentRenderer } from '@keystatic/core/renderer';
import { ComponentProps } from 'react';
import Link from 'next/link';

const defaultRenderers = {
  inline: {
    bold: ({ children }: any) => <strong>{children}</strong>,
    italic: ({ children }: any) => <em>{children}</em>,
    code: ({ children }: any) => <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-sm">{children}</code>,
    link: ({ children, href }: any) => (
      <Link href={href} className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
        {children}
      </Link>
    ),
  },
  block: {
    paragraph: ({ children, textAlign }: any) => (
      <p className={`mb-6 text-white/80 leading-relaxed font-light ${textAlign ? `text-${textAlign}` : ''}`}>
        {children}
      </p>
    ),
    heading: ({ level, children, textAlign }: any) => {
      const Tag = `h${level}` as any;
      const baseStyles = "font-medium text-white tracking-tighter mb-6 mt-12";
      const sizeStyles = {
        1: "text-4xl md:text-5xl",
        2: "text-3xl md:text-4xl",
        3: "text-2xl md:text-3xl",
        4: "text-xl md:text-2xl",
        5: "text-lg md:text-xl",
        6: "text-base md:text-lg",
      }[level as 1|2|3|4|5|6];
      return <Tag className={`${baseStyles} ${sizeStyles} ${textAlign ? `text-${textAlign}` : ''}`}>{children}</Tag>;
    },
    divider: () => <hr className="border-white/10 my-12" />,
    image: ({ src, alt }: any) => (
      <img src={src} alt={alt || ''} className="rounded-lg w-full h-auto object-cover my-8 border border-white/10" />
    ),
    list: ({ children, type }: any) => {
      const Tag = type === 'ordered' ? 'ol' : 'ul';
      const className = type === 'ordered' ? 'list-decimal list-inside' : 'list-disc list-outside';
      return <Tag className={`${className} mb-6 ml-4 text-white/80 space-y-2`}>{children}</Tag>;
    },
    listItem: ({ children }: any) => <li className="pl-2">{children}</li>,
  },
};

export function DocumentRenderer({ 
  document 
}: { 
  document: ComponentProps<typeof KeystaticDocumentRenderer>['document'] 
}) {
  return (
    <KeystaticDocumentRenderer
      document={document}
      renderers={defaultRenderers}
    />
  );
}
