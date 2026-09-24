/**
 * Gadget Bazar BD - Configuration File
 * Easily update payment numbers, delivery fees, contact info, and API endpoints here.
 */

const CONFIG = {
  // Store Information
  storeName: "Gadget Bazar BD",
  storeTagline: "আপনার প্রয়োজনীয় স্মার্ট গ্যাজেট, এখন হাতের নাগালে!",
  phone: "01700-000000",
  whatsappNumber: "8801700000000", // with country code, no plus for wa.me
  whatsappMessage: "হ্যালো, আমি Gadget Bazar BD থেকে একটি গ্যাজেট সম্পর্কে জানতে চাই।",
  messengerUrl: "https://m.me/gadgetbazarbd",
  email: "support@gadgetbazar.com.bd",
  address: "বাড়ি ২৪, রোড ৭, সেক্টর ৩, উত্তরা, ঢাকা-১২৩০, বাংলাদেশ",

  // Delivery Charges (in BDT ৳)
  deliveryInsideDhaka: 80,
  deliveryOutsideDhaka: 130,
  currencySymbol: "৳",
  orderIdPrefix: "GB",

  // Configurable Payment Instructions
  // (Customers see these when bKash / Nagad / Rocket / Bank Transfer is selected)
  paymentInstructions: {
    bkash: {
      title: "bKash Personal (Send Money)",
      number: "01700-000000",
      type: "Personal",
      instructions: "অনুগ্রহ করে আপনার বিকাশ অ্যাপ বা *247# থেকে উপরের নম্বরে Send Money করুন। সফল লেনদেনের পর Transaction ID (TrxID) নিচে প্রদান করুন।"
    },
    nagad: {
      title: "Nagad Personal (Send Money)",
      number: "01800-000000",
      type: "Personal",
      instructions: "অনুগ্রহ করে আপনার নগদ অ্যাপ বা *167# থেকে উপরের নম্বরে Send Money করুন। সফল লেনদেনের পর Transaction ID (TrxID) নিচে প্রদান করুন।"
    },
    rocket: {
      title: "Rocket Personal (Send Money)",
      number: "01900-000000",
      type: "Personal",
      instructions: "অনুগ্রহ করে রকেট একাউন্ট থেকে Send Money করুন এবং Transaction ID নিচে পূরণ করুন।"
    },
    bank: {
      title: "Bank Transfer Information",
      details: "Bank: City Bank / Islami Bank Bangladesh\nAccount Name: Gadget Bazar BD\nAccount Number: 2050341890001234\nBranch: Uttara Branch, Dhaka\nRouting: 125272635",
      instructions: "ব্যাংক ডিপোজিট বা অনলাইন ফান্ড ট্রান্সফারের রেফারেন্স বা ট্রানজেকশন আইডি নিচে প্রদান করুন।"
    }
  },

  // API Integration Endpoints
  // Use our secure server endpoint /api/order by default to protect Telegram & Google API secrets
  TELEGRAM_PROXY_URL: "/api/order",
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec",

  // All 64 Districts of Bangladesh
  districts: [
    "Dhaka (ঢাকা)",
    "Gazipur (গাজীপুর)",
    "Narayanganj (নারায়ণগঞ্জ)",
    "Chattogram (চট্টগ্রাম)",
    "Sylhet (সিলেট)",
    "Rajshahi (রাজশাহী)",
    "Khulna (খুলনা)",
    "Barishal (বরিশাল)",
    "Rangpur (রংপুর)",
    "Mymensingh (ময়মনসিংহ)",
    "Cumilla (কুমিল্লা)",
    "Bogura (বগুড়া)",
    "Cox's Bazar (কক্সবাজার)",
    "Feni (ফেনী)",
    "Brahmanbaria (ব্রাহ্মণবাড়িয়া)",
    "Noakhali (নোয়াখালী)",
    "Chandpur (চাঁদপুর)",
    "Lakshmipur (লক্ষ্মীপুর)",
    "Tangail (টাঙ্গাইল)",
    "Narsingdi (নরসিংদী)",
    "Kishoreganj (কিশোরগঞ্জ)",
    "Manikganj (মানিকগঞ্জ)",
    "Munshiganj (মুন্সীগঞ্জ)",
    "Faridpur (ফরিদপুর)",
    "Gopalganj (গোপালগঞ্জ)",
    "Madaripur (মাদারীপুর)",
    "Shariatpur (শরীয়তপুর)",
    "Rajbari (রাজবাড়ী)",
    "Jamalpur (জামালপুর)",
    "Netrokona (নেত্রকোণা)",
    "Sherpur (শেরপুর)",
    "Sunamganj (সুনামগঞ্জ)",
    "Habiganj (হবিগঞ্জ)",
    "Moulvibazar (মৌলভীবাজার)",
    "Pabna (পাবনা)",
    "Sirajganj (সিরাজগঞ্জ)",
    "Naogaon (নওগাঁ)",
    "Natore (নাটোর)",
    "Chapainawabganj (চাঁপাইনবাবগঞ্জ)",
    "Joypurhat (জয়পুরহাট)",
    "Dinajpur (দিনাজপুর)",
    "Thakurgaon (ঠাকুরগাঁও)",
    "Panchagarh (পঞ্চগড়)",
    "Nilphamari (নীলফামারী)",
    "Lalmonirhat (লালমনিরহাট)",
    "Kurigram (কুড়িগ্রাম)",
    "Gaibandha (গাইবান্ধা)",
    "Jashore (যশোর)",
    "Satkhira (সাতক্ষীরা)",
    "Jhenaidah (ঝিনাইদহ)",
    "Magura (মাগুরা)",
    "Narail (নড়াইল)",
    "Bagerhat (বাগেরহাট)",
    "Kushtia (কুষ্টিয়া)",
    "Chuadanga (চুয়াডাঙ্গা)",
    "Meherpur (মেহেরপুর)",
    "Jhalokathi (ঝালকাঠি)",
    "Pirojpur (পিরোজপুর)",
    "Barguna (বরগুনা)",
    "Patuakhali (পটুয়াখালী)",
    "Bhola (ভোলা)",
    "Bandarban (বান্দরবান)",
    "Rangamati (রাঙ্গামাটি)",
    "Khagrachhari (খাগড়াছড়ি)"
  ]
};

// Expose globally for vanilla JS
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
