document.addEventListener(
    "DOMContentLoaded",
    renderWishlist
);


function getWishlist() {

    return JSON.parse(
        localStorage.getItem("KreyansWishlist")
    ) || [];

}


function saveWishlist(wishlist) {

    localStorage.setItem(
        "KreyansWishlist",
        JSON.stringify(wishlist)
    );

    updateHeaderCounters();

}


function renderWishlist() {

    const wishlist = getWishlist();

    const container =
        document.getElementById(
            "wishlist-products"
        );

    const emptyWishlist =
        document.getElementById(
            "empty-wishlist"
        );

    const clearButton =
        document.getElementById(
            "clear-wishlist-button"
        );

    const countElement =
        document.getElementById(
            "wishlist-page-count"
        );


    countElement.textContent =
        `${wishlist.length} ${
            wishlist.length === 1
                ? "product"
                : "products"
        } saved`;


    if (wishlist.length === 0) {

        container.style.display = "none";

        emptyWishlist.style.display = "flex";

        clearButton.style.display = "none";

        return;

    }


    container.style.display = "grid";

    emptyWishlist.style.display = "none";

    clearButton.style.display = "flex";


    container.innerHTML =
        wishlist.map(wishlistItem => {


            const product =
                products.find(
                    item =>
                        item.id === wishlistItem.id
                );


            if (!product) {

                return "";

            }


            const discount =
                calculateWishlistDiscount(
                    product.price,
                    product.oldPrice
                );


            return `

                <article class="wishlist-card">

                    <div class="wishlist-image">

                        <a
                            href="product-details.html?id=${product.id}"
                        >

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                        </a>


                        <span class="wishlist-discount">

                            ${discount}% OFF

                        </span>


                        <button
                            type="button"
                            class="wishlist-remove-icon"
                            onclick="removeFromWishlist(${product.id})"
                            aria-label="Remove ${product.name}"
                        >

                            <i class="fa-solid fa-xmark"></i>

                        </button>

                    </div>


                    <div class="wishlist-info">

                        <span class="wishlist-category">

                            ${formatCategory(product.category)}

                        </span>


                        <a
                            href="product-details.html?id=${product.id}"
                        >

                            <h3>
                                ${product.name}
                            </h3>

                        </a>


                        <div class="wishlist-rating">

                            ${createStars(product.rating)}

                            <span>

                                (${product.reviews})

                            </span>

                        </div>


                        <div class="wishlist-price">

                            <strong>

                                ${formatCurrency(product.price)}

                            </strong>

                            <span>

                                ${formatCurrency(product.oldPrice)}

                            </span>

                        </div>


                        <div class="wishlist-actions">

                            <button
                                type="button"
                                class="wishlist-cart-button"
                                onclick="moveWishlistItemToCart(${product.id})"
                            >

                                <i class="fa-solid fa-cart-plus"></i>

                                Add to Cart

                            </button>


                            <button
                                type="button"
                                class="wishlist-remove-button"
                                onclick="removeFromWishlist(${product.id})"
                            >

                                Remove

                            </button>

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


function removeFromWishlist(productId) {

    let wishlist = getWishlist();


    const product =
        products.find(
            item =>
                item.id === productId
        );


    wishlist =
        wishlist.filter(
            item =>
                item.id !== productId
        );


    saveWishlist(wishlist);

    renderWishlist();


    if (product) {

        showNotification(
            `${product.name} removed from wishlist`
        );

    }

}


function moveWishlistItemToCart(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    let cart = JSON.parse(
        localStorage.getItem("KreyansCart")
    ) || [];


    const existingProduct =
        cart.find(
            item =>
                item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });

    }


    localStorage.setItem(
        "KreyansCart",
        JSON.stringify(cart)
    );


    updateHeaderCounters();


    showNotification(
        `${product.name} added to cart`
    );

}


function clearWishlist() {

    const wishlist = getWishlist();


    if (wishlist.length === 0) {

        return;

    }


    localStorage.removeItem(
        "KreyansWishlist"
    );


    updateHeaderCounters();

    renderWishlist();


    showNotification(
        "Your wishlist has been cleared"
    );

}


function calculateWishlistDiscount(
    price,
    oldPrice
) {

    if (!oldPrice || oldPrice <= price) {

        return 0;

    }


    return Math.round(
        ((oldPrice - price) / oldPrice)
        * 100
    );

}