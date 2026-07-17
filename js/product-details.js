let currentProduct = null;
let selectedQuantity = 1;


document.addEventListener("DOMContentLoaded", () => {

    loadProductDetails();

});


function loadProductDetails() {

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        Number(params.get("id"));


    currentProduct =
        products.find(
            product => product.id === productId
        );


    if (!currentProduct) {

        showProductNotFound();

        return;

    }


    document.title =
        `${currentProduct.name} | Zenvora`;


    const breadcrumb =
        document.getElementById(
            "breadcrumb-product"
        );


    if (breadcrumb) {

        breadcrumb.textContent =
            currentProduct.name;

    }


    renderProductDetails();

    renderRelatedProducts();

}


function renderProductDetails() {

    const container =
        document.getElementById(
            "product-details-container"
        );


    const discount =
        calculateDiscount(
            currentProduct.price,
            currentProduct.oldPrice
        );


    container.innerHTML = `

        <div class="product-details-gallery">

            <div class="main-product-image">

                <span class="product-discount-badge">
                    ${discount}% OFF
                </span>

                <img
                    src="${currentProduct.image}"
                    alt="${currentProduct.name}"
                    id="main-product-image"
                >

            </div>

        </div>


        <div class="product-details-info">

            <span class="details-category">
                ${formatCategory(currentProduct.category)}
            </span>


            <h1>
                ${currentProduct.name}
            </h1>


            <div class="details-rating">

                <div class="rating-stars">
                    ${createStars(currentProduct.rating)}
                </div>

                <strong>
                    ${currentProduct.rating}
                </strong>

                <span>
                    (${currentProduct.reviews} customer reviews)
                </span>

            </div>


            <div class="details-price">

                <span class="current-price">
                    ${formatCurrency(currentProduct.price)}
                </span>

                <span class="details-old-price">
                    ${formatCurrency(currentProduct.oldPrice)}
                </span>

                <span class="discount-text">
                    Save ${discount}%
                </span>

            </div>


            <p class="product-description">

                Experience quality, style and performance
                with the ${currentProduct.name}.
                Carefully selected by Zenvora to bring
                convenience and value to your everyday life.

            </p>


            <div class="product-benefits">

                <div>
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Quality Assured</span>
                </div>

                <div>
                    <i class="fa-solid fa-truck-fast"></i>
                    <span>Fast Delivery</span>
                </div>

                <div>
                    <i class="fa-solid fa-rotate-left"></i>
                    <span>Easy Returns</span>
                </div>

            </div>


            <div class="purchase-section">

                <div class="quantity-selector">

                    <button
                        type="button"
                        onclick="changeQuantity(-1)"
                        aria-label="Decrease quantity"
                    >
                        <i class="fa-solid fa-minus"></i>
                    </button>

                    <span id="product-quantity">
                        1
                    </span>

                    <button
                        type="button"
                        onclick="changeQuantity(1)"
                        aria-label="Increase quantity"
                    >
                        <i class="fa-solid fa-plus"></i>
                    </button>

                </div>


                <button
                    type="button"
                    class="details-cart-button"
                    onclick="addCurrentProductToCart()"
                >

                    <i class="fa-solid fa-cart-shopping"></i>

                    Add to Cart

                </button>


                <button
                    type="button"
                    class="details-wishlist-button"
                    onclick="addToWishlist(${currentProduct.id})"
                    aria-label="Add to wishlist"
                >

                    <i class="fa-regular fa-heart"></i>

                </button>

            </div>


            <button
                type="button"
                class="buy-now-button"
                onclick="buyNow()"
            >

                Buy Now

                <i class="fa-solid fa-arrow-right"></i>

            </button>


            <div class="delivery-information">

                <div>

                    <i class="fa-solid fa-truck"></i>

                    <div>
                        <strong>Free Delivery</strong>
                        <span>On eligible orders</span>
                    </div>

                </div>


                <div>

                    <i class="fa-solid fa-shield-halved"></i>

                    <div>
                        <strong>Secure Shopping</strong>
                        <span>Your purchase is protected</span>
                    </div>

                </div>

            </div>

        </div>

    `;

}


function changeQuantity(change) {

    selectedQuantity += change;


    if (selectedQuantity < 1) {

        selectedQuantity = 1;

    }


    if (selectedQuantity > 10) {

        selectedQuantity = 10;

    }


    const quantityElement =
        document.getElementById(
            "product-quantity"
        );


    if (quantityElement) {

        quantityElement.textContent =
            selectedQuantity;

    }

}


function addCurrentProductToCart() {

    if (!currentProduct) return;


    let cart =
        JSON.parse(
            localStorage.getItem("zenvoraCart")
        ) || [];


    const existingProduct =
        cart.find(
            item =>
                item.id === currentProduct.id
        );


    if (existingProduct) {

        existingProduct.quantity +=
            selectedQuantity;

    } else {

        cart.push({
            id: currentProduct.id,
            quantity: selectedQuantity
        });

    }


    localStorage.setItem(
        "zenvoraCart",
        JSON.stringify(cart)
    );


    updateHeaderCounters();


    showNotification(
        `${selectedQuantity} × ${currentProduct.name} added to cart`
    );

}


function buyNow() {

    addCurrentProductToCart();

    setTimeout(() => {

        window.location.href =
            "checkout.html";

    }, 400);

}


function renderRelatedProducts() {

    const container =
        document.getElementById(
            "related-products"
        );


    const relatedProducts =
        products
            .filter(
                product =>
                    product.category ===
                        currentProduct.category

                    &&

                    product.id !==
                        currentProduct.id
            )
            .slice(0, 4);


    if (relatedProducts.length === 0) {

        document
            .getElementById(
                "related-products-section"
            )
            .style.display = "none";

        return;

    }


    container.innerHTML =
        relatedProducts
            .map(product =>
                createProductCard(product)
            )
            .join("");

}


function calculateDiscount(
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


function showProductNotFound() {

    const detailsContainer =
        document.getElementById(
            "product-details-container"
        );


    const notFound =
        document.getElementById(
            "product-not-found"
        );


    const relatedSection =
        document.getElementById(
            "related-products-section"
        );


    detailsContainer.style.display =
        "none";


    notFound.style.display =
        "flex";


    relatedSection.style.display =
        "none";

}