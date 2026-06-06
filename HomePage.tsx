/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Award, Star, ArrowRight, MapPin, Phone, Instagram, Facebook, MessageSquare, Plus, Crown } from 'lucide-react';
import { Product, Service, Review, NewsPost } from '../types';

interface HomePageProps {
  onNavigate: (tabId: string) => void;
  homepageSettings: any;
  services: Service[];
  products: Product[];
  reviews: Review[];
  news: NewsPost[];
}

export default function HomePage({
  onNavigate,
  homepageSettings,
  services,
  products,
  reviews,
  news,
}: HomePageProps) {
  const [beautifulMode, setBeautifulMode] = useState<boolean>(true);

  const headline = homepageSettings?.headline || 'Beauty, Confidence & Elegance';
  const slogan = homepageSettings?.slogan || 'Step into the sublime world of G3 Cosmetics and Spa. Our Hawassa master artists formulate flawless makeup and botanical treatments tailored specifically for your radiant, timeless glow.';
  const btnBook = homepageSettings?.buttonBookText || 'Book Appointment';
  const btnShop = homepageSettings?.buttonShopText || 'Shop Products';

  // Extract featured popular items
  const popularServices = services.slice(0, 3);
  const popularProducts = products.filter(p => p.isPopular).slice(0, 3);
  const featuredReviews = reviews.filter(r => r.status === 'approved').slice(0, 3);
  const featuredNews = news.slice(0, 2);

  return (
    <div id="home-page-container" className="overflow-hidden bg-[#FFFFFF]">
      {/* 1. HERO SECTION WITH ETHIOPIAN BRIDE */}
      <section className={`relative min-h-[85vh] flex items-center overflow-hidden py-12 md:py-20 border-b border-[#FFD1E8]/40 transition-all duration-1000 ${
        beautifulMode 
          ? 'bg-gradient-to-tr from-[#FFF0F6] via-[#FFF5F9] to-[#EBEFFF]' 
          : 'bg-gradient-to-r from-[#FFD1E8]/50 via-white to-transparent'
      }`}>
        {/* Soft background decorative layout */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#FF5FA2]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#9B5DE5]/5 blur-3xl pointer-events-none" />

        {beautifulMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Animated slow golden-pink particles */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: '80%', x: `${n * 11}%`, scale: 0.5 }}
                animate={{
                  opacity: [0, 0.85, 0],
                  y: ['80%', '10%'],
                  scale: [0.6, 1.3, 0.7],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 5 + n,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: n * 0.3,
                }}
                className="absolute text-[16px]"
                style={{ left: `${n * 11}%`, bottom: '0%' }}
              >
                {n % 3 === 0 ? '🌹' : n % 3 === 1 ? '💖' : '🌸'}
              </motion.div>
            ))}
            {/* Golden-pink dream shine pulse */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#FF5FA2]/8 blur-[120px] opacity-60 animate-pulse" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-200/10 blur-[100px] opacity-40" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Slogan and Text details */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5FA2]/10 border border-[#FF5FA2]/20 text-[#FF5FA2] text-[11px] md:text-xs font-bold uppercase tracking-widest"
                >
                  <Crown size={14} className="text-[#D4AF37]" /> Luxury Aesthetics & Cosmetics Ethiopia
                </motion.div>
                
                {/* Beautiful Mode Switcher */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBeautifulMode(!beautifulMode)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-500 shadow-xs border cursor-pointer ${
                    beautifulMode 
                      ? 'bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white border-transparent shadow-[#FF5FA2]/20 shadow-md'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-[#FF5FA2]'
                  }`}
                >
                  <span>{beautifulMode ? 'Ambient Premium Glow On' : 'Activate Premium Glow'}</span>
                </motion.button>
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black text-[#3D1B2D] leading-[1.1] tracking-tight font-sans"
              >
                G3 <span className="text-[#FF5FA2]">BEAUTY</span> & COSMETICS
                <span className="block mt-2 bg-gradient-to-r from-[#FF5FA2] via-[#9B5DE5] to-[#D4AF37] bg-clip-text text-transparent font-medium text-2xl sm:text-3xl md:text-4xl tracking-normal italic animate-pulse">
                  {headline}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="text-[#3D1B2D]/85 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light"
              >
                {slogan}
              </motion.p>

              {/* Action commands with super smooth bounciness */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-[#FF5FA2] via-[#E25492] to-[#9B5DE5] text-white font-black tracking-wider shadow-md hover:shadow-xl hover:shadow-[#FF5FA2]/40 hover:scale-[1.04] active:scale-[0.96] transition-all duration-500 ease-out uppercase font-mono text-xs cursor-pointer flex items-center justify-center gap-2 border border-[#D4AF37]/50"
                >
                  <ArrowRight size={16} className="text-white" /> {btnBook}
                </button>
                <button
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto px-9 py-4 rounded-2xl border-2 border-[#FF5FA2]/70 text-[#FF5FA2] font-black tracking-wider hover:bg-[#FF5FA2]/5 hover:scale-[1.04] active:scale-[0.96] transition-all duration-500 ease-out uppercase font-mono text-xs cursor-pointer"
                >
                  {btnShop}
                </button>
              </motion.div>

              {/* Tiny features row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-100 max-w-lg mx-auto lg:mx-0 text-left"
              >
                <div>
                  <h4 className="text-xl font-bold text-[#FF5FA2]">100%</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Premium Quality</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#9B5DE5]">88+</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Bridal Queens</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#D4AF37]">5.0 ★</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Top Rating</p>
                </div>
              </motion.div>
            </div>

            {/* Premium Ethiopian Bridal Model Side Container */}
            <div className="lg:col-span-5 relative w-full flex items-center justify-center min-h-[460px] mt-8 lg:mt-0">
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] h-[450px]">
                
                {/* 1. Main Classic Center Model (Habesha Gold Glam) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute left-[8%] top-[10%] w-[70%] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white z-20 group"
                >
                  <div className="absolute inset-0 border border-[#D4AF37]/30 rounded-[1.8rem] pointer-events-none z-10 m-1.5" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D1B2D]/40 to-transparent z-10" />
                  <img
                    src="/src/assets/images/g3_hero_model_1780749528237.png"
                    alt="Ethiopian Bride Royalty Makeup"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-705"
                  />
                  <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-[#D4AF37]/10 flex justify-between items-center shadow-md">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider text-[#FF5FA2] font-black block">Elite Artistry</span>
                      <h5 className="font-extrabold text-[#3D1B2D] text-[11px]">Habesha Gold Glam</h5>
                    </div>
                    <button
                      onClick={() => onNavigate('booking')}
                      className="p-1.5 bg-[#FF5FA2] hover:bg-[#9B5DE5] text-white rounded-full transition-colors shrink-0 cursor-pointer"
                    >
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>

                {/* 2. Top-Right Offset Image (Bridal Masterclass / Royal Cosmetics) */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: -20, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="absolute right-[5%] top-[2%] w-[50%] aspect-[1/1] rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D1B2D]/40 to-transparent z-10" />
                  <img
                    src="/src/assets/images/g3_bridal_makeup_1780749559005.png"
                    alt="Traditional Luxury Makeup"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-705"
                  />
                  <div className="absolute bottom-2 left-2 right-2 z-20 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg">
                    <span className="text-[8px] uppercase tracking-wider text-[#9B5DE5] font-black block">Royal Cosmetics</span>
                  </div>
                </motion.div>

                {/* 3. Bottom-Left Offset Image (Revitalizing Skincare / Botanical Spa) */}
                <motion.div
                  initial={{ opacity: 0, x: -20, y: 20, scale: 0.85 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                  className="absolute left-[2%] bottom-[2%] w-[52%] aspect-[1/1] rounded-2xl overflow-hidden shadow-xl border-4 border-white z-30 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D1B2D]/40 to-transparent z-10" />
                  <img
                    src="/src/assets/images/g3_skincare_model_1780749544052.png"
                    alt="Skin Health & Glow"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-705"
                  />
                  <div className="absolute bottom-2 left-2 right-2 z-20 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg">
                    <span className="text-[8px] uppercase tracking-wider text-emerald-600 font-black block">Botanical Spa</span>
                  </div>
                </motion.div>

                {/* Decorative slow-rotating dashed background ring */}
                <div 
                  className="absolute inset-[10%] rounded-full border border-dashed border-[#D4AF37]/20 pointer-events-none z-0 animate-spin" 
                  style={{ animationDuration: '40s' }} 
                />

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS FLOW */}
      <section className="py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 bg-white border-b border-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#FF5FA2]/40 transition-colors">
            <div className="w-11 h-11 rounded-full bg-[#FF5FA2]/10 flex items-center justify-center text-[#FF5FA2] mb-4">
              <Award size={22} />
            </div>
            <h3 className="font-extrabold text-sm text-[#3D1B2D] uppercase tracking-wide">Professional Artists Team</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">Certified bridal stylists & facial aesthetics experts coordinating your beauty.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#9B5DE5]/40 transition-colors">
            <div className="w-11 h-11 rounded-full bg-[#9B5DE5]/10 flex items-center justify-center text-[#9B5DE5] mb-4">
              <Heart size={22} />
            </div>
            <h3 className="font-extrabold text-sm text-[#3D1B2D] uppercase tracking-wide">Premium Botanical Products</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">Exclusive royal cosmetics formulations nourishing all types of Ethiopian skin tones.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center text-[#D4AF37] mb-4">
              <Star size={22} />
            </div>
            <h3 className="font-extrabold text-sm text-[#3D1B2D] uppercase tracking-wide">Happy Glorious Queens</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">Over 5000+ radiant customers leaving beautiful verified reviews in southern Ethiopia.</p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-emerald-500/40 transition-colors">
            <div className="w-11 h-11 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-extrabold text-sm text-[#3D1B2D] uppercase tracking-wide">100% Reliable Payments</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">Secure verify checkout processes via Telebirr mobile money, CBE Bank, or USDT Crypto.</p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR SALON SERVICES SECTION */}
      <section className="py-16 bg-[#FFD1E8]/10 border-b border-[#FFD1E8]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-[#FF5FA2] text-xs font-black uppercase tracking-widest block">ROYAL TREATMENTS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D1B2D] tracking-tight">Our Beloved Popular Services</h2>
            <p className="text-gray-500 text-xs sm:text-sm">Indulge in flawless makeup artistry, aromatic massages, and exclusive bride hair styling in Hawassa beauty center.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularServices.map((s) => (
              <div key={s.id} className="bg-white rounded-3xl overflow-hidden border border-[#FFD1E8]/40 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover scale-102 group-hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/10 text-xs font-black text-[#FF5FA2]">
                    ⭐ {s.rating}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-zinc-950/70 backdrop-blur-md px-3 py-1 rounded-md text-[10px] text-white font-mono uppercase font-bold tracking-wider">
                    {s.duration} duration
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-base text-gray-900 group-hover:text-[#FF5FA2] transition-colors">{s.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3">{s.description}</p>
                  </div>

                  <div className="border-t border-gray-50 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Estimated Fee</span>
                      <strong className="text-[#FF5FA2] font-extrabold text-base">{s.priceEtb} ETB</strong>
                    </div>
                    <button
                      onClick={() => onNavigate('booking')}
                      className="px-5 py-3 rounded-2xl bg-[#9B5DE5] hover:bg-[#FF5FA2] text-white text-xs font-black tracking-wider transition-all duration-500 hover:scale-[1.05] active:scale-[0.95] hover:shadow-lg hover:shadow-[#FF5FA2]/20 uppercase font-mono cursor-pointer flex items-center gap-1"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('services')}
              className="text-xs uppercase font-extrabold text-[#9B5DE5] hover:text-[#FF5FA2] hover:underline flex items-center gap-2.5 mx-auto cursor-pointer"
            >
              Explore all beauty services offered <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. CHERISHED TESTIMONIALS SCREEN AREA */}
      <section className="py-16 bg-[#FFFFFF] border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            
            <div className="space-y-4 text-center lg:text-left">
              <span className="text-[#FF5FA2] text-[11px] font-black tracking-widest uppercase block">TESTIMONIALS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">Word of Mouth elegance</h2>
              <p className="text-xs text-gray-500 leading-relaxed font-light">See why elite ladies and bridal queens in Hawassa depend absolutely on G3 Beauty salon services.</p>
              <button
                onClick={() => onNavigate('reviews')}
                className="inline-flex items-center gap-1.5 bg-[#FF5FA2] hover:bg-[#9B5DE5] text-white text-xs font-black px-5 py-3 rounded-2xl transition-all duration-500 hover:scale-[1.05] active:scale-[0.95] hover:shadow-lg hover:shadow-[#FF5FA2]/20 cursor-pointer"
              >
                Submit feedback reviews
              </button>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredReviews.map((r) => (
                <div key={r.id} className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 italic leading-relaxed font-light">"{r.comments}"</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3 pt-4 border-t border-gray-200/40">
                    <img src={r.userPhoto} alt={r.userName} className="w-8 h-8 rounded-full border shadow-xs" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-semibold text-xs text-gray-900">{r.userName}</h4>
                      <span className="text-[10px] text-gray-400 font-mono block">{r.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. DYNAMIC LUXURY PRODUCTS FEATURE */}
      <section className="py-16 bg-zinc-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[#9B5DE5] text-xs font-black tracking-widest uppercase block">COSMETICS BOUTIQUE</span>
            <h2 className="text-3xl font-extrabold text-[#3D1B2D]">Popular Cosmetics Boutique</h2>
            <p className="text-gray-500 text-xs">Shop luxurious foundations, velvet lipsticks, and complete Habesha bridal palettes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-5">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-4 shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute top-3 left-3 bg-[#9B5DE5] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    Popular
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">{p.category.replace('_', ' ')}</span>
                  <h3 className="font-extrabold text-sm text-gray-900 mt-1">{p.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <strong className="text-gray-900 text-sm font-black block">{p.priceEtb} ETB</strong>
                    <span className="text-[10px] font-mono text-gray-400">${p.priceUsdt} USDT</span>
                  </div>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-3.5 py-2 rounded-lg bg-[#FF5FA2] text-white text-[11px] font-bold hover:bg-[#9B5DE5] transition-colors cursor-pointer"
                  >
                    View Boutique
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BEAUTY INSIGHTS & EXCERPT NEWS BLOG */}
      <section className="py-16 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-[#FF5FA2] text-xs font-black tracking-widest uppercase block">BEAUTY INSIGHTS</span>
            <h2 className="text-3xl font-extrabold text-[#3D1B2D]">Skin Advice & Beauty News</h2>
            <p className="text-gray-500 text-xs">Read tips written by royal cosmetology experts in Hawassa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredNews.map((n) => (
              <div key={n.id} className="flex flex-col sm:flex-row gap-5 items-center border border-gray-50 rounded-2xl p-5 hover:bg-gray-50/50 transition-colors">
                <div className="w-full sm:w-36 aspect-square rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                  <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-[#9B5DE5] bg-[#9B5DE5]/10 px-2.5 py-0.5 rounded-full">
                    {n.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-gray-950 leading-snug">{n.title}</h3>
                  <p className="text-xs text-gray-500 font-light line-clamp-2">{n.blurb}</p>
                  <button
                    onClick={() => onNavigate('news')}
                    className="text-[10px] font-bold text-[#FF5FA2] hover:underline flex items-center gap-1"
                  >
                    Read skincare guidelines <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MAJESTIC GLOW PRE-FOOTER BANNER */}
      <section className="bg-gradient-to-r from-[#FF5FA2] via-[#9B5DE5] to-[#D4AF37] py-12 px-4 shadow-inner">
        <div className="max-w-5xl mx-auto text-center text-white space-y-4">
          <Crown className="mx-auto text-amber-300 animate-bounce" size={32} />
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight tracking-wider uppercase">Join G3 Royal Glow Movement</h2>
          <p className="text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed text-pink-50">
            Enjoy premium discount codes and absolute VIP scheduling reservations inside Hawassa, Ethiopia. Tap to prepare your consultation now!
          </p>
          <div className="pt-2 flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => onNavigate('booking')}
              className="px-7 py-3 rounded-2xl bg-white text-[#FF5FA2] font-black tracking-wider hover:bg-pink-100 hover:scale-[1.04] active:scale-[0.96] transition-all duration-500 uppercase font-mono text-xs cursor-pointer shadow-md"
            >
              Book My Royal Slot
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white font-black tracking-wider hover:shadow-lg hover:scale-[1.04] active:scale-[0.96] transition-all duration-500 uppercase font-mono text-xs cursor-pointer border border-[#FF5FA2]/20 shadow-md"
            >
              Reach support
            </button>
          </div>
        </div>
      </section>

      {/* 8. PREMIUM FOOTER */}
      <footer className="bg-[#30071C] text-white pt-16 pb-8 border-t border-[#D4AF37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
            
            {/* Info */}
            <div className="space-y-4">
              <span className="block text-xl font-black bg-gradient-to-r from-[#FF5FA2] via-[#D4AF37] to-[#FFD1E8] bg-clip-text text-transparent">G3 COSMETICS</span>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Premium luxury beauty brand styling bridal transformations & formulating botanical facial cosmetics for wonderful skin tones since 2024.
              </p>
              <div className="text-[10px] text-gray-500 font-mono">
                📍 Hawassa South Town Road<br />Sidama Region, Ethiopia
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-extrabold text-[#D4AF37] text-xs uppercase tracking-widest mb-4">Glow Services</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">Traditional Habesha Bridal</button></li>
                <li><button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">Hair Weaving & Braids</button></li>
                <li><button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">Facial Hydrating Wash</button></li>
                <li><button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">Royal Gold Pedicure</button></li>
              </ul>
            </div>

            {/* Navigation Helpers */}
            <div>
              <h4 className="font-extrabold text-[#FF5FA2] text-xs uppercase tracking-widest mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Cosmetics Boutique</button></li>
                <li><button onClick={() => onNavigate('booking')} className="hover:text-white transition-colors">Confirm Appointments</button></li>
                <li><button onClick={() => onNavigate('payments')} className="hover:text-white transition-colors">Receipt Verification</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">Our Beautiful Story</button></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-[#9B5DE5] text-xs uppercase tracking-widest mb-4">Contact Board</h4>
              <p className="text-xs text-gray-400">Phone Hotline: 0924390725</p>
              <div className="flex gap-2">
                <a href="#" className="p-2 bg-zinc-800 rounded text-[#FF5FA2] hover:bg-[#FF5FA2] hover:text-white transition-colors">
                  <Instagram size={14} />
                </a>
                <a href="#" className="p-2 bg-zinc-800 rounded text-[#9B5DE5] hover:bg-[#9B5DE5] hover:text-white transition-colors">
                  <Facebook size={14} />
                </a>
                <a href="#" className="p-2 bg-zinc-800 rounded text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors">
                  <MessageSquare size={14} />
                </a>
              </div>
              <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-mono">Bilingual EN & አማርኛ</span>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 gap-4">
            <span>© 2026 G3 Beauty & Cosmetics. All luxury rights reserved. Hawassa, Ethiopia.</span>
            <span>Beauty, Confidence & Elegance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
