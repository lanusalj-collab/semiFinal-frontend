// script.js

// --- Basic product data (20 Gadget Products) ---
const productList = [
    { id: 1, name: "Laptop Pro X", price: 1299.00, desc: "High-performance laptop for professionals.", stock: 10 },
    { id: 2, name: "Wireless Headphones Z", price: 199.99, desc: "Noise-cancelling headphones with deep bass.", stock: 25 },
    { id: 3, name: "Smartphone 15 Ultra", price: 999.00, desc: "Latest flagship smartphone with advanced camera.", stock: 15 },
    { id: 4, name: "Smart Watch 6", price: 249.50, desc: "Fitness and health tracker with 5-day battery life.", stock: 30 },
    { id: 5, name: "Portable SSD 1TB", price: 89.99, desc: "Ultra-fast external storage for backups and transfers.", stock: 40 },
    { id: 6, name: "Gaming Mouse RGB", price: 49.99, desc: "Ergonomic gaming mouse with customizable RGB lighting.", stock: 50 },
    { id: 7, name: "Mechanical Keyboard", price: 119.00, desc: "Tactile mechanical keyboard for typing and gaming.", stock: 20 },
    { id: 8, name: "Bluetooth Speaker Mini", price: 35.00, desc: "Pocket-sized speaker with powerful sound.", stock: 60 },
    { id: 9, name: "4K Webcam", price: 79.99, desc: "High-resolution webcam for streaming and video calls.", stock: 18 },
    { id: 10, name: "E-Reader Paperbook 4", price: 129.99, desc: "Glare-free screen for comfortable reading.", stock: 22 },
    { id: 11, name: "Mesh Wi-Fi System", price: 199.00, desc: "Blanket your home with fast, reliable Wi-Fi.", stock: 12 },
    { id: 12, name: "Drone Explorer SE", price: 349.99, desc: "Foldable drone with 4K video recording.", stock: 8 },
    { id: 13, name: "USB-C Hub 7-in-1", price: 39.95, desc: "Expand your laptop's connectivity with multiple ports.", stock: 75 },
    { id: 14, name: "Portable Power Bank 20K", price: 45.00, desc: "High-capacity power bank for multiple charges.", stock: 90 },
    { id: 15, name: "VR Headset", price: 399.00, desc: "Immersive virtual reality experience.", stock: 11 },
    { id: 16, name: "Stylus Pen Pro", price: 19.99, desc: "Precision stylus for tablets and touchscreens.", stock: 100 },
    { id: 17, name: "Smart Home Hub", price: 89.00, desc: "Control all your smart devices from one place.", stock: 14 },
    { id: 18, name: "Laser Projector Compact", price: 599.00, desc: "Portable projector for a cinema experience anywhere.", stock: 7 },
    { id: 19, name: "Gaming Headset Elite", price: 75.50, desc: "Comfortable over-ear headset with clear mic.", stock: 33 },
    { id: 20, name: "Tablet Slim 11-inch", price: 399.00, desc: "Lightweight tablet perfect for media consumption.", stock: 16 }
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

// --- Cart Persistence and Rendering ---

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function renderProducts() {
    productListEl.innerHTML = ''; // Clear existing content

    productList.forEach(prod => {
        const col = document.createElement('div');
        col.className = 'col';

        col.innerHTML = `
            <div class="card product-card position-relative h-100">
                <div class="card-body d-flex flex-column">
                    <div class="card-meta">
                      <h5 class="card-title">${prod.name}</h5>
                      <p class="card-desc">${prod.desc}</p>
                    </div>

                    <div class="card-footer mt-auto">
                      <div class="price">$${prod.price.toFixed(2)}</div>
                      <button class="btn btn-add btn-add-to-cart" data-id="${prod.id}" aria-label="Add ${prod.name} to cart">Add</button>
                    </div>
                </div>
            </div>
        `;

        productListEl.appendChild(col);
    });

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
                    
                    <span class="fw-bold me-3">$${(item.price * item.qty).toFixed(2)}</span>

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