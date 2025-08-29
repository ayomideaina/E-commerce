const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productDetails = document.getElementById("product-details");

// Fetch and display the product details
function fetchProductDetails(id) {
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }
      return response.json();
    })
    .then((product) => {
      displayProduct(product);
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
      productDetails.innerHTML = `<p class="text-red-500">Failed to load product details.</p>`;
    });
}

// Render product details into the DOM
function displayProduct(product) {
  productDetails.innerHTML = `
    <div class="flex justify-center">
      <img src="${product.image}" alt="${product.title}" class="w-80 h-80 object-contain">
    </div>
    <div class="flex flex-col justify-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">${product.title}</h2>
      <p class="text-gray-600 mb-4">${product.description}</p>
      <p class="text-xl font-semibold text-blue-600 mb-6">$${product.price}</p>
      <a href="cart.html"
        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        onclick="addToCart(${product.id})"
      >
        Add to Cart
      </a>
    </div>
  `;
}

// Add product to cart
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productInCart = cart.find((item) => item.id === id);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.push({ id: id, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}

// Load product on page load
if (productId) {
  fetchProductDetails(productId);
} else {
  productDetails.innerHTML = `<p class="text-gray-500">No product selected.</p>`;
}

