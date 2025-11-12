// script.js

// --- Basic product data (20 Gadget Products) ---
const PEXELS_API_KEY = "zMdhk5QB6WkxyVU5p1mAzU9HTYHMHjJcu5piEs8OYwkwyKmNrUhSt0VC";

const CURRENCY = '₱';

const productList = [
  { id: 1, name: "Trail Runner 300", price: 129.99, desc: "Lightweight trail running shoe with grippy outsole.", stock: 24, image: "https://via.placeholder.com/400x280?text=Trail+Runner+300" },
  { id: 2, name: "Urban Sneak Low", price: 89.50, desc: "Everyday sneaker with breathable knit upper.", stock: 40, image: "https://via.placeholder.com/400x280?text=Urban+Sneak+Low" },
  { id: 3, name: "Court Master Pro", price: 109.00, desc: "Cushioned court shoe for quick lateral movement.", stock: 18, image: "https://via.placeholder.com/400x280?text=Court+Master+Pro" },
  { id: 4, name: "City Slip-On", price: 69.99, desc: "Easy slip-on for commuting and errands.", stock: 55, image: "https://via.placeholder.com/400x280?text=City+Slip-On" },
  { id: 5, name: "Classic Leather Oxford", price: 149.00, desc: "Timeless leather shoe for smart casual looks.", stock: 12, image: "https://via.placeholder.com/400x280?text=Leather+Oxford" },
  { id: 6, name: "Performance Run 5", price: 139.95, desc: "Responsive running shoe with foam midsole.", stock: 30, image: "https://via.placeholder.com/400x280?text=Performance+Run+5" },
  { id: 7, name: "Hiker GTX", price: 179.00, desc: "Water-resistant hiking boot with ankle support.", stock: 10, image: "https://via.placeholder.com/400x280?text=Hiker+GTX" },
  { id: 8, name: "Mesh Trainer X", price: 79.00, desc: "Gym trainer with breathable mesh and stable base.", stock: 66, image: "https://via.placeholder.com/400x280?text=Mesh+Trainer+X" },
  { id: 9, name: "Retro Canvas Low", price: 59.99, desc: "Casual canvas shoe with vintage styling.", stock: 80, image: "https://via.placeholder.com/400x280?text=Retro+Canvas+Low" },
  { id: 10, name: "Desert Chukka", price: 119.50, desc: "Versatile chukka boot with soft suede upper.", stock: 20, image: "https://via.placeholder.com/400x280?text=Desert+Chukka" },
  { id: 11, name: "Tennis Ace 2", price: 99.99, desc: "Durable tennis shoe built for court traction.", stock: 25, image: "https://via.placeholder.com/400x280?text=Tennis+Ace+2" },
  { id: 12, name: "Slip-Resist Work", price: 129.00, desc: "Work shoe with slip-resistant outsole and comfort sole.", stock: 14, image: "https://via.placeholder.com/400x280?text=Slip-Resist+Work" },
  { id: 13, name: "Minimalist Barefoot", price: 89.00, desc: "Low-profile barefoot shoe for natural movement.", stock: 38, image: "https://via.placeholder.com/400x280?text=Minimalist+Barefoot" },
  { id: 14, name: "All-Weather Runner", price: 149.99, desc: "Waterproof running shoe for rainy conditions.", stock: 9, image: "https://via.placeholder.com/400x280?text=All-Weather+Runner" },
  { id: 15, name: "Weekend Loafer", price: 99.50, desc: "Comfortable loafer with cushioned insole.", stock: 33, image: "https://via.placeholder.com/400x280?text=Weekend+Loafer" },
  { id: 16, name: "Court Pro High", price: 129.00, desc: "High-top court shoe with ankle stability.", stock: 16, image: "https://via.placeholder.com/400x280?text=Court+Pro+High" },
  { id: 17, name: "Lightweight Hiking Shoe", price: 139.00, desc: "Low-cut hiking shoe for fastpacking and trails.", stock: 22, image: "https://via.placeholder.com/400x280?text=Lightweight+Hiking+Shoe" },
  { id: 18, name: "Freestyle Skate", price: 74.99, desc: "Skate-style shoe with reinforced toe and grip cupsole.", stock: 29, image: "https://via.placeholder.com/400x280?text=Freestyle+Skate" },
  { id: 19, name: "Comfort Walker", price: 84.99, desc: "Daily walker with soft cushioning and arch support.", stock: 47, image: "https://via.placeholder.com/400x280?text=Comfort+Walker" },
  { id: 20, name: "Elite Marathon", price: 199.00, desc: "High-performance marathon shoe with carbon plate.", stock: 6, image: "https://via.placeholder.com/400x280?text=Elite+Marathon" }
];

// --- DOM Elements ---
const productListEl = document.getElementById('product-list');
const cartEl = document.getElementById('cart-section');
const cartListEl = document.getElementById('cart-list');
const cartCountEl = document.getElementById('cart-count');
const totalEl = document.getElementById('total');
const checkoutForm = document.getElementById('checkout-form');
const confirmCheckoutBtn = document.getElementById('confirm-checkout');

// Initialize cart from localStorage or as an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];


async function fetchProductImage(query) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query + " shoes")}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });
    const data = await res.json();
    // Return the first image URL or a fallback if none found
    return data.photos?.[0]?.src?.medium || "https://picsum.photos/400/280?random=" + Math.random();
  } catch (err) {
    console.error("Error fetching image for", query, err);
    return "https://picsum.photos/400/280?random=" + Math.random(); // fallback image
  }
}

// --- Cart Persistence and Rendering ---

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

async function renderProducts() {
  productListEl.innerHTML = ''; // Clear existing content

  for (const prod of productList) {
    const imageUrl = await fetchProductImage(prod.name); // Fetch image dynamically

    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
      <div class="card product-card position-relative h-100">
          <img src="${imageUrl}" class="card-img-top" alt="${prod.name}" style="height: 280px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
              <div class="card-meta">
                <h5 class="card-title">${prod.name}</h5>
                <p class="card-desc">${prod.desc}</p>
              </div>

              <div class="card-footer mt-auto">
                <div class="price" style="padding-bottom: 10px">₱${prod.price.toFixed(2)}</div>
                <button class="btn btn-add btn-add-to-cart rounded-pill btn-secondary rounded w-100 add-cart-btn" data-id="${prod.id}" aria-label="Add ${prod.name} to cart" style="background-color: #B6F500; color: #000000;">Add</button>
              </div>
          </div>
      </div>
    `;

    productListEl.appendChild(col);
  }

  // Attach event listeners to all "Add to Cart" buttons
  document.querySelectorAll('.btn-add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });
}

function addToCart(id) {
    const prod = productList.find(p => p.id === id);
    const item = cart.find(i => i.id === id);

    if (item) {
        // Item is already in cart, increase quantity
        item.qty += 1;
    } else {
        // Item is not in cart, add new item object
        if (prod) {
            cart.push({ id: prod.id, name: prod.name, price: prod.price, qty: 1 });
        }
    }

    saveCart();
    renderCart();
}

function updateCart(id, delta) {
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.qty += delta;
        
        // Remove item if quantity drops to 0 or below
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }

        saveCart();
        renderCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function renderCart() {
    cartListEl.innerHTML = ''; // Clear existing cart
    let total = 0;

    if (cart.length === 0) {
        cartListEl.innerHTML = '<li class="list-group-item text-center text-muted">Your cart is empty.</li>';
        document.getElementById('checkout-container').style.display = 'none';
    } else {
        document.getElementById('checkout-container').style.display = 'block';

        cart.forEach(item => {
            total += item.price * item.qty;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            li.innerHTML = `
                <span class="text-truncate" style="max-width: 50%;">${item.name} <strong class="text-muted">(x${item.qty})</strong></span>
                <div class="d-flex align-items-center">
                    <div class="btn-group btn-group-sm me-3" role="group" aria-label="Quantity controls">
                        <button type="button" class="btn btn-outline-secondary btn-update-cart" data-action="decrease" data-id="${item.id}">-</button>
                        <button type="button" class="btn btn-outline-secondary disabled">${item.qty}</button>
                        <button type="button" class="btn btn-outline-secondary btn-update-cart" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    
                    <span class="fw-bold me-3">₱${(item.price * item.qty).toFixed(2)}</span>

                    <button type="button" class="btn btn-danger btn-sm btn-remove-item" data-id="${item.id}" aria-label="Remove button">❌</button>
                </div>
            `;
            cartListEl.appendChild(li);
        });
    }

    // Update totals and counts
    totalEl.innerText = total.toFixed(2);
    cartCountEl.innerText = cart.reduce((sum, item) => sum + item.qty, 0); // Total items in cart
    document.getElementById('cart-total-items').innerText = cart.length; // Number of unique items

    // Attach cart button listeners (must be done after rendering)
    document.querySelectorAll('.btn-update-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            const action = e.currentTarget.dataset.action;
            const delta = action === 'increase' ? 1 : -1;
            updateCart(id, delta);
        });
    });

    document.querySelectorAll('.btn-remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removeFromCart(id);
        });
    });
}

// --- Checkout Logic ---

// confirmCheckoutBtn.addEventListener('click', async (e) => {
//     e.preventDefault();
    
//     // Form validation
//     const name = document.getElementById('customer-name').value.trim();
//     const email = document.getElementById('customer-email').value.trim();
//     const address = document.getElementById('customer-address').value.trim();

//     if (!name || !email || !address) {
//         alert('Please fill out all checkout fields.');
//         return;
//     }

//     if (cart.length === 0) {
//         alert('Your cart is empty.');
//         return;
//     }

//     const total = parseFloat(totalEl.innerText);

//     const order = {
//         customer: { name, email, address },
//         items: cart,
//         total: total,
//     };

//     // POST to backend (simulated or real)
//     try {
//         // This fetch will communicate with the server.js you successfully ran on http://localhost:3000
//         const res = await fetch('http://localhost:3000/checkout', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(order),
//         });

//         if (!res.ok) {
//             throw new Error('Server error during checkout.');
//         }

//         const data = await res.json();
        
//         // Success
//         alert(`Order placed! Order ID: ${data.orderId}`);
        
//         // Clear cart and form
//         cart = [];
//         saveCart();
//         renderCart();
//         checkoutForm.reset();

//     } catch (err) {
//         // Alert on error when placing order
//         alert('There was an error placing the order. Please ensure your Node.js server is running.');
//     }
// });

// --- Initialization ---
renderProducts();
renderCart();








document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('customer-name').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (!name || !email || !address) {
      alert('Please complete all required fields.');
      return;
    }

    // Try common cart keys
    const rawCart = localStorage.getItem('cart') || '[]';
    let items;
    try { items = JSON.parse(rawCart) || []; } catch { items = []; }

    if (!Array.isArray(items) || items.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Compute total (supports items with price/unitPrice and quantity/qty)
    const total = items.reduce((sum, it) => {
      const price = parseFloat(it.price ?? it.unitPrice ?? 0) || 0;
      const qty = parseInt(it.quantity ?? it.qty ?? 1) || 1;
      return sum + price * qty;
    }, 0);

    // Load existing orders, create new order id
    const ordersRaw = localStorage.getItem('orders') || '[]';
    let orders;
    try { orders = JSON.parse(ordersRaw) || []; } catch { orders = []; }

    const orderNumber = orders.length + 1;
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${orderNumber}`;

    const order = {
      id: orderId,
      number: orderNumber,
      customer: { name, email, address },
      items,
      total: parseFloat(total.toFixed(2)),
      createdAt: new Date().toISOString()
    };

    // Save order(s) to localStorage
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('lastOrder', JSON.stringify(order));

    // Clear cart from localStorage
    localStorage.removeItem('cart');
    localStorage.removeItem('shoppingCart');

    // Update UI if present
    const cartCount = document.getElementById('cart-count');
    const cartList = document.getElementById('cart-list');
    const totalEl = document.getElementById('total');
    if (cartCount) cartCount.textContent = '0';
    if (cartList) cartList.innerHTML = '';
    if (totalEl) totalEl.textContent = '0.00';

    // Close offcanvas (Bootstrap) if present
    const offcanvasEl = document.getElementById('cart-section');
    if (offcanvasEl && window.bootstrap?.Offcanvas) {
      const inst = bootstrap.Offcanvas.getInstance(offcanvasEl) || bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      inst.hide();
    }

    // Feedback to user
    showOrderSuccess(order);
    form.reset();
  });
});





function showOrderSuccess(order) {
  // Create a top-right toast container if missing
  const containerId = 'toast-container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.zIndex = '1080';
    document.body.appendChild(container);
  }

  // If Bootstrap Toast is available, use it
  if (window.bootstrap?.Toast) {
    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-bg-success border-0';
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.style.minWidth = '240px';

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong class="d-block">Order placed</strong>
          <small class="d-block text-white-50">ID: ${order.id}</small>
          <div class="mt-1">Thank you, ${order.customer.name}!</div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    container.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 4500 });
    toast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  } else {
    // Fallback: simple dismissible alert
    const alertEl = document.createElement('div');
    alertEl.className = 'alert alert-success alert-dismissible fade show';
    alertEl.style.minWidth = '240px';
    alertEl.style.marginBottom = '0.5rem';
    alertEl.innerHTML = `
      <strong>Order placed</strong><br><small>ID: ${order.id}</small>
      <div>Thank you, ${order.customer.name}!</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    container.appendChild(alertEl);
    setTimeout(() => {
      alertEl.classList.remove('show');
      alertEl.remove();
    }, 4500);
  }
}