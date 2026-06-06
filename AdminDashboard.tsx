/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Crown,
  TrendingUp,
  Briefcase,
  Users,
  CreditCard,
  MessageSquare,
  FileText,
  Image,
  Home,
  Bot,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Edit,
  DollarSign,
  Calendar,
  Lock,
  Search,
  ShoppingCart
} from 'lucide-react';
import { User, Booking, Order, Product, Review, NewsPost, GalleryItem } from '../types';

interface AdminDashboardProps {
  currentUser: User | null;
  users: User[];
  services: any[];
  products: Product[];
  bookings: Booking[];
  orders: Order[];
  reviews: Review[];
  news: NewsPost[];
  gallery: GalleryItem[];
  homepageSettings: any;
  onUpdateBookingStatus: (bookingId: string, status: any, paymentStatus: any, txId?: string) => void;
  onUpdateOrderStatus: (orderId: string, status: any, paymentStatus: any) => void;
  onModerateReview: (reviewId: string, status: 'approved' | 'rejected') => void;
  onAddProduct: (product: any) => void;
  onAddService: (service: any) => void;
  onAddNews: (post: any) => void;
  onAddGallery: (item: any) => void;
  onUpdateHomepage: (settings: any) => void;
}

export default function AdminDashboard({
  currentUser,
  users,
  services,
  products,
  bookings,
  orders,
  reviews,
  news,
  gallery,
  homepageSettings,
  onUpdateBookingStatus,
  onUpdateOrderStatus,
  onModerateReview,
  onAddProduct,
  onAddService,
  onAddNews,
  onAddGallery,
  onUpdateHomepage,
}: AdminDashboardProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'bookings' | 'orders' | 'products' | 'services' | 'reviews' | 'news' | 'gallery' | 'homepage'>('analytics');

  // AI executive insights states
  const [executiveReport, setExecutiveReport] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);

  // New product schema form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState<any>('makeup_kits');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdEtb, setNewProdEtb] = useState(1200);
  const [newProdUsdt, setNewProdUsdt] = useState(10);
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdImg, setNewProdImg] = useState('');
  const [prodFeedback, setProdFeedback] = useState('');

  // New service schema form
  const [newSName, setNewSName] = useState('');
  const [newSDesc, setNewSDesc] = useState('');
  const [newSEtb, setNewSEtb] = useState(3000);
  const [newSDur, setNewSDur] = useState('1.5 Hours');
  const [newSImg, setNewSImg] = useState('');
  const [srvFeedback, setSrvFeedback] = useState('');

  // New news article
  const [customNewsTitle, setCustomNewsTitle] = useState('');
  const [customNewsCat, setCustomNewsCat] = useState<any>('tips');
  const [customNewsBlurb, setCustomNewsBlurb] = useState('');
  const [customNewsContent, setCustomNewsContent] = useState('');
  const [newsFeedback, setNewsFeedback] = useState('');

  // New gallery item
  const [customGalTitle, setCustomGalTitle] = useState('');
  const [customGalCat, setCustomGalCat] = useState('salon');
  const [customGalImg, setCustomGalImg] = useState('');
  const [galFeedback, setGalFeedback] = useState('');

  // Customize homepage forms
  const [editedHeadline, setEditedHeadline] = useState(homepageSettings?.headline || 'Beauty, Confidence & Elegance');
  const [editedSlogan, setEditedSlogan] = useState(homepageSettings?.slogan || '');
  const [homeCtaBook, setHomeCtaBook] = useState(homepageSettings?.buttonBookText || 'Book Appointment');
  const [homeCtaShop, setHomeCtaShop] = useState(homepageSettings?.buttonShopText || 'Shop Products');
  const [editedWelcome, setEditedWelcome] = useState(homepageSettings?.welcomeBanner || '');
  const [homeFeedback, setHomeFeedback] = useState('');

  // Search parameters filter
  const [searchTerm, setSearchTerm] = useState('');

  // Sales totals
  const totalBookingsPaid = bookings.filter(b => b.paymentStatus === 'paid').reduce((acc, b) => acc + b.priceEtb, 0);
  const totalOrdersPaid = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalEtb, 0);
  const totalSalesEtb = totalBookingsPaid + totalOrdersPaid;

  const totalBookingsPaidUsdt = bookings.filter(b => b.paymentStatus === 'paid' && b.paymentMethod === 'usdt').reduce((acc, b) => acc + Math.round(b.priceEtb / 120), 0);
  const totalOrdersPaidUsdt = orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalUsdt, 0);
  const totalSalesUsdt = totalBookingsPaidUsdt + totalOrdersPaidUsdt;

  const pendingConfirmationBookings = bookings.filter(b => b.status === 'pending');
  const pendingVerificationPayments = bookings.filter(b => b.paymentStatus === 'pending_verification').length + orders.filter(o => o.paymentStatus === 'pending_verification').length;

  const fetchAIExecutiveReport = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch('/api/gemini/admin-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser?.email })
      });
      const data = await res.json();
      setExecutiveReport(data.text);
    } catch {
      setExecutiveReport("Heuristic business backup logs: Focus on marketing the Bridal packages during summer.");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    onAddProduct({
      name: newProdName,
      category: newProdCat,
      description: newProdDesc,
      priceEtb: Number(newProdEtb),
      priceUsdt: Number(newProdUsdt),
      stock: Number(newProdStock),
      image: newProdImg || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
    });

    setNewProdName('');
    setNewProdDesc('');
    setNewProdImg('');
    setProdFeedback('Cosmetics product registered successfully in store registry! 💄');
    setTimeout(() => setProdFeedback(''), 3000);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSName) return;

    onAddService({
      name: newSName,
      description: newSDesc,
      priceEtb: Number(newSEtb),
      duration: newSDur,
      image: newSImg || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800'
    });

    setNewSName('');
    setNewSDesc('');
    setNewSImg('');
    setSrvFeedback('New luxurious salon service published in bookings grid! 📅');
    setTimeout(() => setSrvFeedback(''), 3000);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNewsTitle || !customNewsContent) return;

    onAddNews({
      title: customNewsTitle,
      category: customNewsCat,
      blurb: customNewsBlurb,
      content: customNewsContent,
      author: 'G3 Luxury Board',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'
    });

    setCustomNewsTitle('');
    setCustomNewsBlurb('');
    setCustomNewsContent('');
    setNewsFeedback('News tip or announcement article published! 🗞️');
    setTimeout(() => setNewsFeedback(''), 3000);
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGalImg) return;

    onAddGallery({
      title: customGalTitle || 'Aesthetic Highlight',
      image: customGalImg,
      category: customGalCat
    });

    setCustomGalTitle('');
    setCustomGalImg('');
    setGalFeedback('Visual beauty asset uploaded successfully to gallery! 📸');
    setTimeout(() => setGalFeedback(''), 3000);
  };

  const handleHomepageSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateHomepage({
      headline: editedHeadline,
      slogan: editedSlogan,
      buttonBookText: homeCtaBook,
      buttonShopText: homeCtaShop,
      welcomeBanner: editedWelcome
    });
    setHomeFeedback('Homepage custom settings saved and live updated successfully! 🌐');
    setTimeout(() => setHomeFeedback(''), 3000);
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Admin Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-900 text-white p-6 rounded-2xl mb-8 border border-amber-500/30 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/40 animate-pulse">
            <Crown size={26} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-widest flex items-center gap-1.5 uppercase">
              G3 Admin Suite <span className="text-amber-500 text-sm font-mono tracking-normal text-right">v2.5</span>
            </h1>
            <p className="text-xs text-amber-500 font-mono">BOSSMED SYSTEM: {currentUser?.name} | Hawassa Authority Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-zinc-800 px-4 py-2 rounded-xl text-gray-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping" />
          <span>Server Terminal Secure</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm h-fit shrink-0">
          <p className="text-[10px] text-gray-400 font-extrabold tracking-widest uppercase px-3 mb-4">Board Modules</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
            
            <button
              onClick={() => setActiveAdminTab('analytics')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeAdminTab === 'analytics' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={16} />
              <span>Metrics & Board AI</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('bookings')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all relative ${
                activeAdminTab === 'bookings' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <Calendar size={16} />
              <span>Bookings Manager</span>
              {pendingConfirmationBookings.length > 0 && (
                <span className={`absolute right-3 top-3.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${activeAdminTab === 'bookings' ? 'bg-white text-amber-700' : 'bg-rose-500 text-white animate-pulse'}`}>
                  {pendingConfirmationBookings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminTab('orders')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all relative ${
                activeAdminTab === 'orders' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart size={16} />
              <span>Orders Dispatch</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('products')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeAdminTab === 'products' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <DollarSign size={16} />
              <span>Products Catalog</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('services')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeAdminTab === 'services' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <Briefcase size={16} />
              <span>Salon Services</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('reviews')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeAdminTab === 'reviews' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare size={16} />
              <span>Reviews Mod</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('news')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeAdminTab === 'news' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <FileText size={16} />
              <span>Blog tips Publisher</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('gallery')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeAdminTab === 'gallery' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <Image size={16} />
              <span>G3 Gallery Grid</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('homepage')}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                activeAdminTab === 'homepage' ? 'bg-amber-500 text-white shadow-xs' : 'text-zinc-700 hover:bg-gray-50'
              }`}
            >
              <Home size={16} />
              <span>Website Customizer</span>
            </button>
          </div>
        </div>

        {/* Content Container Area */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* TAB 1: ANALYTICS & BOARD ASSISTANT */}
          {activeAdminTab === 'analytics' && (
            <div className="space-y-8">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-start flex-col sm:flex-row gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Executive Management KPIs</h2>
                  <p className="text-gray-500 text-xs mt-1">Combined revenues of G3 Hawassa branch checkout sales & appointment sessions.</p>
                </div>
                <button
                  onClick={fetchAIExecutiveReport}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-[#1a1a1a] rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:shadow transition-shadow uppercase font-mono cursor-pointer"
                >
                  <Bot size={16} /> {loadingReport ? 'Consulting board AI...' : 'Request AI Executive Report'}
                </button>
              </div>

              {/* STATS KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-50 border border-zinc-100 p-4.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">TOTAL REVENUE (ETB)</span>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1">{totalSalesEtb} ETB</h3>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-1">💹 Verfied Bookings + Sales</span>
                </div>

                <div className="bg-zinc-50 border border-zinc-100 p-4.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">CRYPTO REVENUE (USDT)</span>
                  <h3 className="text-xl md:text-2xl font-black text-[#9B5DE5] mt-1">${totalSalesUsdt} USDT</h3>
                  <span className="text-[10px] text-gray-400 block mt-1">On-chain receipts</span>
                </div>

                <div className="bg-zinc-50 border border-zinc-100 p-4.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">ACTIVE APPOINTMENTS</span>
                  <h3 className="text-xl md:text-2xl font-black text-amber-600 mt-1">{bookings.length} slots</h3>
                  <span className="text-[10px] text-amber-600 font-semibold block mt-1">{pendingConfirmationBookings.length} awaiting verify</span>
                </div>

                <div className="bg-zinc-50 border border-zinc-100 p-4.5 rounded-xl text-center">
                  <span className="text-[10px] text-gray-400 font-extrabold tracking-wide uppercase">GLOW CUSTOMERS</span>
                  <h3 className="text-xl md:text-2xl font-black text-gray-950 mt-1">{users.length} users</h3>
                  <span className="text-[10px] text-gray-400 block mt-1">Unique registries</span>
                </div>
              </div>

              {/* AI Report presentation block */}
              {executiveReport && (
                <div className="bg-[#2D1624] text-white p-6 rounded-2xl border border-amber-500/20 shadow-lg relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-amber-500/25 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] tracking-widest uppercase font-mono">
                    <Bot size={12} /> Executive Counsel
                  </div>
                  <h3 className="font-extrabold text-[#D4AF37] text-sm uppercase tracking-wide border-b border-white/10 pb-2 mb-4 flex items-center gap-1.5">
                    <Crown size={16} /> G3 Board Strategic Insights
                  </h3>
                  <div className="text-xs space-y-2 leading-relaxed whitespace-pre-line text-rose-100">
                    {executiveReport}
                  </div>
                </div>
              )}

              {/* Transactions list split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <h3 className="text-xs font-extrabold tracking-wider uppercase text-gray-400 mb-3 block">User Accounts List</h3>
                  <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50 max-h-[220px] overflow-y-auto">
                    {users.map((u) => (
                      <div key={u.id} className="p-3 bg-gray-50 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <img src={u.photoUrl} alt="User Avatar" className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
                          <div>
                            <p className="font-bold text-gray-900">{u.name}</p>
                            <p className="text-[10px] text-gray-500">{u.email}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[#D4AF37] font-mono text-[9px] uppercase">{u.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold tracking-wider uppercase text-gray-400 mb-3 block">Revenues Sources Breakdown</h3>
                  <div className="space-y-2 bg-gray-50 p-4 border border-gray-100 rounded-xl text-xs">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Verified Hair/Makeup Bookings Yield:</span>
                      <strong className="text-gray-900 font-extrabold">{totalBookingsPaid} ETB</strong>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Verified Cosmetics Checkout Sales:</span>
                      <strong className="text-[#9B5DE5] font-extrabold">{totalOrdersPaid} ETB</strong>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span>Pending Receipts in Verification Queue:</span>
                      <strong className="text-amber-600 font-extrabold font-mono">{pendingVerificationPayments} transactions</strong>
                    </div>
                    <div className="flex justify-between items-center text-sm font-extrabold pt-2 text-[#FF5FA2]">
                      <span className="uppercase">Combined Gross Earnings:</span>
                      <span>{totalSalesEtb} ETB (${totalSalesUsdt} USDT)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS SCHEDULER MANAGER */}
          {activeAdminTab === 'bookings' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">Manage Appointment Bookings</h2>
                <p className="text-gray-500 text-xs mt-1">Review, approve, reschedule or reject client reservations.</p>
              </div>

              {bookings.length === 0 ? (
                <p className="py-6 text-center text-gray-400 text-sm">No bookings scheduled by customers.</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="border border-gray-1000 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs relative hover:shadow-xs transition-shadow">
                      <div className="flex justify-between flex-wrap gap-2 mb-3 pb-3 border-b border-gray-200/50">
                        <div>
                          <span className="font-mono text-gray-400">Time: {b.time} on {b.date}</span>
                          <h4 className="font-black text-sm text-[#FF5FA2] mt-0.5">{b.serviceName}</h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase font-mono font-bold text-[9px]">Status: {b.status}</span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase font-mono font-bold text-[9px]">Pay: {b.paymentStatus}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3 rounded-xl mb-4">
                        <div className="space-y-1">
                          <p><strong>Customer Name:</strong> {b.userName}</p>
                          <p><strong>Phone Number:</strong> {b.userPhone}</p>
                          <p><strong>Notes:</strong> {b.notes || '"No special requirements"'}</p>
                        </div>
                        <div className="space-y-1">
                          <p><strong>Service Price:</strong> {b.priceEtb} ETB</p>
                          {b.transactionId && <p><strong>Receipt Trans Ref:</strong> <span className="font-mono text-amber-700">{b.transactionId}</span></p>}
                          {b.receiptUrl && (
                            <a href={b.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-sky-500 font-bold hover:underline block truncate">
                              🖼️ View Submitted Screenshot Invoice
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex justify-end gap-2">
                        {b.status !== 'confirmed' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'confirmed', b.paymentStatus === 'unpaid' ? 'paid' : b.paymentStatus)}
                            className="bg-emerald-600 text-white rounded px-3 py-1.5 font-bold hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle size={12} /> Approve Schedule
                          </button>
                        )}
                        {b.status !== 'completed' && b.status === 'confirmed' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'completed', 'paid')}
                            className="bg-indigo-600 text-white rounded px-3 py-1.5 font-bold hover:bg-indigo-700 cursor-pointer flex items-center gap-1"
                          >
                            Mark Completed
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'cancelled', b.paymentStatus)}
                            className="bg-red-50 text-red-600 border border-red-200 rounded px-3 py-1.5 font-bold hover:bg-red-100 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDER CHECKOUT DISPATCH */}
          {activeAdminTab === 'orders' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">Products Order Logistics</h2>
                <p className="text-gray-500 text-xs mt-1">Review cosmetic shopping bag shipments and transit routes.</p>
              </div>

              {orders.length === 0 ? (
                <p className="py-6 text-center text-gray-400 text-sm">No active product checkouts placed.</p>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <div key={o.id} className="border border-gray-100 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-3 flex-wrap">
                        <div>
                          <span className="font-mono text-gray-400">Order ID: {o.id}</span>
                          <p className="font-semibold text-gray-500">Shipping To: {o.address}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold uppercase">{o.status}</span>
                          <span className={`px-2.5 py-0.5 rounded font-bold uppercase ${o.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
                            {o.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items loop summary */}
                      <div className="bg-white p-3 rounded-lg mb-4 space-y-1 flex flex-col">
                        <strong className="text-[11px] uppercase tracking-wide text-gray-400 block mb-1">Products Package:</strong>
                        {o.items.map((it: any, ind: number) => (
                          <div key={ind} className="flex justify-between items-center text-gray-700">
                            <span>{it.name} (QTY: {it.quantity})</span>
                            <span className="font-mono">{it.priceEtb * it.quantity} ETB</span>
                          </div>
                        ))}
                        <div className="border-t border-gray-100 pt-2 flex justify-between font-extrabold text-[#FF5FA2]">
                          <span>Invoice Total:</span>
                          <span>{o.totalEtb} ETB (${o.totalUsdt} USDT)</span>
                        </div>
                      </div>

                      {/* Logistics Actions */}
                      <div className="flex justify-end gap-2">
                        {o.status === 'pending' && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, 'processing', o.paymentStatus === 'unpaid' ? 'paid' : o.paymentStatus)}
                            className="bg-emerald-600 text-white rounded px-3 py-1.5 font-bold cursor-pointer"
                          >
                            Mark Processing (Paid)
                          </button>
                        )}
                        {o.status === 'processing' && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, 'shipped', 'paid')}
                            className="bg-sky-600 text-white rounded px-3 py-1.5 font-bold cursor-pointer"
                          >
                            Ship Package
                          </button>
                        )}
                        {o.status === 'shipped' && (
                          <button
                            onClick={() => onUpdateOrderStatus(o.id, 'delivered', 'paid')}
                            className="bg-indigo-600 text-white rounded px-3 py-1.5 font-bold cursor-pointer"
                          >
                            Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SHOP PRODUCTS INVENTORY CATALOG */}
          {activeAdminTab === 'products' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">Cosmetics Inventory Catalog</h2>
                  <p className="text-gray-500 text-xs mt-1">Add, update stock, and revise cosmetics pricing levels.</p>
                </div>
              </div>

              {prodFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                  {prodFeedback}
                </div>
              )}

              {/* Form addition */}
              <form onSubmit={handleProductSubmit} className="bg-gray-50 p-5 rounded-2xl space-y-4 text-xs border border-gray-100">
                <span className="font-extrabold uppercase tracking-widest text-[#FF5FA2] block">Register New Cosmetic Item</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Product Title</label>
                    <input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} required placeholder="Matte Lipstick, Hydra Gel etc" className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Category Tag</label>
                    <select value={newProdCat} onChange={(e: any) => setNewProdCat(e.target.value)} className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full">
                      <option value="makeup_kits">Makeup Kits</option>
                      <option value="lipsticks">Lipsticks</option>
                      <option value="foundations">Foundations</option>
                      <option value="face_creams">Face Creams</option>
                      <option value="hair_products">Hair Products</option>
                      <option value="perfumes">Perfumes</option>
                      <option value="accessories">Beauty Accessories</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Image HTTPS Link</label>
                    <input type="text" value={newProdImg} onChange={(e) => setNewProdImg(e.target.value)} placeholder="https://..." className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Price in ETB</label>
                    <input type="number" value={newProdEtb} onChange={(e) => setNewProdEtb(Number(e.target.value))} required className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Price in USDT ($)</label>
                    <input type="number" value={newProdUsdt} onChange={(e) => setNewProdUsdt(Number(e.target.value))} required className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Initial Stock Units</label>
                    <input type="number" value={newProdStock} onChange={(e) => setNewProdStock(Number(e.target.value))} required className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                  <div className="pt-5">
                    <button type="submit" className="w-full bg-[#FF5FA2] text-white rounded py-2 font-bold cursor-pointer hover:opacity-90">
                      Add Product
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Short Description</label>
                  <textarea rows={2} value={newProdDesc} onChange={(e) => setNewProdDesc(e.target.value)} placeholder="Explain performance, formula highlights..." className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                </div>
              </form>

              {/* Products list visual */}
              <div className="border border-gray-50 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-[350px] overflow-y-auto">
                {products.map((p) => (
                  <div key={p.id} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="product" className="w-10 h-10 object-cover rounded border border-gray-100 shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-bold text-gray-900">{p.name}</h4>
                        <span className="text-[9px] text-[#9B5DE5] uppercase font-bold tracking-wide">{p.category.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <strong className="text-gray-900 block">{p.priceEtb} ETB (${p.priceUsdt} USDT)</strong>
                      <span className={`text-[10px] ${p.stock < 5 ? 'text-rose-500 font-bold' : 'text-gray-400'}`}>Stock: {p.stock} units</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SALON SERVICES CONFIG */}
          {activeAdminTab === 'services' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-extrabold text-gray-900">Offered Salon Services Grid</h2>
                <p className="text-gray-500 text-xs mt-1">Configure luxury appointment catalog items.</p>
              </div>

              {srvFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                  {srvFeedback}
                </div>
              )}

              <form onSubmit={handleServiceSubmit} className="bg-gray-50 p-5 rounded-2xl space-y-4 text-xs border border-gray-100">
                <span className="font-extrabold uppercase tracking-widest text-[#9B5DE5] block">Publish New Service Offering</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Service Category Title</label>
                    <input type="text" value={newSName} onChange={(e) => setNewSName(e.target.value)} required placeholder="Gold Facial, Lash Lifting..." className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Duration Tag</label>
                    <input type="text" value={newSDur} onChange={(e) => setNewSDur(e.target.value)} required placeholder="1.5 Hours, 45 Minutes" className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Price in ETB</label>
                    <input type="number" value={newSEtb} onChange={(e) => setNewSEtb(Number(e.target.value))} required className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="font-bold text-gray-700">Model Image HTTPS Link</label>
                    <input type="text" value={newSImg} onChange={(e) => setNewSImg(e.target.value)} placeholder="https://..." className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Detailed Description</label>
                  <textarea rows={2} value={newSDesc} onChange={(e) => setNewSDesc(e.target.value)} placeholder="Specify premium botanical cream, golden masks, etc..." className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                </div>

                <button type="submit" className="px-5 py-2.5 rounded bg-[#9B5DE5] text-white font-bold cursor-pointer hover:opacity-90">
                  Publish offering
                </button>
              </form>

              {/* Show active list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((s) => (
                  <div key={s.id} className="p-4 border border-gray-100 rounded-xl flex gap-3 text-xs items-center bg-zinc-50">
                    <img src={s.image} alt={s.name} className="w-12 h-12 object-cover rounded border shrink-0" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-black text-gray-950">{s.name}</h4>
                      <p className="text-gray-400 mt-0.5">{s.duration} | <strong className="text-emerald-700">{s.priceEtb} ETB</strong></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS MODERATION */}
          {activeAdminTab === 'reviews' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">Reviews & Moderation Center</h2>
                <p className="text-gray-500 text-xs mt-1">Approve or Reject review statements before they become visible public.</p>
              </div>

              {reviews.length === 0 ? (
                <p className="py-6 text-center text-gray-400 text-sm">No reviews found.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl border border-gray-100 hover:shadow-xs text-xs space-y-2">
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <div>
                          <strong className="text-gray-900 block">{r.userName} ({r.targetName})</strong>
                          <span className="text-[10px] text-gray-400">Written on {r.date}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          r.status === 'approved' ? 'bg-green-100 text-green-800' :
                          r.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>
                      </div>

                      <p className="text-gray-600 italic">"{r.comments}"</p>

                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                        {r.status !== 'approved' && (
                          <button
                            onClick={() => onModerateReview(r.id, 'approved')}
                            className="px-3 py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => onModerateReview(r.id, 'rejected')}
                            className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BLOG NEWS TIPS PUBLISHER */}
          {activeAdminTab === 'news' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-extrabold text-gray-900">Beauty tips & News Publisher</h2>
                <p className="text-gray-500 text-xs mt-1">Publish updates, announcements or skincare guides for G3 clients.</p>
              </div>

              {newsFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                  {newsFeedback}
                </div>
              )}

              <form onSubmit={handleNewsSubmit} className="bg-gray-50 p-5 rounded-2xl space-y-4 text-xs border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Article Headline Title</label>
                    <input type="text" value={customNewsTitle} onChange={(e) => setCustomNewsTitle(e.target.value)} required placeholder="Winter skincare guides, bridal announcements" className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">News Type tag</label>
                    <select value={customNewsCat} onChange={(e: any) => setCustomNewsCat(e.target.value)} className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full">
                      <option value="tips">Beauty Tips</option>
                      <option value="promotions">Promotions Coupon</option>
                      <option value="announcements">Direct Announcements</option>
                      <option value="updates">Hawassa Branch Updates</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Short Blurb</label>
                  <input type="text" value={customNewsBlurb} onChange={(e) => setCustomNewsBlurb(e.target.value)} placeholder="Catchy subtitle introductory blurb snippet" className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Full Content Text</label>
                  <textarea rows={5} value={customNewsContent} onChange={(e) => setCustomNewsContent(e.target.value)} required placeholder="Provide deep structural bullet points, cosmetic tips, or promotional discount codes..." className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                </div>

                <button type="submit" className="px-5 py-2.5 rounded bg-amber-500 text-zinc-950 font-extrabold cursor-pointer hover:opacity-90">
                  Publish news post
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: GALLERY PHOTO GRID */}
          {activeAdminTab === 'gallery' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h2 className="text-xl font-extrabold text-gray-900">Elegance Gallery Assets</h2>
                <p className="text-gray-500 text-xs mt-1">Coordinate visual photo registries highlighted under About page.</p>
              </div>

              {galFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold">
                  {galFeedback}
                </div>
              )}

              <form onSubmit={handleGallerySubmit} className="bg-gray-50 p-5 rounded-2xl space-y-4 text-xs border border-gray-100 max-w-lg">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Asset Title</label>
                  <input type="text" value={customGalTitle} onChange={(e) => setCustomGalTitle(e.target.value)} placeholder="Gold Nails portrait" className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Category Filter</label>
                    <input type="text" value={customGalCat} onChange={(e) => setCustomGalCat(e.target.value)} placeholder="nails, skincare, bridal" className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700">Image HTTPS Link</label>
                    <input type="text" value={customGalImg} onChange={(e) => setCustomGalImg(e.target.value)} required placeholder="https://..." className="border border-gray-200 rounded px-2 py-1.5 bg-white w-full" />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-zinc-950 text-white rounded font-bold cursor-pointer">
                  Upload highlight
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t pt-4">
                {gallery.map((it) => (
                  <div key={it.id} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 shrink-0">
                    <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-[10px]">
                      <span>{it.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: HOMEPAGE CUSTOMIZER SETTINGS */}
          {activeAdminTab === 'homepage' && (
            <div>
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">Handled Homepage Customizer</h2>
                <p className="text-gray-500 text-xs mt-1">Live customized headlines, taglines, button triggers, and notification tickers.</p>
              </div>

              {homeFeedback && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold mb-6">
                  {homeFeedback}
                </div>
              )}

              <form onSubmit={handleHomepageSave} className="space-y-6 text-xs max-w-2xl">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wide block">G3 Primary Headline Slogan</label>
                  <input type="text" value={editedHeadline} onChange={(e) => setEditedHeadline(e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs font-bold" />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wide block">Slogan Sub-text Slogan</label>
                  <textarea rows={3} value={editedSlogan} onChange={(e) => setEditedSlogan(e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs leading-relaxed" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase block">Booking CTA Button Text</label>
                    <input type="text" value={homeCtaBook} onChange={(e) => setHomeCtaBook(e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2.5 w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase block">Cosmetics Shop Button Text</label>
                    <input type="text" value={homeCtaShop} onChange={(e) => setHomeCtaShop(e.target.value)} required className="border border-gray-200 rounded-xl px-4 py-2.5 w-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase block">G3 Shop Notice Warning</label>
                  <input type="text" value={editedWelcome} onChange={(e) => setEditedWelcome(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 w-full" />
                </div>

                <button type="submit" className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-extrabold tracking-wide hover:shadow transition-shadow uppercase font-mono cursor-pointer">
                  Save customize layout
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
