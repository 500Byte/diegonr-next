'use client';

import { useState } from 'react';
import { Check, Copy, FileCode } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <figure className="my-12 border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FileCode className="w-3 h-3 text-white/40" />
          {filename && (
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
              {filename}
            </span>
          )}
          {language && !filename && (
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 bg-white/[0.02] overflow-x-auto">
        <code className="font-mono text-sm text-white/80 leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </figure>
  );
}
