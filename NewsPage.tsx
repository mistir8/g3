/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, User, ArrowRight, Crown, Star } from 'lucide-react';
import { NewsPost } from '../types';

interface NewsPageProps {
  news: NewsPost[];
}

export default function NewsPage({ news }: NewsPageProps) {
  return (
    <div id="beauty-news-page-container" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white">
      
      {/* Upper header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-[#FF5FA2] text-xs font-black tracking-widest uppercase block">BEAUTY INSIGHTS JOURNAL</span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-950 uppercase select-none">Elegance News & Routine Tips</h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] mx-auto mt-2" />
        <p className="text-gray-500 text-xs sm:text-sm">Indulge in cosmetic secrets, traditional skincare regimens, and direct salon promotion codes written by G3 cosmetologists.</p>
      </div>

      {/* Main Blog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {news.map((post) => (
          <div
            key={post.id}
            className="border border-[#FFD1E8]/30 rounded-3xl overflow-hidden bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
          >
            {/* Visual element preview */}
            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
              <img
                src={post.image || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'}
                alt={post.title}
                className="w-full h-full object-cover scale-102 group-hover:scale-106 transition-transform duration-700 select-none"
              />
              <span className="absolute bottom-4 left-4 bg-zinc-950/70 backdrop-blur-md text-white font-mono text-[9px] uppercase font-bold px-3 py-1.5 rounded-md tracking-wider">
                🏷️ {post.category}
              </span>
            </div>

            {/* Content text */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                  <span className="flex items-center gap-1">📅 {post.date || 'June 2026'}</span>
                  <span>|</span>
                  <span className="flex items-center gap-1">👤 By {post.author}</span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-950 leading-snug group-hover:text-[#FF5FA2] transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {post.blurb}
                </p>

                <div className="bg-zinc-50 border border-zinc-100 p-4.5 rounded-2xl text-xs text-gray-700 leading-relaxed font-light whitespace-pre-line border-l-4 border-l-[#FF5FA2]">
                  {post.content}
                </div>
              </div>

              {/* Highlight promo stamp */}
              {post.category === 'promotions' && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3.5 rounded-xl text-center font-bold font-mono tracking-widest text-[11px] sm:text-xs">
                  🎉 COUPON: Settle booking SMS screenshot for custom 15% discount bonus
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Skincare sidebar highlights info */}
      <div className="mt-16 bg-[#FFD1E8]/10 border border-[#FFD1E8]/30 rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto space-y-3">
        <Crown className="mx-auto text-amber-500 animate-bounce" size={24} />
        <h4 className="font-extrabold text-[#1A1A1A] text-sm uppercase">Curated Custom Skincare Questions?</h4>
        <p className="text-xs text-gray-600 font-light leading-relaxed">
          Tap the floating **G3 Beauty Assistant** icon at the bottom of the screen. Type or choose your skin characteristics, and our server AI will formulate customized cosmetics guides in English and አማርኛ!
        </p>
      </div>

    </div>
  );
}
