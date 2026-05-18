import { Info, AlertTriangle, Lightbulb, Quote } from 'lucide-react';

type CalloutVariant = 'info' | 'warning' | 'insight' | 'quote';

interface ResearchCalloutProps {
  variant?: CalloutVariant;
  title?: string;
  content: string;
}

const variantConfig: Record<CalloutVariant, { icon: typeof Info; borderColor: string; bg: string }> = {
  info: {
    icon: Info,
    borderColor: 'border-white/20',
    bg: 'bg-white/[0.02]',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-white/40',
    bg: 'bg-white/[0.04]',
  },
  insight: {
    icon: Lightbulb,
    borderColor: 'border-white/30',
    bg: 'bg-white/[0.03]',
  },
  quote: {
    icon: Quote,
    borderColor: 'border-white/20',
    bg: 'bg-transparent',
  },
};

export function ResearchCallout({ variant = 'info', title, content }: ResearchCalloutProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  if (variant === 'quote') {
    return (
      <blockquote className="my-12 pl-6 border-l-2 border-white/30">
        {title && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
            {title}
          </p>
        )}
        <p className="text-white/70 italic leading-relaxed text-lg font-light">
          {content}
        </p>
      </blockquote>
    );
  }

  return (
    <div className={`my-12 p-6 border-l-4 ${config.borderColor} ${config.bg}`}>
      <div className="flex items-start gap-4">
        <Icon className="w-5 h-5 text-white/40 shrink-0 mt-0.5" />
        <div className="space-y-2">
          {title && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">
              {title}
            </p>
          )}
          <p className="text-white/80 leading-relaxed font-light whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
