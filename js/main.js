document.addEventListener("DOMContentLoaded", () => {

    renderCategories();

    renderFeaturedProducts();

});


function renderCategories() {

    const container =
        document.getElementById("category-container");

    if (!container) return;


    container.innerHTML = categories.map(category => `

        <a
            href="products.html?category=${category.slug}"
            class="category-card"
        >

            <div class="category-icon">

                <i class="${category.icon}"></i>

            </div>

            <h3>
                ${category.name}
            </h3>

        </a>

    `).join("");

}


function renderFeaturedProducts() {

    const container =
        document.getElementById("featured-products");

    if (!container) return;


    const featuredProducts =
        products.filter(product => product.featured);


    container.innerHTML = featuredProducts.map(product => {

        return createProductCard(product);

    }).join("");

}


function createProductCard(product) {

    return `

        <article class="product-card">

            <div class="product-image">

                <a
                    href="product-details.html?id=${product.id}"
                >

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </a>


                <div class="product-actions">

                    <button
                        type="button"
                        onclick="addToWishlist(${product.id})"
                        aria-label="Add ${product.name} to wishlist"
                    >

                        <i class="fa-regular fa-heart"></i>

                    </button>


                    <button
                        type="button"
                        onclick="viewProduct(${product.id})"
                        aria-label="View ${product.name}"
                    >

                        <i class="fa-regular fa-eye"></i>

                    </button>

                </div>

            </div>


            <div class="product-info">

                <p class="product-category">

                    ${formatCategory(product.category)}

                </p>


                <a
                    href="product-details.html?id=${product.id}"
                >

                    <h3 class="product-title">

                        ${product.name}

                    </h3>

                </a>


                <div class="product-rating">

                    ${createStars(product.rating)}

                    <span>

                        (${product.reviews})

                    </span>

                </div>


                <div class="product-price-row">

                    <div>

                        <span class="product-price">

                            ${formatCurrency(product.price)}

                        </span>

                    </div>


                    <button
                        type="button"
                        class="add-cart-button"
                        onclick="addToCart(${product.id})"
                        aria-label="Add ${product.name} to cart"
                    >

                        <i class="fa-solid fa-cart-plus"></i>

                    </button>

                </div>

            </div>

        </article>

    `;

}


function createStars(rating) {

    let stars = "";

    const fullStars = Math.floor(rating);


    for (let i = 1; i <= 5; i++) {

        if (i <= fullStars) {

            stars +=
                '<i class="fa-solid fa-star"></i>';

        } else {

            stars +=
                '<i class="fa-regular fa-star"></i>';

        }

    }


    return stars;

}


function formatCurrency(price) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(price);

}


function formatCategory(category) {

    const selectedCategory =
        categories.find(
            item => item.slug === category
        );


    return selectedCategory
        ? selectedCategory.name
        : category;

}


function viewProduct(productId) {

    window.location.href =
        `product-details.html?id=${productId}`;

}


/* =========================================================
   CART
   ========================================================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    let cart = JSON.parse(
        localStorage.getItem("KreyansCart")
    ) || [];


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            id: product.id,
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


/* =========================================================
   WISHLIST
   ========================================================= */

function addToWishlist(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) return;


    let wishlist = JSON.parse(
        localStorage.getItem("KreyansWishlist")
    ) || [];


    const alreadyExists =
        wishlist.some(
            item => item.id === productId
        );


    if (alreadyExists) {

        showNotification(
            `${product.name} is already in your wishlist`
        );

        return;

    }


    wishlist.push({
        id: product.id
    });


    localStorage.setItem(
        "KreyansWishlist",
        JSON.stringify(wishlist)
    );


    updateHeaderCounters();


    showNotification(
        `${product.name} added to wishlist`
    );

}


/* =========================================================
   NOTIFICATION
   ========================================================= */

function showNotification(message) {

    const existingNotification =
        document.querySelector(
            ".Kreyans-notification"
        );


    if (existingNotification) {

        existingNotification.remove();

    }


    const notification =
        document.createElement("div");


    notification.className =
        "Kreyans-notification";


    notification.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>
            ${message}
        </span>

    `;


    document.body.appendChild(notification);


    setTimeout(() => {

        notification.classList.add("show");

    }, 50);


    setTimeout(() => {

        notification.classList.remove("show");


        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 2500);

}