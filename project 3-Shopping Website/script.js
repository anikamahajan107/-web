
const products = [
  {
    id: 1,
    name: "The Sunday Shirt",
    category: "Fashion",
    price: 899,
    tag: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80",
    description: "A relaxed shirt for everyday style."
  },
  {
    id: 2,
    name: "Everyday Tote",
    category: "Accessories",
    price: 649,
    tag: "EVERYDAY LOVE",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
    description: "A roomy tote for your everyday essentials."
  },
  {
    id: 3,
    name: "Soft Knit Cardigan",
    category: "Fashion",
    price: 1299,
    tag: "NEW IN",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80",
    description: "A soft and comfortable layer."
  },
  {
    id: 4,
    name: "Golden Hour Earrings",
    category: "Accessories",
    price: 499,
    tag: "LITTLE LUXURY",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
    description: "Elegant earrings for a finishing touch."
  },
  {
    id: 5,
    name: "Weekend Sneakers",
    category: "Fashion",
    price: 1499,
    tag: "MOST LOVED",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    description: "Comfortable sneakers for everyday outings."
  },
  {
    id: 6,
    name: "The Daily Journal",
    category: "Lifestyle",
    price: 399,
    tag: "SLOW MOMENTS",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=700&q=80",
    description: "A journal for plans, ideas and thoughts."
  },
  {
    id: 7,
    name: "Classic Sunglasses",
    category: "Accessories",
    price: 599,
    tag: "SUNNY DAYS",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",
    description: "Classic sunglasses for sunny days."
  },
  {
    id: 8,
    name: "Ceramic Coffee Cup",
    category: "Lifestyle",
    price: 549,
    tag: "HOME FAVOURITE",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=80",
    description: "A ceramic cup for your favourite drink."
  }
];

function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    return [];
  }
}

let cart = readStorage("blushcart-cart");
let wishlist = readStorage("blushcart-wishlist");

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

function saveCart() {
  localStorage.setItem("blushcart-cart", JSON.stringify(cart));
}

function saveWishlist() {
  localStorage.setItem("blushcart-wishlist", JSON.stringify(wishlist));
}

function updateCartCount() {
  let count = 0;

  for (let i = 0; i < cart.length; i++) {
    count += cart[i].quantity;
  }

  document.querySelectorAll("#cart-count").forEach(function (element) {
    element.textContent = count;
  });
}

function productCard(product) {
  let saved = wishlist.includes(product.id);

  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge">${product.tag}</span>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${formatPrice(product.price)}</p>

        <div class="product-actions">
          <button class="add-btn" data-add="${product.id}">Add to bag</button>
          <button data-details="${product.id}">Details</button>
          <button class="heart-btn" data-wish="${product.id}">
            ${saved ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>`;
}

function renderHomeProducts() {
  const grid = document.getElementById("home-products");

  if (!grid) return;

  grid.innerHTML = products.slice(0, 4).map(productCard).join("");
}

function renderProducts() {
  const grid = document.getElementById("product-grid");

  if (!grid) return;

  const searchBox = document.getElementById("product-search");
  const categoryBox = document.getElementById("category-filter");
  const sortBox = document.getElementById("sort-products");

  const searchText = searchBox ? searchBox.value.toLowerCase().trim() : "";
  const sortOption = sortBox ? sortBox.value : "default";

  const urlParameters = new URLSearchParams(window.location.search);
  const categoryFromLink = urlParameters.get("category");

  if (categoryFromLink && categoryBox && !categoryBox.dataset.loaded) {
    categoryBox.value = categoryFromLink;
    categoryBox.dataset.loaded = "yes";
  }

  const selectedCategory = categoryBox ? categoryBox.value : "All";
  let filteredProducts = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const matchesName = product.name.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    if (matchesName && matchesCategory) {
      filteredProducts.push(product);
    }
  }

  if (sortOption === "low") {
    filteredProducts.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sortOption === "high") {
    filteredProducts.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sortOption === "name") {
    filteredProducts.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  }

  const resultsMessage = document.getElementById("results-message");

  if (resultsMessage) {
    resultsMessage.textContent =
      filteredProducts.length +
      (filteredProducts.length === 1
        ? " product found"
        : " products found");
  }

  if (filteredProducts.length === 0) {
    grid.innerHTML =
      '<div class="empty-state">No products found. Try another search or category.</div>';
  } else {
    grid.innerHTML = filteredProducts.map(productCard).join("");
  }
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  if (!container || !totalElement) return;

  if (cart.length === 0) {
    container.innerHTML =
      '<div class="empty-state">Your bag is waiting for something lovely.</div>';

    totalElement.textContent = formatPrice(0);
    updateCartCount();
    return;
  }

  let cartHTML = "";
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];

    const product = products.find(function (p) {
      return p.id === item.id;
    });

    if (product) {
      const lineTotal = product.price * item.quantity;
      total += lineTotal;

      cartHTML += `
        <div class="cart-row">
          <img src="${product.image}" alt="${product.name}">

          <div>
            <h3>${product.name}</h3>
            <span class="muted">${formatPrice(product.price)} each</span>
          </div>

          <div class="quantity-control">
            <button data-decrease="${product.id}">−</button>
            <span>${item.quantity}</span>
            <button data-increase="${product.id}">+</button>
          </div>

          <strong class="line-total">${formatPrice(lineTotal)}</strong>
          <button class="remove-btn" data-remove="${product.id}">Remove</button>
        </div>`;
    }
  }

  container.innerHTML = cartHTML;
  totalElement.textContent = formatPrice(total);
  updateCartCount();
}

function renderWishlist() {
  const container = document.getElementById("wishlist-items");

  if (!container) return;

  const savedProducts = products.filter(function (product) {
    return wishlist.includes(product.id);
  });

  if (savedProducts.length === 0) {
    container.innerHTML =
      '<div class="empty-state">No saved favourites yet. Tap the heart on a product to keep it here.</div>';
    return;
  }

  container.innerHTML = savedProducts.map(function (product) {
    return `
      <div class="wishlist-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <strong>${product.name}</strong>
          <small>${formatPrice(product.price)}</small>
        </div>
        <button class="small-btn" data-add="${product.id}">Add to bag</button>
        <button class="small-btn" data-wish="${product.id}">Remove</button>
      </div>`;
  }).join("");
}

function addToCart(productId) {
  const existingItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  updateCartCount();
  showMessage("checkout-message", "Product added to your bag.", "success");
}

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(function (id) {
      return id !== productId;
    });
  } else {
    wishlist.push(productId);
  }

  saveWishlist();
  renderProducts();
  renderHomeProducts();
  renderWishlist();
}

function showProductDetails(productId) {
  const product = products.find(function (item) {
    return item.id === productId;
  });

  const dialog = document.getElementById("product-dialog");
  const content = document.getElementById("product-detail-content");

  if (product && dialog && content) {
    content.innerHTML = `
      <div class="detail-layout">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <span class="product-category">${product.category}</span>
          <h2>${product.name}</h2>
          <p class="product-price">${formatPrice(product.price)}</p>
          <p>${product.description}</p>
          <button class="btn btn-dark" data-add="${product.id}">
            Add to bag
          </button>
        </div>
      </div>`;

    dialog.showModal();
  }
}

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = message;
    element.className = "form-message " + type;
  }
}

document.addEventListener("DOMContentLoaded", function () {

  // 1. Dark mode
  if (localStorage.getItem("blushcart-theme") === "dark") {
    document.body.classList.add("dark-mode");
  }

  document.querySelectorAll(".theme-toggle").forEach(function (button) {
    button.textContent =
      document.body.classList.contains("dark-mode") ? "☀" : "☾";

    button.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      const theme = document.body.classList.contains("dark-mode")
        ? "dark"
        : "light";

      localStorage.setItem("blushcart-theme", theme);

      document.querySelectorAll(".theme-toggle").forEach(function (item) {
        item.textContent = theme === "dark" ? "☀" : "☾";
      });
    });
  });

  // 2. Mobile navigation
  const menuButton = document.getElementById("menu-toggle");
  const navigation = document.getElementById("main-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      navigation.classList.toggle("open");
    });
  }

  // 3. Display products
  renderHomeProducts();
  renderProducts();
  renderCart();
  renderWishlist();
  updateCartCount();

  // 4. Search, category filter and sorting
  ["product-search", "category-filter", "sort-products"].forEach(function (id) {
    const control = document.getElementById(id);

    if (control) {
      control.addEventListener(
        id === "product-search" ? "input" : "change",
        renderProducts
      );
    }
  });

  // 5. Add products, wishlist and cart quantity controls
  document.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.add) {
      addToCart(Number(button.dataset.add));
      renderWishlist();
    }

    if (button.dataset.wish) {
      toggleWishlist(Number(button.dataset.wish));
    }

    if (button.dataset.details) {
      showProductDetails(Number(button.dataset.details));
    }

    if (button.dataset.increase) {
      const item = cart.find(function (row) {
        return row.id === Number(button.dataset.increase);
      });

      if (item) {
        item.quantity++;
      }

      saveCart();
      renderCart();
    }

    if (button.dataset.decrease) {
      const itemId = Number(button.dataset.decrease);

      const item = cart.find(function (row) {
        return row.id === itemId;
      });

      if (item) {
        item.quantity--;
      }

      cart = cart.filter(function (row) {
        return row.quantity > 0;
      });

      saveCart();
      renderCart();
    }

    if (button.dataset.remove) {
      cart = cart.filter(function (row) {
        return row.id !== Number(button.dataset.remove);
      });

      saveCart();
      renderCart();
    }
  });

  // 6. Clear shopping cart
  const clearCartButton = document.getElementById("clear-cart");

  if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
      cart = [];
      saveCart();
      renderCart();

      showMessage(
        "checkout-message",
        "Your bag has been cleared.",
        "success"
      );
    });
  }

  // 7. Demo checkout and cart total
  const checkoutButton = document.getElementById("checkout-button");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
      if (cart.length === 0) {
        showMessage(
          "checkout-message",
          "Your bag is empty. Add something lovely first.",
          "error"
        );
      } else {
        showMessage(
          "checkout-message",
          "Demo checkout: your cart total is calculated. No real payment is taken.",
          "success"
        );
      }
    });
  }

  // 8. Product details pop-up
  const dialog = document.getElementById("product-dialog");
  const closeDialogButton = document.getElementById("close-dialog");

  if (dialog && closeDialogButton) {
    closeDialogButton.addEventListener("click", function () {
      dialog.close();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  }

  // 9. Contact form validation
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value.trim();

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name === "" || email === "" || subject === "" || message === "") {
        showMessage(
          "form-message",
          "Please complete every field before sending.",
          "error"
        );
      } else if (!emailPattern.test(email)) {
        showMessage(
          "form-message",
          "Please enter a valid email address.",
          "error"
        );
      } else {
        showMessage(
          "form-message",
          "Thank you, " + name + "! Your message passed validation.",
          "success"
        );

        contactForm.reset();
      }
    });
  }

  // 10. Newsletter form
  const newsletterForm = document.getElementById("newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("newsletter-email").value.trim();

      if (email === "") {
        showMessage(
          "newsletter-message",
          "Please enter your email address.",
          "error"
        );
      } else {
        showMessage(
          "newsletter-message",
          "Thank you for joining the Blushcart demo list!",
          "success"
        );

        newsletterForm.reset();
      }
    });
  }

  // Back-to-top button
  const topButton = document.getElementById("back-to-top");

  if (topButton) {
    window.addEventListener("scroll", function () {
      topButton.classList.toggle("visible", window.scrollY > 300);
    });

    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
