/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, ShoppingCart, Heart, User, Crown, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserType | null;
  onLogout: () => void;
  cartCount: number;
  wishlistCount: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  cartCount,
  wishlistCount,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Normal items available to all
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'shop', label: 'Shop' },
    { id: 'booking', label: 'Booking' },
    { id: 'payments', label: 'Payments' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'news', label: 'News' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  const isAdmin = currentUser?.email === 'miistir.8@gmail.com';

  return (
    <nav id="luxury-g3-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-[#FFD1E8]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo with 3d effect reflection */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleTabClick('home')}>
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#E6C65A] via-[#D4AF37] to-[#BC9028] p-0.5 flex items-center justify-center shadow-md">
              <div className="absolute inset-[1px] rounded-full bg-[#FFF0F6] flex items-center justify-center">
                <span className="text-sm font-extrabold tracking-tight text-white bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] bg-clip-text text-transparent">G3</span>
              </div>
              {/* Pulse Heart */}
              <div className="absolute -top-1.5 -right-1 flex animate-ping">
                <Heart size={11} className="text-[#FF5FA2] fill-[#FF5FA2]" />
              </div>
            </div>
            <div className="ml-3">
              <span className="block text-lg font-black tracking-tight text-gray-900 leading-none">
                G3 <span className="text-[#FF5FA2]">BEAUTY</span>
              </span>
              <span className="block text-[9px] text-[#D4AF37] tracking-widest font-mono uppercase font-bold text-left">Confidence & Elegance</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-1 xl:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3 py-2 text-xs xl:text-sm font-semibold tracking-wide rounded-md transition-all duration-300 relative ${
                  activeTab === item.id
                    ? 'text-[#FF5FA2]'
                    : 'text-gray-700 hover:text-[#9B5DE5]'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Utility Controls & Dashboards */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-4">
            
            {/* Wishlist Icon link */}
            <button
              onClick={() => handleTabClick('shop')}
              className="p-2 text-gray-500 hover:text-[#FF5FA2] transition-colors relative"
              title="View Wishlist"
            >
              <Heart size={21} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-[#FF5FA2] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon link */}
            <button
              onClick={() => handleTabClick('shop')}
              className="p-2 text-gray-500 hover:text-[#9B5DE5] transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 rounded-full bg-[#9B5DE5] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User status trigger */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTabClick(isAdmin ? 'admin-dashboard' : 'user-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    isAdmin
                      ? 'bg-amber-500/10 border-amber-500 text-amber-800'
                      : 'bg-[#FF5FA2]/10 border-[#FF5FA2]/30 text-[#FF5FA2]'
                  }`}
                >
                  {isAdmin ? <Crown size={14} className="text-[#D4AF37]" /> : <User size={14} />}
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout Session"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTabClick('register')}
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:border-[#FF5FA2] transition-colors text-gray-600"
                >
                  Register
                </button>
                <button
                  onClick={() => handleTabClick('login')}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white text-xs font-bold hover:shadow-md transition-shadow cursor-pointer"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleTabClick('shop')}
              className="p-1.5 text-gray-500 relative"
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF5FA2] text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-600 hover:text-gray-950 focus:outline-none"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-3 space-y-1 shadow-lg max-h-[85vh] overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left px-5 py-3 text-sm font-semibold flex items-center gap-3 transition-colors ${
                activeTab === item.id
                  ? 'bg-[#FF5FA2]/10 text-[#FF5FA2]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeTab === item.id ? 'bg-[#FF5FA2]' : 'bg-transparent'}`} />
              {item.label}
            </button>
          ))}
          <div className="h-[1px] bg-gray-100 my-2 mx-5" />
          
          {/* Mobile Auth options */}
          <div className="px-5 py-2.5 space-y-2">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleTabClick(isAdmin ? 'admin-dashboard' : 'user-dashboard')}
                  className="w-full py-2.5 rounded-xl border border-[#FF5FA2]/30 text-sm font-bold text-center text-[#FF5FA2] flex items-center justify-center gap-2"
                >
                  {isAdmin ? <Crown size={16} className="text-[#D4AF37]" /> : <User size={16} />}
                  <span>{isAdmin ? 'Admin Dashboard' : 'My Account Area'}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium text-red-500 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center gap-1"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTabClick('register')}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-center text-gray-700"
                >
                  Register
                </button>
                <button
                  onClick={() => handleTabClick('login')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white text-sm font-bold text-center"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
