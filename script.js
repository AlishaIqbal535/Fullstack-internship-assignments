document.addEventListener('DOMContentLoaded', () => {
    const cart = []; // The state for our cart
    const cartItemCountEl = document.getElementById('cartItemCount');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartItemsEl = document.getElementById('cartItems');

    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const checkoutModal = document.getElementById('checkoutModal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutFormContainer = document.getElementById('checkoutFormContainer');
    const orderConfirmationEl = document.getElementById('orderConfirmation');

    // --- State Management and Rendering Functions ---

    // Function to render the cart items and update the total
    const renderCart = () => {
        cartItemsEl.innerHTML = ''; // Clear existing items
        let total = 0;

        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
            cartItemCountEl.textContent = 0;
            cartTotalEl.textContent = `$0.00`;
            checkoutBtn.disabled = true;
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <p><strong>${item.name}</strong></p>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="update-quantity-btn" data-id="${item.id}" data-action="decrement">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="update-quantity-btn" data-id="${item.id}" data-action="increment">+</button>
                    <button class="delete-item-btn" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsEl.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartItemCountEl.textContent = cart.reduce((count, item) => count + item.quantity, 0);
        cartTotalEl.textContent = `$${total.toFixed(2)}`;
        checkoutBtn.disabled = false;
    };

    // Function to add a product to the cart
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        renderCart();
        cartSidebar.classList.add('open');
    };

    // Function to update item quantity
    const updateCart = (id, action) => {
        const item = cart.find(item => item.id === id);
        if (item) {
            if (action === 'increment') {
                item.quantity += 1;
            } else if (action === 'decrement') {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    deleteFromCart(id);
                    return;
                }
            }
            renderCart();
        }
    };

    // Function to delete an item from the cart
    const deleteFromCart = (id) => {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            renderCart();
        }
    };

    // --- Event Listeners ---

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.product-card');
            const product = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
            };
            addToCart(product);
        });
    });

    // Handle cart quantity updates and deletions
    cartItemsEl.addEventListener('click', (event) => {
        const target = event.target;
        const id = target.dataset.id;
        
        if (target.classList.contains('update-quantity-btn')) {
            updateCart(id, target.dataset.action);
        } else if (target.classList.contains('delete-item-btn')) {
            deleteFromCart(id);
        }
    });

    // Open/Close cart sidebar
    openCartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Open checkout modal
    checkoutBtn.addEventListener('click', () => {
        checkoutModal.classList.add('show');
    });

    // Close checkout modal
    closeModalBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('show');
    });

    // Handle checkout form submission
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // This is where you would process the payment/order in a real app.
        // For this example, we just show a success message.
        
        checkoutFormContainer.classList.add('hidden');
        orderConfirmationEl.classList.remove('hidden');

        // Clear the cart after a short delay
        setTimeout(() => {
            cart.length = 0; // Clear the cart array
            renderCart();
            // Optional: Close the modal after a few seconds
            setTimeout(() => {
                checkoutModal.classList.remove('show');
                checkoutFormContainer.classList.remove('hidden');
                orderConfirmationEl.classList.add('hidden');
            }, 3000);
        }, 1000);
    });

    // Initial render
    renderCart();
});