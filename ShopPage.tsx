/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, ShoppingCart, Trash2, X, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { Product, User, OrderItem } from '../types';

interface ShopPageProps {
  products: Product[];
  currentUser: User | null;
  onPlaceOrder: (items: any[], totalEtb: number, totalUsdt: number, address: string, method: string) => void;
  onNavigate: (tabId: string) => void;
  onCartUpdate: (count: number) => void;
  onWishlistUpdate: (count: number) => void;
}

export default function ShopPage({
  products,
  currentUser,
  onPlaceOrder,
  onNavigate,
  onCartUpdate,
  onWishlistUpdate,
}: ShopPageProps) {
  // Catalog filter variables
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('popular');

  // Shopping Cart & Wishlist state
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const items = localStorage.getItem('g3_wishlist');
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  // Checkout modal
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('telebirr');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [checkoutFeedback, setCheckoutFeedback] = useState('');

  // Settle numbers
  const categoriesList = [
    { id: 'all', label: 'All Items' },
    { id: 'makeup_kits', label: 'Makeup Kits' },
    { id: 'lipsticks', label: 'Lipsticks' },
    { id: 'foundations', label: 'Foundations' },
    { id: 'face_creams', label: 'Face Creams' },
    { id: 'hair_products', label: 'Hair Products' },
    { id: 'perfumes', label: 'Perfumes' },
    { id: 'accessories', label: 'Beauty Accessories' }
  ];

  // Callback counts
  useEffect(() => {
    const totalItems = cart.reduce((acc, c) => acc + c.quantity, 0);
    onCartUpdate(totalItems);
  }, [cart, onCartUpdate]);

  useEffect(() => {
    localStorage.setItem('g3_wishlist', JSON.stringify(wishlist));
    onWishlistUpdate(wishlist.length);
  }, [wishlist, onWishlistUpdate]);

  // Handle Cart logic
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Handle Wishlist logic
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Filter Catalog
  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortOption === 'price_low') return a.priceEtb - b.priceEtb;
    if (sortOption === 'price_high') return b.priceEtb - a.priceEtb;
    return (b.rating || 0) - (a.rating || 0); // Popular/Rating default
  });

  // Totals calculations
  const totalEtb = cart.reduce((acc, c) => acc + c.product.priceEtb * c.quantity, 0);
  const totalUsdt = cart.reduce((acc, c) => acc + c.product.priceUsdt * c.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryAddress) {
      setCheckoutFeedback('Please specify your delivery coordinates.');
      return;
    }

    if (cart.length === 0) return;

    // Map checkout items
    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      priceEtb: item.product.priceEtb,
      priceUsdt: item.product.priceUsdt,
      image: item.product.image
    }));

    onPlaceOrder(orderItems, totalEtb, totalUsdt, deliveryAddress, selectedPaymentMethod);
    
    setOrderCompleted(true);
    setCart([]);
    setDeliveryAddress('');
    
    setTimeout(() => {
      setOrderCompleted(false);
      setCheckoutOpen(false);
      onNavigate('payments'); // Direct them instantly to payment receipt form
    }, 3500);
  };

  return (
    <div id="shop-boutique-wrapper" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white relative">
      
      {/* Upper Announcement Header */}
      <div className="bg-[#FFD1E8]/30 border border-[#FFD1E8]/60 rounded-3xl p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FF5FA2]/15 flex items-center justify-center text-[#FF5FA2] shrink-0">
            <Heart size={18} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-[#FF5FA2] tracking-wider block">G3 Cosmetics Notice</span>
            <h2 className="font-extrabold text-sm text-[#3D1B2D]">Habesha bridal kits & makeup inventory</h2>
            <p className="text-xs text-gray-500 font-light mt-0.5">Dual pricing tracks automatically in Ethiopian Birr (ETB) & USDT Crypto.</p>
          </div>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#FF5FA2] hover:bg-[#9B5DE5] hover:scale-[1.04] active:scale-[0.96] transition-all duration-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md hover:shadow-lg hover:shadow-[#FF5FA2]/25 font-sans"
        >
          <ShoppingCart size={14} /> View Shopping Cart ({cart.length})
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side Filters list */}
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">Search Boutique</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Find lipstick, foundation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 bg-gray-50 focus:outline-[#FF5FA2] focus:bg-white"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={15} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">Sort products by</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-[#FF5FA2]"
            >
              <option value="popular">Popularity & Rating</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black tracking-widest text-[#FF5FA2] uppercase">Categories Tag</h3>
            <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto whitespace-nowrap lg:whitespace-normal pb-2 lg:pb-0 scrollbar-none">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-left text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#FF5FA2] text-white border-transparent shadow-xs'
                      : 'text-zinc-700 bg-gray-50 border border-transparent hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Product Grid Catalog */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <span className="text-xs text-gray-400 font-medium">Found {filteredProducts.length} premium cosmetics</span>
            <span className="text-[10px] text-[#9B5DE5] uppercase font-bold tracking-widest font-mono">Verified Hawassa Batch</span>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="py-12 text-center text-gray-400 text-sm font-light">No cosmetic formulas matching filters found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const isFavorite = wishlist.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="border border-[#FFD1E8]/30 rounded-2xl bg-white p-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative"
                  >
                    {/* Favorite Heart trigger */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className={`absolute top-6 right-6 z-20 p-2.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                        isFavorite ? 'bg-rose-50 text-[#FF5FA2]' : 'bg-white/80 text-gray-400 hover:text-[#FF5FA2]'
                      }`}
                      title="Favorite bookmark"
                    >
                      <Heart size={15} className={isFavorite ? 'fill-current' : ''} />
                    </button>

                    {/* Image visual */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-4 shrink-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover scale-102 group-hover:scale-105 transition-transform duration-500 select-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta info details */}
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-gray-400">
                        {p.category.replace('_', ' ')}
                      </span>
                      <h3 className="font-extrabold text-[#3D1B2D] text-xs sm:text-sm group-hover:text-[#FF5FA2] transition-colors leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-light line-clamp-2">
                        {p.description}
                      </p>
                      <div className="pt-1 select-none">
                        <span className="text-xs text-amber-500">★ {p.rating || 4.8} </span>
                        <span className="text-[10px] text-gray-400">({p.reviewsCount || 40})</span>
                      </div>
                    </div>

                    {/* Product Purchase row */}
                    <div className="border-t border-gray-50 pt-3 mt-4 flex items-center justify-between">
                      <div>
                        {/* Birr and USDT tracker */}
                        <strong className="text-[#3D1B2D] font-black text-sm block">
                          {p.priceEtb} ETB
                        </strong>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          ${p.priceUsdt} USDT
                        </span>
                      </div>

                      {p.stock <= 0 ? (
                        <span className="px-3.5 py-1.5 bg-gray-100 rounded text-gray-400 text-[10px] uppercase font-extrabold font-mono select-none">
                          Out of stock
                        </span>
                      ) : (
                        <button
                          onClick={() => addToCart(p)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white text-[11px] font-bold hover:shadow transition-shadow cursor-pointer flex items-center gap-1"
                        >
                          <ShoppingCart size={12} /> Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SHOPPING CART DRAWER PANEL (Overlaid on side block) */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full sm:w-[420px] bg-white h-full shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} />
                  <h3 className="font-extrabold text-sm tracking-wide">Cosmetics Cart ({cart.length})</h3>
                </div>
                <button onClick={() => setCartOpen(false)} className="text-white hover:opacity-85">
                  <X size={20} />
                </button>
              </div>

              {/* Items Panel */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {cart.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center text-gray-400 text-xs">
                    <ShoppingCart size={32} className="text-gray-300 mb-2" />
                    <p className="font-semibold">Shopping Bag is pristine empty.</p>
                    <p className="text-gray-400">Add Matte pink lipstick or Bridal palettes to glow.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3.5 p-3 rounded-xl border border-gray-100 items-center justify-between text-xs"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden border shrink-0 bg-gray-50">
                        <img src={item.product.image} alt="Cart product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{item.product.name}</h4>
                        <p className="text-gray-400 font-mono text-[10px] mt-0.5">
                          {item.product.priceEtb} Birr | ${item.product.priceUsdt} USDT
                        </p>
                        
                        {/* Control quantities */}
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="w-5 h-5 bg-gray-200 hover:bg-gray-300 font-bold rounded flex items-center justify-center cursor-pointer">-</button>
                          <span className="font-bold text-gray-900 mx-1">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="w-5 h-5 bg-gray-200 hover:bg-gray-300 font-bold rounded flex items-center justify-center cursor-pointer">+</button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-300 hover:text-red-500 p-1.5 shrink-0 ml-1"
                        title="Remove product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Settle checkout */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-4">
                <div className="space-y-1.5 text-right">
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Subtotal Birr:</span>
                    <strong className="text-gray-900 font-extrabold">{totalEtb} ETB</strong>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal Crypto:</span>
                    <strong className="text-gray-900 font-mono">${totalUsdt} USDT</strong>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        alert('Please register or login your G3 VIP customer account to complete secure checkout.');
                        onNavigate('login');
                        setCartOpen(false);
                        return;
                      }
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    disabled={cart.length === 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] via-[#E25492] to-[#9B5DE5] text-white hover:opacity-90 disabled:opacity-40 font-extrabold tracking-wider transition-opacity text-xs uppercase font-mono cursor-pointer flex items-center justify-center gap-1 shadow-md"
                  >
                    Proceed to secure checkout <ArrowRight size={14} />
                  </button>
                  <p className="text-[10px] text-gray-400 text-center leading-normal">
                    Free shipping inside Hawassa. Receipts must be uploaded to Payments tab for dispatch.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT CONFIRMATION MODAL POPUP */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/20 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[#D4AF37]" size={18} />
                  <h3 className="font-extrabold tracking-wide text-sm uppercase">G3 VIP checkout portal</h3>
                </div>
                <button onClick={() => setCheckoutOpen(false)} className="text-white">
                  <X size={20} />
                </button>
              </div>

              {orderCompleted ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                    <Check size={32} />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 uppercase">Cosmetics Order Placed Successfully!</h2>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    Your order coordinates are safely registered. We are navigating you automatically to our <strong>Secure Payments</strong> coordinator to submit your Telebirr cash receipt screenshot.
                  </p>
                  <span className="text-[10px] text-[#FF5FA2] font-mono block animate-pulse">Navigating to payments coordinator...</span>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4 text-xs">
                  {checkoutFeedback && (
                    <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs font-semibold">
                      {checkoutFeedback}
                    </div>
                  )}

                  {/* Summary row */}
                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl space-y-1.5 font-light">
                    <span className="font-extrabold text-gray-400 uppercase tracking-widest block text-[9px] mb-1">Billing Summary:</span>
                    <div className="flex justify-between">
                      <span>Customer Tag:</span>
                      <strong className="text-gray-900 font-extrabold">{currentUser?.name}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Invoice sum (Birr):</span>
                      <strong className="text-[#FF5FA2] font-black">{totalEtb} ETB</strong>
                    </div>
                    <div className="flex justify-between border-t border-gray-200/50 pt-1.5 font-mono text-[11px]">
                      <span>USDT Wallet Equivalent:</span>
                      <strong>${totalUsdt} USDT</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">Delivery Drop-off Address (Hawassa Only)</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Hawassa, Piazza road, behind Central Hotel, Office 24"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white w-full leading-normal"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase block mb-1">Select Payment Coordinator</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('telebirr')}
                        className={`py-2 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer font-bold ${
                          selectedPaymentMethod === 'telebirr'
                            ? 'border-[#FF5FA2] bg-[#FF5FA2]/5 text-[#FF5FA2]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <span className="text-[10px]">Telebirr</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('bank_transfer')}
                        className={`py-2 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer font-bold ${
                          selectedPaymentMethod === 'bank_transfer'
                            ? 'border-[#9B5DE5] bg-[#9B5DE5]/5 text-[#9B5DE5]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <span className="text-[10px]">Bank / CBE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('usdt')}
                        className={`py-2 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer font-bold ${
                          selectedPaymentMethod === 'usdt'
                            ? 'border-[#D4AF37] bg-amber-500/5 text-[#D4AF37]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <span className="text-[10px]">Crypto USDT</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-lg text-[10px] text-gray-500 leading-normal">
                    💡 **Important**: Our delivery board tracks orders status manually. Upon packing, dispatch will take place at CBE / Telebirr receipt clearance.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold tracking-wider uppercase font-mono cursor-pointer hover:shadow transition-shadow"
                  >
                    Confirm & Complete Checkout
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
