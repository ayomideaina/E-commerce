function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = count;
}


const API_URL = "https://fakestoreapi.com";

async function fetchCategories() {
    try {
        const res = await fetch(`${API_URL}/products/categories`);
        const categories = await res.json();
        displayCategories(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

async function fetchProducts(category = null) {
    try {
        let url = category
            ? `${API_URL}/products/category/${encodeURIComponent(category)}`
            : `${API_URL}/products?limit=8`;

        const res = await fetch(url);
        const products = await res.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}


//DISPLAY FUNCTIONS
function displayCategories(categories) {
    const container = document.getElementById("category");
    container.innerHTML = "";

    categories.forEach(cat => {
        const div = document.createElement("div");
        div.className =
            "bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition cursor-pointer";
        div.innerHTML = `
            <h4 class="text-lg font-semibold capitalize">${cat}</h4>
        `;

        div.addEventListener("click", () => {
            // Remove highlight from all
            document.querySelectorAll("#category div").forEach(c => {
                c.classList.remove("bg-blue-500", "text-white");
                c.classList.add("bg-white", "text-gray-800");
            });

            // Highlight selected
            div.classList.remove("bg-white", "text-gray-800");
            div.classList.add("bg-blue-500", "text-white");

            // Fetch products by category
            fetchProducts(cat);
        });

        container.appendChild(div);
    });
}

function displayProducts(products) {
    const container = document.getElementById("featured-products");
    container.innerHTML = "";

    products.forEach(product => {
        const div = document.createElement("div");
        div.className =
            "bg-white shadow rounded-lg p-4 hover:shadow-xl transition flex flex-col";

        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}" 
                class="h-40 w-full object-contain mb-4">
            <h4 class="font-semibold text-gray-800 line-clamp-1">${product.title}</h4>
            <p class="text-blue-600 font-bold mt-2">$${product.price}</p>
            <div class="mt-auto flex justify-between items-center pt-4">
                <a href="pages/product.html?id=${product.id}" 
                   class="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                   View
                </a>
                <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')"
                   class="text-sm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                   Add
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

//Cart function
function addToCart(id, title, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }

    saveCart(cart);
}


document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    fetchCategories();
    fetchProducts();
});
