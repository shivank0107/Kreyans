async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Could not load ${filePath}`);
        }

        const html = await response.text();

        const element = document.getElementById(elementId);

        if (element) {
            element.innerHTML = html;
        }

    } catch (error) {
        console.error("Component loading error:", error);
    }
}


async function initializeComponents() {

    await Promise.all([
        loadComponent("header", "components/header.html"),
        loadComponent("footer", "components/footer.html")
    ]);


    // Footer current year

    const yearElement =
        document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    // Mobile navigation

    initializeMobileNavigation();


    // Global search

    initializeGlobalSearch();


    // Update cart and wishlist counters

    updateHeaderCounters();

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initializeMobileNavigation() {

    const menuButton =
        document.getElementById(
            "mobile-menu-button"
        );

    const navLinks =
        document.getElementById(
            "nav-links"
        );


    if (!menuButton || !navLinks) {
        return;
    }


    menuButton.addEventListener(
        "click",
        () => {

            navLinks.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   GLOBAL SEARCH
   ========================================================= */

function initializeGlobalSearch() {

    const searchInput =
        document.getElementById(
            "global-search"
        );

    const searchButton =
        document.getElementById(
            "search-button"
        );

    const categorySelect =
        document.getElementById(
            "search-category"
        );


    if (!searchInput || !searchButton) {
        return;
    }


    function performSearch() {

        const query =
            searchInput.value.trim();


        const category =
            categorySelect
                ? categorySelect.value
                : "all";


        const params =
            new URLSearchParams();


        // Add search query

        if (query) {

            params.set(
                "search",
                query
            );

        }


        // Add category

        if (category !== "all") {

            params.set(
                "category",
                category
            );

        }


        const queryString =
            params.toString();


        if (queryString) {

            window.location.href =
                `products.html?${queryString}`;

        } else {

            window.location.href =
                "products.html";

        }

    }


    // Search button click

    searchButton.addEventListener(
        "click",
        performSearch
    );


    // Enter key search

    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                performSearch();

            }

        }
    );

}


/* =========================================================
   CART & WISHLIST COUNTERS
   ========================================================= */

function updateHeaderCounters() {

    const cart =
        JSON.parse(
            localStorage.getItem(
                "zenvoraCart"
            )
        ) || [];


    const wishlist =
        JSON.parse(
            localStorage.getItem(
                "zenvoraWishlist"
            )
        ) || [];


    const cartCount =
        document.getElementById(
            "cart-count"
        );


    const wishlistCount =
        document.getElementById(
            "wishlist-count"
        );


    if (cartCount) {

        const totalItems =
            cart.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    (
                        Number(
                            item.quantity
                        ) || 1
                    ),
                0
            );


        cartCount.textContent =
            totalItems;

    }


    if (wishlistCount) {

        wishlistCount.textContent =
            wishlist.length;

    }

}


/* =========================================================
   INITIALIZE COMPONENTS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeComponents
);