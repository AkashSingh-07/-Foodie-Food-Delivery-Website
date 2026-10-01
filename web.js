var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");

const checkoutLink = document.querySelector(".checkout-btn");
const checkoutModal = document.querySelector("#checkout-modal");
const closeCheckout = document.querySelector("#close-checkout");
const checkoutForm = document.querySelector("#checkout-form");
const billModal = document.querySelector("#bill-modal");
const billContent = document.querySelector("#bill-content");
const closeBill = document.querySelector("#close-bill");
const printBill = document.querySelector("#print-bill");
const finishOrder = document.querySelector("#finish-order");

cartIcon.addEventListener("click", (event) => {
  event.preventDefault();
  cartTab.classList.add("cart-tab-active");
});

closeBtn.addEventListener("click", (event) => {
  event.preventDefault();
  cartTab.classList.remove("cart-tab-active");
});

hamburger.addEventListener("click", (event) => {
  event.preventDefault();
  mobileMenu.classList.toggle("mobile-menu-active");
  bars.classList.toggle("fa-bars");
  bars.classList.toggle("fa-xmark");
});

let productList = [];
let cartProduct = [];

const updateTotal = () => {
  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll(".cart-list .item").forEach((item) => {
    const quantity = Number(item.querySelector(".quantity-value").textContent);

    const price = Number(
      item.querySelector(".item-total").textContent.replace("$", ""),
    );

    totalPrice += price;
    totalQuantity += quantity;
  });

  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;

  if (cartProduct.length === 0) {
    cartList.innerHTML =
      '<p class="cart-empty-message">Your cart is empty.</p>';
  }
};

const showCards = () => {
  cardList.innerHTML = "";

  productList.forEach((product) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

    orderCard.innerHTML = `
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <h4>${product.name}</h4>
      <h4 class="price">${product.price}</h4>
      <a href="#" class="btn card-btn">Add to cart</a>
    `;

    cardList.appendChild(orderCard);

    orderCard.querySelector(".card-btn").addEventListener("click", (event) => {
      event.preventDefault();
      addToCart(product);
    });
  });
};

const addToCart = (product) => {
  const existingProduct = cartProduct.find((item) => item.id === product.id);

  if (existingProduct) {
    alert("Item is already in cart");
    return;
  }

  const price = Number(String(product.price).replace("$", ""));

  if (!Number.isFinite(price) || price < 0) {
    alert("This product has an invalid price.");
    return;
  }

  cartProduct.push({
    ...product,
    quantity: 1,
    numericPrice: price,
  });

  const cartItem = document.createElement("div");
  cartItem.classList.add("item");

  cartItem.innerHTML = `
    <div class="item-image">
      <img src="${product.image}" alt="${product.name}">
    </div>

    <div class="detail">
      <h4>${product.name}</h4>
      <h4 class="item-total">$${price.toFixed(2)}</h4>
    </div>

    <div class="flex">
      <a href="#" class="quantity-btn minus" aria-label="Decrease quantity">
        <i class="fa-solid fa-minus"></i>
      </a>

      <h4 class="quantity-value">1</h4>

      <a href="#" class="quantity-btn plus" aria-label="Increase quantity">
        <i class="fa-solid fa-plus"></i>
      </a>
    </div>
  `;

  cartList.appendChild(cartItem);
  cartTab.classList.add("cart-tab-active");

  let quantity = 1;

  const plusBtn = cartItem.querySelector(".plus");
  const minusBtn = cartItem.querySelector(".minus");
  const quantityValue = cartItem.querySelector(".quantity-value");
  const itemTotal = cartItem.querySelector(".item-total");

  plusBtn.addEventListener("click", (event) => {
    event.preventDefault();

    quantity++;

    const savedProduct = cartProduct.find((item) => item.id === product.id);

    if (savedProduct) {
      savedProduct.quantity = quantity;
    }

    quantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;

    updateTotal();
  });

  minusBtn.addEventListener("click", (event) => {
    event.preventDefault();

    if (quantity > 1) {
      quantity--;

      const savedProduct = cartProduct.find((item) => item.id === product.id);

      if (savedProduct) {
        savedProduct.quantity = quantity;
      }

      quantityValue.textContent = quantity;
      itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;

      updateTotal();
    } else {
      cartItem.classList.add("slide-out");

      setTimeout(() => {
        cartItem.remove();

        cartProduct = cartProduct.filter((item) => item.id !== product.id);

        updateTotal();
      }, 300);
    }
  });

  updateTotal();
};

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function openCheckout(event) {
  if (event) {
    event.preventDefault();
  }

  if (cartProduct.length === 0) {
    alert("Please add at least one item to your cart first.");
    return;
  }

  cartTab.classList.remove("cart-tab-active");
  checkoutModal.classList.add("show");
  checkoutModal.setAttribute("aria-hidden", "false");
}

checkoutLink.addEventListener("click", openCheckout);

closeCheckout.addEventListener("click", () => {
  checkoutModal.classList.remove("show");
  checkoutModal.setAttribute("aria-hidden", "true");
});

closeBill.addEventListener("click", () => {
  billModal.classList.remove("show");
  billModal.setAttribute("aria-hidden", "true");
});

checkoutModal.addEventListener("click", (event) => {
  if (event.target === checkoutModal) {
    checkoutModal.classList.remove("show");
    checkoutModal.setAttribute("aria-hidden", "true");
  }
});

billModal.addEventListener("click", (event) => {
  if (event.target === billModal) {
    billModal.classList.remove("show");
    billModal.setAttribute("aria-hidden", "true");
  }
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (cartProduct.length === 0) {
    alert("Your cart is empty.");
    checkoutModal.classList.remove("show");
    return;
  }

  const name = document.querySelector("#customer-name").value.trim();
  const phone = document.querySelector("#customer-phone").value.trim();
  const address = document.querySelector("#customer-address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in all checkout details.");
    return;
  }

  if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) {
    alert("Please enter a valid phone number.");
    return;
  }

  const rows = cartProduct.map((product) => ({
    name: product.name,
    quantity: product.quantity,
    unitPrice: product.numericPrice,
    lineTotal: product.numericPrice * product.quantity,
  }));

  const subtotal = rows.reduce((sum, item) => sum + item.lineTotal, 0);

  const billNumber = `FD-${Date.now()}`;
  const billDate = new Date().toLocaleString();

  billContent.innerHTML = `
    <div class="bill-header">
      <h2>Foodie.</h2>
      <p>Food Delivery & Takeaway</p>
      <h4>ORDER BILL</h4>
    </div>

    <div class="bill-customer">
      <p><strong>Bill No:</strong> ${billNumber}</p>
      <p><strong>Date:</strong> ${escapeHTML(billDate)}</p>
      <p><strong>Customer:</strong> ${escapeHTML(name)}</p>
      <p><strong>Phone:</strong> ${escapeHTML(phone)}</p>
      <p><strong>Delivery Address:</strong> ${escapeHTML(address)}</p>
    </div>

    <table class="bill-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        ${rows
          .map(
            (item) => `
          <tr>
            <td>${escapeHTML(item.name)}</td>
            <td>$${item.unitPrice.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${item.lineTotal.toFixed(2)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <div class="bill-total">
      <p>
        <strong>Subtotal:</strong>
        <span>$${subtotal.toFixed(2)}</span>
      </p>

      <p>
        <strong>Delivery:</strong>
        <span>$0.00</span>
      </p>

      <h4>
        <span>Grand Total:</span>
        <span>$${subtotal.toFixed(2)}</span>
      </h4>
    </div>

    <p class="bill-thanks">
      Thank you for ordering with Foodie!
    </p>
  `;

  checkoutModal.classList.remove("show");
  checkoutModal.setAttribute("aria-hidden", "true");

  billModal.classList.add("show");
  billModal.setAttribute("aria-hidden", "false");
});

printBill.addEventListener("click", () => {
  window.print();
});

finishOrder.addEventListener("click", () => {
  billModal.classList.remove("show");
  billModal.setAttribute("aria-hidden", "true");

  cartProduct = [];
  cartList.innerHTML = "";
  cartTotal.textContent = "$0.00";
  cartValue.textContent = "0";

  checkoutForm.reset();
});

const initApp = () => {
  fetch("product.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load product.json");
      }

      return response.json();
    })
    .then((data) => {
      productList = data;
      showCards();
      updateTotal();
    })
    .catch((error) => {
      console.error("Unable to load products:", error);

      cardList.innerHTML =
        "<p>Unable to load food items. Run the page with Live Server and check product.json.</p>";
    });
};

initApp();
