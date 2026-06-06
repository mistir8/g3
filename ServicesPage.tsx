/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, Star, Crown, Clock, MapPin } from 'lucide-react';
import { Service } from '../types';

interface ServicesPageProps {
  services: Service[];
  onBookService: (serviceName: string) => void;
}

export default function ServicesPage({ services, onBookService }: ServicesPageProps) {
  return (
    <div id="services-page-container" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white">
      
      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5FA2]/10 border border-[#FF5FA2]/20 text-[#FF5FA2] text-xs font-bold uppercase tracking-widest">
          <Crown size={12} className="text-[#D4AF37]" /> Beauty, Confidence & Elegance
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[#3D1B2D] leading-tight select-none">
          LUXURY SALON SERVICES
        </h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] mx-auto mt-2" />
        <p className="text-gray-500 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Embark on a pampering escape in Hawassa. Our premier artists utilize elite botanical ingredients and custom cosmetics to craft your masterpiece glow.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((item) => (
          <div
            key={item.id}
            className="border border-[#FFD1E8]/40 rounded-3xl bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group h-full"
          >
            {/* Upper portrait */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

              {/* Float Rating */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#FF5FA2] flex items-center gap-1 shadow-sm border border-[#FFD1E8]/30">
                <Star size={12} className="text-[#D4AF37] fill-current" />
                <span>{item.rating || 4.9}</span>
                <span className="text-gray-400 font-light text-[10px]">({item.reviewsCount || 100})</span>
              </div>

              {/* Hover highlight overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#FF5FA2]/10 via-transparent to-[#9B5DE5]/10 z-10 transition-opacity duration-500 pointer-events-none" />
            </div>

            {/* Down content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base md:text-lg text-gray-900 group-hover:text-[#FF5FA2] transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#9B5DE5] bg-[#9B5DE5]/10 px-2.5 py-0.5 rounded-full font-bold">
                    <Clock size={12} />
                    <span>{item.duration}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Row Pricing & Trigger button */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">FEES IN HAWASSA</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <strong className="text-lg md:text-xl font-black text-[#FF5FA2]">{item.priceEtb}</strong>
                    <span className="text-xs text-[#FF5FA2]/90 font-bold font-mono">ETB</span>
                  </div>
                </div>

                <button
                  onClick={() => onBookService(item.name)}
                  className="px-5 py-3 rounded-2xl bg-[#9B5DE5] hover:bg-[#FF5FA2] text-white text-xs font-black tracking-wider uppercase font-mono shadow-md hover:shadow-xl hover:shadow-[#FF5FA2]/20 hover:scale-[1.05] active:scale-[0.95] transition-all duration-500 ease-out cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar size={13} /> Book Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom informational guidelines */}
      <div className="mt-16 bg-zinc-50 border border-zinc-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-sm text-gray-900 uppercase">Need customized VIP party styling?</h4>
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            We prepare absolute group hairstyles and multi-queen glamour for graduation events, holidays, and high-fashion galas. Let us verify coordinate pricing.
          </p>
        </div>
        <button
          onClick={() => onBookService('Custom Group Session')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] via-[#9B5DE5] to-[#D4AF37] text-white font-extrabold text-xs uppercase font-mono shadow-sm hover:translate-y-[-1px] transition-transform shrink-0 cursor-pointer"
        >
          Request Custom Event Quote
        </button>
      </div>

    </div>
  );
}
