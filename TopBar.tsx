/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, MapPin, Instagram, Facebook, MessageSquare, ShieldCheck } from 'lucide-react';

export default function TopBar() {
  return (
    <div id="marketing-top-bar" className="bg-[#1A1A1A] text-white text-xs py-2 px-4 border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Contact details */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-[11px] md:text-xs">
          <div className="flex items-center gap-1.5 text-gray-300">
            <MapPin size={14} className="text-[#D4AF37]" />
            <span>Branch: <strong className="text-white font-medium">Hawassa, Ethiopia</strong></span>
          </div>
          <div className="hidden md:inline text-[#D4AF37]/40">|</div>
          <div className="flex items-center gap-1.5 text-gray-300">
            <Phone size={14} className="text-[#FF5FA2]" />
            <span>Support: <strong className="text-white font-medium">0924390725</strong></span>
          </div>
        </div>

        {/* Global branding or announcement banner */}
        <span className="text-[10px] md:text-[11px] text-[#FFD1E8] tracking-widest uppercase font-semibold animate-pulse">
          Premium Royal VIP Treatment Awaiting You
        </span>

        {/* Social connections */}
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-[#FF5FA2] transition-colors"
            title="G3 Instagram"
          >
            <Instagram size={14} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-[#9B5DE5] transition-colors"
            title="G3 Facebook"
          >
            <Facebook size={14} />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-[#D4AF37] transition-colors"
            title="G3 Telegram Channel"
          >
            <MessageSquare size={14} />
          </a>
          <div className="w-[1px] h-3 bg-gray-700 mx-1" />
          <div className="flex items-center gap-1 text-[#D4AF37] text-[10px] uppercase tracking-wider font-semibold">
            <ShieldCheck size={12} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
