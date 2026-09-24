/**
 * Gadget Bazar BD - Main Vanilla JavaScript Application
 * All interactive functionality: Catalog, Filtering, Quick View,
 * Buy Now Order Popup, Cart System, Validations & Backend Proxy.
 */

// Global State
let currentFilter = 'all';
let currentSort = 'default';
let activeOrderProduct = null;
let orderQuantity = 1;
let selectedColor = '';
let selectedSize = '';
let cart = [];

// Initialize Cart from LocalStorage
try {
  const savedCart = localStorage.getItem('gb_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
} catch (e) {
  console.error("Error reading cart from localStorage", e);
  cart = [];
}

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  renderReviews();
  renderFaqs();
  updateCartBadge();
  initCountdownTimer();
  initDistrictDropdown();
  setupEventListeners();
});

/* -------------------------------------------------------------
 * 1. Render Categories
 * ----------------------------------------------------------- */
function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container || !window.categories) return;

  container.innerHTML = window.categories.map(cat => `
    <button 
      type="button"
      onclick="handleCategoryClick('${cat.id}')"
      class="category-pill group flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#008bf5] hover:shadow-md transition-all duration-200 text-left w-full cursor-pointer ${currentFilter === cat.id ? 'active !bg-[#008bf5] !text-white !border-[#008bf5]' : 'text-slate-700'}"
      id="category-${cat.id.replace(/\s+/g, '-').toLowerCase()}"
    >
      <div class="w-10 h-10 rounded-xl flex items-center justify-center ${currentFilter === cat.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#008bf5] group-hover:bg-[#008bf5] group-hover:text-white'} transition-colors duration-200 text-base shrink-0">
        <i class="fa-solid ${cat.icon}"></i>
      </div>
      <div class="min-w-0">
        <p class="font-semibold text-sm sm:text-base truncate leading-tight">${cat.name}</p>
        <span class="text-xs ${currentFilter === cat.id ? 'text-blue-100' : 'text-slate-500'}">${cat.count}টি পণ্য</span>
      </div>
    </button>
  `).join('');
}

function handleCategoryClick(categoryId) {
  currentFilter = categoryId;
  renderCategories();
  filterProducts(categoryId);
  
  // Update UI filter buttons in product section if present
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.dataset.filter === categoryId) {
      btn.classList.add('bg-[#008bf5]', 'text-white', 'border-[#008bf5]');
      btn.classList.remove('bg-white', 'text-slate-600');
    } else {
      btn.classList.remove('bg-[#008bf5]', 'text-white', 'border-[#008bf5]');
      btn.classList.add('bg-white', 'text-slate-600');
    }
  });

  const productSection = document.getElementById('products-section');
  if (productSection) {
    productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* -------------------------------------------------------------
 * 2. Render Products & Filtering
 * ----------------------------------------------------------- */
function renderProducts() {
  const container = document.getElementById('product-grid');
  if (!container || !window.products) return;

  let filtered = [...window.products];

  // Apply Filter
  if (currentFilter !== 'all') {
    if (currentFilter === 'offers') {
      filtered = filtered.filter(p => p.isOffer);
    } else if (currentFilter === 'bestsellers') {
      filtered = filtered.filter(p => p.isBestSeller);
    } else {
      filtered = filtered.filter(p => p.category === currentFilter);
    }
  }

  // Search filter if query exists
  const searchInput = document.getElementById('product-search-input');
  if (searchInput && searchInput.value.trim() !== '') {
    const q = searchInput.value.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.banglaName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Apply Sort
  if (currentSort === 'low-to-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'high-to-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  const countBadge = document.getElementById('product-count-badge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length}টি গ্যাজেট পাওয়া গেছে`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-blue-50 text-[#008bf5] mx-auto flex items-center justify-center text-2xl mb-4">
          <i class="fa-solid fa-box-open"></i>
        </div>
        <h4 class="text-xl font-bold text-slate-800 mb-2">কোনো পণ্য পাওয়া যায়নি</h4>
        <p class="text-slate-500 text-sm max-w-md mx-auto mb-5">আপনার পছন্দের ক্যাটাগরি বা সার্চ কিওয়ার্ড পরিবর্তন করে আবার চেষ্টা করুন।</p>
        <button onclick="resetFilters()" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
          <i class="fa-solid fa-rotate-left"></i> সব পণ্য দেখুন
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="product-card group bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between" id="product-${p.id}">
      <!-- Image & Badges -->
      <div class="relative w-full aspect-square bg-slate-50 overflow-hidden cursor-pointer" onclick="openProductModal(${p.id})">
        <img 
          src="${p.image}" 
          alt="${p.name}" 
          loading="lazy" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'"
        />
        
        <!-- Badges -->
        <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          ${p.discount > 0 ? `
            <span class="badge-discount px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide">
              ${p.discount}% ছাড়
            </span>
          ` : ''}
          ${p.isBestSeller ? `
            <span class="bg-amber-500 text-white px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs">
              <i class="fa-solid fa-crown text-[9px] mr-1"></i> বেস্ট সেলার
            </span>
          ` : ''}
        </div>

        <!-- Quick View Overlay Button -->
        <button 
          type="button" 
          onclick="event.stopPropagation(); openProductModal(${p.id})"
          class="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 text-slate-700 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#008bf5] hover:text-white"
          title="দ্রুত দেখুন (Quick View)"
        >
          <i class="fa-solid fa-eye text-sm"></i>
        </button>
      </div>

      <!-- Info Section -->
      <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <!-- Category & Rating -->
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-xs font-medium text-[#008bf5] bg-blue-50/80 px-2 py-0.5 rounded-md">
              ${p.category}
            </span>
            <div class="flex items-center text-xs text-amber-500 gap-1 font-medium">
              <i class="fa-solid fa-star text-[11px]"></i>
              <span>${p.rating}</span>
              <span class="text-slate-400">(${p.reviews})</span>
            </div>
          </div>

          <!-- Product Name -->
          <h3 
            onclick="openProductModal(${p.id})"
            class="font-bold text-slate-800 text-base leading-snug group-hover:text-[#008bf5] transition-colors cursor-pointer line-clamp-1 mb-1" 
            title="${p.name}"
          >
            ${p.name}
          </h3>
          <p class="text-xs text-slate-500 line-clamp-1 mb-2.5">${p.banglaName}</p>

          <!-- Short Description -->
          <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            ${p.shortDesc}
          </p>
        </div>

        <div>
          <!-- Colors if available -->
          ${p.colors && p.colors.length > 0 ? `
            <div class="flex items-center gap-1.5 mb-3">
              <span class="text-[11px] text-slate-400">কালার:</span>
              <div class="flex items-center gap-1">
                ${p.colors.map(c => `
                  <span class="inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    ${c}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Price & Stock -->
          <div class="flex items-baseline justify-between gap-2 pt-2 border-t border-slate-100 mb-3.5">
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-bold text-slate-900 leading-none">
                ৳${p.price.toLocaleString()}
              </span>
              ${p.oldPrice ? `
                <span class="text-xs text-slate-400 line-through">
                  ৳${p.oldPrice.toLocaleString()}
                </span>
              ` : ''}
            </div>
            <span class="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ইন স্টক
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="grid grid-cols-2 gap-2">
            <button 
              type="button" 
              onclick="addToCart(${p.id}, 1)"
              class="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <i class="fa-solid fa-cart-plus text-slate-500"></i> কার্ট
            </button>
            <button 
              type="button" 
              onclick="openOrderModal(${p.id})"
              class="w-full py-2.5 px-3 rounded-xl btn-primary font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-bolt text-yellow-300"></i> কিনুন
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(category) {
  currentFilter = category;
  renderProducts();
}

function sortProducts(sortOption) {
  currentSort = sortOption;
  renderProducts();
}

function resetFilters() {
  currentFilter = 'all';
  currentSort = 'default';
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) searchInput.value = '';
  renderCategories();
  renderProducts();
}

/* -------------------------------------------------------------
 * 3. Product Quick View Modal
 * ----------------------------------------------------------- */
function openProductModal(productId) {
  const product = window.products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quick-view-modal');
  const container = document.getElementById('quick-view-content');
  if (!modal || !container) return;

  let selectedModalColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
  let selectedModalSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
  let modalQty = 1;

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      <!-- Product Image Gallery -->
      <div class="space-y-3">
        <div class="relative w-full aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
          <img 
            id="modal-main-image" 
            src="${product.image}" 
            alt="${product.name}" 
            class="w-full h-full object-cover"
          />
          <span class="badge-discount absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold">
            ${product.discount}% বিশেষ ছাড়
          </span>
        </div>
        ${product.gallery && product.gallery.length > 1 ? `
          <div class="flex gap-2 overflow-x-auto pb-1">
            ${product.gallery.map((img, idx) => `
              <button 
                type="button" 
                onclick="document.getElementById('modal-main-image').src='${img}'"
                class="w-16 h-16 rounded-xl border-2 border-slate-200 overflow-hidden hover:border-[#008bf5] shrink-0"
              >
                <img src="${img}" class="w-full h-full object-cover" />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Product Details -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-[#008bf5] rounded-md">
              ${product.category}
            </span>
            <div class="flex items-center text-xs text-amber-500 gap-1 font-semibold">
              <i class="fa-solid fa-star"></i>
              <span>${product.rating}</span>
              <span class="text-slate-400">(${product.reviews}টি রিভিউ)</span>
            </div>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-1 leading-tight">
            ${product.name}
          </h2>
          <p class="text-sm text-[#008bf5] font-medium mb-3">${product.banglaName}</p>

          <!-- Price -->
          <div class="flex items-baseline gap-3 p-3 bg-slate-50 rounded-xl mb-4">
            <span class="text-2xl sm:text-3xl font-bold text-[#008bf5]">
              ৳${product.price.toLocaleString()}
            </span>
            ${product.oldPrice ? `
              <span class="text-sm text-slate-400 line-through">
                ৳${product.oldPrice.toLocaleString()}
              </span>
            ` : ''}
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">
              সাশ্রয় ৳${(product.oldPrice - product.price).toLocaleString()}
            </span>
          </div>

          <!-- Description & Features -->
          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            ${product.shortDesc}
          </p>

          ${product.features && product.features.length > 0 ? `
            <div class="mb-4">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">মূল বৈশিষ্ট্যাবলী:</h4>
              <ul class="space-y-1.5 text-xs text-slate-600">
                ${product.features.map(f => `
                  <li class="flex items-start gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-sm shrink-0"></i>
                    <span>${f}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Options Selection -->
          <div class="space-y-3.5 pt-3 border-t border-slate-100">
            <!-- Colors -->
            ${product.colors && product.colors.length > 0 ? `
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">কালার নির্বাচন করুন:</label>
                <div class="flex flex-wrap gap-2" id="modal-color-group">
                  ${product.colors.map((c, i) => `
                    <button 
                      type="button" 
                      onclick="setModalColor('${c}', this)"
                      class="modal-color-pill px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${i === 0 ? 'border-[#008bf5] bg-blue-50 text-[#008bf5]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}"
                    >
                      ${c}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Sizes -->
            ${product.sizes && product.sizes.length > 0 ? `
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">সাইজ:</label>
                <div class="flex flex-wrap gap-2" id="modal-size-group">
                  ${product.sizes.map((s, i) => `
                    <button 
                      type="button" 
                      onclick="setModalSize('${s}', this)"
                      class="modal-size-pill px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${i === 0 ? 'border-[#008bf5] bg-blue-50 text-[#008bf5]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}"
                    >
                      ${s}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Quantity -->
            <div class="flex items-center gap-4 pt-1">
              <span class="text-xs font-semibold text-slate-700">পরিমাণ:</span>
              <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button type="button" onclick="adjustModalQty(-1)" class="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold">-</button>
                <span id="modal-qty-display" class="w-10 text-center font-bold text-sm text-slate-800">1</span>
                <button type="button" onclick="adjustModalQty(1)" class="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold">+</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="grid grid-cols-2 gap-3 pt-5 mt-5 border-t border-slate-100">
          <button 
            type="button" 
            onclick="addModalToCart(${product.id})"
            class="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <i class="fa-solid fa-cart-plus"></i> কার্ট এ রাখুন
          </button>
          <button 
            type="button" 
            onclick="buyNowFromModal(${product.id})"
            class="py-3 px-4 rounded-xl btn-primary font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <i class="fa-solid fa-bolt text-yellow-300"></i> এখনই কিনুন
          </button>
        </div>
      </div>
    </div>
  `;

  // Store active modal attributes
  modal.dataset.productId = product.id;
  modal.dataset.selectedColor = selectedModalColor;
  modal.dataset.selectedSize = selectedModalSize;
  modal.dataset.qty = "1";

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeProductModal() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function setModalColor(color, btn) {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.dataset.selectedColor = color;
  document.querySelectorAll('.modal-color-pill').forEach(b => {
    b.classList.remove('border-[#008bf5]', 'bg-blue-50', 'text-[#008bf5]');
    b.classList.add('border-slate-200', 'text-slate-600');
  });
  btn.classList.add('border-[#008bf5]', 'bg-blue-50', 'text-[#008bf5]');
  btn.classList.remove('border-slate-200', 'text-slate-600');
}

function setModalSize(size, btn) {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.dataset.selectedSize = size;
  document.querySelectorAll('.modal-size-pill').forEach(b => {
    b.classList.remove('border-[#008bf5]', 'bg-blue-50', 'text-[#008bf5]');
    b.classList.add('border-slate-200', 'text-slate-600');
  });
  btn.classList.add('border-[#008bf5]', 'bg-blue-50', 'text-[#008bf5]');
  btn.classList.remove('border-slate-200', 'text-slate-600');
}

function adjustModalQty(delta) {
  const modal = document.getElementById('quick-view-modal');
  const display = document.getElementById('modal-qty-display');
  if (!modal || !display) return;
  let qty = parseInt(modal.dataset.qty || "1", 10) + delta;
  if (qty < 1) qty = 1;
  if (qty > 50) qty = 50;
  modal.dataset.qty = qty.toString();
  display.textContent = qty.toString();
}

function addModalToCart(productId) {
  const modal = document.getElementById('quick-view-modal');
  const qty = parseInt(modal?.dataset.qty || "1", 10);
  const color = modal?.dataset.selectedColor || '';
  const size = modal?.dataset.selectedSize || '';
  addToCart(productId, qty, color, size);
  closeProductModal();
}

function buyNowFromModal(productId) {
  const modal = document.getElementById('quick-view-modal');
  const qty = parseInt(modal?.dataset.qty || "1", 10);
  const color = modal?.dataset.selectedColor || '';
  const size = modal?.dataset.selectedSize || '';
  closeProductModal();
  openOrderModal(productId, color, size, qty);
}

/* -------------------------------------------------------------
 * 4. IMPORTANT - BUY NOW POPUP ORDER FORM
 * ----------------------------------------------------------- */
function initDistrictDropdown() {
  const districtSelect = document.getElementById('order-district');
  if (!districtSelect || !window.CONFIG || !window.CONFIG.districts) return;

  districtSelect.innerHTML = `
    <option value="" disabled selected>আপনার জেলা নির্বাচন করুন</option>
    ${window.CONFIG.districts.map(d => `
      <option value="${d}">${d}</option>
    `).join('')}
  `;
}

function openOrderModal(productId, initialColor, initialSize, initialQty = 1) {
  const product = window.products.find(p => p.id === productId);
  if (!product) return;

  activeOrderProduct = product;
  orderQuantity = initialQty || 1;
  
  const modal = document.getElementById('order-modal');
  if (!modal) return;

  // Populate Product Summary Header in Modal
  const imgEl = document.getElementById('order-summary-img');
  const nameEl = document.getElementById('order-summary-name');
  const priceEl = document.getElementById('order-summary-price');
  const prodNameInput = document.getElementById('order-product-name-input');
  
  if (imgEl) imgEl.src = product.image;
  if (nameEl) nameEl.textContent = product.name;
  if (priceEl) priceEl.textContent = `৳${product.price.toLocaleString()}`;
  if (prodNameInput) prodNameInput.value = `${product.name} (৳${product.price})`;

  // Color selection
  const colorContainer = document.getElementById('order-color-container');
  const colorSelect = document.getElementById('order-color-select');
  if (product.colors && product.colors.length > 0) {
    selectedColor = initialColor || product.colors[0];
    if (colorSelect) {
      colorSelect.innerHTML = product.colors.map(c => `
        <option value="${c}" ${c === selectedColor ? 'selected' : ''}>${c}</option>
      `).join('');
    }
    if (colorContainer) colorContainer.classList.remove('hidden');
  } else {
    selectedColor = 'Standard';
    if (colorContainer) colorContainer.classList.add('hidden');
  }

  // Size selection
  const sizeContainer = document.getElementById('order-size-container');
  const sizeSelect = document.getElementById('order-size-select');
  if (product.sizes && product.sizes.length > 0) {
    selectedSize = initialSize || product.sizes[0];
    if (sizeSelect) {
      sizeSelect.innerHTML = product.sizes.map(s => `
        <option value="${s}" ${s === selectedSize ? 'selected' : ''}>${s}</option>
      `).join('');
    }
    if (sizeContainer) sizeContainer.classList.remove('hidden');
  } else {
    selectedSize = 'Free Size';
    if (sizeContainer) sizeContainer.classList.add('hidden');
  }

  // Quantity Display
  const qtyInput = document.getElementById('order-quantity-input');
  if (qtyInput) qtyInput.value = orderQuantity;

  // Select Dhaka by default if not chosen
  const districtSelect = document.getElementById('order-district');
  if (districtSelect && !districtSelect.value) {
    districtSelect.value = "Dhaka (ঢাকা)";
  }

  // Reset Payment Method to COD
  const codRadio = document.getElementById('payment-cod');
  if (codRadio) codRadio.checked = true;
  handlePaymentMethodChange('cod');

  updateOrderSummary();

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function adjustOrderQty(delta) {
  orderQuantity += delta;
  if (orderQuantity < 1) orderQuantity = 1;
  if (orderQuantity > 50) orderQuantity = 50;
  
  const qtyInput = document.getElementById('order-quantity-input');
  if (qtyInput) qtyInput.value = orderQuantity;

  updateOrderSummary();
}

function handlePaymentMethodChange(method) {
  const trxBox = document.getElementById('payment-code-container');
  const instructionsBox = document.getElementById('payment-instructions-box');
  const instructionsContent = document.getElementById('payment-instructions-content');
  const trxInput = document.getElementById('order-payment-code');

  if (method === 'cod') {
    if (trxBox) trxBox.classList.add('hidden');
    if (instructionsBox) instructionsBox.classList.add('hidden');
    if (trxInput) {
      trxInput.required = false;
      trxInput.value = '';
    }
  } else {
    if (trxBox) trxBox.classList.remove('hidden');
    if (trxInput) trxInput.required = true;

    if (instructionsBox && instructionsContent && window.CONFIG?.paymentInstructions) {
      const info = window.CONFIG.paymentInstructions[method];
      if (info) {
        instructionsBox.classList.remove('hidden');
        instructionsContent.innerHTML = `
          <div class="text-xs sm:text-sm text-slate-700 space-y-1">
            <p class="font-bold text-[#008bf5] flex items-center gap-1.5">
              <i class="fa-solid fa-circle-info"></i> ${info.title}
            </p>
            ${info.number ? `
              <p class="font-mono text-sm bg-white p-2 rounded-lg border border-blue-200 font-bold text-slate-900 select-all">
                নম্বর: <span class="text-[#008bf5]">${info.number}</span>
              </p>
            ` : ''}
            ${info.details ? `
              <pre class="font-mono text-xs bg-white p-2 rounded-lg border border-blue-200 whitespace-pre-wrap text-slate-800">${info.details}</pre>
            ` : ''}
            <p class="text-xs text-slate-500 pt-1">${info.instructions}</p>
          </div>
        `;
      }
    }
  }
}

function updateOrderSummary() {
  if (!activeOrderProduct) return;

  const districtSelect = document.getElementById('order-district');
  const isDhaka = districtSelect && districtSelect.value.includes('Dhaka');
  
  const insideFee = window.CONFIG?.deliveryInsideDhaka ?? 80;
  const outsideFee = window.CONFIG?.deliveryOutsideDhaka ?? 130;
  const deliveryCharge = isDhaka ? insideFee : outsideFee;

  const subtotal = activeOrderProduct.price * orderQuantity;
  const grandTotal = subtotal + deliveryCharge;

  // DOM elements update
  const summaryProdName = document.getElementById('sum-product-name');
  const summaryUnit = document.getElementById('sum-unit-price');
  const summaryQty = document.getElementById('sum-quantity');
  const summarySubtotal = document.getElementById('sum-subtotal');
  const summaryDelivery = document.getElementById('sum-delivery');
  const summaryGrandTotal = document.getElementById('sum-grand-total');

  if (summaryProdName) summaryProdName.textContent = activeOrderProduct.name;
  if (summaryUnit) summaryUnit.textContent = `৳${activeOrderProduct.price.toLocaleString()}`;
  if (summaryQty) summaryQty.textContent = orderQuantity.toString();
  if (summarySubtotal) summarySubtotal.textContent = `৳${subtotal.toLocaleString()}`;
  if (summaryDelivery) summaryDelivery.textContent = `৳${deliveryCharge.toLocaleString()}`;
  if (summaryGrandTotal) summaryGrandTotal.textContent = `৳${grandTotal.toLocaleString()}`;
}

/* -------------------------------------------------------------
 * 5. Order Form Validation & Submission (Google Sheet + Telegram)
 * ----------------------------------------------------------- */
function generateOrderId() {
  const prefix = window.CONFIG?.orderIdPrefix || 'GB';
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomNum = Math.floor(100 + Math.random() * 900); // 3 digits
  return `${prefix}-${year}${month}${day}-${randomNum}`;
}

async function submitOrder(event) {
  event.preventDefault();

  if (!activeOrderProduct) {
    showErrorMessage("কোনো পণ্য নির্বাচন করা হয়নি!");
    return;
  }

  // Get Form Values
  const nameInput = document.getElementById('order-customer-name');
  const phoneInput = document.getElementById('order-customer-phone');
  const districtSelect = document.getElementById('order-district');
  const addressInput = document.getElementById('order-customer-address');
  const colorSelect = document.getElementById('order-color-select');
  const sizeSelect = document.getElementById('order-size-select');
  const paymentMethodInput = document.querySelector('input[name="payment_method"]:checked');
  const trxInput = document.getElementById('order-payment-code');

  const customerName = nameInput ? nameInput.value.trim() : '';
  const customerPhone = phoneInput ? phoneInput.value.trim() : '';
  const district = districtSelect ? districtSelect.value : '';
  const address = addressInput ? addressInput.value.trim() : '';
  const paymentMethod = paymentMethodInput ? paymentMethodInput.value : 'cod';
  const paymentCode = trxInput ? trxInput.value.trim() : '';
  const color = colorSelect ? colorSelect.value : (selectedColor || 'Standard');
  const size = sizeSelect ? sizeSelect.value : (selectedSize || 'Free Size');

  // 1. Validation: Name
  if (!customerName || customerName.length < 2) {
    showErrorMessage("অনুগ্রহ করে আপনার সঠিক নাম লিখুন।");
    if (nameInput) nameInput.focus();
    return;
  }

  // 2. Validation: Bangladesh Phone Number
  // Format: 01XXXXXXXXX (11 digits, begins with 013-019)
  const bdPhoneRegex = /^01[3-9]\d{8}$/;
  const sanitizedPhone = customerPhone.replace(/[\s-+]/g, '');
  if (!bdPhoneRegex.test(sanitizedPhone)) {
    showErrorMessage("অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)");
    if (phoneInput) phoneInput.focus();
    return;
  }

  // 3. Validation: District
  if (!district) {
    showErrorMessage("অনুগ্রহ করে আপনার জেলা নির্বাচন করুন।");
    if (districtSelect) districtSelect.focus();
    return;
  }

  // 4. Validation: Address
  if (!address || address.length < 6) {
    showErrorMessage("অনুগ্রহ করে আপনার পূর্ণ ডেলিভারি ঠিকানা বিস্তারিত লিখুন।");
    if (addressInput) addressInput.focus();
    return;
  }

  // 5. Validation: Payment Code if not COD
  if (paymentMethod !== 'cod' && !paymentCode) {
    showErrorMessage("অনুগ্রহ করে আপনার পেমেন্টের Transaction ID (TrxID) প্রদান করুন।");
    if (trxInput) trxInput.focus();
    return;
  }

  // Calculate Costs
  const isDhaka = district.includes('Dhaka');
  const deliveryCharge = isDhaka 
    ? (window.CONFIG?.deliveryInsideDhaka ?? 80) 
    : (window.CONFIG?.deliveryOutsideDhaka ?? 130);
  const productTotal = activeOrderProduct.price * orderQuantity;
  const grandTotal = productTotal + deliveryCharge;
  const orderId = generateOrderId();
  
  // Format Bangladesh Time
  const now = new Date();
  const formattedDateTime = now.toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'medium',
    timeStyle: 'short'
  }) + ' (BST)';

  // Build Payload
  const orderPayload = {
    orderId,
    dateTime: formattedDateTime,
    productId: activeOrderProduct.id,
    productName: activeOrderProduct.name,
    productBanglaName: activeOrderProduct.banglaName,
    color,
    size,
    quantity: orderQuantity,
    productPrice: activeOrderProduct.price,
    productTotal,
    deliveryCharge,
    totalPrice: grandTotal,
    customerName,
    phone: sanitizedPhone,
    district,
    fullAddress: address,
    paymentMethod: paymentMethod.toUpperCase(),
    paymentCode: paymentCode || 'N/A (Cash on Delivery)',
    orderSource: 'Website Landing Page'
  };

  // Submit Button Loading State
  const submitBtn = document.getElementById('order-submit-btn');
  const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <i class="fa-solid fa-circle-notch fa-spin"></i> অর্ডার পাঠানো হচ্ছে...
    `;
  }

  try {
    // Send to our secure server backend endpoint
    const response = await fetch(window.CONFIG?.TELEGRAM_PROXY_URL || '/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...orderPayload,
        googleScriptUrl: window.CONFIG?.GOOGLE_SCRIPT_URL
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Save order to LocalStorage for customer order history reference
      try {
        const history = JSON.parse(localStorage.getItem('gb_orders') || '[]');
        history.unshift(orderPayload);
        localStorage.setItem('gb_orders', JSON.stringify(history.slice(0, 10)));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }

      // Reset form and close modal
      closeOrderModal();
      showSuccessModal(orderId, orderPayload);
      document.getElementById('order-form')?.reset();
    } else {
      throw new Error(result.message || 'অর্ডার পাঠানো যায়নি');
    }
  } catch (error) {
    console.error("Order submission error:", error);
    showErrorMessage("❌ অর্ডার পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি আমাদের ফোনে/হোয়াটসঅ্যাপে যোগাযোগ করুন।");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  }
}

/* -------------------------------------------------------------
 * 6. Success & Error Modals
 * ----------------------------------------------------------- */
function showSuccessModal(orderId, orderData) {
  const modal = document.getElementById('success-modal');
  const idEl = document.getElementById('success-order-id');
  const detailsEl = document.getElementById('success-order-details');
  if (!modal) return;

  if (idEl) idEl.textContent = orderId;
  if (detailsEl && orderData) {
    detailsEl.innerHTML = `
      <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs sm:text-sm space-y-1.5 text-slate-700">
        <div class="flex justify-between font-bold border-b border-slate-200 pb-2 mb-2">
          <span>পণ্য:</span>
          <span class="text-slate-900">${orderData.productName} (${orderData.quantity}টি)</span>
        </div>
        <div class="flex justify-between">
          <span>গ্রাহকের নাম:</span>
          <span class="font-medium text-slate-900">${orderData.customerName}</span>
        </div>
        <div class="flex justify-between">
          <span>মোবাইল নম্বর:</span>
          <span class="font-medium text-slate-900">${orderData.phone}</span>
        </div>
        <div class="flex justify-between">
          <span>ডেলিভারি ঠিকানা:</span>
          <span class="font-medium text-slate-900 text-right max-w-[65%]">${orderData.fullAddress}, ${orderData.district}</span>
        </div>
        <div class="flex justify-between">
          <span>পেমেন্ট মাধ্যম:</span>
          <span class="font-bold text-[#008bf5]">${orderData.paymentMethod}</span>
        </div>
        <div class="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2 mt-2">
          <span>মোট প্রদেয় বিল:</span>
          <span class="text-emerald-600 text-base">৳${orderData.totalPrice.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function showErrorMessage(msg) {
  const toast = document.getElementById('error-toast');
  const msgEl = document.getElementById('error-toast-msg');
  if (!toast || !msgEl) {
    alert(msg);
    return;
  }

  msgEl.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 4500);
}

/* -------------------------------------------------------------
 * 7. Cart System
 * ----------------------------------------------------------- */
function addToCart(productId, qty = 1, color = '', size = '') {
  const product = window.products.find(p => p.id === productId);
  if (!product) return;

  const itemColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard');
  const itemSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size');

  const existingIndex = cart.findIndex(item => 
    item.id === productId && item.color === itemColor && item.size === itemSize
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      banglaName: product.banglaName,
      price: product.price,
      image: product.image,
      color: itemColor,
      size: itemSize,
      quantity: qty
    });
  }

  saveCart();
  updateCartBadge();
  showCartToast(`"${product.name}" কার্ট-এ যুক্ত হয়েছে!`);
}

function saveCart() {
  try {
    localStorage.setItem('gb_cart', JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to save cart", e);
  }
}

function updateCartBadge() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelectorAll('.cart-count-badge').forEach(badge => {
    badge.textContent = totalCount.toString();
    if (totalCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;

  if (drawer.classList.contains('hidden')) {
    renderCartDrawer();
    drawer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  } else {
    drawer.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-drawer-subtotal');
  const grandTotalEl = document.getElementById('cart-drawer-grandtotal');
  const deliveryEl = document.getElementById('cart-drawer-delivery');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl mb-3">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>
        <p class="font-bold text-slate-700 mb-1">আপনার কার্ট খালি</p>
        <p class="text-xs text-slate-500 mb-4">পছন্দের গ্যাজেটগুলো কার্ট-এ যোগ করুন</p>
        <button onclick="toggleCartDrawer()" class="btn-primary text-xs px-4 py-2 rounded-lg font-semibold">
          কেনাকাটা শুরু করুন
        </button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = '৳0';
    if (grandTotalEl) grandTotalEl.textContent = '৳0';
    if (deliveryEl) deliveryEl.textContent = '৳0';
    return;
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const defaultDelivery = window.CONFIG?.deliveryInsideDhaka ?? 80;
  const grandTotal = subtotal + defaultDelivery;

  container.innerHTML = cart.map((item, idx) => `
    <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover bg-white shrink-0" />
      <div class="flex-1 min-w-0">
        <h4 class="text-xs sm:text-sm font-bold text-slate-800 truncate">${item.name}</h4>
        <p class="text-[11px] text-slate-500">${item.color} | ${item.size}</p>
        <span class="text-xs font-bold text-[#008bf5]">৳${item.price.toLocaleString()}</span>
        <div class="flex items-center gap-2 mt-1">
          <button onclick="adjustCartQty(${idx}, -1)" class="w-6 h-6 bg-white border border-slate-200 rounded text-xs font-bold flex items-center justify-center hover:bg-slate-100">-</button>
          <span class="text-xs font-semibold w-4 text-center">${item.quantity}</span>
          <button onclick="adjustCartQty(${idx}, 1)" class="w-6 h-6 bg-white border border-slate-200 rounded text-xs font-bold flex items-center justify-center hover:bg-slate-100">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${idx})" class="text-slate-400 hover:text-red-500 p-2 text-sm" title="মুছে ফেলুন">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `৳${subtotal.toLocaleString()}`;
  if (deliveryEl) deliveryEl.textContent = `৳${defaultDelivery.toLocaleString()}`;
  if (grandTotalEl) grandTotalEl.textContent = `৳${grandTotal.toLocaleString()}`;
}

function adjustCartQty(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function removeFromCart(index) {
  if (!cart[index]) return;
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function checkoutFromCart() {
  if (cart.length === 0) {
    showErrorMessage("আপনার কার্ট খালি!");
    return;
  }
  toggleCartDrawer();
  
  // Create a combined checkout representation or open the top product
  const primaryItem = cart[0];
  openOrderModal(primaryItem.id, primaryItem.color, primaryItem.size, primaryItem.quantity);
}

function showCartToast(msg) {
  const toast = document.getElementById('cart-toast');
  const msgEl = document.getElementById('cart-toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

/* -------------------------------------------------------------
 * 8. Special Offer Countdown Timer
 * ----------------------------------------------------------- */
function initCountdownTimer() {
  // 12 hours from current time for a sense of urgency
  let targetTime = Date.now() + (11 * 3600 + 42 * 60 + 19) * 1000;

  function update() {
    const now = Date.now();
    let diff = Math.max(0, targetTime - now);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const hEl = document.getElementById('timer-hours');
    const mEl = document.getElementById('timer-minutes');
    const sEl = document.getElementById('timer-seconds');

    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(seconds).padStart(2, '0');

    if (diff <= 0) {
      targetTime = Date.now() + 12 * 3600 * 1000; // Reset loop
    }
  }

  update();
  setInterval(update, 1000);
}

/* -------------------------------------------------------------
 * 9. Reviews & FAQs Render
 * ----------------------------------------------------------- */
function renderReviews() {
  const container = document.getElementById('reviews-grid');
  if (!container || !window.reviewsData) return;

  container.innerHTML = window.reviewsData.map(r => `
    <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-[#008bf5] flex items-center justify-center font-bold text-base shrink-0">
              ${r.name.charAt(0)}
            </div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm leading-tight">${r.name}</h4>
              <p class="text-xs text-slate-400">${r.location}</p>
            </div>
          </div>
          <span class="text-xs text-slate-400">${r.date}</span>
        </div>

        <div class="flex items-center gap-1 text-amber-400 text-xs mb-3">
          ${Array(r.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
        </div>

        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
          "${r.comment}"
        </p>
      </div>

      <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span class="truncate"><i class="fa-solid fa-bag-shopping mr-1 text-[#008bf5]"></i> ${r.product}</span>
        <span class="text-emerald-600 font-semibold shrink-0"><i class="fa-solid fa-check-circle mr-1"></i> ভেরিফাইড ক্রেতা</span>
      </div>
    </div>
  `).join('');
}

function renderFaqs() {
  const container = document.getElementById('faq-accordion');
  if (!container || !window.faqsData) return;

  container.innerHTML = window.faqsData.map((faq, idx) => `
    <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden mb-3">
      <button 
        type="button" 
        onclick="toggleFaq(${idx})" 
        class="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-800 text-sm sm:text-base hover:text-[#008bf5] transition-colors cursor-pointer"
        id="faq-btn-${idx}"
      >
        <span><i class="fa-regular fa-circle-question text-[#008bf5] mr-2"></i> ${faq.question}</span>
        <i id="faq-icon-${idx}" class="fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200"></i>
      </button>
      <div id="faq-body-${idx}" class="hidden px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
        ${faq.answer}
      </div>
    </div>
  `).join('');
}

function toggleFaq(idx) {
  const body = document.getElementById(`faq-body-${idx}`);
  const icon = document.getElementById(`faq-icon-${idx}`);
  if (!body) return;

  const isHidden = body.classList.contains('hidden');
  
  // Close others for clean accordion
  document.querySelectorAll('[id^="faq-body-"]').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('[id^="faq-icon-"]').forEach(el => el.classList.remove('rotate-180'));

  if (isHidden) {
    body.classList.remove('hidden');
    if (icon) icon.classList.add('rotate-180');
  }
}

/* -------------------------------------------------------------
 * 10. Event Listeners & UI Helpers
 * ----------------------------------------------------------- */
function setupEventListeners() {
  // Mobile Nav Hamburger Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });
  }

  // Search input handler
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderProducts();
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeOrderModal();
      closeSuccessModal();
      closeBlogspotModal();
      const cartDrawer = document.getElementById('cart-drawer');
      if (cartDrawer && !cartDrawer.classList.contains('hidden')) {
        toggleCartDrawer();
      }
    }
  });
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) drawer.classList.toggle('hidden');
}

/* -------------------------------------------------------------
 * 11. Blogspot Single File Modal (for easy 1-click copy)
 * ----------------------------------------------------------- */
function openBlogspotModal() {
  const modal = document.getElementById('blogspot-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeBlogspotModal() {
  const modal = document.getElementById('blogspot-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

async function copyBlogspotCode() {
  const copyBtn = document.getElementById('copy-blogspot-btn');
  try {
    const res = await fetch('/single-file-blogspot.html');
    const code = await res.text();
    await navigator.clipboard.writeText(code);
    if (copyBtn) {
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> সম্পূর্ণ কোড কপি হয়েছে!';
      copyBtn.classList.add('bg-emerald-600');
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> কোড কপি করুন (Copy All Code)';
        copyBtn.classList.remove('bg-emerald-600');
      }, 3000);
    }
  } catch (err) {
    console.error("Failed to copy", err);
    alert("কপি করা যায়নি, আপনি সরাসরি ফাইলটি ডাউনলোড করতে পারেন।");
  }
}

// Expose globally for HTML onclick hooks
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.openOrderModal = openOrderModal;
window.closeOrderModal = closeOrderModal;
window.adjustOrderQty = adjustOrderQty;
window.updateOrderSummary = updateOrderSummary;
window.handlePaymentMethodChange = handlePaymentMethodChange;
window.submitOrder = submitOrder;
window.closeSuccessModal = closeSuccessModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.adjustCartQty = adjustCartQty;
window.toggleCartDrawer = toggleCartDrawer;
window.checkoutFromCart = checkoutFromCart;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.handleCategoryClick = handleCategoryClick;
window.resetFilters = resetFilters;
window.setModalColor = setModalColor;
window.setModalSize = setModalSize;
window.adjustModalQty = adjustModalQty;
window.addModalToCart = addModalToCart;
window.buyNowFromModal = buyNowFromModal;
window.toggleFaq = toggleFaq;
window.toggleMobileMenu = toggleMobileMenu;
window.openBlogspotModal = openBlogspotModal;
window.closeBlogspotModal = closeBlogspotModal;
window.copyBlogspotCode = copyBlogspotCode;
