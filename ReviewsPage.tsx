/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MessageSquare, Check, Heart, User, FileText } from 'lucide-react';
import { Review, User as UserType } from '../types';

interface ReviewsPageProps {
  reviews: Review[];
  currentUser: UserType | null;
  onAddReview: (review: Review) => void;
  onNavigate: (tabId: string) => void;
}

export default function ReviewsPage({
  reviews,
  currentUser,
  onAddReview,
  onNavigate,
}: ReviewsPageProps) {
  const approvedReviews = reviews.filter(r => r.status === 'approved');

  // Submit feedback state
  const [ratingInput, setRatingInput] = useState(5);
  const [commentsInput, setCommentsInput] = useState('');
  const [targetInput, setTargetInput] = useState('G3 Bridal Makeup');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentsInput) return;

    if (!currentUser) {
      setFeedbackMsg('Requires an active VIP Client account. Register to submit review.');
      onNavigate('login');
      return;
    }

    const reviewPayload = {
      userId: currentUser.id,
      userName: currentUser.name,
      userPhoto: currentUser.photoUrl || 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
      targetName: targetInput,
      rating: ratingInput,
      comments: commentsInput
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });

      if (res.ok) {
        const data = await res.json();
        onAddReview(data.review);
        setCommentsInput('');
        setFeedbackMsg('Your gorgeous review is submitted and awaiting instant board clearance moderation!');
        setTimeout(() => setFeedbackMsg(''), 4500);
      } else {
        setFeedbackMsg('Failed to submit review. Check parameters.');
      }
    } catch {
      setFeedbackMsg('Communication errors occurred. Support Hotline: 0924390725.');
    }
  };

  return (
    <div id="reviews-page-wrapper" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-[#9B5DE5] text-xs font-black tracking-widest uppercase block">CLIENT COMMUNITY STORIES</span>
        <h1 className="text-3xl md:text-5xl font-black text-gray-950 select-none uppercase">Beloved Customer Reviews</h1>
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#9B5DE5] to-[#FF5FA2] mx-auto mt-2" />
        <p className="text-gray-500 text-xs sm:text-sm">Read organic feedback leaving from gorgeous brides and customers. Your timless stories nourish our Hawassa craftsmanship.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Submit Feedback Form */}
        <div className="lg:col-span-5 bg-zinc-50 border border-zinc-100 p-6 sm:p-8 rounded-3xl shadow-sm">
          <div className="border-b border-gray-200/50 pb-3 mb-4">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5 uppercase">
              <Heart size={16} className="text-[#FF5FA2]" /> Share G3 Experience
            </h3>
            <p className="text-gray-500 text-[11px] mt-0.5">Approved comments display publicly on homepage community sliders.</p>
          </div>

          {feedbackMsg && (
            <div className={`p-3.5 border rounded-xl text-xs font-semibold mb-4 leading-relaxed ${
              feedbackMsg.includes('Clearance') || feedbackMsg.includes('gorgeous')
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {feedbackMsg}
            </div>
          )}

          {!currentUser ? (
            <div className="text-center py-6 text-xs text-gray-400 space-y-3">
              <User className="text-gray-300 mx-auto" size={32} />
              <p className="font-semibold">Review submissions require an active customer login.</p>
              <button
                onClick={() => onNavigate('login')}
                className="mt-1 text-[#FF5FA2] font-black hover:underline"
              >
                Login to write feedback →
              </button>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs text-left">
              
              <div className="space-y-1">
                <label className="font-bold text-gray-700 uppercase">Target Salon Service / Cosmetic Product</label>
                <select
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 bg-white w-full text-xs text-left cursor-pointer"
                >
                  <option value="G3 Bridal Makeup">G3 Traditional Bridal Makeup</option>
                  <option value="Hair Styling & Braids">Hair Styling & Braids</option>
                  <option value="Aromatherapy Spa">Aromatherapy Spa</option>
                  <option value="Nail Art Studio">Nail Art Studio</option>
                  <option value="Matt Rose Pink Lipstick">Matt Rose Pink Lipstick</option>
                  <option value="Radiance Glow Foundation">Radiance Glow Foundation</option>
                </select>
              </div>

              {/* Star interactive selection */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 uppercase block mb-1">Your Rating Experience</label>
                <div className="flex items-center gap-1.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const ratingValue = i + 1;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRatingInput(ratingValue)}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-all hover:scale-110 cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={
                            ratingValue <= (hoverRating ?? ratingInput)
                              ? 'fill-current text-amber-500'
                              : 'text-gray-300'
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 uppercase">Aesthetic Feedback Comments</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell our community how our artists catered to your timeless style, skin glow results, or product textures..."
                  value={commentsInput}
                  onChange={(e) => setCommentsInput(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus:bg-gray-50/20 w-full text-xs leading-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white font-extrabold tracking-wider uppercase font-mono cursor-pointer hover:shadow transition-shadow flex items-center justify-center gap-1.5"
              >
                <Check size={14} /> Settle community review
              </button>
            </form>
          )}
        </div>

        {/* Right Side: public feed */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest block text-left">Community Ledger ({approvedReviews.length} Active)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {approvedReviews.map((r) => (
              <div key={r.id} className="p-5 border border-[#FFD1E8]/30 rounded-2xl bg-white shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <Star key={idx} size={13} className="fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-light italic">"{r.comments}"</p>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-50 shrink-0">
                  <img src={r.userPhoto} alt={r.userName} className="w-8 h-8 rounded-full border border-gray-100 object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-xs text-[#1a1a1a]">{r.userName}</h4>
                    <span className="text-[9px] text-[#FF5FA2] uppercase tracking-wider font-mono font-bold block mt-0.5">{r.targetName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
