const checkoutItemsContainer = document.getElementById("checkout-items");
const checkoutSubtotalEl = document.getElementById("checkout-subtotal");
const checkoutTotalEl = document.getElementById("checkout-total");
const placeOrderBtn = document.getElementById("place-order-btn");
const checkoutForm = document.getElementById("checkout-form");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Load checkout summary
async function loadCheckout() {
  checkoutItemsContainer.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML = `<p class="text-gray-500">Your cart is empty.</p>`;
    checkoutSubtotalEl.textContent = "$0.00";
    checkoutTotalEl.textContent = "$5.99";
    return;
  }

  for (let item of cart) {
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${item.id}`);
      const product = await res.json();

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      const div = document.createElement("div");
      div.className = "flex justify-between items-center";
      div.innerHTML = `
        <div>
          <p class="font-medium">${product.title}</p>
          <p class="text-sm text-gray-500">Qty: ${item.quantity}</p>
        </div>
        <p class="font-semibold">$${itemTotal.toFixed(2)}</p>
      `;
      checkoutItemsContainer.appendChild(div);
    } catch (err) {
      console.error("Error loading checkout product:", err);
    }
  }

  checkoutSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  const total = subtotal + 5.99;
  checkoutTotalEl.textContent = `$${total.toFixed(2)}`;
}

// Place order handler
placeOrderBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  
  const formData = new FormData(checkoutForm);
  const customer = Object.fromEntries(formData.entries());

 
  localStorage.setItem("customerInfo", JSON.stringify(customer));

  
  localStorage.removeItem("cart");


  showOrderPopup(customer);
});

// Popup modal function
function showOrderPopup(customer) {
  
  const popup = document.createElement("div");
  popup.className =
    "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

  popup.innerHTML = `
    <div class="bg-white p-7 rounded-lg shadow-lg w-90 lg:w-120 text-center">
        <h2 class="lg:text-xl font-bold mb-2">
            <i class="fa-solid fa-square-check"></i> Order Confirmed!
        </h2>
        <p class="text-gray-700 mb-4">Thank you !! <br>Your order has been placed successfully.</p>
        <button id="close-popup" class="mt-4 px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Close
        </button>
    </div>
  `;

  document.body.appendChild(popup);

  // Close popup on button click
  document.getElementById("close-popup").addEventListener("click", () => {
    popup.remove();
    window.location.href = "../index.html";
  });
}


loadCheckout();
