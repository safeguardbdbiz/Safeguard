/**
 * Gadget Bazar BD - Products Data Structure
 * Easily add, edit, or remove products here.
 */

const products = [
  {
    id: 1,
    name: "Mini Electric Chopper",
    banglaName: "মিনি ইলেকট্রিক ফুড চপার ও ব্লেন্ডার",
    category: "Kitchen",
    price: 850,
    oldPrice: 1200,
    discount: 29,
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Black", "White", "Emerald Green"],
    sizes: ["250ml"],
    rating: 4.8,
    reviews: 124,
    stock: true,
    isBestSeller: true,
    isOffer: true,
    shortDesc: "রসুন, পিঁয়াজ, আদা, বাদাম ও মাংস মাত্র কয়েক সেকেন্ডে দ্রুত চপ করার রিচার্জেবল মিনি চপার।",
    features: [
      "ওয়্যারলেস ও ইউএসবি রিচার্জেবল (এক চার্জে ৩০+ বার ব্যবহার)",
      "স্টেইনলেস স্টিল থ্রি-ব্লেড টেকনোলজি",
      "ফুড-গ্রেড বিপিএ-ফ্রি টেকসই ম্যাটেরিয়াল",
      "এক ক্লিকেই হ্যান্ডি অপারেশন ও সহজে ধোয়া যায়"
    ]
  },
  {
    id: 2,
    name: "Rechargeable Mini Fan",
    banglaName: "হাই-স্পিড রিচার্জেবল পোর্টেবল টেবিল ফ্যান",
    category: "Home Gadgets",
    price: 1150,
    oldPrice: 1650,
    discount: 30,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["White", "Navy Blue", "Pastel Pink"],
    sizes: ["Free Size"],
    rating: 4.9,
    reviews: 215,
    stock: true,
    isBestSeller: true,
    isOffer: true,
    shortDesc: "লোডশেডিং ও ভ্রমণের জন্য পাওয়ারফুল ৪-স্পিড আল্ট্রা-সাইলেন্ট রিচার্জেবল ডেস্ক ফ্যান।",
    features: [
      "৪০০০mAh শক্তিশালী ব্যাটারি (টানা ৮-১০ ঘণ্টা ব্যাকআপ)",
      "ইউএসবি টাইপ-সি ফাস্ট চার্জিং সুবিধা",
      "৩৬০ ডিগ্রি রোটেটেবল অ্যাডজাস্টমেন্ট",
      "সুপার সাইলেন্ট ব্রাশলেস মোটর"
    ]
  },
  {
    id: 3,
    name: "3-in-1 Fast Charging Cable",
    banglaName: "৩-ইন-১ মাল্টিপল ফাস্ট চার্জিং কেবল (১০০W)",
    category: "Mobile Accessories",
    price: 420,
    oldPrice: 650,
    discount: 35,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Black", "Red", "Grey"],
    sizes: ["1.2 Meter"],
    rating: 4.7,
    reviews: 98,
    stock: true,
    isBestSeller: false,
    isOffer: true,
    shortDesc: "একসাথে Type-C, Lightning (iPhone) এবং Micro-USB চার্জ করার হেভি-ডিউটি ব্রেইডেড ক্যাবল।",
    features: [
      "একসাথে তিনটি ডিভাইসে দ্রুত পাওয়ার সাপ্লাই",
      "প্রিমিয়াম নাইলন ব্রেইডেড অ্যান্টি-বেন্ডিং কোটিং",
      "স্মার্ট চিপ প্রটেকশন ওভারহিটিং প্রতিরোধ করে",
      "হাই-স্পিড ডেটা ট্রান্সফার রেট"
    ]
  },
  {
    id: 4,
    name: "LED Motion Sensor Light",
    banglaName: "স্মার্ট মোশন সেন্সর এলইডি লাইট (ম্যাগনেটিক)",
    category: "Home Gadgets",
    price: 550,
    oldPrice: 850,
    discount: 35,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Warm White", "Pure White"],
    sizes: ["20cm", "40cm"],
    rating: 4.9,
    reviews: 167,
    stock: true,
    isBestSeller: true,
    isOffer: false,
    shortDesc: "মানুষ কাছে আসলেই নিজে নিজে জ্বলে উঠবে! আলমারি, সিঁড়ি, বেডরুম ও কিচেনের জন্য সেরা।",
    features: [
      "১২০ ডিগ্রি ওয়াইড-অ্যাঙ্গেল অটো সেন্সর ডিটেকশন",
      "ম্যাগনেটিক ইনস্টলেশন – দেয়াল ফুটো করার প্রয়োজন নেই",
      "ইউএসবি রিচার্জেবল, একবার চার্জে ১-২ মাস ব্যাকআপ",
      "অটো এবং অলওয়েজ-অন মোড সুইচিং সুবিধা"
    ]
  },
  {
    id: 5,
    name: "Portable Fresh Juice Blender",
    banglaName: "পোর্টেবল ইউএসবি ফ্রুট জুসার ও ব্লেন্ডার",
    category: "Kitchen",
    price: 1350,
    oldPrice: 1950,
    discount: 31,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Pastel Pink", "Mint Green", "Ocean Blue"],
    sizes: ["380ml"],
    rating: 4.8,
    reviews: 142,
    stock: true,
    isBestSeller: true,
    isOffer: true,
    shortDesc: "অফিস, জিম কিংবা ভ্রমণের সময় ৩০ সেকেন্ডে ফ্রেশ জুস বা স্মুদি তৈরির কমপ্যাক্ট ব্লেন্ডার।",
    features: [
      "৬-ব্লেড ৩ডি স্টেইনলেস স্টিল কাটার",
      "সহজে বহনযোগ্য হ্যান্ডেল ও ওয়াটারপ্রুফ বডি",
      "ইউএসবি রিচার্জেবল ২০০০mAh ব্যাটারি",
      "সেফটি লক সিস্টেম – কাপ না আটকালে চলবে না"
    ]
  },
  {
    id: 6,
    name: "Wireless Car Charger & Mount",
    banglaName: "অটো-ক্ল্যাম্পিং ওয়্যারলেস কার ফোন হোল্ডার ও চার্জার",
    category: "Car Accessories",
    price: 1450,
    oldPrice: 2100,
    discount: 31,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Midnight Black", "Silver Metallic"],
    sizes: ["Free Size"],
    rating: 4.7,
    reviews: 86,
    stock: true,
    isBestSeller: false,
    isOffer: false,
    shortDesc: "ইনফ্রারেড সেন্সরযুক্ত স্মার্ট কার মাউন্ট যা ফোন রাখতেই স্বয়ংক্রিয়ভাবে গ্রিপ করে চার্জ করে।",
    features: [
      "১৫W কিউআই ফাস্ট ওয়্যারলেস চার্জিং সাপোর্ট",
      "স্মার্ট সেন্সর অটো ক্লিপিং এবং ওয়ান-টাচ রিলিজ",
      "৩৬০ ডিগ্রি রোটেশনাল ভিউয়িং অ্যাঙ্গেল",
      "কার এয়ারভেন্টে সহজে স্থাপনযোগ্য মজবুত গ্রিপ"
    ]
  },
  {
    id: 7,
    name: "Smart LED Night Light",
    banglaName: "অ্যাস্ট্রোনট গ্যালাক্সি স্টার প্রজেক্টর নাইট লাইট",
    category: "Smart Gadgets",
    price: 1750,
    oldPrice: 2500,
    discount: 30,
    image: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1843?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1843?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Astronaut White"],
    sizes: ["Free Size"],
    rating: 4.9,
    reviews: 198,
    stock: true,
    isBestSeller: true,
    isOffer: true,
    shortDesc: "আপনার ঘরকে এক নিমিষে রূপকথার মহাকাশ আর তারার মেলায় সাজিয়ে তোলার ম্যাজিকাল প্রজেক্টর।",
    features: [
      "৮ ধরণের নেবুলা ইফেক্ট ও স্টারলাইট মোড",
      "রিমোট কন্ট্রোল ও অটো টাইমার সুবিধা (৪৫ ও ৯০ মিনিট)",
      "৩৬০ ডিগ্রি রোটেটিং ম্যাগনেটিক হেড ডিজাইন",
      "বেডরুম ও বাচ্চাদের জন্য নিখুঁত উপহার"
    ]
  },
  {
    id: 8,
    name: "Portable Car & Home Vacuum",
    banglaName: "পোর্টেবল হ্যান্ডহেল্ড পাওয়ার ভ্যাকুয়াম ক্লিনার",
    category: "Car Accessories",
    price: 1250,
    oldPrice: 1800,
    discount: 31,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Matte Black", "Pearl White"],
    sizes: ["Free Size"],
    rating: 4.8,
    reviews: 110,
    stock: true,
    isBestSeller: false,
    isOffer: true,
    shortDesc: "গাড়ি, ল্যাপটপ কীবোর্ড, সোফা ও ঘরের ছোট কোণার ধুলাবালি পরিষ্কারের শক্তিশালী রিচার্জেবল ভ্যাকুয়াম।",
    features: [
      "৯০০০PA হাই সাকশন পাওয়ার সাইক্লোনিক মোটর",
      "ওয়াশেবল ও রি-ইউজেবল HEPA ফিল্টার",
      "বিভিন্ন সাইজের ৩টি বিশেষ নোজল ব্রাশ অন্তর্ভুক্ত",
      "হালকা ও সহজে পোর্টেবল ডিজাইন"
    ]
  },
  {
    id: 9,
    name: "TWS Wireless Gaming Earbuds",
    banglaName: "লো-লেটেন্সি আল্ট্রা ব্যাস গেমিং ইয়ারবাডস",
    category: "Smart Gadgets",
    price: 1190,
    oldPrice: 1850,
    discount: 36,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Cyber Black", "Neon Yellow"],
    sizes: ["Free Size"],
    rating: 4.8,
    reviews: 176,
    stock: true,
    isBestSeller: true,
    isOffer: true,
    shortDesc: "৪৫ms আল্ট্রা-লো লেটেন্সি, ডীপ বেস সাউন্ড এবং কুল আরজিবি লাইটযুক্ত প্রিমিয়াম ব্লুটুথ ইয়ারবাডস।",
    features: [
      "ব্লুটুথ ৫.৩ স্টেবল ও ইনস্ট্যান্ট কানেক্টিভিটি",
      "নয়েজ ক্যান্সেলেশন মাইক্রোফোন ক্রিস্টাল ক্লিয়ার কলের জন্য",
      "টানা ৬ ঘণ্টা গান ও কেসসহ ৩০ ঘণ্টা প্লেব্যাক",
      "আইপিএক্স৫ সোয়েট ও ওয়াটার রেজিস্ট্যান্ট"
    ]
  },
  {
    id: 10,
    name: "Smart Fitness Calling Watch",
    banglaName: "এইচডি ব্লুটুথ কলিং স্মার্টওয়াচ ও হেলথ ট্র্যাকার",
    category: "Smart Gadgets",
    price: 1990,
    oldPrice: 2850,
    discount: 30,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Space Black", "Silver Gray", "Rose Gold"],
    sizes: ["Free Size"],
    rating: 4.9,
    reviews: 240,
    stock: true,
    isBestSeller: true,
    isOffer: false,
    shortDesc: "সরাসরি কথা বলার ব্লুটুথ কলিং, হার্ট রেট ও স্লিপ মনিটরিং এবং ১০০+ স্পোর্টস মোড।",
    features: [
      "১.৮৫ ইঞ্চি সুপার ব্রাইট ফুল টাচ এইচডি ডিসপ্লে",
      "হাই-কোয়ালিটি স্পিকার ও মাইকে পরিষ্কার কলিং",
      "রক্তচাপ, এসপিও২ এবং সার্বক্ষণিক হার্ট রেট ট্র্যাকার",
      "৫-৭ দিন একটানা ব্যাটারি ব্যাকআপ"
    ]
  },
  {
    id: 11,
    name: "Foldable Aluminum Laptop Stand",
    banglaName: "অ্যাডজাস্টেবল অ্যালুমিনিয়াম ল্যাপটপ ও ট্যাব স্ট্যান্ড",
    category: "Useful Tools",
    price: 690,
    oldPrice: 990,
    discount: 30,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Space Silver", "Deep Grey"],
    sizes: ["Universal"],
    rating: 4.8,
    reviews: 94,
    stock: true,
    isBestSeller: false,
    isOffer: false,
    shortDesc: "ঘাড় ও পিঠের ব্যথা দূর করতে ৭-ধাপ উচ্চতা পরিবর্তনযোগ্য ফোল্ডিং ল্যাপটপ কুলিং স্ট্যান্ড।",
    features: [
      "১০০% সলিড এভিয়েশন অ্যালুমিনিয়াম অ্যালয় বডি",
      "ল্যাপটপকে দ্রুত ঠান্ডা রাখতে ওপেন কুলিং ভেন্টিলেশন",
      "স্লিপ-প্রুফ সিলিকন কুশন স্ক্র্যাচ প্রতিরোধ করে",
      "সহজে ভাঁজ করে ব্যাগে বহনের জন্য পাউচ সহ"
    ]
  },
  {
    id: 12,
    name: "Smart Water Dispenser Pump",
    banglaName: "অটোমেটিক ইউএসবি রিচার্জেবল ওয়াটার ডিসপেনসার",
    category: "Kitchen",
    price: 620,
    oldPrice: 890,
    discount: 30,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80"
    ],
    colors: ["Classic Black", "Clean White"],
    sizes: ["Free Size"],
    rating: 4.7,
    reviews: 130,
    stock: true,
    isBestSeller: false,
    isOffer: true,
    shortDesc: "এক ক্লিকে বোতল বা জার থেকে সহজে পানি তোলার ঝামেলামুক্ত অটোমেটিক পাম্প।",
    features: [
      "খাবারের জন্য নিরাপদ ফুড-গ্রেড সিলিকন হস",
      "১২০০mAh রিচার্জেবল ব্যাটারি (৪-৬ জার পানি তোলা যায়)",
      "সব ধরণের স্ট্যান্ডার্ড ওয়াটার জারে পারফেক্ট ফিট",
      "কম্প্যাক্ট এবং ওয়ান-টাচ প্রেস কন্ট্রোল"
    ]
  }
];

// Categories definition
const categories = [
  { id: "all", name: "সকল গ্যাজেট", icon: "fa-cubes", count: 12 },
  { id: "Smart Gadgets", name: "স্মার্ট গ্যাজেট", icon: "fa-microchip", count: 3 },
  { id: "Mobile Accessories", name: "মোবাইল এক্সেসরিজ", icon: "fa-mobile-screen-button", count: 2 },
  { id: "Home Gadgets", name: "হোম গ্যাজেট", icon: "fa-house-laptop", count: 2 },
  { id: "Kitchen", name: "কিচেন গ্যাজেট", icon: "fa-utensils", count: 3 },
  { id: "Car Accessories", name: "কার এক্সেসরিজ", icon: "fa-car", count: 2 },
  { id: "Useful Tools", name: "দৈনন্দিন টুলস", icon: "fa-screwdriver-wrench", count: 1 }
];

// Customer Reviews data
const reviewsData = [
  {
    id: 1,
    name: "তানভীর হাসান",
    location: "মিরপুর, ঢাকা",
    rating: 5,
    date: "২ দিন আগে",
    product: "মিনি ইলেকট্রিক ফুড চপার",
    comment: "পণ্যটি সত্যিই অসাধারণ! রসুন আর পিঁয়াজ চপ করতে এখন মাত্র ১০ সেকেন্ড লাগে। প্যাকেজিং চমৎকার ছিল এবং পরের দিনই ডেলিভারি পেয়েছি।"
  },
  {
    id: 2,
    name: "ফারহানা আক্তার",
    location: "আগ্রাবাদ, চট্টগ্রাম",
    rating: 5,
    date: "৪ দিন আগে",
    product: "পোর্টেবল রিচার্জেবল ফ্যান",
    comment: "লোডশেডিং এর সময়ে বাচ্চাদের জন্য খুবই উপকারী। ফ্যানের বাতাস বেশ ভালো আর ব্যাটারি ব্যাকআপ এক কথায় দুর্দান্ত। ক্যাশ অন ডেলিভারিতে পেয়েছি।"
  },
  {
    id: 3,
    name: "মাহমুদুল করিম",
    location: "উপশহর, সিলেট",
    rating: 5,
    date: "১ সপ্তাহ আগে",
    product: "স্মার্ট মোশন সেন্সর লাইট",
    comment: "অর্ডার করার ৩ দিনের মাথায় ডেলিভারি পেয়েছি। আলমারি আর সিঁড়ির জন্য ৩টা নিয়েছিলাম, সবগুলোই পারফেক্ট কাজ করছে। সেলারের ব্যবহারও চমৎকার।"
  },
  {
    id: 4,
    name: "আরিফুল ইসলাম",
    location: "বোয়ালিয়া, রাজশাহী",
    rating: 5,
    date: "১ সপ্তাহ আগে",
    product: "পোর্টেবল ভ্যাকুয়াম ক্লিনার",
    comment: "গাড়ির এসি ভেন্ট আর সিটের ভেতরের ময়লা পরিষ্কার করার জন্য সেরা গ্যাজেট। দাম অনুযায়ী কোয়ালিটি অত্যন্ত প্রিমিয়াম।"
  }
];

// FAQs data
const faqsData = [
  {
    question: "কিভাবে অর্ডার সম্পন্ন করব?",
    answer: "যেকোনো পণ্যের নিচে থাকা 'এখনই কিনুন' (Buy Now) বাটনে ক্লিক করুন। এরপর নাম, মোবাইল নম্বর, জেলা এবং সম্পূর্ণ ঠিকানা লিখে 'অর্ডার কনফার্ম করুন' বাটনে ক্লিক করলেই আপনার অর্ডার সম্পন্ন হয়ে যাবে।"
  },
  {
    question: "ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা আছে কি?",
    answer: "হ্যাঁ! সারাদেশে শতভাগ ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। পণ্য হাতে পেয়ে সম্পূর্ণ দেখে ও চেক করে তারপর মূল্য পরিশোধ করতে পারবেন।"
  },
  {
    question: "কত দিনের মধ্যে ডেলিভারি পাবো?",
    answer: "ঢাকা শহরের ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ২ থেকে ৩ কার্যদিবসের মধ্যে দ্রুততম সময়ে কুরিয়ারের মাধ্যমে ডেলিভারি পৌঁছে দেওয়া হয়।"
  },
  {
    question: "ডেলিভারি চার্জ কত টাকা?",
    answer: "ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৮০ টাকা এবং ঢাকার বাইরে যেকোনো জেলা বা থানায় ডেলিভারি চার্জ ১৩০ টাকা।"
  },
  {
    question: "পণ্য কোনো সমস্যা হলে পরিবর্তন (Return/Exchange) করা যাবে?",
    answer: "অবশ্যই! পণ্য পাওয়ার পর কোনো সমস্যা বা ত্রুটি থাকলে ৩ দিনের মধ্যে আমাদের হোয়াটসঅ্যাপে যোগাযোগ করলে ফ্রি রিপ্লেসমেন্ট প্রদান করা হয়।"
  },
  {
    question: "বিকাশ বা নগদে পেমেন্ট করলে Payment Code / TrxID কোথায় পাবো?",
    answer: "বিকাশ বা নগদ অ্যাপ থেকে Send Money সম্পন্ন করার পর স্ক্রিনে ৮-১০ সংখ্যার একটি ট্রানজেকশন আইডি (TrxID) দেখতে পাবেন, সেটি অর্ডার ফর্মের ট্রানজেকশন আইডি ঘরে লিখে দিবেন।"
  }
];

if (typeof window !== "undefined") {
  window.products = products;
  window.categories = categories;
  window.reviewsData = reviewsData;
  window.faqsData = faqsData;
}
