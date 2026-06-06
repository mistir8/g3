/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Smile, Check, User, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { Service, User as UserType } from '../types';

interface BookingPageProps {
  services: Service[];
  currentUser: UserType | null;
  onNavigate: (tabId: string) => void;
  onAddBooking: (bookingData: any) => void;
  preselectedService?: string;
}

export default function BookingPage({
  services,
  currentUser,
  onNavigate,
  onAddBooking,
  preselectedService = '',
}: BookingPageProps) {
  // Booking flow states
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(() => {
    if (preselectedService) {
      return services.find(s => s.name === preselectedService) || services[0];
    }
    return services[0];
  });

  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Default to tomorrow
    return today.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:00 AM');
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [clientNotes, setClientNotes] = useState('');

  const [bookingFeedback, setBookingFeedback] = useState('');
  const [bookingCompleted, setBookingCompleted] = useState(false);

  // Time coordinates
  const timeSlots = [
    '09:00 AM',
    '11:00 AM',
    '01:00 PM',
    '03:00 PM',
    '05:00 PM',
    '07:00 PM'
  ];

  const handleNextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && (!bookingDate || !selectedTimeSlot)) return;
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      setBookingFeedback('Specify your name and phone coordinates so Hawassa reception can reach you.');
      return;
    }

    if (!currentUser) {
      setBookingFeedback('Please register or login your G3 VIP account to confirm bookings.');
      onNavigate('login');
      return;
    }

    const bookingData = {
      userId: currentUser.id,
      userName: clientName,
      userPhone: clientPhone,
      serviceName: selectedService?.name || 'Makeup Artistry',
      priceEtb: selectedService?.priceEtb || 4500,
      duration: selectedService?.duration || '1.5 Hours',
      date: bookingDate,
      time: selectedTimeSlot,
      notes: clientNotes
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (res.ok) {
        const payload = await res.json();
        onAddBooking(payload.booking);
        setBookingCompleted(true);
        setTimeout(() => {
          setBookingCompleted(false);
          setStep(1);
          setClientNotes('');
          onNavigate('payments'); // Guide them straight to payment screenshot uploader
        }, 3500);
      } else {
        const errData = await res.json();
        setBookingFeedback(errData.message || 'Trouble reserving slot. Try choosing a different date.');
      }
    } catch {
      setBookingFeedback('Communication trouble. Please verify credentials or contact 0924390725.');
    }
  };

  return (
    <div id="booking-scheduler-container" className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-white">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-[#FF5FA2] text-xs font-black tracking-widest uppercase block">RESERVATION CENTRE</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950">Confirm Your Royal Session</h1>
        <p className="text-gray-500 text-xs">Choose luxurious style, convenient timing slot and finalize with CBE / Telebirr transaction confirmation.</p>
        <div className="w-16 h-[2px] bg-gradient-to-r from-[#FF5FA2] to-[#D4AF37] mx-auto mt-2" />
      </div>

      {bookingFeedback && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4.5 rounded-2xl text-xs font-semibold mb-6">
          {bookingFeedback}
        </div>
      )}

      {/* Steps visual bar */}
      <div className="flex items-center justify-center gap-2 mb-8 select-none text-xs">
        <span className={`px-3 py-1.5 rounded-full font-bold transition-colors ${step >= 1 ? 'bg-[#FF5FA2] text-white' : 'bg-gray-100 text-gray-400'}`}>1. Select Service</span>
        <div className="w-6 h-[1px] bg-gray-200" />
        <span className={`px-3 py-1.5 rounded-full font-bold transition-colors ${step >= 2 ? 'bg-[#FF5FA2] text-white' : 'bg-gray-100 text-gray-400'}`}>2. Date & Time</span>
        <div className="w-6 h-[1px] bg-gray-200" />
        <span className={`px-3 py-1.5 rounded-full font-bold transition-colors ${step >= 3 ? 'bg-[#FF5FA2] text-white' : 'bg-gray-100 text-gray-400'}`}>3. Verification</span>
      </div>

      {bookingCompleted ? (
        <div className="p-8 text-center bg-zinc-50 border border-zinc-100 rounded-3xl space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce border border-emerald-200">
            <Check size={32} />
          </div>
          <h2 className="text-lg font-black text-gray-900 uppercase">Aesthetic Slot Reserved!</h2>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Your beautiful salon appointment has been saved. We are navigating you automatically to our <strong>Secure Payments</strong> coordinator to confirm Telebirr cash screenshots and freeze your time coordinates.
          </p>
          <span className="text-[10px] text-[#FF5FA2] font-mono block animate-pulse">Routing to payments coordinator...</span>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-sm">
          
          {/* STEP 1: SERVICE CHOICE */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-gray-600">Select Glamour Service:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center ${
                      selectedService?.id === srv.id
                        ? 'border-[#FF5FA2] bg-[#FF5FA2]/5 ring-1 ring-[#FF5FA2]'
                        : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-50 border border-gray-100">
                      <img src={srv.image} alt={srv.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{srv.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{srv.duration}</p>
                      <strong className="text-xs text-[#FF5FA2] block mt-1 font-semibold">{srv.priceEtb} ETB</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-2xl bg-[#FF5FA2] hover:bg-[#9B5DE5] hover:scale-[1.05] active:scale-[0.95] text-white font-black text-xs uppercase font-mono tracking-wider transition-all duration-500 cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-lg hover:shadow-[#FF5FA2]/20"
                >
                  Confirm Choice <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE AND TIME SLOT SCHEDULER */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-gray-400">Select Ideal Timing parameters:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Date Picker input */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-gray-700 uppercase flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#FF5FA2]" /> Date of Appointment (Hawassa):
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white w-full text-xs"
                  />
                  <span className="block text-[10px] text-gray-400">We operate 7 days a week, 08:00 AM to 08:00 PM.</span>
                </div>

                {/* Slots grid selection */}
                <div className="space-y-2 text-xs text-left">
                  <label className="font-bold text-gray-700 uppercase flex items-center gap-1.5 mb-1">
                    <Clock size={14} className="text-[#9B5DE5]" /> Choose specific time slot:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-1 rounded-xl text-center border text-[11px] font-bold transition-colors cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'border-[#9B5DE5] bg-[#9B5DE5]/5 text-[#9B5DE5]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-100 text-xs font-bold flex items-center gap-1"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-2xl bg-[#FF5FA2] hover:bg-[#9B5DE5] hover:scale-[1.05] active:scale-[0.95] text-white font-black text-xs uppercase font-mono tracking-wider transition-all duration-500 cursor-pointer flex items-center gap-1.5 shadow-md hover:shadow-lg hover:shadow-[#FF5FA2]/20"
                >
                  Confirm Timing <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER VERIFICATION & SIGN-OFF */}
          {step === 3 && (
            <form onSubmit={handleBookingSubmit} className="space-y-6 text-xs text-left">
              <h3 className="font-extrabold text-sm uppercase tracking-wide text-gray-500 mb-4 border-b pb-2">Provide Customer Details:</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0911223344"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 uppercase">Special Aesthetic requirements / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Specify skin sensitivity, custom hair styles, bridal party expectations..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 w-full bg-gray-50 focus:bg-white leading-normal"
                />
              </div>

              {/* Bill brief details card */}
              <div className="p-4 bg-[#FFD1E8]/20 border border-[#FFD1E8]/50 rounded-2xl">
                <span className="font-black text-[#FF5FA2] uppercase block tracking-wider text-[10px] mb-2">Final Booking Invoice:</span>
                <div className="space-y-1 text-gray-600 font-light">
                  <p>🔹 Service Selected: <strong>{selectedService?.name}</strong></p>
                  <p>🔹 Session Duration: <strong>{selectedService?.duration}</strong></p>
                  <p>🔹 Date & Timing coordinates: <strong>{bookingDate} at {selectedTimeSlot}</strong></p>
                  <p className="border-t border-gray-200/50 pt-1.5 text-sm font-extrabold text-[#FF5FA2]">Estimated Fee: {selectedService?.priceEtb} ETB</p>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase font-mono tracking-wider cursor-pointer transition-all duration-500 hover:scale-[1.05] active:scale-[0.95] flex items-center gap-1.5 shadow-md hover:shadow-[#059669]/20 hover:shadow-lg"
                >
                  <Check size={14} /> Submit Reservation Now
                </button>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  );
}
