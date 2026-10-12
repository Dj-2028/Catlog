// ============= Admin Dashboard JavaScript =============

const API = '/api/products';
let allProducts = [];
let allCategories = [];
let allServices = [];
let allEnquiries = [];
let currentEnquiryFilter = 'all';

let deleteAction = null;
let accumulatedFiles = [];
const MAX_IMAGES = 6;

// ------------- Initial Load -------------
function initAdminDashboard() {
  loadProducts();
  loadCategories();
  loadServices();
  loadEnquiries();
  loadStoreSettings();

  const productForm = document.getElementById('productForm');
  if (productForm) productForm.addEventListener('submit', handleProductSubmit);

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', debounce(handleSearch, 300));

  setupCategoryDropdown();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminDashboard);
} else {
  initAdminDashboard();
}

// ------------- Tab Switching -------------
function switchTab(tab) {
  const tabs = ['products', 'categories', 'services', 'enquiries', 'settings'];
  tabs.forEach(t => {
    const panel = document.getElementById('panel' + capitalize(t));
    const btn = document.getElementById('tabBtn' + capitalize(t));
    if (panel) {
      if (t === tab) panel.classList.remove('hidden');
      else panel.classList.add('hidden');
    }
    if (btn) {
      if (t === tab) {
        btn.className = 'tab-btn px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 bg-brand-600/15 text-brand-400 border border-brand-500/30';
      } else {
        btn.className = 'tab-btn px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-surface-400 hover:text-white hover:bg-surface-800/50';
      }
    }
  });

  if (tab === 'categories') renderCategoriesTab();
  if (tab === 'services') loadServices();
  if (tab === 'enquiries') loadEnquiries();
  if (tab === 'settings') loadStoreSettings();
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function closeAllPanels() {
  closePanel();
  closeServicePanel();
  closeDeleteModal();
}

// ========================================================
// 1. PRODUCTS
// ========================================================

async function loadProducts() {
  try {
    const res = await fetch(API + '?limit=100');
    const data = await res.json();
    allProducts = data.products || [];
    renderProductsTable(allProducts);
    const countEl = document.getElementById('productCount');
    if (countEl) countEl.textContent = `${allProducts.length} product${allProducts.length !== 1 ? 's' : ''} in catalog`;
    const tabCount = document.getElementById('tabCountProducts');
    if (tabCount) tabCount.textContent = allProducts.length;
  } catch (err) {
    showToast('Failed to load products', 'error');
  }
}

function renderProductsTable(products) {
  const tbody = document.getElementById('productTableBody');
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-4 py-12 text-center">
          <div class="text-4xl mb-3">📦</div>
          <p class="text-surface-500">No products found in catalog</p>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    const imgSrc = p.images && p.images.length > 0 && p.images[0].url ? p.images[0].url : '';
    const availLabels = {
      in_stock: { text: 'In Stock', cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
      limited: { text: 'Limited', cls: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
      on_order: { text: 'On Order', cls: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
      out_of_stock: { text: 'Out of Stock', cls: 'text-red-400 bg-red-500/10 border-red-500/30' }
    };
    const av = availLabels[p.availability] || availLabels.in_stock;

    return `
    <tr class="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
      <td class="px-4 py-3">
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-800 flex-shrink-0 border border-surface-700/50">
          ${imgSrc
        ? `<img src="${imgSrc}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover" />`
        : `<div class="w-full h-full flex items-center justify-center text-surface-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`
      }
        </div>
      </td>
      <td class="px-4 py-3 font-mono text-xs text-surface-400">${escapeHtml(p.serialNo)}</td>
      <td class="px-4 py-3">
        <div class="font-medium text-white text-sm">${escapeHtml(p.name)}</div>
        <div class="flex items-center gap-2 mt-0.5">
          ${p.isFeatured ? '<span class="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">⭐ Featured</span>' : ''}
          ${!p.isPublished ? '<span class="text-[10px] text-surface-500 uppercase">Draft</span>' : ''}
        </div>
      </td>
      <td class="px-4 py-3 hidden md:table-cell text-sm text-surface-300 font-medium">
        ${escapeHtml(p.brand || '—')}
      </td>
      <td class="px-4 py-3 hidden lg:table-cell">
        <span class="px-2.5 py-1 rounded-lg bg-surface-800 text-surface-300 text-xs font-medium border border-surface-700/50">${escapeHtml(p.category)}</span>
      </td>
      <td class="px-4 py-3 font-semibold text-white text-sm">
        ${p.price > 0 ? `₹${Number(p.price).toLocaleString('en-IN')}` : '<span class="text-xs text-brand-400 font-normal">Quote only</span>'}
      </td>
      <td class="px-4 py-3 hidden sm:table-cell">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${av.cls}">
          ${av.text}
        </span>
      </td>
      <td class="px-4 py-3">
        <div class="flex items-center justify-end gap-1.5">
          ${p.slug ? `<a href="/products/${p.slug}" target="_blank" class="p-2 rounded-lg hover:bg-surface-700 transition-colors text-surface-400 hover:text-emerald-400" title="View product page">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </a>` : ''}
          <button onclick="editProduct('${p._id}')" class="p-2 rounded-lg hover:bg-surface-700 transition-colors text-surface-400 hover:text-brand-400" title="Edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button onclick="confirmDeleteProduct('${p._id}', '${escapeHtml(p.name)}')" class="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-surface-400 hover:text-red-400" title="Delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  if (!query) { renderProductsTable(allProducts); return; }
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.serialNo.toLowerCase().includes(query) ||
    (p.brand && p.brand.toLowerCase().includes(query)) ||
    p.category.toLowerCase().includes(query)
  );
  renderProductsTable(filtered);
}

function openPanel(product = null) {
  const panel = document.getElementById('slidePanel');
  const overlay = document.getElementById('overlay');
  const title = document.getElementById('panelTitle');

  resetProductForm();

  if (product) {
    title.textContent = 'Edit Product';
    document.getElementById('productId').value = product._id;
    document.getElementById('formName').value = product.name || '';
    document.getElementById('formSerialNo').value = product.serialNo || '';
    document.getElementById('formBrand').value = product.brand || '';
    document.getElementById('formPrice').value = product.price || 0;
    document.getElementById('formAvailability').value = product.availability || 'in_stock';
    document.getElementById('formCategory').value = product.category || '';
    document.getElementById('formDescription').value = product.description || '';
    document.getElementById('formPublished').checked = product.isPublished !== false;
    document.getElementById('formFeatured').checked = product.isFeatured === true;

    if (product.specifications && Object.keys(product.specifications).length > 0) {
      Object.entries(product.specifications).forEach(([key, val]) => addSpecRow(key, val));
    }

    if (product.images && product.images.length > 0) {
      document.getElementById('existingImages').value = JSON.stringify(product.images);
      const grid = document.getElementById('existingImagesGrid');
      grid.innerHTML = product.images.map((img, idx) => `
        <div class="relative group aspect-square rounded-lg overflow-hidden border border-surface-700">
          <img src="${img.url}" class="w-full h-full object-cover" />
          <button type="button" onclick="removeExistingImage(${idx})" class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      `).join('');
      document.getElementById('existingImagesPreview').classList.remove('hidden');
    }

    document.getElementById('submitBtn').textContent = 'Update Product';
  } else {
    title.textContent = 'Add Product';
    document.getElementById('submitBtn').textContent = 'Save Product';
  }

  panel.classList.add('open');
  overlay.classList.add('active');
}

function closePanel() {
  const p = document.getElementById('slidePanel');
  if (p) p.classList.remove('open');
  const o = document.getElementById('overlay');
  if (o) o.classList.remove('active');
}

async function editProduct(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    const product = await res.json();
    openPanel(product);
  } catch (err) {
    showToast('Failed to load product details', 'error');
  }
}

function resetProductForm() {
  document.getElementById('productId').value = '';
  document.getElementById('existingImages').value = '[]';
  document.getElementById('formName').value = '';
  document.getElementById('formSerialNo').value = '';
  document.getElementById('formBrand').value = '';
  document.getElementById('formPrice').value = '';
  document.getElementById('formAvailability').value = 'in_stock';
  document.getElementById('formCategory').value = '';
  document.getElementById('formDescription').value = '';
  document.getElementById('specsContainer').innerHTML = '';
  document.getElementById('formPublished').checked = true;
  document.getElementById('formFeatured').checked = false;
  document.getElementById('formImages').value = '';
  document.getElementById('newImagesPreview').innerHTML = '';
  document.getElementById('existingImagesGrid').innerHTML = '';
  document.getElementById('existingImagesPreview').classList.add('hidden');
  accumulatedFiles = [];
  updateImageCounter();
}

function removeExistingImage(idx) {
  let images = JSON.parse(document.getElementById('existingImages').value || '[]');
  images.splice(idx, 1);
  document.getElementById('existingImages').value = JSON.stringify(images);

  const grid = document.getElementById('existingImagesGrid');
  if (images.length === 0) {
    document.getElementById('existingImagesPreview').classList.add('hidden');
    grid.innerHTML = '';
  } else {
    grid.innerHTML = images.map((img, i) => `
      <div class="relative group aspect-square rounded-lg overflow-hidden border border-surface-700">
        <img src="${img.url}" class="w-full h-full object-cover" />
        <button type="button" onclick="removeExistingImage(${i})" class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    `).join('');
  }
}

function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.78) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = function () {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

function handleImagePick(input) {
  const existingCount = JSON.parse(document.getElementById('existingImages').value || '[]').length;
  const allowedNew = MAX_IMAGES - existingCount;

  Array.from(input.files).forEach(file => {
    if (
      accumulatedFiles.length < allowedNew &&
      !accumulatedFiles.find(f => f.name === file.name && f.size === file.size)
    ) {
      accumulatedFiles.push(file);
    }
  });

  input.value = '';
  renderNewImagesPreview();
  updateImageCounter();
}

function removeNewImage(idx) {
  accumulatedFiles.splice(idx, 1);
  renderNewImagesPreview();
  updateImageCounter();
}

function renderNewImagesPreview() {
  const preview = document.getElementById('newImagesPreview');
  if (accumulatedFiles.length === 0) {
    preview.innerHTML = '';
    return;
  }
  preview.innerHTML = '';
  accumulatedFiles.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'relative group aspect-square rounded-lg overflow-hidden border border-surface-700';
      div.innerHTML = `
        <img src="${e.target.result}" class="w-full h-full object-cover" />
        <button type="button" onclick="removeNewImage(${idx})"
          class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>`;
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function updateImageCounter() {
  const el = document.getElementById('imageCounter');
  if (!el) return;
  const existingCount = JSON.parse(document.getElementById('existingImages').value || '[]').length;
  const total = existingCount + accumulatedFiles.length;
  el.textContent = `${total} / ${MAX_IMAGES} images`;
  el.className = total >= MAX_IMAGES
    ? 'text-xs text-amber-400 font-medium'
    : 'text-xs text-surface-500';
}

async function handleProductSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('productId').value;
  const formData = new FormData();

  formData.append('name', document.getElementById('formName').value);
  formData.append('serialNo', document.getElementById('formSerialNo').value);
  formData.append('brand', document.getElementById('formBrand').value.trim());
  formData.append('price', document.getElementById('formPrice').value || '0');
  formData.append('availability', document.getElementById('formAvailability').value);
  formData.append('category', document.getElementById('formCategory').value.trim());
  formData.append('description', document.getElementById('formDescription').value);
  formData.append('isPublished', document.getElementById('formPublished').checked);
  formData.append('isFeatured', document.getElementById('formFeatured').checked);

  const specs = getSpecsFromRows();
  formData.append('specifications', JSON.stringify(specs));

  if (id) {
    formData.append('existingImages', document.getElementById('existingImages').value);
  }

  const submitBtn = document.getElementById('submitBtn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    for (const file of accumulatedFiles) {
      const compressed = await compressImage(file);
      const namedBlob = new File([compressed], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
      formData.append('images', namedBlob);
    }

    const url = id ? `${API}/${id}` : API;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Something went wrong');

    showToast(id ? 'Product updated successfully' : 'Product created successfully', 'success');
    closePanel();
    await loadProducts();
    await loadCategories();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

function confirmDeleteProduct(id, name) {
  deleteAction = async () => {
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showToast('Product deleted successfully', 'success');
      closeDeleteModal();
      await loadProducts();
      await loadCategories();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  document.getElementById('deleteModalTitle').textContent = 'Delete Product';
  document.getElementById('deleteModalMsg').textContent = `Are you sure you want to delete "${name}"? This action cannot be undone.`;
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('confirmDeleteBtn').onclick = () => { if (deleteAction) deleteAction(); };
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  deleteAction = null;
}

function addSpecRow(key = '', value = '') {
  const container = document.getElementById('specsContainer');
  const row = document.createElement('div');
  row.className = 'flex items-center gap-2';
  row.innerHTML = `
        <input type="text" placeholder="e.g. Thickness" value="${escapeHtml(key)}"
            class="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 text-xs spec-key" />
        <input type="text" placeholder="e.g. 19 mm" value="${escapeHtml(value)}"
            class="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 text-xs spec-value" />
        <button type="button" onclick="this.parentElement.remove()"
            class="p-2 rounded-lg hover:bg-red-500/10 text-surface-500 hover:text-red-400 transition-colors flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
    `;
  container.appendChild(row);
}

function getSpecsFromRows() {
  const specs = {};
  document.querySelectorAll('#specsContainer > div').forEach(row => {
    const key = row.querySelector('.spec-key').value.trim();
    const val = row.querySelector('.spec-value').value.trim();
    if (key) specs[key] = val;
  });
  return specs;
}

// ========================================================
// 2. CATEGORIES
// ========================================================

async function loadCategories() {
  try {
    const res = await fetch('/api/categories?withCounts=1');
    if (!res.ok) throw new Error('Failed to fetch categories');
    allCategories = await res.json();
    renderCategoryDropdown();
    renderCategoriesTab();
    const tabCount = document.getElementById('tabCountCategories');
    if (tabCount) tabCount.textContent = allCategories.length;
  } catch (err) {
    showToast('Failed to load categories', 'error');
  }
}

function renderCategoriesTab() {
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  if (allCategories.length === 0) {
    grid.innerHTML = `<div class="col-span-full py-12 text-center text-surface-500">No categories found</div>`;
    return;
  }

  grid.innerHTML = allCategories.map(c => `
    <div class="p-5 rounded-2xl bg-surface-900 border border-surface-800 hover:border-surface-700 transition-all flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold flex-shrink-0">
          🏷️
        </div>
        <div class="min-w-0">
          <h4 class="font-display font-semibold text-white text-base truncate">${escapeHtml(c.name)}</h4>
          <p class="text-xs text-surface-400">${c.productCount || 0} product${c.productCount !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 flex-shrink-0">
        <a href="/products?category=${encodeURIComponent(c.name)}" target="_blank" class="p-2 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-emerald-400 transition-colors" title="View category in store">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
        <button onclick="confirmDeleteCategory('${c._id}', '${escapeHtml(c.name)}')" class="p-2 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition-colors" title="Delete category">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

async function handleCreateCategoryDirect() {
  const input = document.getElementById('newCatInput');
  const name = input ? input.value.trim() : '';
  if (!name) return showToast('Please enter a category name', 'error');

  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add category');
    showToast(`Category "${name}" created`, 'success');
    input.value = '';
    await loadCategories();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function confirmDeleteCategory(id, name) {
  deleteAction = async () => {
    try {
      const res = await fetch('/api/categories/' + id, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showToast('Category deleted', 'success');
      closeDeleteModal();
      await loadCategories();
      await loadProducts();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  document.getElementById('deleteModalTitle').textContent = 'Delete Category';
  document.getElementById('deleteModalMsg').textContent = `Delete "${name}"? Products in this category will be moved to "Uncategorized".`;
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('confirmDeleteBtn').onclick = () => { if (deleteAction) deleteAction(); };
}

function renderCategoryDropdown() {
  const list = document.getElementById('categoryList');
  if (!list) return;

  const inputVal = document.getElementById('formCategory').value.trim().toLowerCase();
  const filtered = allCategories.filter(c => c.name.toLowerCase().includes(inputVal));

  if (filtered.length === 0 && inputVal !== '') {
    list.innerHTML = `<li class="px-3 py-2 text-xs text-surface-500 text-center">No matches found</li>`;
  } else {
    list.innerHTML = filtered.map(c => `
      <li class="group flex items-center justify-between px-3 py-2 hover:bg-surface-700 cursor-pointer text-xs text-surface-200" onclick="selectCategory('${escapeHtml(c.name).replace(/'/g, "\\'")}')">
          <span class="flex-1">${escapeHtml(c.name)}</span>
      </li>
    `).join('');
  }
}

function selectCategory(name) {
  document.getElementById('formCategory').value = name;
  document.getElementById('categoryDropdown').classList.add('hidden');
  document.getElementById('categoryAddWrapper').classList.add('hidden');
}

function setupCategoryDropdown() {
  const input = document.getElementById('formCategory');
  const toggle = document.getElementById('categoryDropdownBtn');
  const dropdown = document.getElementById('categoryDropdown');
  const wrapper = document.getElementById('categoryWrapper');
  const addWrapper = document.getElementById('categoryAddWrapper');
  const addNameSpan = document.getElementById('newCategoryName');
  const addBtn = document.getElementById('categoryAddBtn');

  if (!input || !toggle) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
      renderCategoryDropdown();
      addWrapper.classList.add('hidden');
      dropdown.classList.remove('hidden');
      input.focus();
    } else {
      dropdown.classList.add('hidden');
    }
  });

  input.addEventListener('focus', () => {
    renderCategoryDropdown();
    dropdown.classList.remove('hidden');
  });

  input.addEventListener('input', () => {
    const val = input.value.trim();
    renderCategoryDropdown();
    const exists = allCategories.find(c => c.name.toLowerCase() === val.toLowerCase());
    if (val && !exists) {
      addNameSpan.textContent = val;
      addWrapper.classList.remove('hidden');
    } else {
      addWrapper.classList.add('hidden');
    }
  });

  addBtn.addEventListener('click', async () => {
    const val = input.value.trim();
    if (val) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: val })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        showToast('Category created', 'success');
        await loadCategories();
        selectCategory(val);
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (wrapper && !wrapper.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

// ========================================================
// 3. SERVICES
// ========================================================

async function loadServices() {
  try {
    const res = await fetch('/api/services?all=1');
    if (!res.ok) throw new Error('Failed to fetch services');
    allServices = await res.json();
    renderServicesTable(allServices);
    const tabCount = document.getElementById('tabCountServices');
    if (tabCount) tabCount.textContent = allServices.length;
  } catch (err) {
    showToast('Failed to load services', 'error');
  }
}

function renderServicesTable(services) {
  const tbody = document.getElementById('servicesTableBody');
  if (!tbody) return;

  if (services.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-12 text-center text-surface-500">
          No services configured yet
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = services.map(s => `
    <tr class="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
      <td class="px-4 py-3 font-mono text-xs text-surface-400">${s.order ?? 0}</td>
      <td class="px-4 py-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-surface-800 overflow-hidden flex-shrink-0 border border-surface-700/50 flex items-center justify-center text-lg">
            ${s.image && s.image.url
              ? `<img src="${s.image.url}" class="w-full h-full object-cover" />`
              : (s.icon === 'saw' ? '🪚' : s.icon === 'consult' ? '🤝' : s.icon === 'cabinet' ? '🗄️' : s.icon === 'truck' ? '🚛' : s.icon === 'delivery' ? '📦' : '🛠️')
            }
          </div>
          <div>
            <h4 class="font-medium text-white text-sm">${escapeHtml(s.title)}</h4>
            <span class="text-[11px] text-brand-400 font-mono">${escapeHtml(s.slug || '')}</span>
          </div>
        </div>
      </td>
      <td class="px-4 py-3 hidden md:table-cell text-xs text-surface-400 max-w-xs truncate">
        ${escapeHtml(s.shortDescription || '—')}
      </td>
      <td class="px-4 py-3">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.isActive ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-surface-500 bg-surface-800'}">
          <span class="w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-emerald-400' : 'bg-surface-500'}"></span>
          ${s.isActive ? 'Active' : 'Disabled'}
        </span>
      </td>
      <td class="px-4 py-3 text-right">
        <div class="flex items-center justify-end gap-1.5">
          <button onclick="editService('${s._id}')" class="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-brand-400 transition-colors" title="Edit service">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button onclick="confirmDeleteService('${s._id}', '${escapeHtml(s.title)}')" class="p-2 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition-colors" title="Delete service">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openServicePanel(service = null) {
  const panel = document.getElementById('serviceSlidePanel');
  const overlay = document.getElementById('overlay');
  const title = document.getElementById('servicePanelTitle');

  document.getElementById('serviceId').value = '';
  document.getElementById('srvTitle').value = '';
  document.getElementById('srvOrder').value = '0';
  document.getElementById('srvIcon').value = 'saw';
  document.getElementById('srvShortDesc').value = '';
  document.getElementById('srvDesc').value = '';
  document.getElementById('srvHighlights').value = '';
  document.getElementById('srvCta').value = '';
  document.getElementById('srvImageFile').value = '';
  document.getElementById('srvIsActive').checked = true;
  document.getElementById('srvImagePreview').classList.add('hidden');

  if (service) {
    title.textContent = 'Edit Service';
    document.getElementById('serviceId').value = service._id;
    document.getElementById('srvTitle').value = service.title || '';
    document.getElementById('srvOrder').value = service.order || 0;
    document.getElementById('srvIcon').value = service.icon || 'saw';
    document.getElementById('srvShortDesc').value = service.shortDescription || '';
    document.getElementById('srvDesc').value = service.description || '';
    document.getElementById('srvHighlights').value = Array.isArray(service.highlights) ? service.highlights.join('\n') : '';
    document.getElementById('srvCta').value = service.ctaLabel || '';
    document.getElementById('srvIsActive').checked = service.isActive !== false;

    if (service.image && service.image.url) {
      document.getElementById('srvImagePreviewImg').src = service.image.url;
      document.getElementById('srvImagePreview').classList.remove('hidden');
    }
    document.getElementById('srvSubmitBtn').textContent = 'Update Service';
  } else {
    title.textContent = 'Add Service';
    document.getElementById('srvSubmitBtn').textContent = 'Save Service';
  }

  panel.classList.add('open');
  overlay.classList.add('active');
}

function closeServicePanel() {
  const panel = document.getElementById('serviceSlidePanel');
  if (panel) panel.classList.remove('open');
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.classList.remove('active');
}

async function editService(id) {
  try {
    const res = await fetch(`/api/services/${id}`);
    if (!res.ok) throw new Error('Failed to load service');
    const service = await res.json();
    openServicePanel(service);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function handleServiceSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('serviceId').value;
  const formData = new FormData();
  formData.append('title', document.getElementById('srvTitle').value.trim());
  formData.append('order', document.getElementById('srvOrder').value);
  formData.append('icon', document.getElementById('srvIcon').value);
  formData.append('shortDescription', document.getElementById('srvShortDesc').value.trim());
  formData.append('description', document.getElementById('srvDesc').value.trim());
  formData.append('highlights', document.getElementById('srvHighlights').value);
  formData.append('ctaLabel', document.getElementById('srvCta').value.trim());
  formData.append('isActive', document.getElementById('srvIsActive').checked);

  const fileInput = document.getElementById('srvImageFile');
  if (fileInput.files.length > 0) {
    formData.append('image', fileInput.files[0]);
  }

  const btn = document.getElementById('srvSubmitBtn');
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    const url = id ? `/api/services/${id}` : '/api/services';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    showToast(id ? 'Service updated successfully' : 'Service created successfully', 'success');
    closeServicePanel();
    await loadServices();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

function confirmDeleteService(id, title) {
  deleteAction = async () => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      showToast('Service deleted', 'success');
      closeDeleteModal();
      await loadServices();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  document.getElementById('deleteModalTitle').textContent = 'Delete Service';
  document.getElementById('deleteModalMsg').textContent = `Are you sure you want to delete service "${title}"?`;
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('confirmDeleteBtn').onclick = () => { if (deleteAction) deleteAction(); };
}

// ========================================================
// 4. ENQUIRIES & QUOTATIONS
// ========================================================

async function loadEnquiries(status = currentEnquiryFilter) {
  currentEnquiryFilter = status;
  try {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    const res = await fetch(`/api/enquiries${query}`);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    const data = await res.json();
    allEnquiries = data.enquiries || [];
    renderEnquiriesTable(allEnquiries);

    const badge = document.getElementById('enquiryBadge');
    if (badge && data.counts) {
      badge.textContent = data.counts.new || 0;
      if (data.counts.new > 0) badge.classList.remove('hidden');
    }
  } catch (err) {
    showToast('Failed to load enquiries', 'error');
  }
}

function filterEnquiries(status) {
  document.querySelectorAll('.enq-filter').forEach(btn => {
    btn.className = 'enq-filter px-3 py-1.5 rounded-lg font-medium text-surface-400 hover:text-white transition-colors';
  });
  const activeBtn = document.getElementById(`enqFilter${capitalize(status)}`);
  if (activeBtn) activeBtn.className = 'enq-filter px-3 py-1.5 rounded-lg font-medium bg-brand-600 text-white transition-colors';
  loadEnquiries(status);
}

function renderEnquiriesTable(enquiries) {
  const tbody = document.getElementById('enquiriesTableBody');
  if (!tbody) return;

  if (enquiries.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-12 text-center text-surface-500">
          No enquiries found
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = enquiries.map(e => {
    const dateStr = new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const cleanPhone = (e.phone || '').replace(/\D/g, '');

    return `
    <tr class="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
      <td class="px-4 py-3 text-xs text-surface-400 whitespace-nowrap">${dateStr}</td>
      <td class="px-4 py-3">
        <div class="font-medium text-white text-sm">${escapeHtml(e.name)}</div>
        <div class="flex items-center gap-2 mt-0.5">
          <a href="tel:${escapeHtml(e.phone)}" class="text-xs text-brand-400 hover:underline">${escapeHtml(e.phone)}</a>
          ${cleanPhone ? `<a href="https://api.whatsapp.com/send?phone=${cleanPhone}&text=Hello%20${encodeURIComponent(e.name)}" target="_blank" class="text-[11px] text-emerald-400 hover:underline">WhatsApp</a>` : ''}
        </div>
        ${e.email ? `<div class="text-[11px] text-surface-400">${escapeHtml(e.email)}</div>` : ''}
      </td>
      <td class="px-4 py-3">
        <span class="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-1 ${e.type === 'quote' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : e.type === 'service' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-surface-800 text-surface-300'}">${escapeHtml(e.type)}</span>
        <div class="text-xs font-medium text-surface-200">${escapeHtml(e.productName || e.serviceTitle || 'General Enquiry')}</div>
      </td>
      <td class="px-4 py-3 hidden md:table-cell text-xs font-mono text-surface-300">
        ${escapeHtml(e.quantity || '—')}
      </td>
      <td class="px-4 py-3 text-xs text-surface-300 max-w-xs break-words">
        ${escapeHtml(e.message || '—')}
      </td>
      <td class="px-4 py-3">
        <select onchange="updateEnquiryStatus('${e._id}', this.value)" class="text-xs rounded-lg px-2.5 py-1 font-medium border ${
          e.status === 'new' ? 'bg-brand-500/10 text-brand-400 border-brand-500/30' :
          e.status === 'contacted' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }">
          <option value="new" ${e.status === 'new' ? 'selected' : ''}>New</option>
          <option value="contacted" ${e.status === 'contacted' ? 'selected' : ''}>Contacted</option>
          <option value="closed" ${e.status === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
      </td>
      <td class="px-4 py-3 text-right">
        <button onclick="confirmDeleteEnquiry('${e._id}', '${escapeHtml(e.name)}')" class="p-2 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition-colors" title="Delete enquiry">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </td>
    </tr>
    `;
  }).join('');
}

async function updateEnquiryStatus(id, status) {
  try {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    showToast('Enquiry status updated', 'success');
    await loadEnquiries();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function confirmDeleteEnquiry(id, name) {
  deleteAction = async () => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete enquiry');
      showToast('Enquiry deleted', 'success');
      closeDeleteModal();
      await loadEnquiries();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  document.getElementById('deleteModalTitle').textContent = 'Delete Enquiry';
  document.getElementById('deleteModalMsg').textContent = `Delete quotation enquiry from "${name}"?`;
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('confirmDeleteBtn').onclick = () => { if (deleteAction) deleteAction(); };
}

// ========================================================
// 5. STORE SETTINGS
// ========================================================

async function loadStoreSettings() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to load settings');
    const s = await res.json();

    const titleHeader = document.getElementById('headerStoreName');
    if (titleHeader && s.storeName) titleHeader.textContent = s.storeName;

    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
    setVal('setStoreName', s.storeName);
    setVal('setEstablished', s.established);
    setVal('setTagline', s.tagline);
    setVal('setAbout', s.about);
    setVal('setPhone', s.phone);
    setVal('setAltPhone', s.alternatePhone);
    setVal('setWhatsapp', s.whatsapp);
    setVal('setEmail', s.email);
    setVal('setGstin', s.gstin);
    setVal('setAddress', s.address);
    setVal('setHours', Array.isArray(s.businessHours) ? s.businessHours.join('\n') : (s.businessHours || ''));
    setVal('setMapEmbed', s.mapEmbedUrl);
  } catch (err) {
    showToast('Failed to load store settings', 'error');
  }
}

async function handleSaveSettings(e) {
  e.preventDefault();

  const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : '';
  const body = {
    storeName: getVal('setStoreName'),
    established: getVal('setEstablished'),
    tagline: getVal('setTagline'),
    about: getVal('setAbout'),
    phone: getVal('setPhone'),
    alternatePhone: getVal('setAltPhone'),
    whatsapp: getVal('setWhatsapp'),
    email: getVal('setEmail'),
    gstin: getVal('setGstin'),
    address: getVal('setAddress'),
    businessHours: getVal('setHours').split('\n').map(s => s.trim()).filter(Boolean),
    mapEmbedUrl: getVal('setMapEmbed'),
  };

  const btn = document.getElementById('saveSettingsBtn');
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    showToast('Store settings saved successfully', 'success');
    if (data.storeName) {
      const titleHeader = document.getElementById('headerStoreName');
      if (titleHeader) titleHeader.textContent = data.storeName;
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

// ========================================================
// UTILITIES
// ========================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-brand-500/10 border-brand-500/30 text-brand-400',
  };

  const toast = document.createElement('div');
  toast.className = `toast px-5 py-3 rounded-xl border ${colors[type] || colors.info} text-sm font-medium shadow-lg backdrop-blur-xl`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
