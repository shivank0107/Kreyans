document.addEventListener(
    "DOMContentLoaded",
    renderCart
);


function getCart() {

    return JSON.parse(
        localStorage.getItem("KreyansCart")
    ) || [];

}


function saveCart(cart) {

    localStorage.setItem(
        "KreyansCart",
        JSON.stringify(cart)
    );


    updateHeaderCounters();

}


function renderCart() {

    const cart = getCart();


    const cartLayout =
        document.getElementById(
            "cart-layout"
        );


    const emptyCart =
        document.getElementById(
            "empty-cart"
        );


    if (cart.length === 0) {

        cartLayout.style.display = "none";

        emptyCart.style.display = "flex";

        return;

    }


    cartLayout.style.display = "grid";

    emptyCart.style.display = "none";


    renderCartItems(cart);

    updateCartSummary(cart);

}


function renderCartItems(cart) {

    const container =
        document.getElementById(
            "cart-items"
        );


    container.innerHTML =
        cart.map(cartItem => {


            const product =
                products.find(
                    item =>
                        item.id === cartItem.id
                );


            if (!product) {

                return "";

            }


            const itemTotal =
                product.price *
                cartItem.quantity;


            return `

                <article class="cart-item">

                    <a
                        href="product-details.html?id=${product.id}"
                        class="cart-item-image"
                    >

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                    </a>


                    <div class="cart-item-info">

                        <span class="cart-item-category">

                            ${formatCategory(product.category)}

                        </span>


                        <a
                            href="product-details.html?id=${product.id}"
                        >

                            <h3>
                                ${product.name}
                            </h3>

                        </a>


                        <div class="cart-item-rating">

                            ${createStars(product.rating)}

                            <span>
                                ${product.rating}
                            </span>

                        </div>


                        <button
                            type="button"
                            class="remove-cart-item"
                            onclick="removeFromCart(${product.id})"
                        >

                            <i class="fa-regular fa-trash-can"></i>

                            Remove

                        </button>

                    </div>


                    <div class="cart-item-actions">

                        <div class="cart-item-price">

                            <strong>

                                ${formatCurrency(product.price)}

                            </strong>


                            <span>

                                ${formatCurrency(product.oldPrice)}

                            </span>

                        </div>


                        <div class="cart-quantity">

                            <button
                                type="button"
                                onclick="updateCartQuantity(
                                    ${product.id},
                                    -1
                                )"
                            >

                                <i class="fa-solid fa-minus"></i>

                            </button>


                            <span>

                                ${cartItem.quantity}

                            </span>


                            <button
                                type="button"
                                onclick="updateCartQuantity(
                                    ${product.id},
                                    1
                                )"
                            >

                                <i class="fa-solid fa-plus"></i>

                            </button>

                        </div>


                        <div class="cart-item-total">

                            <span>
                                Total
                            </span>

                            <strong>

                                ${formatCurrency(itemTotal)}

                            </strong>

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


function updateCartQuantity(
    productId,
    change
) {

    const cart = getCart();


    const cartItem =
        cart.find(
            item =>
                item.id === productId
        );


    if (!cartItem) {

        return;

    }


    cartItem.quantity += change;


    if (cartItem.quantity < 1) {

        removeFromCart(productId);

        return;

    }


    if (cartItem.quantity > 10) {

        cartItem.quantity = 10;

        showNotification(
            "Maximum quantity is 10"
        );

    }


    saveCart(cart);

    renderCart();

}


function removeFromCart(productId) {

    let cart = getCart();


    const product =
        products.find(
            item =>
                item.id === productId
        );


    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveCart(cart);

    renderCart();


    if (product) {

        showNotification(
            `${product.name} removed from cart`
        );

    }

}


function clearCart() {

    const cart = getCart();


    if (cart.length === 0) {

        return;

    }


    localStorage.removeItem(
        "KreyansCart"
    );


    updateHeaderCounters();

    renderCart();


    showNotification(
        "Your cart has been cleared"
    );

}


function updateCartSummary(cart) {

    let subtotal = 0;

    let originalTotal = 0;

    let totalItems = 0;


    cart.forEach(cartItem => {

        const product =
            products.find(
                item =>
                    item.id === cartItem.id
            );


        if (!product) {

            return;

        }


        subtotal +=
            product.price *
            cartItem.quantity;


        originalTotal +=
            product.oldPrice *
            cartItem.quantity;


        totalItems +=
            cartItem.quantity;

    });


    const savings =
        originalTotal - subtotal;


    /*
        Free delivery for now.

        Later we can add:
        - Delivery by PIN code
        - Free delivery threshold
        - Express delivery
    */

    const deliveryCharge = 0;


    const total =
        subtotal + deliveryCharge;


    document.getElementById(
        "cart-subtotal"
    ).textContent =
        formatCurrency(subtotal);


    document.getElementById(
        "cart-savings"
    ).textContent =
        formatCurrency(savings);


    document.getElementById(
        "cart-total"
    ).textContent =
        formatCurrency(total);


    document.getElementById(
        "cart-page-count"
    ).textContent =
        `(${totalItems} ${
            totalItems === 1
                ? "item"
                : "items"
        })`;

}