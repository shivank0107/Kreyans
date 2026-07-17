document.addEventListener(
    "DOMContentLoaded",
    initializeCheckout
);


function initializeCheckout() {

    renderCheckout();

    initializePaymentMethods();

    initializeCheckoutForm();

}


function getCheckoutCart() {

    return JSON.parse(
        localStorage.getItem("KreyansCart")
    ) || [];

}


function renderCheckout() {

    const cart =
        getCheckoutCart();


    const layout =
        document.getElementById(
            "checkout-layout"
        );


    const emptyCheckout =
        document.getElementById(
            "checkout-empty"
        );


    if (cart.length === 0) {

        layout.style.display =
            "none";


        emptyCheckout.style.display =
            "flex";


        return;

    }


    layout.style.display =
        "grid";


    emptyCheckout.style.display =
        "none";


    renderCheckoutItems(cart);

    updateCheckoutSummary(cart);

}


function renderCheckoutItems(cart) {

    const container =
        document.getElementById(
            "checkout-items"
        );


    container.innerHTML =
        cart.map(cartItem => {


            const product =
                products.find(
                    item =>
                        item.id ===
                        cartItem.id
                );


            if (!product) {

                return "";

            }


            return `

                <div class="checkout-item">

                    <div class="checkout-item-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                        <span>

                            ${cartItem.quantity}

                        </span>

                    </div>


                    <div class="checkout-item-info">

                        <strong>

                            ${product.name}

                        </strong>


                        <span>

                            ${formatCategory(
                                product.category
                            )}

                        </span>

                    </div>


                    <strong class="checkout-item-price">

                        ${formatCurrency(
                            product.price *
                            cartItem.quantity
                        )}

                    </strong>

                </div>

            `;

        }).join("");

}


function updateCheckoutSummary(cart) {

    let subtotal = 0;

    let originalTotal = 0;


    cart.forEach(cartItem => {


        const product =
            products.find(
                item =>
                    item.id ===
                    cartItem.id
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

    });


    const savings =
        originalTotal -
        subtotal;


    const total =
        subtotal;


    document.getElementById(
        "checkout-subtotal"
    ).textContent =
        formatCurrency(subtotal);


    document.getElementById(
        "checkout-savings"
    ).textContent =
        formatCurrency(savings);


    document.getElementById(
        "checkout-total"
    ).textContent =
        formatCurrency(total);

}


function initializePaymentMethods() {

    const paymentInputs =
        document.querySelectorAll(
            'input[name="payment"]'
        );


    const message =
        document.getElementById(
            "online-payment-message"
        );


    paymentInputs.forEach(input => {


        input.addEventListener(
            "change",
            event => {


                if (
                    event.target.value ===
                    "cod"
                ) {

                    message.style.display =
                        "none";

                } else {

                    message.style.display =
                        "flex";

                }

            }
        );

    });

}


function initializeCheckoutForm() {

    const form =
        document.getElementById(
            "checkout-form"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        event => {


            event.preventDefault();


            const selectedPayment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (
                selectedPayment.value !==
                "cod"
            ) {

                showNotification(
                    "Please select Cash on Delivery for this demo"
                );

                return;

            }


            placeOrder();

        }
    );

}


function placeOrder() {

    const cart =
        getCheckoutCart();


    if (cart.length === 0) {

        return;

    }


    /*
        Temporary order object.

        Later this will be sent
        to Flask API and MySQL.
    */

    const order = {

        orderNumber:
            generateOrderNumber(),

        customer: {

            name:
                document.getElementById(
                    "full-name"
                ).value,

            phone:
                document.getElementById(
                    "phone"
                ).value,

            address:
                document.getElementById(
                    "address"
                ).value,

            landmark:
                document.getElementById(
                    "landmark"
                ).value,

            city:
                document.getElementById(
                    "city"
                ).value,

            state:
                document.getElementById(
                    "state"
                ).value,

            pincode:
                document.getElementById(
                    "pincode"
                ).value,

            email:
                document.getElementById(
                    "email"
                ).value

        },

        paymentMethod:
            "Cash on Delivery",

        items:
            cart,

        createdAt:
            new Date()
                .toISOString()

    };


    /*
        Temporary order history.

        Useful until database
        is connected.
    */

    const orders =
        JSON.parse(
            localStorage.getItem(
                "KreyansOrders"
            )
        ) || [];


    orders.push(order);


    localStorage.setItem(
        "KreyansOrders",
        JSON.stringify(orders)
    );


    localStorage.removeItem(
        "KreyansCart"
    );


    updateHeaderCounters();


    showOrderSuccess(
        order.orderNumber
    );

}


function generateOrderNumber() {

    const timestamp =
        Date.now()
            .toString()
            .slice(-7);


    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );


    return `ZNV-${timestamp}-${random}`;

}


function showOrderSuccess(
    orderNumber
) {

    const header =
        document.querySelector(
            ".checkout-page-header"
        );


    const layout =
        document.getElementById(
            "checkout-layout"
        );


    const success =
        document.getElementById(
            "order-success"
        );


    if (header) {

        header.style.display =
            "none";

    }


    layout.style.display =
        "none";


    success.style.display =
        "flex";


    document.getElementById(
        "order-number"
    ).textContent =
        orderNumber;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}