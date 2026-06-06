/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingBag,
  Heart,
  Star,
  Bell,
  Settings,
  LogOut,
  Upload,
  User,
  CreditCard,
  MapPin,
  Smile
} from 'lucide-react';
import { User as UserType, Booking, Order, Product, Review } from '../types';

interface UserDashboardProps {
  currentUser: UserType | null;
  onLogout: () => void;
  bookings: Booking[];
  orders: Order[];
  products: Product[];
  reviews: Review[];
  onTriggerPayment: (bookingId: string) => void;
  onUpdateUser: (updatedUser: UserType) => void;
  setActiveMainTab: (tab: string) => void;
}

export default function UserDashboard({
  currentUser,
  onLogout,
  bookings,
  orders,
  products,
  reviews,
  onTriggerPayment,
  onUpdateUser,
  setActiveMainTab,
}: UserDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'bookings' | 'orders' | 'wishlist' | 'reviews' | 'notifications' | 'profile'>('dashboard');

  // Profile forms state
  const [editingName, setEditingName] = useState(currentUser?.name || '');
  const [editingPhone, setEditingPhone] = useState(currentUser?.phone || '');
  const [profileUrl, setProfileUrl] = useState(currentUser?.photoUrl || '');
  const [customPhotoInput, setCustomPhotoInput] = useState('');
  const [updateFeedback, setUpdateFeedback] = useState('');

  // Local Wishlist simulation from localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const items = localStorage.getItem('g3_wishlist');
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  });

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  const userBookings = bookings.filter(b => b.userId === currentUser?.id);
  const userOrders = orders.filter(o => o.userId === currentUser?.id);
  const userReviews = reviews.filter(r => r.userId === currentUser?.id);

  // Simulated notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Welcome to G3 Aesthetics!', message: 'Thanks for choosing Hawassa G3 Beauty salon. Check out our services page to plan your style!', time: '1 hour ago', read: false },
    { id: 2, title: 'Deposit Verification Process', message: 'Once you book an appointment, submit your Telebirr cash screenshot in the Payments tab to activate your time slots.', time: '2 hours ago', read: true }
  ]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated = {
      ...currentUser,
      name: editingName,
      phone: editingPhone,
      photoUrl: profileUrl || currentUser.photoUrl
    };

    onUpdateUser(updated);
    setUpdateFeedback('Royal Profile updated successfully!');
    setTimeout(() => setUpdateFeedback(''), 3000);
  };

  const handleApplyCustomPhoto = () => {
    if (customPhotoInput) {
      setProfileUrl(customPhotoInput);
      setCustomPhotoInput('');
    }
  };

  return (
    <div id="user-dashboard-wrapper" className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Upper Welcome Header banner */}
      <div className="bg-gradient-to-r from-[#FF5FA2] via-[#9B5DE5] to-[#D4AF37] p-8 rounded-2xl text-white mb-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-x-12 -translate-y-12 shrink-0 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-20 h-20 rounded-full border-4 border-white/70 overflow-hidden shadow-lg bg-zinc-800 shrink-0">
              <img
                src={currentUser?.photoUrl || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150"}
                alt="Profile Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <h1 className="text-2xl font-black">{currentUser?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold tracking-wider flex items-center gap-1">
                  <Heart size={11} className="text-[#FFD1E8] animate-pulse" /> Platinum VIP Gal
                </span>
              </div>
              <p className="text-[#FFD1E8] text-sm mt-1">{currentUser?.email} | {currentUser?.phone}</p>
              <p className="text-xs text-white/80 mt-2 font-mono">Customer Member Since June 2026</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-white/10 px-6 py-4 rounded-xl border border-white/10 shrink-0 text-center sm:text-left">
            <div>
              <p className="text-[10px] text-[#FFD1E8] tracking-widest uppercase font-bold">G3 Glow Points</p>
              <h2 className="text-3xl font-black text-[#D4AF37]">450 XP</h2>
              <p className="text-[10px] text-white/70 mt-1">Glow level: Princess</p>
            </div>
            <div className="w-[1px] h-10 bg-white/20" />
            <div className="text-left">
              <p className="text-xs font-semibold text-white">Loyalty Benefits</p>
              <p className="text-[10px] text-white/80">Claim 15% discount bonus coupon in next Hawassa visit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar navigation control */}
        <div className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-fit">
          <p className="text-[10px] text-gray-400 tracking-wider font-extrabold uppercase px-3 mb-4">Navigations</p>
          <div className="flex flex-wrap lg:flex-col gap-1">
            
            <button
              onClick={() => setActiveSubTab('dashboard')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'dashboard'
                  ? 'bg-[#FF5FA2] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={16} />
              <span className="hidden lg:inline">Status Overview</span>
            </button>

            <button
              onClick={() => setActiveSubTab('bookings')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all relative ${
                activeSubTab === 'bookings'
                  ? 'bg-[#FF5FA2] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CalendarDays size={16} />
              <span className="hidden lg:inline">My Bookings</span>
              {userBookings.length > 0 && (
                <span className={`absolute right-3 top-3.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${activeSubTab === 'bookings' ? 'bg-white text-[#FF5FA2]' : 'bg-[#FF5FA2] text-white'}`}>
                  {userBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('orders')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all relative ${
                activeSubTab === 'orders'
                  ? 'bg-[#FF5FA2] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag size={16} />
              <span className="hidden lg:inline">My Orders</span>
              {userOrders.length > 0 && (
                <span className={`absolute right-3 top-3.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${activeSubTab === 'orders' ? 'bg-white text-[#FF5FA2]' : 'bg-[#9B5DE5] text-white'}`}>
                  {userOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('wishlist')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all relative ${
                activeSubTab === 'wishlist'
                  ? 'bg-[#FF5FA2] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart size={16} />
              <span className="hidden lg:inline">Wishlist Bookmarks</span>
              {wishlistProducts.length > 0 && (
                <span className={`absolute right-3 top-3.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${activeSubTab === 'wishlist' ? 'bg-white text-[#FF5FA2]' : 'bg-pink-500 text-white'}`}>
                  {wishlistProducts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('reviews')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'reviews'
                  ? 'bg-[#FF5FA2] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Star size={16} />
              <span className="hidden lg:inline">My Reviews</span>
            </button>

            <button
              onClick={() => setActiveSubTab('notifications')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all relative ${
                activeSubTab === 'notifications'
                  ? 'bg-[#FF5FA2] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bell size={16} />
              <span className="hidden lg:inline">Notifications Portal</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className={`absolute right-3 top-3.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${activeSubTab === 'notifications' ? 'bg-white text-[#FF5FA2]' : 'bg-red-500 text-white animate-pulse'}`}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('profile')}
              className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'profile'
                  ? 'bg-[#FF5FA2] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings size={16} />
              <span className="hidden lg:inline">Profile Settings</span>
            </button>

            <button
              onClick={onLogout}
              className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden lg:inline font-bold">Logout</span>
            </button>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          
          {/* Sub TAB 1: DASHBOARD OVERVIEW */}
          {activeSubTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">VIP Dashboard</h2>
                <p className="text-gray-500 text-xs mt-1">Instant summary of your aesthetic journey and product logistics.</p>
              </div>

              {/* Bento cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#FFD1E8]/30 border border-[#FFD1E8]/60 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase text-gray-700">Upcoming Appointments</span>
                    <CalendarDays className="text-[#FF5FA2]" size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {userBookings.filter(b => b.status === 'confirmed').length} Active
                  </h3>
                  <button
                    onClick={() => setActiveSubTab('bookings')}
                    className="text-xs font-bold text-[#FF5FA2] mt-3 block hover:underline"
                  >
                    View booking logs →
                  </button>
                </div>

                <div className="bg-[#9B5DE5]/5 border border-[#9B5DE5]/20 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase text-gray-700">Cosmetic Orders</span>
                    <ShoppingBag className="text-[#9B5DE5]" size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {userOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length} Transit
                  </h3>
                  <button
                    onClick={() => setActiveSubTab('orders')}
                    className="text-xs font-bold text-[#9B5DE5] mt-3 block hover:underline"
                  >
                    Track dispatch progress →
                  </button>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl md:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase text-gray-700">Wishlist Loved</span>
                    <Heart className="text-pink-500" size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">{wishlistProducts.length} Products</h3>
                  <button
                    onClick={() => setActiveSubTab('wishlist')}
                    className="text-xs font-bold text-amber-700 mt-3 block hover:underline"
                  >
                    Manage shopping bag →
                  </button>
                </div>
              </div>

              {/* Recent activity timeline */}
              <div className="mt-8 space-y-4">
                <h3 className="text-sm uppercase tracking-wide text-gray-400 font-extrabold flex items-center gap-1">
                  <Bell size={14} /> Quick Notifications
                </h3>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex gap-3.5 items-start">
                      {!n.read ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5FA2] shrink-0 mt-1.5" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0 mt-1.5" />
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{n.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-gray-400 block mt-1.5">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sub TAB 2: BOOKINGS LIST */}
          {activeSubTab === 'bookings' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <CalendarDays className="text-[#FF5FA2]" /> My Appointment Bookings
                </h2>
                <p className="text-gray-500 text-xs mt-1">Real-time schedule calendar verified by our Hawassa management board.</p>
              </div>

              {userBookings.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Smile className="mx-auto text-gray-300 mb-2.5" size={40} />
                  <p className="text-sm font-semibold">No booking coordinates recorded.</p>
                  <p className="text-xs mt-1">Schedule a magnificent makeup session or hair styling appointment today!</p>
                  <button
                    onClick={() => setActiveMainTab('booking')}
                    className="mt-4 px-4.5 py-2 text-xs font-bold rounded-lg bg-[#FF5FA2] text-white hover:opacity-90"
                  >
                    Plan Booking Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map((b) => (
                    <div key={b.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow relative">
                      {/* Top indicator icons */}
                      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-50 pb-3 mb-3">
                        <div>
                          <h3 className="font-extrabold text-sm text-gray-900">{b.serviceName}</h3>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                            <span>📅 {b.date}</span>
                            <span>⏱️ {b.time}</span>
                            <span>({b.duration})</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold ${
                            b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            b.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            b.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {b.status}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold ${
                            b.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                            b.paymentStatus === 'pending_verification' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {b.paymentStatus === 'unpaid' ? 'unpaid' : b.paymentStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Summary details */}
                      <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-3 rounded-lg">
                        <p><strong>Customer Name:</strong> {b.userName}</p>
                        <p><strong>Phone:</strong> {b.userPhone}</p>
                        <p><strong>Amount Due:</strong> <strong className="text-gray-900">{b.priceEtb} ETB</strong></p>
                        {b.notes && <p><strong>Notes:</strong> "{b.notes}"</p>}
                        {b.transactionId && <p className="font-mono text-[11px] text-gray-400">Transaction Ref: {b.transactionId}</p>}
                      </div>

                      {/* Payment Action block if Unpaid */}
                      {b.paymentStatus === 'unpaid' && (
                        <div className="mt-3.5 flex items-center justify-end gap-2 text-right">
                          <span className="text-[11px] text-gray-500">Pay securely via Telebirr or Bank transfer:</span>
                          <button
                            onClick={() => onTriggerPayment(b.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white text-[11px] font-extrabold hover:shadow transition-shadow flex items-center gap-1 cursor-pointer"
                          >
                            <CreditCard size={12} /> Confirm & Upload Receipt
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub TAB 3: ORDER HISTORY */}
          {activeSubTab === 'orders' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <ShoppingBag className="text-[#9B5DE5]" /> My Cosmetic Orders
                </h2>
                <p className="text-gray-500 text-xs mt-1">E-commerce checkout transactions history and dispatch monitoring.</p>
              </div>

              {userOrders.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <ShoppingBag className="mx-auto text-gray-300 mb-2.5" size={40} />
                  <p className="text-sm font-semibold">No order logs registered.</p>
                  <p className="text-xs mt-1">Shop our elite collection of Lipsticks, Face Creams, and Accessories.</p>
                  <button
                    onClick={() => setActiveMainTab('shop')}
                    className="mt-4 px-4.5 py-2 text-xs font-bold rounded-lg bg-[#9B5DE5] text-white hover:opacity-90"
                  >
                    Go Shop Now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((o) => (
                    <div key={o.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm">
                      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-gray-100 pb-3 mb-3">
                        <div>
                          <p className="text-xs font-mono font-bold text-gray-500 uppercase">Order ID: {o.id}</p>
                          <span className="text-[11px] text-gray-400 block mt-1">Purchased on {o.createdAt.split('T')[0]}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-[#9B5DE5]/10 text-[#9B5DE5] border border-[#9B5DE5]/20">
                            {o.status}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            o.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="space-y-2 mb-4">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded border border-gray-100 overflow-hidden shrink-0">
                              <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-xs">
                              <h4 className="font-bold text-gray-900">{item.name}</h4>
                              <p className="text-gray-500">Qty: {item.quantity} | {item.priceEtb} ETB (${item.priceUsdt} USDT)</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Pricing details */}
                      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-xs">
                        <div>
                          <p className="text-gray-500">Shipping Info: <strong>{o.address}</strong></p>
                          <p className="text-gray-400 text-[10px] mt-0.5">Payment Method: {o.paymentMethod.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-[11px]">Grand Total</p>
                          <p className="font-extrabold text-[#FF5FA2] text-sm">{o.totalEtb} ETB</p>
                          <p className="font-mono text-[10px] text-gray-400">${o.totalUsdt} USDT</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub TAB 4: WISHLIST BOOKMARKS */}
          {activeSubTab === 'wishlist' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <Heart className="text-pink-500 animate-pulse" /> Wishlist Bookmarks
                </h2>
                <p className="text-gray-500 text-xs mt-1">Cosmetic materials you bookmarked for later luxury purchasing.</p>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Heart className="mx-auto text-gray-300 mb-2.5" size={40} />
                  <p className="text-sm font-semibold">Your Wishlist is currently empty.</p>
                  <p className="text-xs">Explore G3 Cosmetics store catalogue and tap the heart icon on cards.</p>
                  <button
                    onClick={() => setActiveMainTab('shop')}
                    className="mt-4 px-4 py-2 text-xs font-bold rounded-lg bg-pink-500 text-white"
                  >
                    Browse Boutique
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="border border-gray-100 rounded-xl p-4 flex gap-4 hover:shadow-xs">
                      <div className="w-16 h-16 rounded overflow-hidden border border-gray-100 shrink-0 bg-zinc-50">
                        <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-xs">
                        <h3 className="font-bold text-gray-900">{p.name}</h3>
                        <p className="text-gray-400 uppercase text-[10px] tracking-wide mt-0.5">{p.category.replace('_', ' ')}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="font-extrabold text-gray-900">{p.priceEtb} ETB</span>
                          <span className="text-gray-400 font-mono text-[11px]">${p.priceUsdt} USDT</span>
                        </div>
                        <button
                          onClick={() => setActiveMainTab('shop')}
                          className="mt-2 text-[10px] font-bold text-[#FF5FA2] hover:underline"
                        >
                          Shop and add to cart →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub TAB 5: MY REVIEWS SUMMARY */}
          {activeSubTab === 'reviews' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <Star className="text-amber-500 fill-amber-500" /> My Reviews & Feedback
                </h2>
                <p className="text-gray-500 text-xs mt-1">Review items you shared to help of G3 beautiful communities.</p>
              </div>

              {userReviews.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Star className="mx-auto text-gray-300 mb-2.5" size={40} />
                  <p className="text-sm font-semibold">No feedback submitted yet.</p>
                  <p className="text-xs">Post a review about our salon or checkout products on the Reviews page.</p>
                  <button
                    onClick={() => setActiveMainTab('reviews')}
                    className="mt-4 px-4.5 py-2 text-xs font-bold rounded-lg bg-[#FF5FA2] text-white"
                  >
                    Submit Feedback
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userReviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900">{r.targetName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 mb-2">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 italic">"{r.comments}"</p>
                      <span className="text-[10px] text-gray-400 block mt-2">{r.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub TAB 6: NOTIFICATIONS PORTAL */}
          {activeSubTab === 'notifications' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                    <Bell className="text-[#FF5FA2]" /> Messages & Updates
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">Direct announcements and scheduling status confirmations.</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  className="text-xs text-gray-500 hover:text-[#FF5FA2] font-semibold"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 rounded-xl border transition-all ${!n.read ? 'bg-pink-50/20 border-[#FF5FA2]/30' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5">
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2]" />}
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-gray-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub TAB 7: PROFILE SETTINGS */}
          {activeSubTab === 'profile' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  <Settings className="text-gray-500" /> Account Settings
                </h2>
                <p className="text-gray-500 text-xs mt-1">Configure your personal G3 identity and cosmetic customer avatar coordinates.</p>
              </div>

              {updateFeedback && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs font-semibold mb-6">
                  {updateFeedback}
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-6 max-w-lg">
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-gray-50 pb-6 mb-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    <img src={profileUrl || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150"} alt="Avatar preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs font-extrabold text-gray-700 uppercase">Change Avatar Photo</p>
                    <input
                      type="url"
                      placeholder="Paste image HTTPS link..."
                      value={customPhotoInput}
                      onChange={(e) => setCustomPhotoInput(e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1.5 w-full max-w-sm text-gray-700 bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomPhoto}
                      className="px-3.5 py-1.5 rounded bg-[#FF5FA2] text-white text-[11px] font-bold md:ml-2 hover:opacity-90 inline-block cursor-pointer"
                    >
                      Apply Link
                    </button>
                    <span className="block text-[10px] text-gray-400 mt-1">Accepts any secure high-res web address</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      required
                      className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={editingPhone}
                      onChange={(e) => setEditingPhone(e.target.value)}
                      required
                      className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Registered Email (Immutable)</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full text-xs bg-gray-50 text-gray-400 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white font-bold text-xs hover:shadow transition-shadow cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
