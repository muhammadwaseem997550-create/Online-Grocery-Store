const products = [
    { id: 1, name: "Red Apple", price: 1.50, rating: 4.5, image: "https://cdn-icons-png.flaticon.com/512/415/415733.png" },
    { id: 2, name: "Organic Banana", price: 0.80, rating: 4.2, image: "https://cdn-icons-png.flaticon.com/512/2909/2909761.png" },
    { id: 3, name: "Fresh Milk", price: 3.50, rating: 4.9, image: "https://cdn-icons-png.flaticon.com/512/2405/2405454.png" },
    { id: 4, name: "Whole Wheat Bread", price: 2.20, rating: 4.1, image: "https://cdn-icons-png.flaticon.com/512/992/992744.png" },
    { id: 5, name: "Eggs (12pk)", price: 4.00, rating: 4.7, image: "https://cdn-icons-png.flaticon.com/512/837/837560.png" }
];

let cart = JSON.parse(localStorage.getItem('FreshCartData')) || [];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();
    setupEventListeners();
});

// --- Product Rendering ---
function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>$${p.price.toFixed(2)}</p>
            <div style="color:#f1c40f; margin:10px 0;">${'★'.repeat(Math.floor(p.rating))}</div>
            <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

// --- Cart Logic ---
function addToCart(id) {
    toggleSpinner(true);
    const product = products.find(p => p.id === id);
    const inCart = cart.find(item => item.id === id);

    if (inCart) {
        inCart.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    setTimeout(() => {
        saveAndRefresh();
        toggleSpinner(false);
    }, 400); // Visual feedback delay
}

function saveAndRefresh() {
    localStorage.setItem('FreshCartData', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartList = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('total-price');
    const countDisplay = document.getElementById('cart-count');

    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    countDisplay.innerText = totalCount;

    cartList.innerHTML = cart.map(item => `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.quantity} x $${item.price.toFixed(2)}</small>
            </div>
            <button onclick="removeFromCart(${item.id})" style="border:none; background:none; color:red; cursor:pointer;">&times;</button>
        </div>
    `).join('');

    const totalSum = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalDisplay.innerText = totalSum.toFixed(2);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveAndRefresh();
}

// --- UI Logic & Search ---
function setupEventListeners() {
    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        renderProducts(filtered);
    });

    // Auth Modal Toggles
    const authModal = document.getElementById('auth-modal');
    document.getElementById('login-btn').onclick = () => authModal.classList.remove('hidden');
    document.getElementById('close-auth').onclick = () => authModal.classList.add('hidden');
    
    // Cart Sidebar Toggles
    const cartSide = document.getElementById('cart-sidebar');
    document.getElementById('cart-btn').onclick = () => cartSide.classList.add('active');
    document.getElementById('close-cart').onclick = () => cartSide.classList.remove('active');
}

function toggleSpinner(show) {
    document.getElementById('loading-overlay').classList.toggle('hidden', !show);
}