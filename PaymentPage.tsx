/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CreditCard, Check, Upload, FileText, Camera, ShieldAlert, Smile, RefreshCw } from 'lucide-react';
import { User, Booking, Order } from '../types';

interface PaymentPageProps {
  currentUser: User | null;
  bookings: Booking[];
  orders: Order[];
  onRefreshPayments: () => void;
  onNavigate: (tabId: string) => void;
}

export default function PaymentPage({
  currentUser,
  bookings,
  orders,
  onRefreshPayments,
  onNavigate,
}: PaymentPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<'telebirr' | 'cbe' | 'usdt'>('telebirr');

  // Receipt form
  const [receiptTxId, setReceiptTxId] = useState('');
  const [receiptAmount, setReceiptAmount] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [submitFeedback, setSubmitFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [screenshotDemo, setScreenshotDemo] = useState('');

  // Collect unpaid bookings/orders for dropdown selection
  const userUnpaidBookings = bookings.filter(b => b.userId === currentUser?.id && b.paymentStatus === 'unpaid');
  const userUnpaidOrders = orders.filter(o => o.userId === currentUser?.id && o.paymentStatus === 'unpaid');

  const handleReceiptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptTxId || !receiptAmount) {
      setSubmitFeedback('Please specify the Transaction ID reference and exact amount paid.');
      return;
    }

    if (!selectedBookingId) {
      setSubmitFeedback('Please choose which Booking or cosmetics Order this cash transfer belongs to.');
      return;
    }

    setIsSubmitting(true);
    setSubmitFeedback('');

    try {
      // Post transaction upload
      const res = await fetch('/api/bookings/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          transactionId: receiptTxId,
          receiptUrl: screenshotUrl || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500' // Mock elegant slip
        })
      });

      if (res.ok) {
        setSubmitFeedback('Success! Representative invoice submitted for clearance verification.');
        setReceiptTxId('');
        setReceiptAmount('');
        setSelectedBookingId('');
        setScreenshotUrl('');
        onRefreshPayments(); // Update state totals
      } else {
        const payload = await res.json();
        setSubmitFeedback(payload.message || 'Verification failed. Double check coordinates.');
      }
    } catch {
      setSubmitFeedback('Communication challenges with Hawassa gateway. Resubmit or reach support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="payment-gateway-container" className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white">
      
      {/* Upper header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-[#FF5FA2] text-xs font-black tracking-widest uppercase block">SECURE GATEWAY</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950">Secure Deposit & Receipt Upload</h1>
        <p className="text-gray-500 text-xs">Instantly finalize your bookings inside Hawassa. Support Telebirr mobile wallet, Commercial Bank of Ethiopia (CBE), or on-chain USDT.</p>
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Step Instructions & Accounts Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-gray-100 rounded-3xl p-5 sm:p-6 bg-zinc-50 space-y-6">
            
            <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider block">G3 Billing Channels:</h3>
            
            {/* Payment Method selectors */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedMethod('telebirr')}
                className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 font-bold cursor-pointer text-xs ${
                  selectedMethod === 'telebirr'
                    ? 'border-[#FF5FA2] bg-[#FF5FA2]/5 text-[#FF5FA2]'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                }`}
              >
                <span>Telebirr</span>
              </button>

              <button
                onClick={() => setSelectedMethod('cbe')}
                className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 font-bold cursor-pointer text-xs ${
                  selectedMethod === 'cbe'
                    ? 'border-[#9B5DE5] bg-[#9B5DE5]/5 text-[#9B5DE5]'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                }`}
              >
                <span>CBE Bank</span>
              </button>

              <button
                onClick={() => setSelectedMethod('usdt')}
                className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 font-bold cursor-pointer text-xs ${
                  selectedMethod === 'usdt'
                    ? 'border-[#D4AF37] bg-amber-500/5 text-[#D4AF37]'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                }`}
              >
                <span>USDT Crypto</span>
              </button>
            </div>

            {/* Render selected channel */}
            {selectedMethod === 'telebirr' && (
              <div className="space-y-4 p-4 rounded-2xl bg-[#FFD1E8]/25 border border-[#FFD1E8]/50 text-xs">
                <span className="inline-block px-3 py-1 rounded bg-[#FF5FA2] text-white font-extrabold text-[9px] uppercase tracking-wider">Official Telebirr Account</span>
                <div className="space-y-2 mt-2 leading-relaxed">
                  <p>🔹 Account Merchant Phone: <strong className="text-zinc-900 font-mono text-sm leading-none bg-white px-2.5 py-1 rounded border border-[#FFD1E8]">0924390725</strong></p>
                  <p>🔹 Merchant Name Label: <strong className="text-zinc-900">G3 Aesthetics Hawassa (M.S.)</strong></p>
                  <p className="text-gray-500 text-[11px] leading-relaxed mt-2 italic">
                    Instructions: Dial *127# on your Ethiotelecom line, transfer the corresponding booking fee deposit to 0924390725, take a crisp screenshot of the confirmation SMS receipt and copy the Transaction Ref string.
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === 'cbe' && (
              <div className="space-y-4 p-4 rounded-2xl bg-[#9B5DE5]/5 border border-[#9B5DE5]/20 text-xs">
                <span className="inline-block px-3 py-1 bg-[#9B5DE5] text-white rounded font-extrabold text-[9px] uppercase tracking-wider">Commercial Bank of Ethiopia (CBE)</span>
                <div className="space-y-2 mt-2 leading-relaxed">
                  <p>🔹 Bank Account Number: <strong className="text-zinc-900 font-mono text-sm leading-none bg-white px-2.5 py-1 rounded border border-[#9B5DE5]/20">1000439072545</strong></p>
                  <p>🔹 Account Holder Title: <strong className="text-zinc-900">G3 BEAUTY AND COSMETICS CORPORATION</strong></p>
                  <p className="text-gray-500 text-[11px] mt-2 italic">
                    Instructions: Use CBE Birr application or visit any CBE branch, settle account fee, write customer name inside CBE notes, and copy reference invoice voucher.
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === 'usdt' && (
              <div className="space-y-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs">
                <span className="inline-block px-3 py-1 bg-[#D4AF37] text-[#1A1A1A] rounded font-black text-[9px] uppercase tracking-widest">USDT Wallet (ERC-20 / TRC-20)</span>
                <div className="space-y-2 mt-2 leading-relaxed">
                  <p>🔹 Deposit Wallet Address: <strong className="block text-[11px] text-zinc-900 font-mono break-all bg-white p-2 rounded border border-gray-200 mt-1 select-all">0xG3Cosmetics725Erc20TimelessGlowNetwork</strong></p>
                  <p>🔹 Networks Supported: <strong className="text-zinc-900">Ethereum ERC-20 / TRON TRC-20</strong></p>
                  <p className="text-gray-500 text-[11px] mt-2 italic">
                    Instructions: Complete on-chain withdrawal transfer. Use standard $1 = 120 ETB conversion benchmarks if checking out or booking. Add on-chain TX hashes inside the receipt submitter form.
                  </p>
                </div>
              </div>
            )}

            {/* Warnings info */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-[10px] sm:text-xs text-orange-800 leading-normal">
              ⚠️ **G3 Advisory**: Slots remain in 'unpaid' temporary hold until screenshot clearance. Our Hawassa manager team clears transactions in less than 30 minutes. Reach 0924390725 immediately if your queue slows down.
            </div>

          </div>
        </div>

        {/* Right Side: File Upload Receipts Submitter Form */}
        <div className="lg:col-span-5">
          <div className="border border-gray-100 rounded-3xl p-5 sm:p-6 bg-white shadow-sm space-y-4">
            
            <div className="border-b border-gray-50 pb-3 mb-2 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1">
                <Upload size={16} className="text-[#FF5FA2]" /> Receipts Submitter
              </h3>
              <button
                onClick={onRefreshPayments}
                className="p-1 px-2 rounded hover:bg-gray-100 text-gray-400 hover:text-[#FF5FA2] flex items-center gap-1 text-[10px]"
                title="Sync payments state"
              >
                <RefreshCw size={11} /> Sync state
              </button>
            </div>

            {submitFeedback && (
              <div className={`p-3 border rounded-xl text-xs font-semibold ${
                submitFeedback.includes('Success')
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {submitFeedback}
              </div>
            )}

            {!currentUser ? (
              <div className="py-6 text-center text-xs text-gray-400 space-y-2">
                <ShieldAlert className="text-gray-300 mx-auto" size={32} />
                <p className="font-semibold">Payment uploader requires an active VIP Login.</p>
                <button
                  onClick={() => onNavigate('login')}
                  className="mt-2 text-[#FF5FA2] font-bold hover:underline"
                >
                  Go to Login Screen →
                </button>
              </div>
            ) : (
              <form onSubmit={handleReceiptSubmit} className="space-y-4 text-xs">
                
                {/* Selector choice */}
                <div className="space-y-1 text-left">
                  <label className="font-bold text-gray-700 uppercase">Associate Booking Appointment / Order</label>
                  <select
                    required
                    value={selectedBookingId}
                    onChange={(e) => setSelectedBookingId(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus:bg-white w-full text-xs text-left"
                  >
                    <option value="">Choose your unpaid item...</option>
                    {userUnpaidBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        📅 Appointment: {b.serviceName} ({b.date} - {b.priceEtb} ETB)
                      </option>
                    ))}
                    {userUnpaidOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        💄 Cosmetic Order: {o.id.slice(0, 10)} ({o.createdAt.split('T')[0]} - {o.totalEtb} ETB)
                      </option>
                    ))}
                    {/* Fallback mock choice if no unpaid present */}
                    {userUnpaidBookings.length === 0 && userUnpaidOrders.length === 0 && bookings.filter(b => b.userId === currentUser.id).map((b) => (
                      <option key={b.id} value={b.id}>
                        🌟 Re-Upload for {b.serviceName} ({b.date})
                      </option>
                    ))}
                  </select>
                  {userUnpaidBookings.length === 0 && userUnpaidOrders.length === 0 && (
                    <span className="block text-[10px] text-gray-400 mt-1">Ready to book new sessions? Settle fees to trigger approvals here.</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">Transaction ID Ref</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TX_9B5DE5725"
                      value={receiptTxId}
                      onChange={(e) => setReceiptTxId(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">Amount Settle (ETB)</label>
                    <input
                      type="number"
                      required
                      placeholder="Amount Paid"
                      value={receiptAmount}
                      onChange={(e) => setReceiptAmount(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                {/* Screenshot URL mock field */}
                <div className="space-y-1 text-left">
                  <label className="font-bold text-gray-700 uppercase">Screenshot Slip URL link</label>
                  <input
                    type="url"
                    placeholder="Optional: Paste secure image link..."
                    value={screenshotUrl}
                    onChange={(e) => {
                      setScreenshotUrl(e.target.value);
                      setScreenshotDemo(e.target.value);
                    }}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs"
                  />
                  <span className="block text-[9px] text-gray-400 mt-1">If blank, our office defaults to validating via Telebirr SMS registry.</span>
                </div>

                {/* Simulated screenshot container */}
                <div className="aspect-ratio-video border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center text-gray-400 cursor-pointer hover:bg-gray-100/50 transition-colors relative h-32 select-none overflow-hidden">
                  {screenshotDemo ? (
                    <img src={screenshotDemo} alt="Slip Upload Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera className="text-gray-300 mb-1" size={24} />
                      <p className="font-bold text-[10px] uppercase text-gray-500">MOCK CAMERA SLIP DETECTOR</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Drag Screenshot or Paste link above</p>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] text-white font-extrabold tracking-wider uppercase font-mono cursor-pointer hover:shadow transition-shadow flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> {isSubmitting ? 'Submitting verification...' : 'Settle Invoice Deposit'}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
