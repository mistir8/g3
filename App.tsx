/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, AlertCircle, CheckCircle, Crown, Lock, Phone } from 'lucide-react';

// Type definitions import
import { User, Booking, Order, Product, Review, NewsPost, GalleryItem } from './types';

// Component imports
import IntroScreen from './components/IntroScreen';
import AIBeautyAssistant from './components/AIBeautyAssistant';
import Navbar from './components/Navbar';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

// Page imports
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ShopPage from './pages/ShopPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import ReviewsPage from './pages/ReviewsPage';
import NewsPage from './pages/NewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  // Navigation active screen
  const [activeTab, setActiveTab] = useState<string>('home');
  const [introCompleted, setIntroCompleted] = useState<boolean>(false);

  // Authenticated user credentials
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('g3_vip_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Database State Holders
  const [usersList, setUsersList] = useState<User[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [newsList, setNewsList] = useState<NewsPost[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [homepageSettings, setHomepageSettings] = useState<any>(null);

  // Utility counts indicators
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  // Preselected booking service name helper
  const [preselectedBooking, setPreselectedBooking] = useState<string>('');

  // Login / Register state forms
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginFeedback, setLoginFeedback] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFeedback, setRegFeedback] = useState('');

  // 1. Load full database synchronizer on mount
  const syncDatabase = async () => {
    try {
      const response = await fetch('/api/db');
      if (response.ok) {
        const db = await response.json();
        setUsersList(db.users || []);
        setServicesList(db.services || []);
        setProductsList(db.products || []);
        setBookingsList(db.bookings || []);
        setOrdersList(db.orders || []);
        setReviewsList(db.reviews || []);
        setNewsList(db.news || []);
        setGalleryList(db.gallery || []);
        setHomepageSettings(db.homepageSettings || null);
      }
    } catch (err) {
      console.error('Database communications offline, relying on client memory.', err);
    }
  };

  useEffect(() => {
    syncDatabase();
  }, []);

  // Update navbar callbacks
  const handleCartUpdate = (count: number) => setCartCount(count);
  const handleWishlistUpdate = (count: number) => setWishlistCount(count);

  const handleRouteNavigate = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookServiceTrigger = (serviceName: string) => {
    setPreselectedBooking(serviceName);
    handleRouteNavigate('booking');
  };

  // 2. Authentication routines
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (response.ok) {
        // Sticky login storage
        localStorage.setItem('g3_vip_session', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        // Settle direction tabs based on role
        if (data.user.role === 'admin') {
          handleRouteNavigate('admin-dashboard');
        } else {
          handleRouteNavigate('user-dashboard');
        }
        
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginFeedback(data.message || 'Invalid email credentials or password.');
      }
    } catch {
      setLoginFeedback('Security channel connectivity offline. Please contact Hawassa admin.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegFeedback('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('g3_vip_session', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        handleRouteNavigate('user-dashboard');
        
        setRegName('');
        setRegEmail('');
        setRegPhone('');
        setRegPassword('');
      } else {
        setRegFeedback(data.message || 'Registration coordinates conflict. Specify distinct email.');
      }
    } catch {
      setRegFeedback('Registration gateway challenges. Reach 0924390725 support.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('g3_vip_session');
    setCurrentUser(null);
    handleRouteNavigate('home');
  };

  const handleUpdateUserProfile = (updatedUser: User) => {
    localStorage.setItem('g3_vip_session', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    
    // Save to users backend list
    setUsersList(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // 3. Checkout Orders trigger callback
  const handlePlaceOrderSubmit = async (
    items: any[],
    totalEtb: number,
    totalUsdt: number,
    address: string,
    method: string
  ) => {
    if (!currentUser) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          items,
          totalEtb,
          totalUsdt,
          address,
          paymentMethod: method
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOrdersList((prev) => [data.order, ...prev]);
        syncDatabase(); // Keep totals fully synchronized
      }
    } catch (err) {
      console.error('Order reservation offline:', err);
    }
  };

  // 4. Admin Management CRUD operations
  const handleUpdateBookingStatusInDashboard = async (
    bookingId: string,
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
    paymentStatus: 'unpaid' | 'paid' | 'pending_verification',
    transactionId?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus, transactionId })
      });
      if (res.ok) {
        syncDatabase();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatusInDashboard = async (
    orderId: string,
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
    paymentStatus: 'unpaid' | 'paid' | 'pending_verification'
  ) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus })
      });
      if (res.ok) {
        syncDatabase();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleModerateReviewInDashboard = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        syncDatabase();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProductInDashboard = async (productData: any) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        syncDatabase();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddServiceInDashboard = async (serviceData: any) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });
      if (res.ok) {
        syncDatabase();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewsInDashboard = async (newsData: any) => {
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData)
      });
      if (res.ok) {
        syncDatabase();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGalleryInDashboard = async (galleryData: any) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData)
      });
      if (res.ok) {
        syncDatabase();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateHomepageInDashboard = async (homepageSettings: any) => {
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homepageSettings)
      });
      if (res.ok) {
        syncDatabase();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerPaymentsForBooking = (bookingId: string) => {
    handleRouteNavigate('payments');
  };

  const handleAddLocalBookingObj = (bookingObj: Booking) => {
    setBookingsList(prev => [bookingObj, ...prev]);
  };

  const handleAddLocalReviewObj = (reviewObj: Review) => {
    setReviewsList(prev => [reviewObj, ...prev]);
  };

  // Loading Screens sequence
  if (!introCompleted) {
    return <IntroScreen onComplete={() => setIntroCompleted(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans selection:bg-[#FFD1E8] selection:text-[#FF5FA2]">
      
      {/* Main sticky navigation header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleRouteNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {/* Primary routed content panels mapping */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {activeTab === 'home' && (
              <HomePage
                onNavigate={handleRouteNavigate}
                homepageSettings={homepageSettings}
                services={servicesList}
                products={productsList}
                reviews={reviewsList}
                news={newsList}
              />
            )}

            {activeTab === 'services' && (
              <ServicesPage
                services={servicesList}
                onBookService={handleBookServiceTrigger}
              />
            )}

            {activeTab === 'shop' && (
              <ShopPage
                products={productsList}
                currentUser={currentUser}
                onPlaceOrder={handlePlaceOrderSubmit}
                onNavigate={handleRouteNavigate}
                onCartUpdate={handleCartUpdate}
                onWishlistUpdate={handleWishlistUpdate}
              />
            )}

            {activeTab === 'booking' && (
              <BookingPage
                services={servicesList}
                currentUser={currentUser}
                onNavigate={handleRouteNavigate}
                onAddBooking={handleAddLocalBookingObj}
                preselectedService={preselectedBooking}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentPage
                currentUser={currentUser}
                bookings={bookingsList}
                orders={ordersList}
                onRefreshPayments={syncDatabase}
                onNavigate={handleRouteNavigate}
              />
            )}

            {activeTab === 'reviews' && (
              <ReviewsPage
                reviews={reviewsList}
                currentUser={currentUser}
                onAddReview={handleAddLocalReviewObj}
                onNavigate={handleRouteNavigate}
              />
            )}

            {activeTab === 'news' && (
              <NewsPage news={newsList} />
            )}

            {activeTab === 'about' && (
              <AboutPage gallery={galleryList} />
            )}

            {activeTab === 'contact' && (
              <ContactPage />
            )}

            {/* REGISTER SCREEN POP */}
            {activeTab === 'register' && (
              <div className="max-w-md mx-auto px-4 py-20 text-xs">
                <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm text-left">
                  <div className="text-center space-y-2 mb-8">
                    <UserPlus size={32} className="text-[#FF5FA2] mx-auto animate-pulse" />
                    <h2 className="text-xl font-black uppercase text-gray-900 tracking-wider">VIP Glow Club</h2>
                    <p className="text-gray-500 font-light text-[11px]">Register to confirm slots and dispatch cosmetics boutique.</p>
                  </div>

                  {regFeedback && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold mb-4 text-xs leading-normal">
                      {regFeedback}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase">Full Name</label>
                      <input type="text" required placeholder="martha kebede" value={regName} onChange={(e) => setRegName(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs" />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase">Email Coordinates</label>
                      <input type="email" required placeholder="martha@gmail.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs font-mono" />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase">Phone Number</label>
                      <input type="tel" required placeholder="0911223344" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs font-mono" />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase">Secure Password</label>
                      <input type="password" required placeholder="choose strong password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs font-mono" />
                    </div>

                    <p className="text-[10px] text-gray-400 leading-normal">
                      By registering, you access G3 royal treatment streak XP points and priority clearance.
                    </p>

                    <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white font-black uppercase font-mono tracking-wider cursor-pointer">
                      Settle Registration
                    </button>
                  </form>

                  <div className="pt-6 text-center border-t border-gray-100 mt-6">
                    <button onClick={() => handleRouteNavigate('login')} className="text-gray-500 hover:text-[#FF5FA2] font-semibold text-[11px]">
                      Already have an account? Login here →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LOGIN SCREEN POP */}
            {activeTab === 'login' && (
              <div className="max-w-md mx-auto px-4 py-20 text-xs">
                <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm text-left">
                  <div className="text-center space-y-2 mb-8">
                    <LogIn size={32} className="text-[#9B5DE5] mx-auto animate-pulse" />
                    <h2 className="text-xl font-black uppercase text-gray-900 tracking-wider">VIP Sign-In</h2>
                    <p className="text-gray-500 font-light text-[11px]">Access your orders, appointments and custom reports.</p>
                  </div>

                  {loginFeedback && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold mb-4 text-xs leading-normal">
                      {loginFeedback}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase">Email Coordinates</label>
                      <input type="email" required placeholder="e.g. selam@gmail.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs font-mono" />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase">Secure Password</label>
                      <input type="password" required placeholder="Enter password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs font-mono" />
                    </div>

                    <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white font-black uppercase font-mono tracking-wider cursor-pointer">
                      Settle Sign-In
                    </button>
                  </form>

                  <div className="pt-6 text-center border-t border-gray-100 mt-6">
                    <button onClick={() => handleRouteNavigate('register')} className="text-gray-500 hover:text-[#9B5DE5] font-semibold text-[11px]">
                      Don't have an account? Register club here →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* REGULAR USER CO-DETERMINED DASHBOARD */}
            {activeTab === 'user-dashboard' && (
              <UserDashboard
                currentUser={currentUser}
                onLogout={handleLogout}
                bookings={bookingsList}
                orders={ordersList}
                products={productsList}
                reviews={reviewsList}
                onTriggerPayment={handleTriggerPaymentsForBooking}
                onUpdateUser={handleUpdateUserProfile}
                setActiveMainTab={handleRouteNavigate}
              />
            )}

            {/* BOARD ADMIN EXECUTIVE SUITE */}
            {activeTab === 'admin-dashboard' && (
              <AdminDashboard
                currentUser={currentUser}
                users={usersList}
                services={servicesList}
                products={productsList}
                bookings={bookingsList}
                orders={ordersList}
                reviews={reviewsList}
                news={newsList}
                gallery={galleryList}
                homepageSettings={homepageSettings}
                onUpdateBookingStatus={handleUpdateBookingStatusInDashboard}
                onUpdateOrderStatus={handleUpdateOrderStatusInDashboard}
                onModerateReview={handleModerateReviewInDashboard}
                onAddProduct={handleAddProductInDashboard}
                onAddService={handleAddServiceInDashboard}
                onAddNews={handleAddNewsInDashboard}
                onAddGallery={handleAddGalleryInDashboard}
                onUpdateHomepage={handleUpdateHomepageInDashboard}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating AI Beauty & Cosmetics Expert on all views */}
      <AIBeautyAssistant currentUser={currentUser} />
    </div>
  );
}
