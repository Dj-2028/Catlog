// ============= Admin Dashboard JavaScript =============

const API = '/api/products';
let allProducts = [];
let deleteProductId = null;

// ------------- Initial Load -------------
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  document.getElementById('productForm').addEventListener('submit', handleSubmit);
  document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));
});

// ------------- Load Products -------------
async function loadProducts() {
  try {
    const res = await fetch(API + '?limit=100');
    const data = await res.json();
    allProducts = data.products || [];
    renderTable(allProducts);
    document.getElementById('productCount').textContent = `${allProducts.length} product${allProducts.length !== 1 ? 's' : ''} total`;
  } catch (err) {
    showToast('Failed to load products', 'error');
  }
}

// ------------- Render Table -------------
function renderTable(products) {
  const tbody = document.getElementById('productTableBody');
  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-12 text-center">
          <div class="text-4xl mb-3">📦</div>
          <p class="text-surface-500">No products found</p>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    const imgSrc = p.images && p.images.length > 0 && p.images[0].url ? p.images[0].url : '';
    return `
    <tr class="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
      <td class="px-4 py-3">
        <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-800 flex-shrink-0">
          ${imgSrc
        ? `<img src="${imgSrc}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover" />`
        : `<div class="w-full h-full flex items-center justify-center text-surface-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>`
      }
        </div>
      </td>
      <td class="px-4 py-3 font-mono text-sm text-surface-400">${escapeHtml(p.serialNo)}</td>
      <td class="px-4 py-3">
        <div class="font-medium text-white text-sm">${escapeHtml(p.name)}</div>
        ${p.isFeatured ? '<span class="text-xs text-amber-400">⭐ Featured</span>' : ''}
      </td>
      <td class="px-4 py-3 hidden md:table-cell">
        <span class="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium">${escapeHtml(p.category)}</span>
      </td>
      <td class="px-4 py-3 font-medium text-white text-sm">₹${Number(p.price).toLocaleString('en-IN')}</td>
      <td class="px-4 py-3 hidden lg:table-cell">
        <span class="inline-flex items-center gap-1.5 text-xs font-medium ${p.isPublished ? 'text-emerald-400' : 'text-surface-500'}">
          <span class="w-2 h-2 rounded-full ${p.isPublished ? 'bg-emerald-400' : 'bg-surface-600'}"></span>
          ${p.isPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      <td class="px-4 py-3">
        <div class="flex items-center justify-end gap-2">
          <button onclick="editProduct('${p._id}')" class="p-2 rounded-lg hover:bg-surface-700 transition-colors text-surface-400 hover:text-brand-400" title="Edit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          </button>
          <button onclick="confirmDelete('${p._id}', '${escapeHtml(p.name)}')" class="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-surface-400 hover:text-red-400" title="Delete">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ------------- Search -------------
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  if (!query) {
    renderTable(allProducts);
    return;
  }
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.serialNo.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  renderTable(filtered);
}

// ------------- Panel Open/Close -------------
function openPanel(product = null) {
  const panel = document.getElementById('slidePanel');
  const overlay = document.getElementById('overlay');
  const title = document.getElementById('panelTitle');

  resetForm();

  if (product) {
    // Edit mode
    title.textContent = 'Edit Product';
    document.getElementById('productId').value = product._id;
    document.getElementById('formName').value = product.name || '';
    document.getElementById('formSerialNo').value = product.serialNo || '';
    document.getElementById('formPrice').value = product.price || 0;
    document.getElementById('formCategory').value = product.category || 'Key Chains';
    document.getElementById('formDescription').value = product.description || '';
    document.getElementById('formPublished').checked = product.isPublished !== false;
    document.getElementById('formFeatured').checked = product.isFeatured === true;

    // Populate spec rows
    if (product.specifications && Object.keys(product.specifications).length > 0) {
      Object.entries(product.specifications).forEach(([key, val]) => addSpecRow(key, val));
    }

    // Show existing images (now objects with {url, public_id})
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
  document.getElementById('slidePanel').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
}

// ------------- Edit Product -------------
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

// ------------- Remove Existing Image -------------
function removeExistingImage(idx) {
  let images = JSON.parse(document.getElementById('existingImages').value || '[]');
  images.splice(idx, 1);
  document.getElementById('existingImages').value = JSON.stringify(images);

  // Re-render
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

// ------------- Preview New Images -------------
function previewImages(input) {
  const preview = document.getElementById('newImagesPreview');
  preview.innerHTML = '';
  if (input.files) {
    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.innerHTML += `
          <div class="aspect-square rounded-lg overflow-hidden border border-surface-700">
            <img src="${e.target.result}" class="w-full h-full object-cover" />
          </div>`;
      };
      reader.readAsDataURL(file);
    });
  }
}

// ------------- Form Submit (Create/Update) -------------
async function handleSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('productId').value;
  const formData = new FormData();

  formData.append('name', document.getElementById('formName').value);
  formData.append('serialNo', document.getElementById('formSerialNo').value);
  formData.append('price', document.getElementById('formPrice').value || '0');
  formData.append('category', document.getElementById('formCategory').value);
  formData.append('description', document.getElementById('formDescription').value);
  formData.append('isPublished', document.getElementById('formPublished').checked);
  formData.append('isFeatured', document.getElementById('formFeatured').checked);

  const specs = getSpecsFromRows();
  if (Object.keys(specs).length > 0) {
    formData.append('specifications', JSON.stringify(specs));
  }

  // Existing images (for update) — send as JSON array of {url, public_id}
  if (id) {
    formData.append('existingImages', document.getElementById('existingImages').value);
  }

  // New images
  const files = document.getElementById('formImages').files;
  if (files) {
    Array.from(files).forEach(file => formData.append('images', file));
  }

  const submitBtn = document.getElementById('submitBtn');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

  try {
    const url = id ? `${API}/${id}` : API;
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Something went wrong');

    showToast(id ? 'Product updated successfully' : 'Product created successfully', 'success');
    closePanel();
    await loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

// ------------- Delete -------------
function confirmDelete(id, name) {
  deleteProductId = id;
  document.getElementById('deleteProductName').textContent = name;
  const modal = document.getElementById('deleteModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('confirmDeleteBtn').onclick = performDelete;
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  deleteProductId = null;
}

async function performDelete() {
  if (!deleteProductId) return;

  const btn = document.getElementById('confirmDeleteBtn');
  btn.disabled = true;
  btn.textContent = 'Deleting...';
  btn.classList.add('opacity-50');

  try {
    const res = await fetch(`${API}/${deleteProductId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete');
    showToast('Product deleted successfully', 'success');
    closeDeleteModal();
    await loadProducts();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Delete';
    btn.classList.remove('opacity-50');
  }
}

// ------------- Toast Notifications -------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
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

// ------------- Reset Form -------------
function resetForm() {
  document.getElementById('productId').value = '';
  document.getElementById('existingImages').value = '[]';
  document.getElementById('formName').value = '';
  document.getElementById('formSerialNo').value = '';
  document.getElementById('formPrice').value = '';
  document.getElementById('formCategory').value = 'Key Chains';
  document.getElementById('formDescription').value = '';
  document.getElementById('specsContainer').innerHTML = '';
  document.getElementById('formPublished').checked = true;
  document.getElementById('formFeatured').checked = false;
  document.getElementById('formImages').value = '';
  document.getElementById('newImagesPreview').innerHTML = '';
  document.getElementById('existingImagesGrid').innerHTML = '';
  document.getElementById('existingImagesPreview').classList.add('hidden');
}

// ------------- Spec Row Helpers -------------
function addSpecRow(key = '', value = '') {
  const container = document.getElementById('specsContainer');
  const row = document.createElement('div');
  row.className = 'flex items-center gap-2';
  row.innerHTML = `
        <input type="text" placeholder="e.g. Material" value="${escapeHtml(key)}"
            class="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm spec-key" />
        <input type="text" placeholder="e.g. Metal" value="${escapeHtml(value)}"
            class="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm spec-value" />
        <button type="button" onclick="this.parentElement.remove()"
            class="p-2 rounded-lg hover:bg-red-500/10 text-surface-500 hover:text-red-400 transition-colors flex-shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
    `;
  container.appendChild(row);
}

function getSpecsFromRows() {
  const specs = {};
  const rows = document.querySelectorAll('#specsContainer > div');
  rows.forEach(row => {
    const key = row.querySelector('.spec-key').value.trim();
    const val = row.querySelector('.spec-value').value.trim();
    if (key) specs[key] = val;
  });
  return specs;
}

// ------------- Utilities -------------
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
