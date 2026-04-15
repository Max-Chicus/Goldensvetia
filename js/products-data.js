// js/products-data.js
const productsData = [
    {
        id: 1,
        name: "Mănuși de Nitril Albastre",
        color: "Albastru",
        colorCode: "blue",
        price: 16,
        priceUnit: "RON",
        description: "Mănuși de nitril premium de culoare albastră, confort sporit pentru utilizare prelungită. Ideal pentru domeniul medical și industrial.",
        image: "assets/images/albastre/principala-albastru.jpeg",
        placeholderImage: "https://placehold.co/600x400/1e3a8a/white?text=Mănuși+Albastre+Easy+Care+Zarys",
        sizes: ["XS", "S", "M", "L", "XL"],
        features: ["Confort maxim", "Rezistență ridicată", "Fără latex", "Texturat pentru aderență"],
        galleryImages: [
            "assets/images/albastre/principala-albastru.jpeg",
            "assets/images/albastre/albastru-1.jpeg",
            "assets/images/albastre/albastru-2.jpeg", 
            "assets/images/albastre/albastru-3.jpeg",
        ]
    },
    {
        id: 2,
        name: "Mănuși de Nitril Negre",
        color: "Negru",
        colorCode: "black",
        price: 18,
        priceUnit: "RON",
        description: "Mănuși de nitril de culoare neagră, design elegant și profesional. Oferă protecție superioară și confort excelent.",
        image: "assets/images/negre/principala-negru.jpeg",
        placeholderImage: "https://placehold.co/600x400/1f2937/white?text=Mănuși+Negre+Easy+Care+Zarys",
        sizes: ["XS", "S", "M", "L", "XL"],
        features: ["Design profesional", "Rezistență chimică", "Confort ergonomic", "Durabilitate crescută"],
        galleryImages: [
            "assets/images/negre/principala-negru.jpeg",
            "assets/images/negre/negru-1.jpeg",
            "assets/images/negre/negru-2.jpeg",
            "assets/images/negre/negru-3.jpeg",
        ]
    }
];

// Function to render products
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = productsData.map(product => `
        <div class="product-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div class="relative overflow-hidden h-85 cursor-pointer" onclick="openGallery(${product.id})">
                <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onerror="this.src='${product.placeholderImage}'"
                >
                <div class="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Confort Premium
                </div>
                <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                    <i class="fas fa-images mr-1"></i> ${product.galleryImages?.length || 0} imagini
                </div>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-2xl font-bold text-blue-900">${product.name}</h3>
                    <div class="text-right">
                        <span class="text-2xl font-bold text-orange-500">${product.price}</span>
                        <span class="text-gray-500">/${product.priceUnit}+TVA</span>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">${product.description}</p>
                
                <div class="mb-4">
                    <p class="text-sm font-semibold text-gray-700 mb-2">Caracteristici:</p>
                    <div class="flex flex-wrap gap-2">
                        ${product.features.map(feature => `
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                <i class="fas fa-check text-orange-500 mr-1"></i>${feature}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Alege mărimea:</label>
                    <div class="flex gap-2">
                        ${product.sizes.map(size => `
                            <button class="size-btn-${product.id} size-btn border-2 border-gray-200 hover:border-blue-900 text-gray-700 hover:text-blue-900 px-4 py-2 rounded-lg transition-all font-semibold" data-size="${size}" data-product-id="${product.id}">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button class="add-to-cart-btn flex-1 bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center space-x-2" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Adaugă în Coș</span>
                    </button>
                    <button onclick="openGallery(${product.id})" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-all">
                        <i class="fas fa-images"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Attach event listeners to size buttons and add to cart buttons
    attachProductEventListeners();
}

function attachProductEventListeners() {
    productsData.forEach(product => {
        // Size selection
        const sizeBtns = document.querySelectorAll(`.size-btn-${product.id}`);
        let selectedSize = null;

        sizeBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                sizeBtns.forEach(b => {
                    b.classList.remove('border-blue-900', 'bg-blue-900', 'text-white');
                    b.classList.add('border-gray-200', 'text-gray-700');
                });
                this.classList.remove('border-gray-200', 'text-gray-700');
                this.classList.add('border-blue-900', 'bg-blue-900', 'text-white');
                selectedSize = this.getAttribute('data-size');
            });
        });

        // Add to cart
        const addBtn = document.querySelector(`.add-to-cart-btn[data-product-id="${product.id}"]`);
        if (addBtn) {
            addBtn.addEventListener('click', function () {
                if (!selectedSize) {
                    showToast('Te rog să selectezi o mărime!', 'warning');
                    return;
                }

                const cartItem = {
                    id: product.id,
                    name: product.name,
                    color: product.color,
                    size: selectedSize,
                    price: product.price,
                    quantity: 1,
                    image: product.image
                };

                addToCart(cartItem);
                selectedSize = null;
                sizeBtns.forEach(b => {
                    b.classList.remove('border-blue-900', 'bg-blue-900', 'text-white');
                    b.classList.add('border-gray-200', 'text-gray-700');
                });
            });
        }
    });
}

// Modal Gallery Functions
let currentGalleryImages = [];
let currentImageIndex = 0;
let currentProductName = '';
let currentProductDesc = '';

function openGallery(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product || !product.galleryImages || product.galleryImages.length === 0) {
        showToast('Nu există imagini disponibile pentru acest produs.', 'info');
        return;
    }

    currentGalleryImages = product.galleryImages;
    currentImageIndex = 0;
    currentProductName = product.name;
    currentProductDesc = product.description;

    const modal = document.getElementById('gallery-modal');
    const mainImg = document.getElementById('modal-main-img');
    const productNameEl = document.getElementById('modal-product-name');
    const productDescEl = document.getElementById('modal-product-desc');

    // Set product info
    productNameEl.textContent = currentProductName;
    productDescEl.textContent = currentProductDesc;

    // Load first image from gallery (principala)
    if (currentGalleryImages[0]) {
        mainImg.src = currentGalleryImages[0];
    }

    // Generate thumbnails
    const thumbnailsContainer = document.getElementById('modal-thumbnails');
    thumbnailsContainer.innerHTML = currentGalleryImages.map((img, idx) => `
        <div class="thumbnail-item cursor-pointer rounded-lg overflow-hidden border-2 ${idx === currentImageIndex ? 'border-orange-500' : 'border-transparent'} hover:border-orange-400 transition-all w-20 h-20 flex-shrink-0">
            <img src="${img}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover" onerror="this.src='${product.placeholderImage}'" onclick="setCurrentImage(${idx})">
        </div>
    `).join('');

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

function setCurrentImage(index) {
    currentImageIndex = index;
    const mainImg = document.getElementById('modal-main-img');
    if (currentGalleryImages[currentImageIndex]) {
        mainImg.src = currentGalleryImages[currentImageIndex];
    }

    // Update thumbnail active border
    const thumbnails = document.querySelectorAll('.thumbnail-item');
    thumbnails.forEach((thumb, idx) => {
        if (idx === currentImageIndex) {
            thumb.classList.add('border-orange-500');
            thumb.classList.remove('border-transparent');
        } else {
            thumb.classList.add('border-transparent');
            thumb.classList.remove('border-orange-500');
        }
    });
}

function nextImage() {
    if (currentGalleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
    setCurrentImage(currentImageIndex);
}

function prevImage() {
    if (currentGalleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    setCurrentImage(currentImageIndex);
}

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'Escape') {
            closeGallery();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    }
});

// Close modal when clicking outside the content
document.getElementById('gallery-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'gallery-modal') {
        closeGallery();
    }
});

// Attach modal button event listeners after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const closeModalBtn = document.getElementById('close-modal');
    const prevBtn = document.getElementById('prev-img');
    const nextBtn = document.getElementById('next-img');

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeGallery);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
});

// Call renderProducts when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});