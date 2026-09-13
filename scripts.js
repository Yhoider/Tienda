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

renderProducts(products);