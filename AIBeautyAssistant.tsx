/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Heart, User, ShieldAlert, BookOpen, Star, HelpCircle } from 'lucide-react';
import { ChatMessage, User as UserType } from '../types';

interface AIBeautyAssistantProps {
  currentUser: UserType | null;
}

export default function AIBeautyAssistant({ currentUser }: AIBeautyAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: "Selam! Welcome to G3 Beauty & Cosmetics. I am your premium AI Beauty Advisor. How can I pamper you today?\n\nI speak both **English** and **Amharic (አማርኛ)!** Feel free to ask me about skincare routines, makeup kits, booking times, or Telebirr payments.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [selectedMakeupStyle, setSelectedMakeupStyle] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser?.email === 'miistir.8@gmail.com';

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) setInput('');

    // Append user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Determine if it is a general beauty chat or local report
      const isReportReq = isAdmin && (text.toLowerCase().includes('report') || text.toLowerCase().includes('insight') || text.toLowerCase().includes('sales') || text.toLowerCase().includes('revenue') || text.toLowerCase().includes('performance'));
      const endpoint = isReportReq ? '/api/gemini/admin-report' : '/api/gemini/chat';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          email: currentUser?.email,
          history: messages.slice(-6), // Send last 6 messages for context
          skinType: selectedSkinType,
          makeupStyle: selectedMakeupStyle
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error state.');
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: data.text || "I apologize, custom systems are cooling. How else may I serve you?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: "I am having temporary connectivity troubles, but our majestic Hawassa team is fully active! Reach out to 0924390725 anytime for immediate response.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyPredefinedQuestion = (topic: string, promptText: string) => {
    if (topic === 'skincare') {
      setSelectedSkinType(promptText);
      handleSend(`Analyze my skincare choice. My skin is: ${promptText}. Suggest skincare treatment and product guidance.`);
    } else if (topic === 'makeup') {
      setSelectedMakeupStyle(promptText);
      handleSend(`Give me beauty advice for ${promptText} makeup style and product recommendations.`);
    } else {
      handleSend(promptText);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="floating-ai-button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              '0 0 0 0px rgba(255, 95, 162, 0.4)',
              '0 0 0 12px rgba(255, 95, 162, 0)',
              '0 0 0 0px rgba(255, 95, 162, 0.4)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF5FA2] via-[#E25492] to-[#9B5DE5] text-white flex items-center justify-center shadow-lg cursor-pointer border border-[#D4AF37]/40 hover:border-[#D4AF37]"
        >
          {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
        </motion.button>
      </div>

      {/* Floating Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-assistant-chat-window"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-22 right-6 z-40 w-[92vw] sm:w-[420px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#D4AF37]/30"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5] p-4 text-white flex items-center justify-between border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-[#D4AF37]/50 relative">
                  <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={20} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide flex items-center gap-1">
                    G3 Beauty AI Advisor
                  </h3>
                  <p className="text-xs text-[#FFD1E8] font-mono">Bilingual Expert (EN/አማ)</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Actions / Shortcuts Panel */}
            <div className="bg-gradient-to-r from-[#FFD1E8]/40 to-[#9B5DE5]/10 p-2.5 flex gap-1.5 overflow-x-auto text-xs whitespace-nowrap scrollbar-none border-b border-gray-100">
              <button
                onClick={() => applyPredefinedQuestion('skincare', 'Oily / Acne Prone')}
                className="px-2.5 py-1 rounded-full bg-white text-gray-700 border border-[#FF5FA2]/20 hover:border-[#FF5FA2] transition-colors"
              >
                🌿 Skincare Tips
              </button>
              <button
                onClick={() => applyPredefinedQuestion('makeup', 'Habesha Bridal Glam')}
                className="px-2.5 py-1 rounded-full bg-white text-gray-700 border border-[#FF5FA2]/20 hover:border-[#FF5FA2] transition-colors"
              >
                💄 Bridal Looks
              </button>
              <button
                onClick={() => applyPredefinedQuestion('general', 'How can I pay via Telebirr?')}
                className="px-2.5 py-1 rounded-full bg-white text-gray-700 border border-[#FF5FA2]/20 hover:border-[#FF5FA2] transition-colors"
              >
                💳 Telebirr Payments
              </button>
              <button
                onClick={() => applyPredefinedQuestion('general', 'What services do you offer ?')}
                className="px-2.5 py-1 rounded-full bg-white text-gray-700 border border-[#FF5FA2]/20 hover:border-[#FF5FA2] transition-colors"
              >
                📅 Services & Booking
              </button>
              {isAdmin && (
                <button
                  onClick={() => applyPredefinedQuestion('admin', 'Show me the G3 Admin Executive report insights.')}
                  className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500 hover:bg-amber-500 hover:text-white transition-all font-semibold"
                >
                  📈 Sales Insights Report
                </button>
              )}
            </div>

            {/* Micro-advisor interactive settings */}
            <div className="bg-gray-50 border-b border-gray-100 px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Configure Skin:</span>
              <select
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value)}
                className="bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-700"
              >
                <option value="">Choose skin type...</option>
                <option value="Dry Skin">Dry Skin</option>
                <option value="Oily & Acne-Prone">Oily & Acne-Prone</option>
                <option value="Combination / Warm Zone">Combination / Warm Zone</option>
                <option value="Sensitive Skin">Sensitive Skin</option>
              </select>
            </div>

            {/* Messages Core Space */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF5FA2] to-[#9B5DE5] flex items-center justify-center text-white text-[10px] shrink-0 mt-0.5 border border-[#D4AF37]">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#FF5FA2] text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                    <p className={`text-[10px] text-right mt-1.5 ${msg.sender === 'user' ? 'text-white/75' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF5FA2] to-[#9B5DE5] flex items-center justify-center text-white text-[10px] shrink-0">
                    AI
                  </div>
                  <div className="bg-white text-gray-500 rounded-2xl rounded-bl-none border border-gray-100 p-3.5 text-xs shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5FA2] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9B5DE5] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-gray-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask beauty questions in English or አማርኛ..."
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#FF5FA2] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-3.5 py-2.5 rounded-xl bg-gradient-to-br from-[#FF5FA2] to-[#9B5DE5] text-white hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 px-0.5">
                <span>📍 Hawassa, Ethiopia</span>
                <span>Powered by Gemini 3.5</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
