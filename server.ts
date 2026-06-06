/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Set up the internal database file path
const DB_FILE = path.join(process.cwd(), 'src', 'db_store.json');

// Helper to securely load database with initial high-quality Ethiopian luxury brand data
function loadDatabase() {
  const defaultDb = {
    users: [
      {
        id: 'user_admin',
        name: 'G3 Salon Manager',
        email: 'miistir.8@gmail.com',
        phone: '0924390725',
        role: 'admin',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_demo',
        name: 'Selamawit Kebede',
        email: 'selam@gmail.com',
        phone: '0911223344',
        role: 'customer',
        photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
        createdAt: new Date().toISOString()
      }
    ],
    services: [
      {
        id: 'srv_makeup',
        name: 'Makeup Artistry',
        description: 'Premium flawless luxury face makeover with modern gold sparkles. Styled beautifully for parties and corporate elegance.',
        priceEtb: 4500,
        duration: '1.5 Hours',
        rating: 4.9,
        reviewsCount: 142,
        image: '/src/assets/images/g3_hero_model_1780749528237.png'
      },
      {
        id: 'srv_styling',
        name: 'Hair Styling & Braiding',
        description: 'Elite traditional Ethiopian styling paired with modern high-fashion cuts. Deep wave revival and hydration wash included.',
        priceEtb: 3200,
        duration: '2 Hours',
        rating: 4.8,
        reviewsCount: 98,
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800'
      },
      {
        id: 'srv_bridal',
        name: 'Bridal Dream Makeup',
        description: 'Exquisite traditional Habesha fusion bridal transformation. Comes with metallic crown styling and skin luster locks.',
        priceEtb: 15000,
        duration: '4 Hours',
        rating: 5.0,
        reviewsCount: 88,
        image: '/src/assets/images/g3_bridal_makeup_1780749559005.png'
      },
      {
        id: 'srv_facial',
        name: 'Intense Facial Treatment',
        description: 'Premium clarifying facial treatment tailored for flawless radiance and Ethiopian skin renewal. Gold face mask finish.',
        priceEtb: 2500,
        duration: '1 Hour',
        rating: 4.7,
        reviewsCount: 120,
        image: '/src/assets/images/g3_skincare_model_1780749544052.png'
      },
      {
        id: 'srv_nails',
        name: 'Nail Art Studio',
        description: 'Matte pink finish with premium gold metallic tips and custom Ethiopian luxury line work accessories.',
        priceEtb: 1800,
        duration: '1 Hour',
        rating: 4.9,
        reviewsCount: 74,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800'
      },
      {
        id: 'srv_spa',
        name: 'Aromatic Spa Therapy',
        description: 'Sensory body oil relaxation massage with therapeutic essential oils. Indulge in complete serenity.',
        priceEtb: 5000,
        duration: '2 Hours',
        rating: 4.9,
        reviewsCount: 55,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800'
      }
    ],
    products: [
      {
        id: 'prod_makeup_kit',
        name: 'G3 Royal Bridal Kit',
        category: 'makeup_kits',
        description: 'Exquisite limited-edition vanity kit for professional Habesha bridal cosmetics. Features high-coverage foundations and shimmering gold pigments.',
        priceEtb: 3600,
        priceUsdt: 30,
        rating: 5.0,
        reviewsCount: 41,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
        stock: 15,
        isPopular: true
      },
      {
        id: 'prod_lipstick',
        name: 'Matte Rose Pink Lipstick',
        category: 'lipsticks',
        description: 'Ultra-pigmented velvet formula inspired by Ethiopian blush. Long-lasting non-drying premium beauty lips luxury color.',
        priceEtb: 960,
        priceUsdt: 8,
        rating: 4.8,
        reviewsCount: 56,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
        stock: 50,
        isPopular: true
      },
      {
        id: 'prod_foundation',
        name: 'Radiance Glow Foundation',
        category: 'foundations',
        description: 'Hydrating base specifically blended for warm skin tones. Resists heat and humidity perfectly, giving a sheer glow.',
        priceEtb: 2400,
        priceUsdt: 20,
        rating: 4.9,
        reviewsCount: 78,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
        stock: 22,
        isPopular: true
      },
      {
        id: 'prod_face_cream',
        name: 'Hydra-Fresh Aloe Cream',
        category: 'face_creams',
        description: 'Calming skin moisturizer utilizing authentic aloe vera and premium glow active acids. Plumps skin in seconds.',
        priceEtb: 1200,
        priceUsdt: 10,
        rating: 4.6,
        reviewsCount: 34,
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400',
        stock: 30
      },
      {
        id: 'prod_hair_nutri',
        name: 'Herbal Curl Nourisher',
        category: 'hair_products',
        description: 'Deep scalp therapy oil rich in African rosemary and black seed extracts. Stimulates elegant strong curly hydration.',
        priceEtb: 1500,
        priceUsdt: 12,
        rating: 4.9,
        reviewsCount: 49,
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400',
        stock: 45
      },
      {
        id: 'prod_perfume',
        name: 'Royal Hawassa Essence',
        category: 'perfumes',
        description: 'Majestic floral oriental perfume capturing citrus breeze, warm amber wood notes, and sweet jasmine petals.',
        priceEtb: 4800,
        priceUsdt: 40,
        rating: 4.9,
        reviewsCount: 65,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        stock: 12,
        isPopular: true
      },
      {
        id: 'prod_brush',
        name: 'Gold Spar Glow Brush Set',
        category: 'accessories',
        description: 'Ultra-soft synthetic makeup powder brushes coated with metallic gold dust texture limits.',
        priceEtb: 720,
        priceUsdt: 6,
        rating: 4.5,
        reviewsCount: 22,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        stock: 25
      }
    ],
    bookings: [
      {
        id: 'bk_1',
        userId: 'user_demo',
        userName: 'Selamawit Kebede',
        userPhone: '0911223344',
        serviceId: 'srv_bridal',
        serviceName: 'Bridal Dream Makeup',
        date: '2026-06-15',
        time: '10:00 AM',
        priceEtb: 15000,
        duration: '4 Hours',
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'telebirr',
        transactionId: 'TX-99882234',
        notes: 'Needs heavy flower detailing in curls.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'bk_2',
        userId: 'user_demo',
        userName: 'Selamawit Kebede',
        userPhone: '0911223344',
        serviceId: 'srv_nails',
        serviceName: 'Nail Art Studio',
        date: '2026-06-20',
        time: '02:30 PM',
        priceEtb: 1800,
        duration: '1 Hour',
        status: 'pending',
        paymentStatus: 'pending_verification',
        paymentMethod: 'bank_transfer',
        notes: 'Wants gold glitter lines.',
        createdAt: new Date().toISOString()
      }
    ],
    orders: [
      {
        id: 'ord_1',
        userId: 'user_demo',
        userName: 'Selamawit Kebede',
        userPhone: '0911223344',
        items: [
          {
            id: 'item_1',
            productId: 'prod_lipstick',
            name: 'Matte Rose Pink Lipstick',
            priceEtb: 960,
            priceUsdt: 8,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'
          },
          {
            id: 'item_2',
            productId: 'prod_brush',
            name: 'Gold Spar Glow Brush Set',
            priceEtb: 720,
            priceUsdt: 6,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'
          }
        ],
        totalEtb: 2640,
        totalUsdt: 22,
        status: 'processing',
        paymentMethod: 'telebirr',
        paymentStatus: 'paid',
        transactionId: 'TX-88771122',
        address: 'Bole, Addis Ababa, Ethiopia',
        createdAt: new Date().toISOString()
      }
    ],
    reviews: [
      {
        id: 'rev_1',
        userId: 'user_demo',
        userName: 'Selamawit Kebede',
        userPhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
        rating: 5,
        comments: 'G3 Salon in Hawassa literally transformed me into a princess! Their Bridal Dream Makeup package is the absolute best in Ethiopia. High recommend!',
        category: 'service',
        targetId: 'srv_bridal',
        targetName: 'Bridal Dream Makeup',
        status: 'approved',
        date: '2026-06-01'
      },
      {
        id: 'rev_2',
        userId: 'user_active_2',
        userName: 'Mahlet Yosef',
        rating: 5,
        comments: 'Excellent quality foundations that match warm African skin complexions beautifully. No dry cracky feeling at all.',
        category: 'product',
        targetId: 'prod_foundation',
        targetName: 'Radiance Glow Foundation',
        status: 'approved',
        date: '2026-06-04'
      },
      {
        id: 'rev_3',
        userId: 'user_active_3',
        userName: 'Helena Getachew',
        rating: 4,
        comments: 'Amazing staff in Hawassa branch. The nail art is brilliant. Rose Pink + Gold sparkle looks neat.',
        category: 'service',
        targetId: 'srv_nails',
        targetName: 'Nail Art Studio',
        status: 'approved',
        date: '2026-06-05'
      }
    ],
    news: [
      {
        id: 'news_1',
        title: '5 Crucial Hydration Tips for Warm Weather Skincare',
        category: 'tips',
        blurb: 'Discover how to protect and moisturize your radiant warm glowing skin under the bright Ethiopian sun.',
        content: `Warm, dry weather can heavily strip natural moisture from your skin. To maintain that flawless luxury glow like G3 Gals, secure your daily routines:\n\n1. Drink at least 3 liters of water daily.\n2. Incorporate an aloe-vera hyaluronic hydrator or our Hydra-Fresh Aloe Cream twice a day.\n3. Wash your face using cool water to regulate open pores.\n4. Always lock with a light facial skin oil at night.\n5. Never skip high-grade SPF sunblock!`,
        date: '2026-06-05',
        author: 'Lidya Tekle, Chief Skincare Stylist',
        image: '/src/assets/images/g3_skincare_model_1780749544052.png',
        views: 312
      },
      {
        id: 'news_2',
        title: 'Grand Summer Bridal Beauty Offer!',
        category: 'promotions',
        blurb: 'Booking season is officially open! Enjoy up to 20% off G3 bridal hair styling & cosmetics packaging.',
        content: `Marriage bells are ringing! We are celebrating this incredible bridal season by lowering deposit amounts and giving an automatic 20% off code on packages booked before June 30. Your reservation will come with complementary custom floral nails, premium matte lip liners, and professional studio high-resolution portraits to commemorate the look in luxurious style. Click the booking link to book now!`,
        date: '2026-06-03',
        author: 'Executive Manager, G3 Hawassa',
        image: '/src/assets/images/g3_bridal_makeup_1780749559005.png',
        views: 520
      }
    ],
    gallery: [
      { id: 'gal_1', title: 'Elegant Bridal Glam', image: '/src/assets/images/g3_bridal_makeup_1780749559005.png', category: 'bridal' },
      { id: 'gal_2', title: 'Radiant Skincare Beauty', image: '/src/assets/images/g3_skincare_model_1780749544052.png', category: 'skincare' },
      { id: 'gal_3', title: 'Matte Rose Lipstick Portrait', image: '/src/assets/images/g3_hero_model_1780749528237.png', category: 'makeup' },
      { id: 'gal_4', title: 'Gold Metallic Nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', category: 'nails' }
    ],
    homepage: {
      headline: 'Beauty, Confidence & Elegance',
      slogan: 'Ethiopia’s Leading Premium Luxury Beauty Destination in Hawassa. Experience the finest handcrafted cosmetics, elite bridal transformations, and personalized botanical skincare services designed for queens.',
      buttonBookText: 'Book Royal Appointment',
      buttonShopText: 'Explore Cosmetic Shop',
      welcomeBanner: 'Welcome to G3 Beauty & Cosmetics. Premium Luxury and Shine are wait you!'
    }
  };

  try {
    if (!fs.existsSync(path.dirname(DB_FILE))) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const existingData = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(existingData);
      // Ensure essential fields exist
      return { ...defaultDb, ...loaded };
    } else {
      // Create new database store file with initial content
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    }
  } catch (error) {
    console.error('Error handling database file, using in-memory fallback:', error);
    return defaultDb;
  }
}

// Global reference for our database
const dbStore = loadDatabase();

// Sync to file system
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbStore, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving db_store to file:', error);
  }
}

// Initialize the GoogleGenAI instance for AI assistance
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;
if (key) {
  try {
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI initialized on server side.');
  } catch (err) {
    console.error('Failed to instantiate Gemini inside server:', err);
  }
} else {
  console.warn('GEMINI_API_KEY is not defined. AI Assistant will operate in rich heuristic backup mode.');
}

// --- API ENDPOINTS ---

// Fetch full DB for frontend synchronization
app.get('/api/db', (req, res) => {
  res.json(dbStore);
});

// Update customized homepage content (Admin feature)
app.put('/api/admin/homepage', (req, res) => {
  try {
    dbStore.homepage = { ...dbStore.homepage, ...req.body };
    saveDatabase();
    res.json({ success: true, homepage: dbStore.homepage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Manage Users Registry (Reg / Auth)
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Please provide all user registry fields.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const exists = dbStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (exists) {
    return res.status(400).json({ error: 'A user with this email already exists.' });
  }

  const newUser = {
    id: 'user_' + Date.now(),
    name,
    email: normalizedEmail,
    phone,
    role: normalizedEmail === 'miistir.8@gmail.com' ? 'admin' : 'customer',
    photoUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date().toISOString()
  };

  dbStore.users.push(newUser);
  saveDatabase();

  res.json({ success: true, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Admin account simulation bypasses standard hash for local security simplicity as instructed
  if (normalizedEmail === 'miistir.8@gmail.com' && password === 'MISTIRX8') {
    let adminUser = dbStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!adminUser) {
      adminUser = {
        id: 'user_admin',
        name: 'G3 Administrator',
        email: 'miistir.8@gmail.com',
        phone: '0924390725',
        role: 'admin',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        createdAt: new Date().toISOString()
      };
      dbStore.users.push(adminUser);
      saveDatabase();
    }
    return res.json({ success: true, user: adminUser });
  }

  // General users
  const foundUser = dbStore.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!foundUser) {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  res.json({ success: true, user: foundUser });
});

// Create Booking appointment
app.post('/api/bookings', (req, res) => {
  const { userId, userName, userPhone, serviceId, serviceName, date, time, notes } = req.body;
  if (!userId || !serviceId || !date || !time) {
    return res.status(400).json({ error: 'Please provide user, service, date, and time.' });
  }

  const selectedService = dbStore.services.find(s => s.id === serviceId);
  if (!selectedService) {
    return res.status(404).json({ error: 'Service not found.' });
  }

  const newBooking = {
    id: 'bk_' + Date.now(),
    userId,
    userName: userName || 'Anonymous Client',
    userPhone: userPhone || '0924390725',
    serviceId,
    serviceName: serviceName || selectedService.name,
    date,
    time,
    priceEtb: selectedService.priceEtb,
    duration: selectedService.duration,
    status: 'pending' as const,
    paymentStatus: 'unpaid' as const,
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  dbStore.bookings.push(newBooking);
  saveDatabase();

  res.json({ success: true, booking: newBooking });
});

// Handle Booking updates (Accept payment / Verify Receipt)
app.put('/api/admin/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus, transactionId } = req.body;

  const bookingIdx = dbStore.bookings.findIndex(b => b.id === id);
  if (bookingIdx === -1) {
    return res.status(404).json({ error: 'Booking appointment not found.' });
  }

  dbStore.bookings[bookingIdx] = {
    ...dbStore.bookings[bookingIdx],
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...(transactionId && { transactionId })
  };

  saveDatabase();
  res.json({ success: true, booking: dbStore.bookings[bookingIdx] });
});

// Log payment tracking receipts
app.post('/api/bookings/:id/payment', (req, res) => {
  const { id } = req.params;
  const { paymentMethod, transactionId, receiptUrl } = req.body;

  const bookingIdx = dbStore.bookings.findIndex(b => b.id === id);
  if (bookingIdx === -1) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  dbStore.bookings[bookingIdx] = {
    ...dbStore.bookings[bookingIdx],
    paymentMethod,
    transactionId,
    receiptUrl: receiptUrl || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300', // Mock receipt asset placeholder
    paymentStatus: 'pending_verification'
  };

  saveDatabase();
  res.json({ success: true, booking: dbStore.bookings[bookingIdx] });
});

// Products: Place Order (eCommerce)
app.post('/api/orders', (req, res) => {
  const { userId, userName, userPhone, items, totalEtb, totalUsdt, paymentMethod, address } = req.body;
  if (!userId || !items || !items.length || !paymentMethod || !address) {
    return res.status(400).json({ error: 'Please supply a checkout list with items and shipping details.' });
  }

  const newOrder = {
    id: 'ord_' + Date.now(),
    userId,
    userName: userName || 'Customer',
    userPhone: userPhone || '0924390725',
    items,
    totalEtb,
    totalUsdt,
    status: 'pending' as const,
    paymentMethod,
    paymentStatus: 'unpaid' as const,
    address,
    createdAt: new Date().toISOString()
  };

  // Adjust product stock level
  items.forEach((item: any) => {
    const prod = dbStore.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });

  dbStore.orders.push(newOrder);
  saveDatabase();

  res.json({ success: true, order: newOrder });
});

// Handle Order Updates (Admin actions)
app.put('/api/admin/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus, transactionId, receiptUrl } = req.body;

  const idx = dbStore.orders.findIndex(o => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  dbStore.orders[idx] = {
    ...dbStore.orders[idx],
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
    ...(transactionId && { transactionId }),
    ...(receiptUrl && { receiptUrl })
  };

  saveDatabase();
  res.json({ success: true, order: dbStore.orders[idx] });
});

// Submit user payment receipts for cosmetics orders
app.post('/api/orders/:id/payment', (req, res) => {
  const { id } = req.params;
  const { transactionId, receiptUrl } = req.body;

  const idx = dbStore.orders.findIndex(o => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  dbStore.orders[idx] = {
    ...dbStore.orders[idx],
    transactionId,
    receiptUrl: receiptUrl || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300',
    paymentStatus: 'pending_verification'
  };

  saveDatabase();
  res.json({ success: true, order: dbStore.orders[idx] });
});

// Review submission and updates with moderation state
app.post('/api/reviews', (req, res) => {
  const { userId, userName, rating, comments, category, targetId, targetName } = req.body;
  if (!userId || !comments || !rating) {
    return res.status(400).json({ error: 'Review text, rating, and identity are required.' });
  }

  const newReview = {
    id: 'rev_' + Date.now(),
    userId,
    userName: userName || 'G3 Glow Guest',
    userPhoto: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userName || 'Guest')}`,
    rating: Number(rating),
    comments,
    category: category || 'service',
    targetId: targetId || 'general',
    targetName: targetName || 'General service',
    status: 'pending' as const, // For moderation purposes
    date: new Date().toISOString().split('T')[0]
  };

  dbStore.reviews.push(newReview);
  saveDatabase();

  res.json({ success: true, review: newReview });
});

// Approve/Deny Reviews (Admin moderation)
app.put('/api/admin/reviews/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const idx = dbStore.reviews.findIndex(r => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Review not found.' });
  }

  dbStore.reviews[idx].status = status;
  saveDatabase();

  res.json({ success: true, review: dbStore.reviews[idx] });
});

// Products Catalog management (Admin features)
app.post('/api/admin/products', (req, res) => {
  const { name, category, description, priceEtb, priceUsdt, stock, image } = req.body;
  if (!name || !category || !priceEtb || !priceUsdt) {
    return res.status(400).json({ error: 'Product name, category, and standard pricing are required.' });
  }

  const newProd = {
    id: 'prod_' + Date.now(),
    name,
    category,
    description: description || '',
    priceEtb: Number(priceEtb),
    priceUsdt: Number(priceUsdt),
    rating: 5.0,
    reviewsCount: 0,
    image: image || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
    stock: Number(stock) || 10
  };

  dbStore.products.push(newProd);
  saveDatabase();

  res.json({ success: true, product: newProd });
});

app.put('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  const idx = dbStore.products.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  dbStore.products[idx] = {
    ...dbStore.products[idx],
    ...req.body
  };

  saveDatabase();
  res.json({ success: true, product: dbStore.products[idx] });
});

// Services management
app.post('/api/admin/services', (req, res) => {
  const { name, description, priceEtb, duration, image } = req.body;
  if (!name || !priceEtb || !duration) {
    return res.status(400).json({ error: 'Service name, and prices are required.' });
  }

  const newSrv = {
    id: 'srv_' + Date.now(),
    name,
    description: description || '',
    priceEtb: Number(priceEtb),
    duration,
    rating: 5.0,
    reviewsCount: 0,
    image: image || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800'
  };

  dbStore.services.push(newSrv);
  saveDatabase();

  res.json({ success: true, service: newSrv });
});

// Blog News & Gallery Admin uploads
app.post('/api/admin/news', (req, res) => {
  const { title, category, blurb, content, author, image } = req.body;
  const newPost = {
    id: 'news_' + Date.now(),
    title,
    category,
    blurb,
    content,
    date: new Date().toISOString().split('T')[0],
    author: author || 'G3 Salon Editor',
    image: image || '/src/assets/images/g3_hero_model_1780749528237.png',
    views: 1
  };
  dbStore.news.unshift(newPost);
  saveDatabase();
  res.json({ success: true, news: newPost });
});

app.post('/api/admin/gallery', (req, res) => {
  const { title, image, category } = req.body;
  const newItem = {
    id: 'gal_' + Date.now(),
    title,
    image: image || '/src/assets/images/g3_hero_model_1780749528237.png',
    category: category || 'salon'
  };
  dbStore.gallery.push(newItem);
  saveDatabase();
  res.json({ success: true, galleryItem: newItem });
});


// --- CHAT AND ASSISTANCE PROXIES (GEMINI INTEGRATION) ---

// Floating AI Beauty & Cosmetics Advisor Chat
app.post('/api/gemini/chat', async (req, res) => {
  const { prompt, history, skinType, makeupStyle, currentBookingAttempt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  // System instructional setup enforcing the G3 luxury beauty theme in Ethiopia
  const systemInstruction = `
You are the elite AI Beauty & Cosmetics Advisor for "G3 Beauty & Cosmetics", a world-class luxury beauty salon based in Hawassa, Ethiopia.
Your tagline is "Beauty, Confidence & Elegance".
The salon is owned and managed by the G3 team, offering makeup, hair braiding, luxury skincare masks, custom nail design, and high-fashion Habesha bridal makeovers.
Our main contact number is +251 924 390 725 (0924390725) and location is Hawassa, Ethiopia.

Supported payment methods are: Telebirr (highly recommended with direct verification), Bank Transfer (CBE, Awash, BOA), and USDT.

Guidelines:
1. Always be elegant, confident, premium, and welcoming. Speak in a sophisticated, loving beauty expert tone.
2. Maintain bilingual capabilities: Respond in the user's language choice (Amharic/አማርኛ or English). If the user writes in Amharic, greet and explain options fluently in beautiful Amharic. If in English, response in luxurious English.
3. Capabilities:
   - Answer skincare queries, diagnose skin types, suggest skincare routines (e.g. recommend "Hydra-Fresh Aloe Cream" or our intense Facial Treatment for 2,500 ETB).
   - Recommend products: Makeup Kits (G3 Royal Bridal Kit - 3,600 ETB / 30 USDT), Foundations, Lipsticks (Matte Rose Pink - 960 ETB), Perfumes (Royal Hawassa Essence - 4,800 ETB).
   - Suggest styling routines (e.g. Bridal makeup Habesha look for 15,000 ETB).
   - Help booking: Walk them through selecting from services. We have: Makeup (4,500 ETB), Hair Styling (3,200 ETB), Bridal (15,000 ETB), Facial (2,500 ETB), Nails (1,800 ETB), Spa (5,000 ETB).
   - Answer payment issues: Instruct them to upload their payment receipt screenshot on our Payments tab so our managers can verify their Booking or Order instantly.

If the user mentions:
- Skin Type: ${skinType || 'Not specified'}
- Preferred Makeup style: ${makeupStyle || 'Not specified'}
- Current Booking context: ${JSON.stringify(currentBookingAttempt || {})}

Offer localized Ethiopian recommendations, refer directly to our Hawassa branch experience, and give brief step-by-step beauty tips. Keep your response moderately concise and beautifully formatted in markdown.
`;

  if (ai) {
    try {
      // Package appropriate contents
      const chatContents: any[] = [];
      // Flatten simple history for Gemini API context compatibility
      if (history && history.length) {
        history.forEach((msg: any) => {
          chatContents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }
      chatContents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: chatContents,
        config: {
          systemInstruction,
          temperature: 0.8,
        }
      });

      return res.json({ text: response.text });
    } catch (err: any) {
      console.error('Error in Server-Side Gemini Chat:', err);
      // Fallback below
    }
  }

  // --- HEURISTIC BEAUTY CHAT REPLIES FALLBACK (IF API KEY IS ABSENT OR FAILS) ---
  const lowerPrompt = prompt.toLowerCase();
  let defaultText = '';

  // English heuristic responses
  if (lowerPrompt.includes('skin') || lowerPrompt.includes('face') || lowerPrompt.includes('acne')) {
    defaultText = `Indeed, skin hydration is paramount! As part of G3's luxury beauty program, I recommend our **Intense Facial Treatment** (2,500 ETB) in our Hawassa sanctuary, followed by daily wear of our **Hydra-Fresh Aloe Cream** (1,200 ETB). For your skin type, washing with cool water and applying refreshing rose water helps maintain standard hydration beautifully! Would you like me to book your slot?`;
  } else if (lowerPrompt.includes('makeup') || lowerPrompt.includes('lip') || lowerPrompt.includes('shine')) {
    defaultText = `For beautiful, timeless cosmetics, G3 recommended choice is our **Matte Rose Pink Lipstick** (960 ETB) paired with the premium **Radiance Glow Foundation** (2,400 ETB). This combination keeps warm skin glowing, fresh, and matte under any warm Ethiopian climates! I can guide you to our Shop or checkout pages to order.`;
  } else if (lowerPrompt.includes('book') || lowerPrompt.includes('appointment') || lowerPrompt.includes('reserve')) {
    defaultText = `I would be happy to coordinate your appointment! You can book **Bridal Dream Makeup** (15,000 ETB), **Hair Styling** (3,200 ETB), or **Nail Art** (1,800 ETB). Go straight to our Booking page tab, select your preferred date/time, and complete your reservation. We accept Telebirr or bank transfers easily!`;
  } else if (lowerPrompt.includes('payment') || lowerPrompt.includes('telebirr') || lowerPrompt.includes('pay')) {
    defaultText = `Payment instruction for G3: You can pay securely using **Telebirr (0924390725)**, Bank Transfer, or secure USDT! Once paid, upload your transfer screenshot receipt on the 'Payments' tab. Our Hawassa branch will instant-review and activate your booking status.`;
  } else if (lowerPrompt.includes('amharic') || lowerPrompt.includes('ሰላም') || lowerPrompt.includes('አማርኛ') || lowerPrompt.includes('ቅናሽ') || lowerPrompt.includes('ዋጋ')) {
    defaultText = `ሰላም! የ G3 Beauty & Cosmetics ረዳት ነኝ። በደስታ እረዳዎታለሁ! በሐዋሳ ከተማ የሚገኘውን ውብ ሳሎናችንን ጎብኝተው የሙሽራ ሜካፕ (15,000 ETB) ፣ የፀጉር ስታይል (3,200 ETB) ወይም የፊት ህክምና (2,500 ETB) ማስያዝ ይችላሉ። ክፍያዎችን በቴሌብር (0924390725) መፈጸም ይችላሉ። ምን ልርዳዎት?`;
  } else {
    defaultText = `Welcome to G3 Beauty & Cosmetics — Beauty, Confidence & Elegance! I'm your bilingual premium advisor. I can suggest customized cosmetic skincare routines, skincare types, makeup collections, or guide you through creating bookings and making secure payments using Telebirr. Ask me anything in English or Amharic (አማርኛ)!`;
  }

  res.json({ text: defaultText });
});

// Admin AI Assistant endpoint
app.post('/api/gemini/admin-report', async (req, res) => {
  const { email } = req.body;
  if (!email || email !== 'miistir.8@gmail.com') {
    return res.status(403).json({ error: 'Access denied: Admin credentials required.' });
  }

  // Gather current real-time stats
  const salesEtb = dbStore.orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalEtb : 0), 0) +
                   dbStore.bookings.reduce((acc, b) => acc + (b.paymentStatus === 'paid' ? b.priceEtb : 0), 0);
  const salesUsdt = dbStore.orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalUsdt : 0), 0);
  const bookingsCount = dbStore.bookings.length;
  const usersCount = dbStore.users.length;
  const pendingPayments = dbStore.bookings.filter(b => b.paymentStatus === 'pending_verification').length +
                          dbStore.orders.filter(o => o.paymentStatus === 'pending_verification').length;

  const adminPrompt = `
Generate a premium salon business analysis for the G3 Beauty & Cosmetics Admin.
We are located in Hawassa, Ethiopia.
Here are our real-time metrics:
- Total Revenue (ETB): ${salesEtb} ETB
- Total Revenue (USDT): ${salesUsdt} USDT
- Total Registered Customers: ${usersCount}
- Active Appointments Booked: ${bookingsCount}
- Pending Payments verifying: ${pendingPayments}
- Current Top Sellers: G3 Royal Bridal Kit, Matte Rose Lipstick, Radiance Glow base.

Please formulate:
1. A concise luxurious overview of current performance in Hawassa.
2. 3 Actionable business suggestions to boost sales (e.g. bridal season targeting, lip gloss bundles, localized social media marketing).
3. A short review assessment.
Speak directly to the salon owner (Mistir) in a highly professional, encouraging, analytical, and elegant tone. Include beautiful formatting.
`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: adminPrompt,
        config: {
          systemInstruction: 'You are the Elite Business Intelligence Consultant for G3 Beauty & Cosmetics Luxury Board.'
        }
      });
      return res.json({ text: response.text });
    } catch (err) {
      console.error('Error generating AI admin report:', err);
    }
  }

  // Rich fallback report
  const fallbackReport = `
# Executive Performance Report & Analytics
*Prepared by G3 Beauty AI Consultant - Hawassa Branch*

Greetings, Board Director Mistir. Below is your optimized salon performance synopsis based on current cloud integrations:

### 📈 Current Financial State
- **Total Accrued Revenue**: **${salesEtb} ETB** (combined verified bookings & direct products sales).
- **Crypto Ingress**: **${salesUsdt} USDT** (growing cross-border beauty community).
- **Client base size**: **${usersCount} loyal registered customers** in Hawassa and Addis.
- **Verification Queue**: **${pendingPayments} transaction receipts** awaiting your admin click-approval.

### 💡 Strategic Business Recommendations
1. **Bridal Bundle Upselling**: Leverage our highly-demanded **Bridal Dream Makeup** (15,000 ETB) by bundling it with complementary custom manicure **Nail Art** (valued at 1,800 ETB) at a celebratory summer rate. This increases salon seat yields in Hawassa.
2. **Interactive Social Media Campaigns**: The **Matte Rose Pink Lipstick** is very popular. Encourage client transformation sharing on TikTok and Telegram with a unique G3 tag for a 10% next-service voucher code.
3. **Optimized Booking Windows**: Open slots for evening Facial skin recovery masks midway through the week to utilize off-peak capacity.

*You hold full administrator privileges to modify bookings, products, and receipts instantly via your admin analytics dashboard logs.*
`;

  res.json({ text: fallbackReport });
});


// --- SERVING ENGINE AND VITE MIDDLED ---

const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`G3 server is actively running on host http://0.0.0.0:${PORT}`);
  });
};

startServer();
