/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  photoUrl?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  priceEtb: number;
  duration: string;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  category: 'makeup' | 'hair' | 'nails' | 'spa';
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  priceEtb: number;
  duration: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'pending_verification' | 'paid';
  receiptUrl?: string;
  transactionId?: string;
  paymentMethod?: 'telebirr' | 'bank_transfer' | 'usdt';
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'makeup_kits' | 'lipsticks' | 'foundations' | 'face_creams' | 'hair_products' | 'perfumes' | 'accessories';
  description: string;
  priceEtb: number;
  priceUsdt: number;
  rating: number;
  reviewsCount: number;
  image: string;
  stock: number;
  isPopular?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comments: string;
  category: 'service' | 'product';
  targetId: string; // serviceName or productId
  targetName: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface NewsPost {
  id: string;
  title: string;
  category: 'tips' | 'promotions' | 'announcements' | 'updates';
  blurb: string;
  content: string;
  date: string;
  author: string;
  image: string;
  views: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  priceEtb: number;
  priceUsdt: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  totalEtb: number;
  totalUsdt: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'telebirr' | 'bank_transfer' | 'usdt';
  paymentStatus: 'unpaid' | 'pending_verification' | 'paid';
  receiptUrl?: string;
  transactionId?: string;
  address: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
