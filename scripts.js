const products = [
    {
        id: 1,
        name: "Acetaminofén",
        description: "Producto para el alivio temporal de dolores.",
        price: 8500,
        category: "analgesicos",
        image: "assets/productos/acetaminofen.svg"
    },
    {
        id: 2,
        name: "Ibuprofeno",
        description: "Producto de venta libre para el alivio del dolor.",
        price: 12000,
        category: "analgesicos",
        image: "assets/productos/ibuprofeno.svg"
    },
    {
        id: 3,
        name: "Aspirina",
        description: "Producto para el alivio temporal de dolores.",
        price: 9500,
        category: "analgesicos",
        image: "https://carulla.vtexassets.com/arquivos/ids/25718140/Aspirina-01-Tabletas-884132_a.jpg?v=639213695719630000"
    },
    {
        id: 4,
        name: "Antiácido",
        description: "Producto para el alivio de molestias digestivas.",
        price: 11000,
        category: "digestivos",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5XjgE8TKWAVQzgRjr-sg3Vk7aTYA1H7D44yn4EAEr0uvw8KcQ6_Ldqlg&s=10"
    },
    {
        id: 5,
        name: "Sales de frutas",
        description: "Producto para molestias relacionadas con la digestión.",
        price: 7000,
        category: "digestivos",
        image: "https://habibdroguerias.vtexassets.com/arquivos/ids/159955/100027283_1.jpg?v=638459699428430000 "
    },
    {
        id: 6,
        name: "Loratadina",
        description: "Producto utilizado para aliviar síntomas de alergia.",
        price: 10000,
        category: "alergias",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUljwl_jRUFsRtOYl5gzznaC9-bWuENt9pUf1Dotbue3OH9LfHL_EyX6fx&s=10"
    },
    {
        id: 7,
        name: "Cetirizina",
        description: "Producto utilizado para aliviar síntomas de alergia.",
        price: 11500,
        category: "alergias",
        image: "https://copservir.vtexassets.com/arquivos/ids/1935381/CETIRIZINA-REC-10-MG--GENFAR-_P.png?v=639155458739170000  "
    },
    {
        id: 8,
        name: "Crema hidratante",
        description: "Crema para el cuidado e hidratación de la piel.",
        price: 18000,
        category: "cuidado",
        image: "assets/productos/cerave_imagen.svg"
    }
];

const productsGrid = document.getElementById("productsGrid");

function renderProducts(productsToRender) {
    productsGrid.innerHTML = "";

    productsToRender.forEach(product => {
        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="Ilustración de ${product.name}">
            </div>

            <div class="product-info">
                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">
                    <strong>
                        $${product.price.toLocaleString("es-CO")}
                    </strong>

                    <button
                        class="add-cart-button"
                        data-id="${product.id}"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        `;

        productsGrid.appendChild(card);
    });
}

const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "todos") {
            renderProducts(products);
        } else {
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts);
        }
    });
});

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const cartCount = document.getElementById("cartCount");

let cart = [];
function addToCart(productId) {
    const product = products.find(product => product.id === productId);

    if (!product) {
        return;
    }

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

productsGrid.addEventListener("click", event => {
    const button = event.target.closest(".add-cart-button");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);

    addToCart(productId);
});

function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="cart-empty">
                Tu carrito está vacío.
            </p>
        `;

        cartTotal.textContent = "$0";
        cartCount.textContent = "0";

        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="Ilustración de ${item.name}">
            </div>

            <div class="cart-item-info">
                <h3>${item.name}</h3>

                <p class="cart-item-price">
                    $${item.price.toLocaleString("es-CO")}
                </p>

                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button
                            class="quantity-button"
                            data-action="decrease"
                            data-id="${item.id}"
                        >
                            −
                        </button>

                        <span class="quantity">
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-button"
                            data-action="increase"
                            data-id="${item.id}"
                        >
                            +
                        </button>
                    </div>

                    <button
                        class="remove-button"
                        data-action="remove"
                        data-id="${item.id}"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const quantity = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    cartTotal.textContent = `$${total.toLocaleString("es-CO")}`;
    cartCount.textContent = quantity;
}

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);
    const action = button.dataset.action;

    const item = cart.find(item => item.id === productId);

    if (!item) {
        return;
    }

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }

    if (action === "remove") {
        cart = cart.filter(item => item.id !== productId);
    }

    renderCart();
});

cartButton.addEventListener("click", () => {
    cartOverlay.classList.add("active");
});

cartClose.addEventListener("click", () => {
    cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("active");
    }
});

checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    alert("Compra realizada correctamente.");
});

renderProducts(products);
renderCart()