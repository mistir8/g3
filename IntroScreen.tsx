/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Crown } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    // Generate beautiful random beauty particles floating
    const tempParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      scale: Math.random() * 0.8 + 0.4
    }));
    setParticles(tempParticles);

    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div id="intro-screen" className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-tr from-[#50132B] via-[#2F0615] to-[#4F132E]">
      {/* Lux Pink & Gold Floating Soft Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#FF5FA2]/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#9B5DE5]/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#D4AF37]/5 blur-3xl" />

      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: '100%' }}
            animate={{
              opacity: [0, 0.7, 0],
              y: '-10%',
              x: `${p.x + Math.sin(p.id) * 5}%`
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeOut'
            }}
            className="absolute rounded-full bg-[#FFD1E8]"
            style={{
              left: `${p.x}%`,
              width: `${p.scale * 6}px`,
              height: `${p.scale * 6}px`,
              boxShadow: '0 0 8px rgba(255, 95, 162, 0.4)'
            }}
          />
        ))}
      </div>

      {/* Main Animated 3D metallic Logo Structure */}
      <div className="relative flex flex-col items-center">
      {/* Orbiting elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-16 w-32 h-32 flex items-center justify-center"
        >
          <Star className="text-[#D4AF37] pointer-events-none absolute left-0" size={20} />
          <Heart className="text-[#FF5FA2] pointer-events-none absolute right-0" size={16} />
          <Crown className="text-[#9B5DE5] pointer-events-none absolute top-0" size={18} />
          <Star className="text-[#FFD1E8] pointer-events-none absolute bottom-0" size={14} />
        </motion.div>

        {/* 3D Gold Logo Container */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative group p-8 rounded-full flex items-center justify-center bg-radial from-[#2a1b24] to-[#1a1a1a]/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-[#D4AF37]/20"
        >
          {/* Logo background shine */}
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] blur-md"
          />

          {/* G3 Metallic Symbol with reflective gold texture */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#E6C65A] via-[#D4AF37] to-[#997911] p-1 flex items-center justify-center shadow-inner">
            <div className="absolute inset-[2px] rounded-full bg-[#4F132E] flex items-center justify-center">
              {/* Gold reflective letter accents layout */}
              <motion.span
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  backgroundSize: '200% auto',
                  backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #FFD1E8 50%, #9B5DE5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                className="text-6xl font-black tracking-tight"
              >
                G3
              </motion.span>
            </div>

            {/* Shine sweep overlay */}
            <motion.div
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
            />
          </div>
        </motion.div>

        {/* Text Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-8 px-4"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-white">
            G3 <span className="bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] bg-clip-text text-transparent">BEAUTY</span> & COSMETICS
          </h1>
          <p className="text-[#FFD1E8] font-medium tracking-wide mt-2 text-sm md:text-base opacity-90 max-w-sm mx-auto">
            Beauty, Confidence & Elegance
          </p>

          <div className="w-16 h-[2px] bg-gradient-to-r from-[#FF5FA2] via-[#D4AF37] to-[#9B5DE5] mx-auto mt-4" />
          <p className="text-xs font-mono text-gray-500 tracking-wider mt-3">HAWASSA, ETHIOPIA</p>
        </motion.div>
      </div>

      {/* Core Loader line */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[3px] bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37]"
        />
      </div>
    </div>
  );
}
