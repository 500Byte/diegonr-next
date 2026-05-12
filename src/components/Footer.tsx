"use client";

import React from 'react';
import { SwissContainer } from './Layout';
import { ArrowUpRight } from 'lucide-react';
import { Magnetic } from './Magnetic';
import { Marquee } from './animations/marquee';
import { scrollTo } from '@/lib/lenis';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { SiteSettings } from '@/types';
import { resolveI18n } from '@/lib/sanity.utils';

interface FooterProps {
  siteSettings?: SiteSettings | null;
}

export const Footer: React.FC<FooterProps> = ({ siteSettings }) => {
  const t = useTranslations('Footer');
  const locale = useLocale();

  const navLinks = [
    { label: t('links.about'), path: '/about' as const },
    { label: t('links.projects'), path: '/projects' as const },
    { label: t('links.services'), path: '/services' as const },
    { label: t('links.blog'), path: '/blog' as const },
    { label: t('links.contact'), path: '/contact' as const }
  ];

  const socialLinks = siteSettings?.socialLinks;
  const email = siteSettings?.contact?.email;
  const copyright = siteSettings?.copyright;

  const location = resolveI18n(siteSettings?.contact, 'location', locale);
  const locationCity = location || t('location_city');

  const displayEmail = email || 'hola@diegonr.com';
  const mailtoHref = `mailto:${displayEmail}`;
  const displayCopyright = copyright || 'DIEGO NAVARRO';

  return (
    <footer className="py-20 md:py-32 bg-swiss-black text-swiss-white border-t border-white/5">
      <SwissContainer>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">{t('navigation_label')}</p>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className="text-lg font-light hover:text-white/60 transition-colors p-2 -m-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">{t('social_label')}</p>
            <div className="flex flex-col gap-2">
              {socialLinks?.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-light hover:text-white/60 transition-colors p-2 -m-2"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-4 md:text-right">
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-8">{t('location_label')}</p>
            <p className="text-lg font-light">{locationCity}</p>
            {!location && <p className="text-lg font-light opacity-60">{t('location_remote')}</p>}
          </div>
        </div>

        <div className="w-full border-y border-white/10 py-12 mb-24 cursor-pointer group">
          <a href={mailtoHref} className="block">
            <Marquee speed={40} pauseOnHover={true} className="py-4">
              <div className="flex items-center">
                <span className="text-6xl md:text-[10vw] font-medium tracking-tighter mx-12">
                  {displayEmail.toUpperCase()}
                </span>
                <ArrowUpRight className="w-12 h-12 md:w-[6vw] md:h-[6vw] mx-12 opacity-40" />
              </div>
            </Marquee>
          </a>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="text-[10px] tracking-[0.4em] uppercase opacity-40">
            © {new Date().getFullYear()} {displayCopyright.toUpperCase()}
          </div>
          <div className="flex gap-12 text-[10px] tracking-[0.3em] uppercase">
            <Magnetic strength={0.2}>
              <button 
                onClick={() => {
                  scrollTo(0);
                }}
                className="swiss-underline opacity-60 hover:opacity-100 transition-opacity p-2 -m-2 min-h-[44px] flex items-center"
              >
                {t('back_to_top')}
              </button>
            </Magnetic>
          </div>
        </div>
      </SwissContainer>
    </footer>
  );
};
