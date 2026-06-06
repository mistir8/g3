/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, MapPin, Mail, MessageSquare, Instagram, Facebook, Clock, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [formFeedback, setFormFeedback] = useState('');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback('Your beautiful inquiry coordinates have been submitted successfully! One of G3 Hawassa service members will call or email you soon.');
    setInquiryName('');
    setInquiryEmail('');
    setInquiryMsg('');
    setTimeout(() => setFormFeedback(''), 5000);
  };

  return (
    <div id="contact-page-inner-container" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-[#FF5FA2] text-xs font-black tracking-widest uppercase block">CONTACT CENTRE</span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-950 uppercase select-none">Connect with Our Board</h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] mx-auto mt-2" />
        <p className="text-gray-500 text-xs sm:text-sm">We are thrilled to serve you. Reach us via phone hotline, direct email or visit our physical salon branch in Hawassa.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: coordinates details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-50 border border-zinc-100 p-6 sm:p-8 rounded-3xl space-y-6">
            
            <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider block">Direct support lines</h3>

            <div className="space-y-4">
              <div className="flex gap-4 items-start text-xs text-left">
                <div className="w-9 h-9 rounded-full bg-[#FF5FA2]/10 flex items-center justify-center text-[#FF5FA2] shrink-0 mt-0.5">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest text-[10px]">Hotline Mobile</h4>
                  <p className="font-mono font-medium text-sm text-gray-800 mt-1">0924390725</p>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Call our center anytime 24/7</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs text-left">
                <div className="w-9 h-9 rounded-full bg-[#9B5DE5]/10 flex items-center justify-center text-[#9B5DE5] shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest text-[10px]">Physical location</h4>
                  <p className="text-gray-800 font-medium mt-1">Hawassa, Piazza Road, Southern Ethiopia</p>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Adjacent to central commercial suites</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs text-left">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest text-[10px]">Email Coordinates</h4>
                  <p className="font-mono text-gray-800 mt-1">miistir.8@gmail.com</p>
                  <span className="text-[10px] text-gray-400 block">General and business partnership enquiries</span>
                </div>
              </div>

              <div className="flex gap-4 items-start text-xs text-left">
                <div className="w-9 h-9 rounded-full bg-[#FFD1E8] flex items-center justify-center text-[#FF5FA2] shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 uppercase tracking-widest text-[10px]">Opening Hours</h4>
                  <p className="text-gray-800 mt-1">Monday - Sunday: 08:30 AM - 08:00 PM</p>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Traditional bridal schedules open early on request</span>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-gray-200" />

            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Connect on Social channels</p>
              <div className="flex gap-3">
                <a href="#" className="p-2.5 rounded bg-white border border-gray-200 hover:border-[#FF5FA2] hover:text-[#FF5FA2] transition">
                  <Instagram size={15} />
                </a>
                <a href="#" className="p-2.5 rounded bg-white border border-gray-200 hover:border-[#9B5DE5] hover:text-[#9B5DE5] transition">
                  <Facebook size={15} />
                </a>
                <a href="#" className="p-2.5 rounded bg-white border border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition">
                  <MessageSquare size={15} />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-7">
          <div className="border border-gray-100 rounded-3xl p-6 sm:p-8 bg-white shadow-sm space-y-4">
            
            <div className="border-b border-gray-50 pb-3 mb-2 text-left">
              <h3 className="font-extrabold text-sm text-gray-900 uppercase tracking-wider">Leave cosmetic message board</h3>
              <p className="text-gray-500 text-[11px] mt-0.5">Drop questions about bulk purchases, wedding packages or product orders.</p>
            </div>

            {formFeedback && (
              <div className="p-4 bg-emerald-50 text-emerald-850 border border-emerald-250 rounded-2xl text-xs font-semibold leading-relaxed">
                {formFeedback}
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Martha Kebede"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Email / Contact coordinate</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. martha@gmail.com"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 uppercase">Your message / specific inquiry</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How did you find G3? Do you need special accommodations for hair curls, dry skincare routines, or party schedules?"
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs leading-normal"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5FA2] via-[#E25492] to-[#9B5DE5] text-white font-extrabold text-xs uppercase font-mono tracking-wider cursor-pointer hover:shadow transition-shadow flex items-center justify-center gap-1.5"
              >
                <Send size={14} /> Submit inquiry coordinate
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
