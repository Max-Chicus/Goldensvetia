// js/cart.js
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('goldenvetia_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('goldenvetia_cart', JSON.stringify(cart));
    updateCartUI();
}

// Add to cart
function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id && i.size === item.size);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`Am actualizat cantitatea pentru ${item.name} (${item.size})`, 'success');
    } else {
        cart.push(item);
        showToast(`${item.name} (${item.size}) a fost adăugat în coș`, 'success');
    }
    
    saveCart();
}

// Remove from cart
function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart();
    showToast(`${removedItem.name} (${removedItem.size}) a fost eliminat din coș`, 'info');
}

// Update quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    cart[index].quantity = newQuantity;
    saveCart();
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart UI (sidebar and order summary)
function updateCartUI() {
    // Update cart count badge
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = cartCount);
    
    // Update cart items in sidebar
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">Coșul tău este gol</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.map((item, index) => `
                <div class="cart-item flex gap-4 mb-4 pb-4 border-b">
                    <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-hand-peace text-3xl text-blue-900"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-bold text-blue-900">${item.name}</h4>
                        <p class="text-sm text-gray-600">Culoare: ${item.color} | Mărime: ${item.size}</p>
                        <div class="flex justify-between items-center mt-2">
                            <div class="flex items-center gap-2">
                                <button class="decrease-qty w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition" data-index="${index}">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <span class="font-semibold w-8 text-center">${item.quantity}</span>
                                <button class="increase-qty w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition" data-index="${index}">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-orange-500">${item.price * item.quantity} MDL</p>
                                <button class="remove-item text-red-500 text-sm hover:text-red-700" data-index="${index}">
                                    <i class="fas fa-trash-alt"></i> Elimină
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Attach event listeners for cart actions
            document.querySelectorAll('.decrease-qty').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(btn.dataset.index);
                    if (cart[index].quantity > 1) {
                        updateQuantity(index, cart[index].quantity - 1);
                    } else {
                        removeFromCart(index);
                    }
                });
            });
            
            document.querySelectorAll('.increase-qty').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(btn.dataset.index);
                    updateQuantity(index, cart[index].quantity + 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(btn.dataset.index);
                    removeFromCart(index);
                });
            });
        }
    }
    
    // Update cart total
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = `${calculateTotal()} MDL`;
    }
    
    // Update order summary in form
    updateOrderSummary();
}

// Update order summary in contact form
function updateOrderSummary() {
    const orderSummaryDiv = document.getElementById('order-summary');
    const cartDataInput = document.getElementById('cart-data-input');
    
    if (orderSummaryDiv) {
        if (cart.length === 0) {
            orderSummaryDiv.innerHTML = '<p class="text-gray-400 italic">Nu ai produse în coș. Adaugă produse pentru a comanda.</p>';
            if (cartDataInput) cartDataInput.value = '';
        } else {
            const summaryHtml = cart.map(item => `
                <div class="flex justify-between text-sm">
                    <span>${item.name} (${item.color}, ${item.size}) x ${item.quantity}</span>
                    <span class="font-semibold">${item.price * item.quantity} MDL</span>
                </div>
            `).join('');
            
            orderSummaryDiv.innerHTML = `
                ${summaryHtml}
                <div class="border-t pt-2 mt-2">
                    <div class="flex justify-between font-bold">
                        <span>Total:</span>
                        <span class="text-orange-500">${calculateTotal()} MDL</span>
                    </div>
                </div>
            `;
            
            if (cartDataInput) {
                const cartText = cart.map(item => 
                    `${item.name} - Culoare: ${item.color}, Mărime: ${item.size}, Cantitate: ${item.quantity}, Preț: ${item.price * item.quantity} MDL`
                ).join('\n');
                cartDataInput.value = `Comandă GOLDENVETIA:\n${cartText}\nTotal: ${calculateTotal()} MDL`;
            }
        }
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    toast.style.borderLeftColor = colors[type];
    toast.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}" style="color: ${colors[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize cart
loadCart();