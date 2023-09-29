document.addEventListener("DOMContentLoaded", function () {
    const productContainer = document.querySelector(".product-container");
    const cartIcon = document.querySelector(".icons img:last-child");
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const checkoutButton = document.getElementById("checkout-button");
    let cartCount = 0;
    let cartProducts = [];

    // Función para incrementar la cantidad
    function incrementQuantity(element) {
        const currentQuantity = parseInt(element.textContent);
        element.textContent = currentQuantity + 1;
    }

    // Función para decrementar la cantidad
    function decrementQuantity(element) {
        const currentQuantity = parseInt(element.textContent);
        if (currentQuantity >= 1) {
            element.textContent = currentQuantity - 1;
        }
    }

    // Función para calcular el precio con descuento
    function calcularPrecioConDescuento(precio) {
        // Aplica un 15% de descuento
        return precio * 0.85;
    }

    // Función para abrir el sidebar del carrito
    function openCartSidebar() {
        cartSidebar.classList.add("open");
    }

    // Función para cerrar el sidebar del carrito
    function closeCartSidebar() {
        cartSidebar.classList.remove("open");
    }

    // Función para limpiar las cantidades del producto
    function cleanItemQuantity(element) {
        element.textContent = 0
    }

    // Función para actualizar el precio total del carrito
    function updateCartTotal() {
        let total = 0;

        cartProducts.forEach(product => {
            total += product.precio;
        });

        cartTotal.textContent = total.toFixed(2);
    }

    // Función para agregar un producto al carrito
    function addToCart(product, quantity) {
        const cartItem = document.createElement("li");

        let precio = product.precio * quantity;

        if (product.tieneDescuento) {
            precio = calcularPrecioConDescuento(precio);
        }

        cartItem.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}">
            <span>${product.nombre} (x${quantity})</span>
            <span>$${precio.toFixed(2)}</span>
            <button class="remove-button" data-id="${product.id}">
                <img src="./multimedia/cerrar.png" alt="Eliminar">
            </button>
        `;
        cartItems.appendChild(cartItem);

        // ACTUALIZAR CARRITO
        cartCount += quantity;

        cartProducts.push({
            ...product,
            precio,
            cantidad: quantity
        });

        localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

        // ACTULIZAR PRECIO TOTAL
        updateCartTotal();

        // MOSTRAR TOASTIFY
        Toastify({
            text: "Añadido al carrito",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "rgb(46, 211, 46)", // Cambia el color de fondo a verde 
                color: "#FAFAFA",
            },
        }).showToast();


        const removeButtons = document.querySelectorAll(".remove-button");
        removeButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                const productId = parseInt(button.getAttribute("data-id"));
                removeFromCart(productId);
            });
        });
    }

    // FUNCION ELIMINAR PRODUCTO CARRITO
    function removeFromCart(productId) {
        const productIndex = cartProducts.findIndex(product => product.id === productId);

        if (productIndex !== -1) {
            const removedProduct = cartProducts[productIndex];

            // Restar la cantidad del producto eliminado del contador del carrito
            cartCount -= removedProduct.cantidad;

            // Eliminar el producto del array de productos en el carrito
            cartProducts.splice(productIndex, 1);

            // Actualizar el almacenamiento en Local Storage
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts));

            // Eliminar el elemento del carrito 
            cartItems.removeChild(cartItems.children[productIndex]);

            // Actualizar el precio total
            updateCartTotal();
        }
    }

    // Cargar los productos del carrito desde Local Storage al cargar la página
    const storedCart = localStorage.getItem("cartProducts");
    if (storedCart) {
        cartProducts = JSON.parse(storedCart);

        // Actualizar el precio total al cargar desde Local Storage
        updateCartTotal();

        cartProducts.forEach(product => {
            addToCart(product, product.cantidad);
        });
    }

    // Asignar evento al icono del carrito para abrir el sidebar
    cartIcon.addEventListener("click", openCartSidebar);

    // Asignar evento al botón de cruz para cerrar el sidebar
    const closeCartButton = document.getElementById("close-cart-button");
    closeCartButton.addEventListener("click", closeCartSidebar);

    // Asignar evento al botón de finalizar compra para limpiar el carrito
    checkoutButton.addEventListener("click", () => {
        if (cartProducts.length > 0) {

            // Mostrar SweetAlert de compra exitosa
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡La compra fue realizada!',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                // Limpiar el carrito u otras acciones después de la compra
                cartItems.innerHTML = "";
                cartCount = 0;
                cartTotal.textContent = "0.00";
                cartProducts = [];
                localStorage.removeItem("cartProducts");
                closeCartSidebar();
            });
        } else {
            // Mostrar SweetAlert de carrito vacío
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'No tiene ningun producto en el carrito',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });

    // Obtener los datos del archivo JSON utilizando fetch
    fetch("Productos.json")
        .then(response => response.json())
        .then(data => {
            // Recorrer los datos y generar la estructura HTML
            data.forEach((product, index) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");
                productDiv.innerHTML = `
                    <button class="remove-button" data-id="${product.id}">
                        <img src="./multimedia/cerrar.png" alt="Eliminar">
                    </button>
                    <img src="${product.imagen}" alt="${product.nombre}">
                    <h2>${product.nombre}</h2>
                    ${product.tieneDescuento
                        ? `
                        <span class="original-price discounted">$${product.precio.toFixed(2)}</span>
                        <span class="discounted-price">$${product.precioDescuento.toFixed(2)}</span>
                        `
                        : `
                        <span class="original-price">$${product.precio.toFixed(2)}</span>
                        `
                    }
                    <div class="counter">
                        <button class="decrement">-</button>
                        <span class="quantity">0</span>
                        <button class="increment">+</button>
                    </div>
                    <button class="buy-button">Comprar</button>
                `;
                productContainer.appendChild(productDiv);

                // Agregar evento al botón de compra
                const buyButton = productDiv.querySelector(".buy-button");
                buyButton.addEventListener("click", () => {
                    const currentQuantity = parseInt(productDiv.querySelector(".quantity").textContent);
                    const clickedProduct = data[index]; // Usar la variable index en lugar de product.id
                    const quantityElement = productDiv.querySelector(".quantity");

                    // Asegurarse de que al menos haya un producto en el carrito
                    if (currentQuantity >= 1) {
                        addToCart(clickedProduct, currentQuantity); // Usar la variable clickedProduct
                        closeCartSidebar(); // Cerrar el sidebar después de agregar productos
                        cleanItemQuantity(quantityElement); // Limpio las cantidades del producto comprado
                    }
                });

                // Asignar eventos a los botones de incremento
                const incrementButton = productDiv.querySelector(".increment");
                incrementButton.addEventListener("click", () => {
                    const quantityElement = productDiv.querySelector(".quantity");
                    incrementQuantity(quantityElement); // Pasa el elemento quantity directamente
                });

                // Asignar eventos a los botones de decremento
                const decrementButton = productDiv.querySelector(".decrement");
                decrementButton.addEventListener("click", () => {
                    const quantityElement = productDiv.querySelector(".quantity");
                    decrementQuantity(quantityElement); // Pasa el elemento quantity directamente
                });
            });
        })
        .catch(error => console.error("Error al cargar los datos del archivo JSON:", error));

    localStorage.clear();
});