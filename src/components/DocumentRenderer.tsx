import { PrismicRichText, JSXMapSerializer } from '@prismicio/react';
import { RichTextField } from '@prismicio/client';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

const components: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="mb-6 text-white/80 leading-relaxed font-light">
      {children}
    </p>
  ),
  heading1: ({ children }) => <h1 className="font-medium text-white tracking-tighter mb-6 mt-12 text-4xl md:text-5xl">{children}</h1>,
  heading2: ({ children }) => <h2 className="font-medium text-white tracking-tighter mb-6 mt-12 text-3xl md:text-4xl">{children}</h2>,
  heading3: ({ children }) => <h3 className="font-medium text-white tracking-tighter mb-6 mt-12 text-2xl md:text-3xl">{children}</h3>,
  heading4: ({ children }) => <h4 className="font-medium text-white tracking-tighter mb-6 mt-12 text-xl md:text-2xl">{children}</h4>,
  heading5: ({ children }) => <h5 className="font-medium text-white tracking-tighter mb-6 mt-12 text-lg md:text-xl">{children}</h5>,
  heading6: ({ children }) => <h6 className="font-medium text-white tracking-tighter mb-6 mt-12 text-base md:text-lg">{children}</h6>,
  hyperlink: ({ node, children }) => {
    return (
      <PrismicNextLink field={node.data} className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
        {children}
      </PrismicNextLink>
    );
  },
  image: ({ node }) => {
    return (
      <PrismicNextImage 
        field={node} 
        className="rounded-lg w-full h-auto object-cover my-8 border border-white/10" 
        fallbackAlt=""
      />
    );
  },
  list: ({ children }) => <ul className="list-disc list-outside mb-6 ml-4 text-white/80 space-y-2">{children}</ul>,
  oList: ({ children }) => <ol className="list-decimal list-inside mb-6 ml-4 text-white/80 space-y-2">{children}</ol>,
  listItem: ({ children }) => <li className="pl-2">{children}</li>,
  oListItem: ({ children }) => <li className="pl-2">{children}</li>,
  preformatted: ({ node }) => <pre className="bg-white/10 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto mb-6">{node.text}</pre>
};

export function DocumentRenderer({ field }: { field: RichTextField | null | undefined }) {
  if (!field) return null;
  
  return (
    <PrismicRichText
      field={field}
      components={components}
    />
  );
}
