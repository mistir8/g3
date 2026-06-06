/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Star, Award, Heart, Shield, X, Smile, Target, Users } from 'lucide-react';
import { GalleryItem } from '../types';

interface AboutPageProps {
  gallery: GalleryItem[];
}

export default function AboutPage({ gallery }: AboutPageProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  // Elite team bio registers
  const teamList = [
    { name: 'Dr. Mihret Sisay', role: 'Chief Aesthetician & Formulator', bio: 'Specialize in botanical cosmetic formulas matching Ethiopian warm skin characteristics. Trained in Dubai & Addis.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { name: 'Helen Kebede', role: 'Lead Hair Stylist Master', bio: 'Expert in modern fusions, traditional Habesha bridal crown braiding and intense wave hydration masks.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { name: 'Elsa Solomon', role: 'Bridal Glam Specialist', bio: 'With over 8 years experience helping brides look and feel like absolute royalty under southern sun.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' }
  ];

  return (
    <div id="about-us-page-wrapper" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white">
      
      {/* Introduction Narrative */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5FA2]/10 border border-[#FF5FA2]/20 text-[#FF5FA2] text-xs font-bold uppercase tracking-widest">
            <Crown size={12} className="text-[#D4AF37]" /> Beauty, Confidence & Elegance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 leading-tight">
            G3 BEAUTY STORY
          </h1>
          <div className="w-16 h-[2px] bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] mx-auto lg:mx-0 mt-2" />
          <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed">
            Founded in beautiful Hawassa, Ethiopia, G3 Beauty & Cosmetics emerged from a sheer passion to empower women with world-class, premium elegance. We believe beauty is a majestic integration of confidence, aesthetics, and timeless skin health.
          </p>
          <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed">
            Starting as a boutique custom styling studio, our board formulated natural skincare bases specifically aligned with the sunny, warm regional climate. Today, we coordinate state-of-the-art bridal sessions, cosmetic boutique dispatch, and specialized botanical skin treatments.
          </p>
        </div>

        <div className="relative flex justify-center">
          <div className="w-80 sm:w-96 aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-[0_20px_50px_rgba(255,95,162,0.1)] relative">
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 p-5 text-white">
              <span className="text-[9px] uppercase tracking-widest text-[#FF5FA2] font-extrabold">Active Branch</span>
              <h4 className="font-extrabold text-sm mt-0.5">Hawassa Aesthetics Hub</h4>
            </div>
            <img
              src="/src/assets/images/g3_skincare_model_1780749544052.png"
              alt="Intense skin renewal"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision Bento Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-center md:text-left">
        <div className="p-6 sm:p-8 bg-zinc-50 border border-zinc-100 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FF5FA2]/10 flex items-center justify-center text-[#FF5FA2]">
            <Target size={24} />
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest">Our Royal Mission</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Providing exceptional hair styling, organic skincare makeovers, and authentic cosmetics that reveal the natural sovereign confidence of every Ethiopian queen.
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-zinc-50 border border-zinc-100 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#9B5DE5]/10 flex items-center justify-center text-[#9B5DE5]">
            <Award size={24} />
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest">Exclusive Vision</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Establish G3 Cosmetics as the absolute premier luxury beauty benchmark across East Africa, merging high-fashion style with deep regional heritage.
          </p>
        </div>

        <div className="p-6 sm:p-8 bg-zinc-50 border border-zinc-100 rounded-3xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-[#D4AF37]">
            <Users size={24} />
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest">Aesthetic Teamwork</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Sustaining rigorous sanitary safety, certified staff training programs, and absolute customer tracking with friendly, top-rated support staff.
          </p>
        </div>
      </section>

      {/* Professional Team biographies */}
      <section className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[#FF5FA2] text-xs font-black tracking-widest uppercase block">MASTER ARTISTS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Meet Our Luxury Founders</h2>
          <p className="text-gray-500 text-xs">Certified experts in makeup artistry, custom hair waving and regional skincare design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {teamList.map((tm, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs text-center flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-[#FF5FA2]/40 bg-zinc-100">
                  <img src={tm.image} alt={tm.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#1A1A1A]">{tm.name}</h4>
                  <span className="text-[10px] text-[#9B5DE5] uppercase font-bold tracking-widest block font-mono mt-0.5">{tm.role}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-light px-2">"{tm.bio}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Elegance visual photo gallery registry */}
      <section className="border-t border-gray-100 pt-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[#9B5DE5] text-xs font-black tracking-widest uppercase block">LUXURY PORTRAITS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">The Elegance Gallery</h2>
          <p className="text-gray-500 text-xs">Visual highlights of real traditional Habesha makeup, custom nail work, and active salon spaces in Hawassa.</p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {gallery.map((it) => (
            <div
              key={it.id}
              onClick={() => setSelectedPhoto(it)}
              className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 cursor-pointer shadow-xs shrink-0"
            >
              <img
                src={it.image}
                alt={it.title}
                className="w-full h-full object-cover scale-102 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#FF5FA2]/45 backdrop-blur-xs flex items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-extrabold text-xs uppercase tracking-wide font-mono">
                  🔎 {it.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo lightbox modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-xl bg-transparent relative flex flex-col items-center"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer"
              >
                <X size={24} />
              </button>

              <div className="rounded-2xl overflow-hidden bg-white p-1 shadow-2xl border border-white/25">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="w-full h-auto max-h-[75vh] object-contain rounded-xl select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 text-center bg-white">
                  <h4 className="font-extrabold text-[#1A1A1A] text-xs uppercase tracking-wider">{selectedPhoto.title}</h4>
                  <span className="text-[9px] text-[#9B5DE5] uppercase font-bold tracking-widest block font-mono mt-0.5">{selectedPhoto.category} highlight</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
