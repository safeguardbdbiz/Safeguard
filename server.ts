import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Ensure data directory exists for catalog persistence
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const SITE_CONTENT_FILE = path.join(DATA_DIR, "site_content.json");
const WHY_US_FILE = path.join(DATA_DIR, "why_us.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const FAQS_FILE = path.join(DATA_DIR, "faqs.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const PAYMENT_METHODS_FILE = path.join(DATA_DIR, "payment_methods.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");
const META_FILE = path.join(DATA_DIR, "meta.json");

// Helper to safely read JSON with default fallback
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Helper to safely write JSON
function writeJsonFile(filePath: string, data: any): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

function touchLastUpdated(): number {
  const now = Date.now();
  writeJsonFile(META_FILE, { lastUpdated: now });
  return now;
}

function getLastUpdated(): number {
  try {
    if (fs.existsSync(META_FILE)) {
      const data = JSON.parse(fs.readFileSync(META_FILE, "utf-8"));
      return data.lastUpdated || Date.now();
    }
  } catch (e) {}
  return touchLastUpdated();
}

// Seed default data if files do not exist
const SEED_CATEGORIES = [
  { id: "all", name: "All", banglaName: "সব পণ্য", icon: "fa-cubes" },
  { id: "Smart Gadgets", name: "Smart Gadgets", banglaName: "স্মার্ট গ্যাজেট", icon: "fa-microchip" },
  { id: "Home Gadgets", name: "Home Gadgets", banglaName: "হোম গ্যাজেট", icon: "fa-house-laptop" },
  { id: "Kitchen", name: "Kitchen", banglaName: "কিচেন", icon: "fa-utensils" },
  { id: "Mobile Accessories", name: "Mobile Accessories", banglaName: "মোবাইল এক্সেসরিজ", icon: "fa-mobile-screen-button" },
  { id: "Fire Safety", name: "Fire Safety", banglaName: "ফায়ার  সেফটি", icon: "fa-shield-halved" }
];

const SEED_PRODUCTS = [
  {
    id: 1,
    name: "Mini Electric Food Chopper",
    banglaName: "মিনি ইলেকট্রিক ফুড চপার",
    price: 850,
    oldPrice: 1200,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
    description: "রসুন, পিঁয়াজ, আদা, বাদাম ও মাংস মাত্র ১০ সেকেন্ডে নিখুঁত চপ করার প্রিমিয়াম ইলেকট্রিক চপার। ইউএসবি রিচার্জেবল ও স্টেইনলেস স্টিল ব্লেড।",
    features: [
      "মাত্র ১০ সেকেন্ডে দ্রুত চপিং",
      "৩ লেয়ার এস-শেপ স্টেইনলেস ব্লেড",
      "ইউএসবি রিচার্জেবল ব্যাটারি",
      "ফুড-গ্রেড বিপিএ-মুক্ত বাটি",
      "ওয়ান-টাচ পাওয়ার সুইচ"
    ],
    specs: {
      "ক্যাপাসিটি": "২৫০ মিলি",
      "পাওয়ার / মোটর": "৪৫ ওয়াট হাই স্পিড",
      "ব্যাটারি ব্যাকআপ": "১২০০ mAh (এক চার্জে ৩৫+ বার ব্যবহার)",
      "চার্জিং পোর্ট": "USB Type-C",
      "ম্যাটেরিয়াল": "ফুড-গ্রেড প্লাস্টিক ও 304 স্টিল ব্লেড",
      "ওয়ারেন্টি": "৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি"
    }
  },
  {
    id: 2,
    name: "Rechargeable Mini Desk Fan",
    banglaName: "রিচার্জেবল পোর্টেবল ডেস্ক ফ্যান",
    price: 1150,
    oldPrice: 1650,
    category: "Home Gadgets",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
    description: "লোডশেডিংয়ে দীর্ঘ ব্যাটারি ব্যাকআপ, ৩ স্পিড কন্ট্রোল ও সাইলেন্ট মোটরযুক্ত প্রিমিয়াম মিনি ফ্যান।",
    features: [
      "৩ টি অ্যাডজাস্টেবল স্পিড মোড",
      "আল্ট্রা-সাইলেন্ট ব্রাশলেস মোটর",
      "১২০ ডিগ্রি রোটেটিং হেড",
      "কম্প্যাক্ট ও সহজে বহনযোগ্য",
      "ডেস্ক ও ঝুলিয়ে ব্যবহারের সুবিধা"
    ],
    specs: {
      "ক্যাপাসিটি": "৪ ইঞ্চি ৫-ব্লেড টার্বো ফ্যান",
      "পাওয়ার / মোটর": "৫ ওয়াট ব্রাশলেস কপার মোটর",
      "ব্যাটারি ব্যাকআপ": "২০০০ mAh (৪ থেকে ৭ ঘণ্টা ব্যাকআপ)",
      "চার্জিং পোর্ট": "Micro-USB / Type-C",
      "ম্যাটেরিয়াল": "প্রিমিয়াম ABS পলিমার",
      "ওয়ারেন্টি": "৬ মাস ওয়ারেন্টি"
    }
  },
  {
    id: 3,
    name: "3-in-1 Fast Charging Cable",
    banglaName: "৩-ইন-১ ফাস্ট চার্জিং কেবল",
    price: 420,
    oldPrice: 650,
    category: "Mobile Accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    description: "Type-C, Micro-USB ও Lightning একই ক্যাবলে। শক্তিশালী নাইলন ব্রেইডেড কোটিং সহ ফাস্ট চার্জিং সাপোর্ট।",
    features: [
      "একই সাথে ৩টি ডিভাইস চার্জিং",
      "অ্যালয় মেটাল কানেক্টর ও জংরোধী",
      "নাইলন ব্রেইডেড দীর্ঘস্থায়ী ডিজাইন",
      "স্মার্ট পাওয়ার ম্যানেজমেন্ট চিপ",
      "হাই-স্পিড ডেটা সিঙ্ক ও চার্জিং"
    ],
    specs: {
      "ক্যাপাসিটি": "১.২ মিটার দৈর্ঘ্য",
      "পাওয়ার / মোটর": "3.5A ম্যাক্সিমাম ফাস্ট কারেন্ট",
      "ব্যাটারি ব্যাকআপ": "প্রযোজ্য নয় (ডাইরেক্ট কেবল)",
      "চার্জিং পোর্ট": "USB-A to Type-C, Lightning, Micro-USB",
      "ম্যাটেরিয়াল": "হেভি ডিউটি নাইলন ও অ্যালুমিনিয়াম অ্যালয়",
      "ওয়ারেন্টি": "১ বছর সার্ভিস ওয়ারেন্টি"
    }
  },
  {
    id: 4,
    name: "Smart LED Motion Sensor Light",
    banglaName: "স্মার্ট মোশন সেন্সর লাইট",
    price: 550,
    oldPrice: 850,
    category: "Home Gadgets",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    description: "মানুষের উপস্থিতি বুঝতে পেরে স্বয়ংক্রিয়ভাবে জ্বলে ওঠে। ওয়ারড্রব, সিঁড়ি ও বেডরুমের জন্য অত্যন্ত উপযোগী।",
    features: [
      "৩-৫ মিটার দূরত্বে মোশন ডিটেকশন",
      "২৫ সেকেন্ড পর অটো অফ সিস্টেম",
      "ম্যাগনেটিক ও স্টিকার মাউন্টিং",
      "চোখের জন্য আরামদায়ক ওয়ার্ম হোয়াইট আলো",
      "ওয়্যারলেস রিচার্জেবল সুবিধা"
    ],
    specs: {
      "ক্যাপাসিটি": "২০ সেমি দৈর্ঘ্য / ৮টি হাই-ব্রাইট LED",
      "পাওয়ার / মোটর": "২ ওয়াট এনার্জি সেভিং LED",
      "ব্যাটারি ব্যাকআপ": "৮০০ mAh (সেন্সর মোডে ৩০+ দিন ব্যাকআপ)",
      "চার্জিং পোর্ট": "USB রিচার্জেবল",
      "ম্যাটেরিয়াল": "হিট-রেজিস্ট্যান্ট অ্যালুমিনিয়াম ও অ্যাক্রিলিক",
      "ওয়ারেন্টি": "৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি"
    }
  },
  {
    id: 5,
    name: "Portable USB Juice Blender",
    banglaName: "পোর্টেবল ইউএসবি ফ্রুট ব্লেন্ডার",
    price: 1350,
    oldPrice: 1950,
    category: "Kitchen",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80",
    description: "সতেজ ফলের জুস ও স্মুদি বানান যেকোনো জায়গায়। ইউএসবি চার্জিং এবং ফুড-গ্রেড ব্লেড ও জার।",
    features: [
      "৬ টি হাই-পাওয়ার্ড 3D স্টেইনলেস ব্লেড",
      "বোতলের মতোই বহন করে জুস খাওয়ার সুযোগ",
      "সেফটি ইন্টারলক ও অ্যান্টি-লিক ক্যাপ",
      "সহজে ধোয়ার জন্য ওয়ান-টাচ সেলফ-ক্লিন",
      "অফিস, জিম ও ট্রাভেলের জন্য পারফেক্ট"
    ],
    specs: {
      "ক্যাপাসিটি": "৩৮০ মিলি জুস জার",
      "পাওয়ার / মোটর": "২২,০০০ RPM হাই-টর্ক মোটর",
      "ব্যাটারি ব্যাকআপ": "২০০০ mAh (এক চার্জে ১০-১২ গ্লাস জুস)",
      "চার্জিং পোর্ট": "USB রিচার্জেবল",
      "ম্যাটেরিয়াল": "ফুড-গ্রেড পলিপ্রোপিলিন ও 304 স্টিল ব্লেড",
      "ওয়ারেন্টি": "৬ মাস রিপ্লেসমেন্ট ওয়ারেন্টি"
    }
  },
  {
    id: 6,
    name: "Wireless Car Phone Charger",
    banglaName: "স্মার্ট অটো ক্ল্যাম্পিং কার চার্জার",
    price: 1450,
    oldPrice: 2100,
    category: "Smart Gadgets",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80",
    description: "অটো সেন্সর ক্ল্যাম্পিং ও ফাস্ট ওয়্যারলেস চার্জার। ড্রাইভিং করার সময় সহজে একহাতে ফোন মাউন্ট করুন।",
    features: [
      "ইনফ্রারেড স্মার্ট অটো সেন্সর ক্ল্যাম্পিং",
      "১৫ ওয়াট Qi ফাস্ট ওয়্যারলেস চার্জিং",
      "৩৬০ ডিগ্রি রোটেটিং এয়ার ভেন্ট গ্রিপ",
      "ওভার-ভোল্টেজ ও টেম্পারেচার প্রটেকশন",
      "সব সাইজের স্মার্টফোনে সাপোর্ট"
    ],
    specs: {
      "ক্যাপাসিটি": "৪.০ থেকে ৬.৯ ইঞ্চি সব স্মার্টফোন",
      "পাওয়ার / মোটর": "১৫ ওয়াট কিউআই ওয়্যারলেস আউটপুট",
      "ব্যাটারি ব্যাকআপ": "ইনবিল্ট সুপারক্যাপাসিটর (ইঞ্জিন বন্ধ হলেও খোলে)",
      "চার্জিং পোর্ট": "Type-C ফাস্ট ইনপুট",
      "ম্যাটেরিয়াল": "গ্লাস প্যানেল ও মেটালিক অ্যালয় ফ্রেম",
      "ওয়ারেন্টি": "১ বছর অফিসিয়াল ওয়ারেন্টি"
    }
  }
];

const SEED_SITE_CONTENT = {
  brand: {
    name: "GadgetBazar BD",
    tagline: "স্মার্ট গ্যাজেটের নির্ভরযোগ্য ঠিকানা",
    logoType: "icon",
    logoIcon: "fa-microchip",
    logoImageUrl: "",
    accentColor: "#008bf5"
  },
  announcement: {
    left1: "সারাদেশে দ্রুততম হোম ডেলিভারি",
    left2: "পণ্য হাতে পেয়ে টাকা দিন (COD)",
    banner: "আজকের বিশেষ অফার: সকল গ্যাজেটে মেগা ডিসকাউন্ট!",
    phone: "01700-000000",
    phoneRaw: "01700000000"
  },
  hero: {
    badge: "সেরা গ্যাজেট ও লাইফস্টাইল কালেকশন",
    title: "আপনার প্রয়োজনীয় <span class=\"text-[#008bf5]\">স্মার্ট গ্যাজেট,</span><br class=\"hidden sm:inline\" /> এখন হাতের নাগালে!",
    subtitle: "দৈনন্দিন জীবনকে আরও সহজ ও আরামদায়ক করতে বেছে নিন সেরা কোয়ালিটির গ্যাজেট। সারাদেশে ক্যাশ অন ডেলিভারি ও দ্রুততম হোম ডেলিভারি সুবিধা!",
    btn1Text: "এখনই অর্ডার করুন",
    btn2Text: "আজকের মেগা ছাড়",
    trust1: "ক্যাশ অন ডেলিভারি",
    trust2: "২৪-৭২ ঘণ্টার ডেলিভারি",
    trust3: "১০০% অরিজিনাল",
    featuredImage: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
    featuredTitle: "মিনি ইলেকট্রিক ফুড চপার",
    featuredPrice: "৳৮৫০",
    featuredOldPrice: "৳১২০০"
  },
  offer: {
    badge: "🔥 সীমিত সময়ের মেগা অফার",
    title: "আজকের বিশেষ ক্যাশব্যাক ও ছাড়!",
    subtitle: "অফারটি শেষ হওয়ার আগেই আপনার পছন্দের গ্যাজেট অর্ডার করুন। স্টক সীমিত!",
    btn1Text: "অফারটি গ্রহণ করুন",
    btn2Text: "সব অফার দেখুন"
  },
  footer: {
    about: "বাংলাদেশের নির্ভরযোগ্য স্মার্ট গ্যাজেট স্টোর। আমরা মানসম্মত গ্যাজেট দ্রুততম সময়ে আপনার দোরগোড়ায় পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।",
    phone: "01700-000000",
    phoneRaw: "01700000000",
    whatsapp: "01700-000000",
    email: "safeguardbd.biz@gmail.com",
    hours: "প্রতিদিন সকাল ৯টা - রাত ১১টা",
    copyright: "© 2026 GadgetBazar BD. সর্বস্বত্ব সংরক্ষিত।"
  },
  trustBar: [
    { id: 1, icon: "fa-truck-fast", title: "সারা দেশে হোম ডেলিভারি", subtitle: "২৪ থেকে ৭২ ঘণ্টায় পৌঁছাবে" },
    { id: 2, icon: "fa-hand-holding-dollar", title: "ক্যাশ অন ডেলিভারি", subtitle: "পণ্য হাতে পেয়ে টাকা দিন" },
    { id: 3, icon: "fa-shield-halved", title: "১০০% অরিজিনাল গ্যাজেট", subtitle: "কোয়ালিটি চেক ও প্রিমিয়াম" },
    { id: 4, icon: "fa-rotate-left", title: "৭ দিনের রিটার্ন সুবিধা", subtitle: "সহজ রিপ্লেসমেন্ট পলিসি" }
  ]
};

const SEED_WHY_US = [
  { id: 1, icon: "fa-box-check", title: "১০০% জেনুইন প্রোডাক্ট", desc: "প্রতিটি পণ্য কঠোর কোয়ালিটি ইনস্পেকশন শেষে যত্নসহকারে প্যাকেজিং করে পাঠানো হয়।" },
  { id: 2, icon: "fa-rotate-left", title: "৭ দিনের সহজ রিটার্ন", desc: "পণ্য কোনো সমস্যাযুক্ত হলে বা অমিল পেলে ৭ দিনের মধ্যে বিনা দ্বিধায় রিটার্ন বা রিপ্লেসমেন্ট সুবিধা।" },
  { id: 3, icon: "fa-headset", title: "২৪/৭ ডেডিকেটেড সাপোর্ট", desc: "অর্ডার ট্র্যাকিং, ব্যবহারবিধি বা যে কোনো জিজ্ঞাসায় আমাদের কাস্টমার সাপোর্ট সর্বদা প্রস্তুত।" }
];

const SEED_REVIEWS = [
  { id: 1, author: "তানভীর আহমেদ", text: "ফুড চপারটি অর্ডার করেছিলাম। মাত্র ২ দিনে ডেলিভারি পেয়েছি। কোয়ালিটি খুবই চমৎকার, মসলা ও পিঁয়াজ দারুণ চপ হয়!", rating: 5, badge: "ভেরিফাইড ক্রেতা" },
  { id: 2, author: "সাদিয়া ইসলাম", text: "মিনি ফ্যানের বাতাস অনেক সুন্দর এবং ব্যাটারি ব্যাকআপ দারুণ। গরমে ও লোডশেডিংয়ে অনেক স্বস্তি দিচ্ছে।", rating: 5, badge: "ভেরিফাইড ক্রেতা" },
  { id: 3, author: "মাহমুদুল হাসান", text: "মোশন সেন্সর লাইটটি অসাধারণ। আলমারির ভিতরে লাগিয়েছি, গেট খুললেই চমৎকার আলো দেয়। ধন্যবাদ গ্যাজেট বাজার!", rating: 5, badge: "ভেরিফাইড ক্রেতা" }
];

const SEED_FAQS = [
  { id: 1, question: "কিভাবে অনলাইনে অর্ডার করব?", answer: "আপনার পছন্দের পণ্যের নিচে 'অর্ডার করুন' বাটনে ক্লিক করুন। এরপর আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা লিখে 'অর্ডার নিশ্চিত করুন' এ চাপ দিন। কোনো ঝামেলা ছাড়াই তাৎক্ষণিকভাবে আপনার অর্ডারটি সম্পন্ন হয়ে যাবে।" },
  { id: 2, question: "ডেলিভারি হতে কত দিন সময় লাগে?", answer: "ঢাকার মধ্যে সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে সমগ্র বাংলাদেশে ৪৮ থেকে ৭২ ঘণ্টার মধ্যে দ্রুততম ক্যাশ অন ডেলিভারি সম্পন্ন করা হয়।" },
  { id: 3, question: "ডেলিভারি চার্জ কত টাকা?", answer: "ঢাকার ভেতরে হোম ডেলিভারি চার্জ মাত্র ৭০ টাকা এবং ঢাকার বাইরে সমগ্র বাংলাদেশে জেলা বা উপজেলা পর্যায়ে ডেলিভারি চার্জ ১৩০ টাকা।" },
  { id: 4, question: "পণ্য হাতে পেয়ে চেক করার সুযোগ আছে কি?", answer: "হ্যাঁ, অবশ্যই! ডেলিভারি ম্যানের সামনে পার্সেলটি খুলে পণ্যটি সঠিকভাবে দেখে ও যাচাই করে ক্যাশ অন ডেলিভারিতে নগদ টাকা পরিশোধ করতে পারবেন।" },
  { id: 5, question: "ঢাকার বাইরে অগ্রিম টাকা দেওয়া লাগবে কি?", answer: "না, কোনো প্রকার অগ্রিম টাকা দেওয়ার প্রয়োজন নেই। পুরো টাকাই ক্যাশ অন ডেলিভারিতে পণ্য হাতে পেয়ে নিশ্চিত হয়ে পরিশোধ করতে পারবেন।" },
  { id: 6, question: "পেমেন্ট করার কি কি মাধ্যম রয়েছে?", answer: "ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে নগদ টাকা দেওয়া) ছাড়াও আপনি বিকাশ (bKash), নগদ (Nagad) বা রকেটের মাধ্যমে নিরাপদ ডিজিটাল পেমেন্ট করতে পারবেন।" },
  { id: 7, question: "পণ্য ত্রুটিপূর্ণ হলে বা অমিল পেলে কীভাবে পরিবর্তন বা রিটার্ন করব?", answer: "ডেলিভারি পাওয়ার ৭ দিনের মধ্যে আমাদের হেল্পলাইন বা হোয়াটসঅ্যাপে যোগাযোগ করলে আমরা কোনো প্রকার বাড়তি চার্জ ছাড়াই দ্রুত পণ্য পরিবর্তন বা রিপ্লেসমেন্ট (৭ দিনের রিপ্লেসমেন্ট ওয়ারেন্টি) করে দেব।" },
  { id: 8, question: "অর্ডার কনফার্ম হয়েছে কি না কীভাবে নিশ্চিত হব?", answer: "অর্ডার সাবমিট করার সাথে সাথেই আপনি স্ক্রিনে আপনার ইউনিক 'অর্ডার আইডি' সহ কনফার্মেশন রসিদ দেখতে পাবেন। এছাড়াও আমাদের কাস্টমার সাপোর্ট টিম থেকে ফোন বা হোয়াটসঅ্যাপে কল করে অর্ডারটি নিশ্চিত করা হবে।" },
  { id: 9, question: "পণ্যের গুণগত মান এবং আসল পণ্য পাওয়ার নিশ্চয়তা কি?", answer: "আমরা ১০০% জেনুইন এবং প্রিমিয়াম কোয়ালিটি গ্যাজেট সরাসরি নির্ভরযোগ্য সোর্স থেকে সরবরাহ করি। প্রতিটি পণ্য কঠোরভাবে পরীক্ষা করে যত্নসহকারে বাবল প্যাকেজিং করে পাঠানো হয়।" },
  { id: 10, question: "অর্ডার ট্র্যাক বা পার্সেলের বর্তমান অবস্থা কীভাবে জানব?", answer: "অর্ডার সম্পন্ন হওয়ার পর পাওয়া ইউনিক অর্ডার আইডি অথবা আপনার মোবাইল নম্বর দিয়ে আমাদের হেল্পলাইন বা হোয়াটসঅ্যাপে যেকোনো সময় মেসেজ দিলে মুহূর্তেই আপনার পার্সেলের সর্বশেষ কুরিয়ার অবস্থান জানিয়ে দেওয়া হবে।" },
  { id: 11, question: "অর্ডার পরিবর্তন বা বাতিল (Cancel) করতে চাইলে কী করব?", answer: "যদি ভুলবশত অর্ডার দিয়ে থাকেন অথবা ঠিকানা/কালার পরিবর্তন করতে চান, তবে পার্সেল কুরিয়ারে হস্তান্তরের পূর্বেই দ্রুত আমাদের হোয়াটসঅ্যাপে মেসেজ দিন অথবা হেল্পলাইন নম্বরে কল করুন।" },
  { id: 12, question: "ক্যাশ অন ডেলিভারিতে কি কোনো বাড়তি লুকানো চার্জ আছে?", answer: "না, কোনো প্রকার লুকানো বা অতিরিক্ত চার্জ নেই। ইনভয়েসে উল্লেখিত পণ্যের মূল্য এবং নির্ধারিত ডেলিভারি চার্জ ব্যতীত আপনাকে অতিরিক্ত কোনো টাকা প্রদান করতে হবে না।" }
];

// Initialize default files if missing
if (!fs.existsSync(CATEGORIES_FILE)) writeJsonFile(CATEGORIES_FILE, SEED_CATEGORIES);
if (!fs.existsSync(PRODUCTS_FILE)) writeJsonFile(PRODUCTS_FILE, SEED_PRODUCTS);
if (!fs.existsSync(SITE_CONTENT_FILE)) writeJsonFile(SITE_CONTENT_FILE, SEED_SITE_CONTENT);
if (!fs.existsSync(WHY_US_FILE)) writeJsonFile(WHY_US_FILE, SEED_WHY_US);
if (!fs.existsSync(REVIEWS_FILE)) writeJsonFile(REVIEWS_FILE, SEED_REVIEWS);
if (!fs.existsSync(FAQS_FILE)) writeJsonFile(FAQS_FILE, SEED_FAQS);
if (!fs.existsSync(ORDERS_FILE)) writeJsonFile(ORDERS_FILE, []);
const SEED_PAYMENT_METHODS = [
  {
    id: "pm_bkash",
    provider: "bKash",
    providerBangla: "বিকাশ",
    number: "01763732273",
    type: "Personal",
    typeBangla: "পার্সোনাল",
    instruction: "বিকাশ অ্যাপ অথবা *247# ডায়াল করে Send Money করুন এবং ট্রানজেকশন আইডি দিন",
    active: true
  },
  {
    id: "pm_nagad",
    provider: "Nagad",
    providerBangla: "নগদ",
    number: "01763732273",
    type: "Personal",
    typeBangla: "পার্সোনাল",
    instruction: "নগদ অ্যাপ অথবা *167# ডায়াল করে Send Money করুন এবং ট্রানজেকশন আইডি দিন",
    active: true
  },
  {
    id: "pm_teletalk",
    provider: "Teletalk",
    providerBangla: "টেলিটক",
    number: "01550000000",
    type: "Personal",
    typeBangla: "পার্সোনাল",
    instruction: "টেলিটক নম্বরে পেমেন্ট বা রিচার্জ সম্পন্ন করুন এবং ট্রানজেকশন কোড দিন",
    active: true
  },
  {
    id: "pm_rocket",
    provider: "Rocket",
    providerBangla: "রকেট",
    number: "01763732273-0",
    type: "Personal",
    typeBangla: "পার্সোনাল",
    instruction: "রকেট অ্যাপ অথবা *322# ডায়াল করে Send Money করুন এবং ট্রানজেকশন আইডি দিন",
    active: false
  }
];

if (!fs.existsSync(PAYMENT_METHODS_FILE)) writeJsonFile(PAYMENT_METHODS_FILE, SEED_PAYMENT_METHODS);
if (!fs.existsSync(ADMIN_FILE)) writeJsonFile(ADMIN_FILE, { password: "MAQuaiyum@123" });
if (!fs.existsSync(META_FILE)) touchLastUpdated();

// In-memory store for orders (retains recent orders during runtime)
interface OrderRecord {
  orderId: string;
  dateTime: string;
  productId: number;
  productName: string;
  productBanglaName?: string;
  color: string;
  size: string;
  quantity: number;
  productPrice: number;
  productTotal: number;
  deliveryCharge: number;
  totalPrice: number;
  customerName: string;
  phone: string;
  district: string;
  fullAddress: string;
  paymentMethod: string;
  paymentCode: string;
  orderSource: string;
  orderStatus?: string;
  createdAt: string;
}

let recentOrders: OrderRecord[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Cross-Origin Resource Sharing (CORS) for external Blogger/Blogspot & mobile devices
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Dynamic Blogger Theme Route before static serving so it is always fresh with live data
  app.get(["/single-file-blogspot.html", "/download/single-file-blogspot.html"], (req, res) => {
    const compiled = generateCompiledBloggerTheme();
    if (req.query.download === "1" || req.query.download === "true" || req.path.includes("download")) {
      res.setHeader("Content-Disposition", 'attachment; filename="single-file-blogspot.html"');
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    return res.send(compiled);
  });

  // Static serving for public assets if needed
  app.use(express.static(path.join(process.cwd(), "public")));

  // API Routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      serverTime: new Date().toISOString(),
      telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
      googleScriptConfigured: Boolean(process.env.GOOGLE_SCRIPT_URL)
    });
  });

  // Full Multi-Device Sync Bundle API
  app.get("/api/sync", (req, res) => {
    try {
      const products = readJsonFile(PRODUCTS_FILE, SEED_PRODUCTS);
      const categories = readJsonFile(CATEGORIES_FILE, SEED_CATEGORIES);
      const siteContent = readJsonFile(SITE_CONTENT_FILE, SEED_SITE_CONTENT);
      const whyUs = readJsonFile(WHY_US_FILE, SEED_WHY_US);
      const reviews = readJsonFile(REVIEWS_FILE, SEED_REVIEWS);
      const faqs = readJsonFile(FAQS_FILE, SEED_FAQS);
      const orders = readJsonFile(ORDERS_FILE, []);
      const paymentMethods = readJsonFile(PAYMENT_METHODS_FILE, SEED_PAYMENT_METHODS);
      const settings = readJsonFile(SETTINGS_FILE, {
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
        telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
        googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || "",
        whatsappNumber: "01700000000"
      });
      const admin = readJsonFile(ADMIN_FILE, { password: "MAQuaiyum@123" });
      const lastUpdated = getLastUpdated();

      return res.json({
        products,
        categories,
        siteContent,
        whyUs,
        reviews,
        faqs,
        orders,
        paymentMethods,
        settings,
        adminPassword: admin.password || "MAQuaiyum@123",
        lastUpdated
      });
    } catch (err) {
      console.error("Error generating sync payload:", err);
      return res.status(500).json({ error: "Failed to load sync payload" });
    }
  });

  // Settings API (Telegram, Google Apps Script, WhatsApp)
  app.get("/api/settings", (req, res) => {
    const settings = readJsonFile(SETTINGS_FILE, {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
      telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
      googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || "",
      whatsappNumber: "01700000000"
    });
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    try {
      const current = readJsonFile(SETTINGS_FILE, {
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
        telegramChatId: process.env.TELEGRAM_CHAT_ID || "",
        googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || "",
        whatsappNumber: "01700000000"
      });
      const updated = { ...current, ...req.body };
      writeJsonFile(SETTINGS_FILE, updated);
      touchLastUpdated();
      return res.json({ success: true, settings: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Test Telegram Notification
  app.post("/api/test-telegram", async (req, res) => {
    try {
      const { token, chatId } = req.body;
      const botToken = token || process.env.TELEGRAM_BOT_TOKEN;
      const targetChatId = chatId || process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !targetChatId) {
        return res.status(400).json({ success: false, message: "Bot Token এবং Chat ID আবশ্যক।" });
      }

      const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const tgRes = await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: `🔔 *টেস্ট নোটিফিকেশন সফল! (Test Message)*\n\nআপনার অনলাইন স্টোরের সাথে টেলিগ্রাম বট সফলভাবে কানেক্ট হয়েছে। এখন থেকে কোনো কাস্টমার অর্ডার করলেই সাথে সাথে এখানে নোটিফিকেশন পাবেন।\n\n⏰ সময়: ${new Date().toLocaleString("bn-BD")}`,
          parse_mode: "Markdown"
        })
      });
      const tgData = await tgRes.json();
      if (tgData.ok) {
        return res.json({ success: true, message: "টেলিগ্রামে টেস্ট মেসেজ সফলভাবে পাঠানো হয়েছে!" });
      } else {
        return res.status(400).json({ success: false, message: tgData.description || "টেলিগ্রাম কানেকশন ব্যর্থ হয়েছে।" });
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // Timestamp check for low-overhead client polling (e.g. mobile checking if laptop changed data)
  app.get("/api/sync/timestamp", (req, res) => {
    return res.json({ lastUpdated: getLastUpdated() });
  });

  // Helper to compile Blogger theme with 100% current data and pre-rendered branding
  function generateCompiledBloggerTheme(): string {
    const blogspotPath = path.join(process.cwd(), "public", "single-file-blogspot.html");
    if (!fs.existsSync(blogspotPath)) return "";
    let html = fs.readFileSync(blogspotPath, "utf-8");

    const products = readJsonFile(PRODUCTS_FILE, SEED_PRODUCTS);
    const categories = readJsonFile(CATEGORIES_FILE, SEED_CATEGORIES);
    const siteContent = readJsonFile(SITE_CONTENT_FILE, SEED_SITE_CONTENT);
    const whyUs = readJsonFile(WHY_US_FILE, SEED_WHY_US);
    const reviews = readJsonFile(REVIEWS_FILE, SEED_REVIEWS);
    const faqs = readJsonFile(FAQS_FILE, SEED_FAQS);
    const paymentMethods = readJsonFile(PAYMENT_METHODS_FILE, SEED_PAYMENT_METHODS);

    const brand = siteContent.brand || {
      name: "GadgetBazar BD",
      tagline: "স্মার্ট গ্যাজেটের নির্ভরযোগ্য ঠিকানা",
      logoType: "icon",
      logoIcon: "fa-microchip",
      logoImageUrl: ""
    };

    html = html.replace(/const\s+DEFAULT_PRODUCTS\s*=\s*\[[\s\S]*?\];/m, () => `const DEFAULT_PRODUCTS = ${JSON.stringify(products, null, 2)};`);
    html = html.replace(/const\s+DEFAULT_CATEGORIES\s*=\s*\[[\s\S]*?\];/m, () => `const DEFAULT_CATEGORIES = ${JSON.stringify(categories, null, 2)};`);
    html = html.replace(/const\s+DEFAULT_PAYMENT_METHODS\s*=\s*\[[\s\S]*?\];/m, () => `const DEFAULT_PAYMENT_METHODS = ${JSON.stringify(paymentMethods, null, 2)};`);
    html = html.replace(/const\s+DEFAULT_SITE_CONTENT\s*=\s*\{[\s\S]*?\n\s*\};/m, () => `const DEFAULT_SITE_CONTENT = ${JSON.stringify(siteContent, null, 2)};`);
    html = html.replace(/const\s+DEFAULT_WHY_US\s*=\s*\[[\s\S]*?\];/m, () => `const DEFAULT_WHY_US = ${JSON.stringify(whyUs, null, 2)};`);
    html = html.replace(/const\s+DEFAULT_REVIEWS\s*=\s*\[[\s\S]*?\];/m, () => `const DEFAULT_REVIEWS = ${JSON.stringify(reviews, null, 2)};`);
    html = html.replace(/const\s+DEFAULT_FAQS\s*=\s*\[[\s\S]*?\];/m, () => `const DEFAULT_FAQS = ${JSON.stringify(faqs, null, 2)};`);

    // Pre-render static HTML elements so shop name and logo appear immediately even on first paint
    if (brand.name) {
      html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${brand.name} | ${brand.tagline || 'স্মার্ট গ্যাজেটের নির্ভরযোগ্য ঠিকানা'}</title>`);
      html = html.replace(/(<span id="header-brand-name"[^>]*>)([\s\S]*?)(<\/span>)/i, (match, p1, p2, p3) => `${p1}${brand.name}${p3}`);
      html = html.replace(/(<span id="drawer-brand-name"[^>]*>)([\s\S]*?)(<\/span>)/i, (match, p1, p2, p3) => `${p1}${brand.name}${p3}`);
      html = html.replace(/(<span id="footer-store-name"[^>]*>)([\s\S]*?)(<\/span>)/i, (match, p1, p2, p3) => `${p1}${brand.name}${p3}`);
    }
    if (brand.tagline) {
      html = html.replace(/(<p id="header-brand-tagline"[^>]*>)([\s\S]*?)(<\/p>)/i, (match, p1, p2, p3) => `${p1}${brand.tagline}${p3}`);
    }
    if (brand.logoType === 'image' && brand.logoImageUrl) {
      const imgHtml = `<img src="${brand.logoImageUrl}" alt="${brand.name}" class="h-9 sm:h-11 w-auto max-w-[140px] sm:max-w-[190px] object-contain rounded-lg" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#008bf5] to-[#40a9ff] text-white flex items-center justify-center text-base sm:text-xl shadow-md\\'><i class=\\'fa-solid fa-microchip\\'></i></div>';" />`;
      html = html.replace(/(<div id="header-brand-logo-container"[^>]*>)([\s\S]*?)(<\/div>)/i, (match, p1, p2, p3) => `${p1}${imgHtml}${p3}`);
      const drawerImgHtml = `<img src="${brand.logoImageUrl}" alt="${brand.name}" class="h-8 w-auto max-w-[120px] object-contain rounded-md" />`;
      html = html.replace(/(<div id="drawer-brand-logo-container"[^>]*>)([\s\S]*?)(<\/div>)/i, (match, p1, p2, p3) => `${p1}${drawerImgHtml}${p3}`);
    } else if (brand.logoIcon) {
      const iconHtml = `<div class="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#008bf5] to-[#40a9ff] text-white flex items-center justify-center text-base sm:text-xl shadow-md"><i id="header-brand-icon" class="fa-solid ${brand.logoIcon}"></i></div>`;
      html = html.replace(/(<div id="header-brand-logo-container"[^>]*>)([\s\S]*?)(<\/div>)/i, (match, p1, p2, p3) => `${p1}${iconHtml}${p3}`);
    }

    return html;
  }

  function syncSingleFileBlogspotHtmlOnDisk(): void {
    try {
      const compiled = generateCompiledBloggerTheme();
      if (compiled && compiled.length > 1000) {
        const blogspotPath = path.join(process.cwd(), "public", "single-file-blogspot.html");
        fs.writeFileSync(blogspotPath, compiled, "utf-8");
      }
    } catch (err) {
      console.error("Error updating public/single-file-blogspot.html on disk:", err);
    }
  }

  // Blogger Theme API endpoints
  app.get("/api/blogger-theme", (req, res) => {
    const compiled = generateCompiledBloggerTheme();
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    return res.send(compiled);
  });

  app.get(["/api/download-blogger-theme", "/download/single-file-blogspot.html"], (req, res) => {
    const compiled = generateCompiledBloggerTheme();
    res.setHeader("Content-Disposition", 'attachment; filename="single-file-blogspot.html"');
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    return res.send(compiled);
  });

  app.get("/single-file-blogspot.html", (req, res) => {
    const compiled = generateCompiledBloggerTheme();
    if (req.query.download === "1" || req.query.download === "true") {
      res.setHeader("Content-Disposition", 'attachment; filename="single-file-blogspot.html"');
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
    return res.send(compiled);
  });

  // Full catalog & state restore / batch sync
  app.post("/api/sync/full", (req, res) => {
    try {
      const { products, categories, siteContent, whyUs, reviews, faqs, orders, adminPassword, paymentMethods } = req.body;
      if (Array.isArray(products)) writeJsonFile(PRODUCTS_FILE, products);
      if (Array.isArray(categories)) writeJsonFile(CATEGORIES_FILE, categories);
      if (siteContent && typeof siteContent === "object") writeJsonFile(SITE_CONTENT_FILE, siteContent);
      if (Array.isArray(whyUs)) writeJsonFile(WHY_US_FILE, whyUs);
      if (Array.isArray(reviews)) writeJsonFile(REVIEWS_FILE, reviews);
      if (Array.isArray(faqs)) writeJsonFile(FAQS_FILE, faqs);
      if (Array.isArray(orders)) writeJsonFile(ORDERS_FILE, orders);
      if (Array.isArray(paymentMethods)) writeJsonFile(PAYMENT_METHODS_FILE, paymentMethods);
      if (adminPassword && typeof adminPassword === "string") writeJsonFile(ADMIN_FILE, { password: adminPassword });

      syncSingleFileBlogspotHtmlOnDisk();
      const lastUpdated = touchLastUpdated();
      return res.json({ success: true, message: "All store content synchronized across devices", lastUpdated });
    } catch (err) {
      console.error("Error saving full sync payload:", err);
      return res.status(500).json({ error: "Failed to save full sync payload" });
    }
  });

  // Payment Methods Persistence API (bKash, Nagad, Teletalk, Rocket, etc.)
  app.get("/api/payment-methods", (req, res) => {
    return res.json(readJsonFile(PAYMENT_METHODS_FILE, SEED_PAYMENT_METHODS));
  });

  app.post("/api/payment-methods", (req, res) => {
    try {
      const list = req.body;
      if (Array.isArray(list)) {
        writeJsonFile(PAYMENT_METHODS_FILE, list);
        syncSingleFileBlogspotHtmlOnDisk();
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, count: list.length, lastUpdated });
      }
      return res.status(400).json({ error: "Expected an array of payment methods" });
    } catch (err) {
      console.error("Error saving payment methods:", err);
      return res.status(500).json({ error: "Failed to save payment methods" });
    }
  });

  // Products Persistence API
  app.get("/api/products", (req, res) => {
    return res.json(readJsonFile(PRODUCTS_FILE, SEED_PRODUCTS));
  });

  app.post("/api/products", (req, res) => {
    try {
      const products = req.body;
      if (Array.isArray(products)) {
        writeJsonFile(PRODUCTS_FILE, products);
        syncSingleFileBlogspotHtmlOnDisk();
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, count: products.length, lastUpdated });
      }
      return res.status(400).json({ error: "Expected an array of products" });
    } catch (err) {
      console.error("Error saving products:", err);
      return res.status(500).json({ error: "Failed to save products" });
    }
  });

  // Categories Persistence API
  app.get("/api/categories", (req, res) => {
    return res.json(readJsonFile(CATEGORIES_FILE, SEED_CATEGORIES));
  });

  app.post("/api/categories", (req, res) => {
    try {
      const categories = req.body;
      if (Array.isArray(categories)) {
        writeJsonFile(CATEGORIES_FILE, categories);
        syncSingleFileBlogspotHtmlOnDisk();
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, count: categories.length, lastUpdated });
      }
      return res.status(400).json({ error: "Expected an array of categories" });
    } catch (err) {
      console.error("Error saving categories:", err);
      return res.status(500).json({ error: "Failed to save categories" });
    }
  });

  // Site Content Persistence API (Hero, Trust Bar, Announcement, Offer, Footer)
  app.get("/api/site-content", (req, res) => {
    return res.json(readJsonFile(SITE_CONTENT_FILE, SEED_SITE_CONTENT));
  });

  app.post("/api/site-content", (req, res) => {
    try {
      const content = req.body;
      if (content && typeof content === "object") {
        writeJsonFile(SITE_CONTENT_FILE, content);
        syncSingleFileBlogspotHtmlOnDisk();
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, lastUpdated });
      }
      return res.status(400).json({ error: "Invalid site content payload" });
    } catch (err) {
      console.error("Error saving site content:", err);
      return res.status(500).json({ error: "Failed to save site content" });
    }
  });

  // Why Us Persistence API
  app.get("/api/why-us", (req, res) => {
    return res.json(readJsonFile(WHY_US_FILE, SEED_WHY_US));
  });

  app.post("/api/why-us", (req, res) => {
    try {
      const items = req.body;
      if (Array.isArray(items)) {
        writeJsonFile(WHY_US_FILE, items);
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, count: items.length, lastUpdated });
      }
      return res.status(400).json({ error: "Expected an array of why-us items" });
    } catch (err) {
      console.error("Error saving why-us:", err);
      return res.status(500).json({ error: "Failed to save why-us" });
    }
  });

  // Reviews Persistence API
  app.get("/api/reviews", (req, res) => {
    return res.json(readJsonFile(REVIEWS_FILE, SEED_REVIEWS));
  });

  app.post("/api/reviews", (req, res) => {
    try {
      const reviews = req.body;
      if (Array.isArray(reviews)) {
        writeJsonFile(REVIEWS_FILE, reviews);
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, count: reviews.length, lastUpdated });
      }
      return res.status(400).json({ error: "Expected an array of reviews" });
    } catch (err) {
      console.error("Error saving reviews:", err);
      return res.status(500).json({ error: "Failed to save reviews" });
    }
  });

  // FAQs Persistence API
  app.get("/api/faqs", (req, res) => {
    return res.json(readJsonFile(FAQS_FILE, SEED_FAQS));
  });

  app.post("/api/faqs", (req, res) => {
    try {
      const faqs = req.body;
      if (Array.isArray(faqs)) {
        writeJsonFile(FAQS_FILE, faqs);
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, count: faqs.length, lastUpdated });
      }
      return res.status(400).json({ error: "Expected an array of FAQs" });
    } catch (err) {
      console.error("Error saving FAQs:", err);
      return res.status(500).json({ error: "Failed to save FAQs" });
    }
  });

  // Admin Password Sync API
  app.get("/api/admin-password", (req, res) => {
    const admin = readJsonFile(ADMIN_FILE, { password: "MAQuaiyum@123" });
    return res.json({ password: admin.password || "MAQuaiyum@123" });
  });

  app.post("/api/admin-password", (req, res) => {
    try {
      const { password } = req.body;
      if (typeof password === "string" && password.trim().length >= 4) {
        writeJsonFile(ADMIN_FILE, { password: password.trim() });
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, lastUpdated });
      }
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    } catch (err) {
      console.error("Error saving admin password:", err);
      return res.status(500).json({ error: "Failed to save admin password" });
    }
  });

  // Orders Persistence API
  app.get("/api/orders", (req, res) => {
    const orders = readJsonFile<OrderRecord[]>(ORDERS_FILE, recentOrders);
    return res.json({
      success: true,
      count: orders.length,
      orders: orders.slice().reverse()
    });
  });

  app.post("/api/orders", (req, res) => {
    try {
      const orders = req.body;
      if (Array.isArray(orders)) {
        writeJsonFile(ORDERS_FILE, orders);
        recentOrders = orders;
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, count: orders.length, lastUpdated });
      }
      return res.status(400).json({ error: "Expected an array of orders" });
    } catch (err) {
      console.error("Error saving orders:", err);
      return res.status(500).json({ error: "Failed to save orders" });
    }
  });

  app.delete("/api/orders/:orderId", (req, res) => {
    try {
      const { orderId } = req.params;
      let orders = readJsonFile<OrderRecord[]>(ORDERS_FILE, recentOrders);
      orders = orders.filter(o => o.orderId !== orderId);
      recentOrders = orders;
      writeJsonFile(ORDERS_FILE, orders);
      const lastUpdated = touchLastUpdated();
      return res.json({ success: true, count: orders.length, lastUpdated });
    } catch (err) {
      console.error("Error deleting order:", err);
      return res.status(500).json({ error: "Failed to delete order" });
    }
  });

  app.patch("/api/orders/:orderId/status", (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      let orders = readJsonFile<OrderRecord[]>(ORDERS_FILE, recentOrders);
      const target = orders.find(o => o.orderId === orderId);
      if (target) {
        target.orderStatus = status;
        (target as any).statusUpdatedAt = new Date().toISOString();
        recentOrders = orders;
        writeJsonFile(ORDERS_FILE, orders);
        const lastUpdated = touchLastUpdated();
        return res.json({ success: true, order: target, lastUpdated });
      }
      return res.status(404).json({ error: "Order not found" });
    } catch (err) {
      console.error("Error updating order status:", err);
      return res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.delete("/api/orders", (req, res) => {
    try {
      recentOrders = [];
      writeJsonFile(ORDERS_FILE, []);
      const lastUpdated = touchLastUpdated();
      return res.json({ success: true, count: 0, lastUpdated });
    } catch (err) {
      return res.status(500).json({ error: "Failed to clear orders" });
    }
  });

  // Main Secure Order Processing Endpoint
  app.post("/api/order", async (req, res) => {
    try {
      const {
        orderId,
        dateTime,
        productId,
        productName,
        productBanglaName,
        color,
        size,
        quantity,
        productPrice,
        productTotal,
        deliveryCharge,
        totalPrice,
        customerName,
        phone,
        district,
        fullAddress,
        paymentMethod,
        paymentCode,
        orderSource,
        googleScriptUrl
      } = req.body;

      // Validation
      if (!customerName || !phone || !fullAddress || !district) {
        return res.status(400).json({
          success: false,
          message: "নাম, মোবাইল নম্বর, জেলা এবং সম্পূর্ণ ঠিকানা আবশ্যক।"
        });
      }

      // Validate Bangladesh Phone Number
      const sanitizedPhone = String(phone).replace(/[\s-+]/g, "");
      const bdPhoneRegex = /^01[3-9]\d{8}$/;
      if (!bdPhoneRegex.test(sanitizedPhone)) {
        return res.status(400).json({
          success: false,
          message: "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)"
        });
      }

      const newOrder: OrderRecord = {
        orderId: orderId || `GB-${Date.now()}`,
        dateTime: dateTime || new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
        productId: Number(productId) || 1,
        productName: productName || "Smart Gadget",
        productBanglaName,
        color: color || "Standard",
        size: size || "Free Size",
        quantity: Number(quantity) || 1,
        productPrice: Number(productPrice) || 0,
        productTotal: Number(productTotal) || 0,
        deliveryCharge: Number(deliveryCharge) || 80,
        totalPrice: Number(totalPrice) || 0,
        customerName: String(customerName).trim(),
        phone: sanitizedPhone,
        district: String(district).trim(),
        fullAddress: String(fullAddress).trim(),
        paymentMethod: String(paymentMethod || "CASH ON DELIVERY").toUpperCase(),
        paymentCode: String(paymentCode || "N/A"),
        orderSource: orderSource || "Website Landing Page",
        orderStatus: String(req.body.orderStatus || "Pending"),
        createdAt: new Date().toISOString()
      };

      recentOrders.push(newOrder);
      const currentOrders = readJsonFile<OrderRecord[]>(ORDERS_FILE, []);
      currentOrders.push(newOrder);
      writeJsonFile(ORDERS_FILE, currentOrders);
      touchLastUpdated();

      // Construct Telegram Notification Message strictly adhering to Section 13
      const telegramMessage = [
        "🛒 *NEW ORDER*",
        "━━━━━━━━━━━━━━",
        `📦 *Order ID:* \`${newOrder.orderId}\``,
        `🛍️ *Product:* ${newOrder.productName}`,
        `🎨 *Color:* ${newOrder.color}`,
        `📏 *Size:* ${newOrder.size}`,
        `🔢 *Quantity:* ${newOrder.quantity}`,
        `💰 *Product Total:* ৳${newOrder.productTotal.toLocaleString()}`,
        `🚚 *Delivery:* ৳${newOrder.deliveryCharge.toLocaleString()}`,
        `💵 *Grand Total:* ৳${newOrder.totalPrice.toLocaleString()}`,
        "━━━━━━━━━━━━━━",
        `👤 *Customer:* ${newOrder.customerName}`,
        `📞 *Phone:* [${newOrder.phone}](tel:${newOrder.phone})`,
        `📍 *District:* ${newOrder.district}`,
        `🏠 *Address:*`,
        `${newOrder.fullAddress}`,
        "━━━━━━━━━━━━━━",
        `💳 *Payment:* ${newOrder.paymentMethod}`,
        newOrder.paymentCode && newOrder.paymentCode !== "N/A"
          ? `🔑 *Transaction ID / Code:* \`${newOrder.paymentCode}\``
          : "",
        `🕐 *Time:* ${newOrder.dateTime}`,
        "━━━━━━━━━━━━━━"
      ].filter(Boolean).join("\n");

      // Log order to server console
      console.log("\n================ [ NEW ORDER RECEIVED ] ================");
      console.log(telegramMessage);
      console.log("========================================================\n");

      // Dispatch to Telegram Bot if credentials are provided in .env or settings.json
      const settings = readJsonFile<{
        telegramBotToken?: string;
        telegramChatId?: string;
        googleScriptUrl?: string;
      }>(SETTINGS_FILE, {});

      const botToken = process.env.TELEGRAM_BOT_TOKEN || settings.telegramBotToken;
      const chatId = process.env.TELEGRAM_CHAT_ID || settings.telegramChatId;

      let telegramStatus = "skipped_no_token";
      if (botToken && chatId) {
        try {
          const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
          const tgRes = await fetch(tgUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: telegramMessage,
              parse_mode: "Markdown"
            })
          });
          const tgData = await tgRes.json();
          if (tgData.ok) {
            telegramStatus = "sent";
          } else {
            console.error("Telegram API response error:", tgData);
            telegramStatus = "failed";
          }
        } catch (tgErr) {
          console.error("Failed to send Telegram notification:", tgErr);
          telegramStatus = "network_error";
        }
      }

      // Forward to Google Apps Script / Google Sheets if configured
      const scriptUrl = process.env.GOOGLE_SCRIPT_URL || googleScriptUrl || settings.googleScriptUrl;
      let googleSheetStatus = "skipped_no_url";
      if (scriptUrl && !scriptUrl.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
        try {
          await fetch(scriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrder)
          });
          googleSheetStatus = "forwarded";
        } catch (scriptErr) {
          console.error("Failed to forward to Google Apps Script:", scriptErr);
          googleSheetStatus = "network_error";
        }
      }

      return res.status(200).json({
        success: true,
        orderId: newOrder.orderId,
        message: "অর্ডার সফলভাবে গ্রহণ করা হয়েছে!",
        telegramStatus,
        googleSheetStatus
      });
    } catch (err: any) {
      console.error("Server error handling order:", err);
      return res.status(500).json({
        success: false,
        message: "সার্ভারে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
