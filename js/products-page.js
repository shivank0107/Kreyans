let selectedCategory = "all";
let selectedSort = "default";
let searchQuery = "";


document.addEventListener(
    "DOMContentLoaded",
    initializeProductsPage
);


function initializeProductsPage() {

    readFiltersFromURL();

    initializeProductFilters();

    renderProductsPage();

    syncHeaderSearch();

}


function readFiltersFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    const search =
        params.get("search");


    if (category) {

        selectedCategory =
            category;

    }


    if (search) {

        searchQuery =
            search
                .trim()
                .toLowerCase();

    }


    const categoryRadio =
        document.querySelector(
            `input[name="category"][value="${selectedCategory}"]`
        );


    if (categoryRadio) {

        categoryRadio.checked = true;

    } else {

        selectedCategory = "all";

    }

}


function syncHeaderSearch() {

    /*
        Header is loaded asynchronously,
        so wait until the search elements exist.
    */

    const interval =
        setInterval(() => {


            const searchInput =
                document.getElementById(
                    "global-search"
                );


            const categorySelect =
                document.getElementById(
                    "search-category"
                );


            if (!searchInput) {

                return;

            }


            clearInterval(interval);


            const params =
                new URLSearchParams(
                    window.location.search
                );


            searchInput.value =
                params.get("search") || "";


            if (
                categorySelect &&
                params.get("category")
            ) {

                categorySelect.value =
                    params.get("category");

            }


        }, 50);

}


function initializeProductFilters() {

    const categoryInputs =
        document.querySelectorAll(
            'input[name="category"]'
        );


    categoryInputs.forEach(input => {

        input.addEventListener(
            "change",
            event => {

                selectedCategory =
                    event.target.value;


                updateProductURL();

                renderProductsPage();

            }
        );

    });


    const sortSelect =
        document.getElementById(
            "sort-products"
        );


    if (sortSelect) {

        sortSelect.addEventListener(
            "change",
            event => {

                selectedSort =
                    event.target.value;


                renderProductsPage();

            }
        );

    }


    const clearButton =
        document.getElementById(
            "clear-filters"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearAllFilters
        );

    }

}


function getFilteredProducts() {

    let filteredProducts =
        [...products];


    /* Category */

    if (
        selectedCategory !==
        "all"
    ) {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.category ===
                    selectedCategory
            );

    }


    /* Search */

    if (searchQuery) {

        filteredProducts =
            filteredProducts.filter(
                product => {

                    const productName =
                        product.name
                            .toLowerCase();


                    const productCategory =
                        formatCategory(
                            product.category
                        )
                        .toLowerCase();


                    return (

                        productName.includes(
                            searchQuery
                        )

                        ||

                        productCategory.includes(
                            searchQuery
                        )

                    );

                }
            );

    }


    /* Sort */

    switch (selectedSort) {

        case "price-low":

            filteredProducts.sort(
                (a, b) =>
                    a.price - b.price
            );

            break;


        case "price-high":

            filteredProducts.sort(
                (a, b) =>
                    b.price - a.price
            );

            break;


        case "rating":

            filteredProducts.sort(
                (a, b) =>
                    b.rating - a.rating
            );

            break;

    }


    return filteredProducts;

}


function renderProductsPage() {

    const container =
        document.getElementById(
            "all-products"
        );


    const countElement =
        document.getElementById(
            "product-result-count"
        );


    const noProducts =
        document.getElementById(
            "no-products"
        );


    if (!container) return;


    const filteredProducts =
        getFilteredProducts();


    if (countElement) {

        countElement.textContent =
            `${filteredProducts.length} ${
                filteredProducts.length === 1
                    ? "product"
                    : "products"
            } found`;

    }


    if (
        filteredProducts.length === 0
    ) {

        container.innerHTML = "";

        if (noProducts) {

            noProducts.style.display =
                "flex";

        }

        return;

    }


    if (noProducts) {

        noProducts.style.display =
            "none";

    }


    container.innerHTML =
        filteredProducts
            .map(
                product =>
                    createProductCard(
                        product
                    )
            )
            .join("");

}


function updateProductURL() {

    const params =
        new URLSearchParams();


    if (
        selectedCategory !==
        "all"
    ) {

        params.set(
            "category",
            selectedCategory
        );

    }


    if (searchQuery) {

        params.set(
            "search",
            searchQuery
        );

    }


    const query =
        params.toString();


    const newURL =
        query
            ? `products.html?${query}`
            : "products.html";


    window.history.replaceState(
        {},
        "",
        newURL
    );

}


function clearAllFilters() {

    selectedCategory =
        "all";


    selectedSort =
        "default";


    searchQuery =
        "";


    const allCategory =
        document.querySelector(
            'input[name="category"][value="all"]'
        );


    if (allCategory) {

        allCategory.checked = true;

    }


    const sortSelect =
        document.getElementById(
            "sort-products"
        );


    if (sortSelect) {

        sortSelect.value =
            "default";

    }


    const searchInput =
        document.getElementById(
            "global-search"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    const categorySelect =
        document.getElementById(
            "search-category"
        );


    if (categorySelect) {

        categorySelect.value =
            "all";

    }


    window.history.replaceState(
        {},
        "",
        "products.html"
    );


    renderProductsPage();

}