"use client";

import React from 'react';
import { SwissContainer } from '@/components/Layout';
import { FadeIn } from '@/components/animations/text-reveal';
import { ArrowUpRight } from 'lucide-react';
import { Magnetic } from '@/components/Magnetic';
import Link from 'next/link';
import { ExtendedBlogPost as BlogPostDocument } from '@/lib/sanity';


export const BlogSection: React.FC<{ blogPosts: BlogPostDocument[] }> = ({ blogPosts }) => {
  return (
    <section id="blog" className="py-24 md:py-48 border-t border-white/5 bg-swiss-black overflow-hidden">
      <SwissContainer>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-8">
            <FadeIn>
              <p className="font-mono text-xs text-white/60 mb-4 uppercase tracking-widest">Pensamientos & Artículos</p>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium leading-none tracking-tighter">
                BLOG<span className="text-white/20">.</span>
              </h2>
            </FadeIn>
          </div>
          <div className="md:col-span-4 flex md:items-end md:justify-end">
            <FadeIn delay={0.2}>
              <p className="text-white/60 max-w-sm md:text-right text-sm uppercase tracking-wider">
                Explorando la intersección entre tecnología, diseño y estrategia digital.
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="space-y-0">
          {blogPosts.slice(0, 3).map((post, index) => (
            <FadeIn key={post.uid} delay={index * 0.1}>
              <Link 
                href={`/blog/${post.uid}`}
                className="group relative py-10 md:py-14 border-t border-white/10 flex flex-col md:flex-row md:items-center gap-8 cursor-pointer overflow-hidden block"
              >
                {/* Hover Background */}
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                
                <div className="relative z-10 font-mono text-white/40 w-32 flex-shrink-0 uppercase tracking-widest text-[10px]">
                  {post.date?.toString()}
                </div>
                
                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[8px] font-mono rounded-sm uppercase tracking-widest">
                      {post.category}
                    </span>
                    <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">
                      {post.read_time}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-medium group-hover:translate-x-4 transition-transform duration-500 ease-out">
                    {post.title}
                  </h3>
                </div>

                <div className="relative z-10 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Magnetic strength={0.3}>
                    <div className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-full">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </Magnetic>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-white/10 flex justify-end">
          <Magnetic strength={0.2}>
            <Link 
              href="/blog" 
              className="group flex items-center gap-3 py-2"
            >
              <span className="font-mono text-xs text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">
                Ver todos los artículos
              </span>
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          </Magnetic>
        </div>
      </SwissContainer>
    </section>
  );
};
