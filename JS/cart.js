const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count in nav
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

// Fetch product details for each cart item
async function loadCart() {
  cartItemsContainer.innerHTML = ""; // clear before rendering
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="text-gray-500">Your cart is empty.</p>`;
    cartTotalEl.textContent = "$0.00";
    updateCartCount();
    return;
  }

  for (let item of cart) {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${item.id}`);
      const product = await response.json();

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      const div = document.createElement("div");
      div.className = "flex lg:flex-col lg:items-center gap-6 bg-white shadow p-4 rounded";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="w-50 h-20 object-contain">
        <div class="flex-1">
          <h2 class="font-semibold text-blue-900 text-sm lg:text-lg">${product.title}</h2>
          <p class="text-gray-600">$${product.price.toFixed(2)}</p>
          <p class="text-gray-600">Quantity: ${item.quantity}</p>
        </div>
        <p class="font-bold text-blue-600">$${itemTotal.toFixed(2)}</p>
        <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onclick="removeFromCart(${item.id})">
          Remove
        </button>
      `;
      cartItemsContainer.appendChild(div);
    } catch (error) {
      console.error("Error fetching product for cart:", error);
    }
  }

  // Update total & cart count
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
  updateCartCount();
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

loadCart();
