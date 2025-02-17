class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
        this.saveCart();
        this.updateMenuItemStatus(item.id, item.category, true);
    }

    removeItem(id) {
        const item = this.items.find(i => i.id === id);
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        if (item) {
            this.updateMenuItemStatus(item.id, item.category, false);
        }
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    updateCartCount() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        $('#cart-count').text(totalItems);
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Add new method for email checkout
    async sendOrderEmail(orderDetails) {
        const orderItemsFormatted = this.formatOrderForEmail();
        
        try {
            const response = await $.ajax({
                url: 'send_order.php',
                method: 'POST',
                data: {
                    clientName: orderDetails.clientName,
                    phone: orderDetails.phone,
                    email: orderDetails.email,
                    order: orderItemsFormatted,
                    total: orderDetails.total
                }
            });
            
            if (response.success) {
                this.items = [];
                this.saveCart();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error sending order:', error);
            return false;
        }
    }

    formatOrderForEmail() {
        return this.items.map(item => {
            return `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        }).join('\n');
    }

    updateMenuItemStatus(id, category, inCart) {
        const menuItem = $(`.menu-item[data-id="${id}"][data-category="${category}"]`);
        if (menuItem.length) {
            const title = menuItem.find('h3');
            if (inCart) {
                title.addClass('in-cart');
            } else {
                title.removeClass('in-cart');
            }
        }
    }
}

const cart = new Cart();

// Event handlers for main page
$(document).ready(function() {
    // Add to cart
    $(document).on('click', '.add-to-cart', function() {
        const menuItem = $(this).closest('.menu-item');
        const id = parseInt(menuItem.data('id'));
        const category = menuItem.data('category');
        const name = menuItem.find('h3').text();
        const price = parseFloat(menuItem.find('.price').text().replace('$', ''));
        const quantity = parseInt(menuItem.find('.quantity-control').val());
        
        cart.addItem({ id, category, name, price, quantity });
        
        // Add visual feedback
        const title = menuItem.find('h3');
        title.addClass('added');
        
        // Remove the animation class after effect
        setTimeout(() => {
            title.removeClass('added');
            // Don't remove 'in-cart' class as it should stay
        }, 1000);
    });

    // Cart page specific code
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});

// Move OrderDetails class outside of displayCart function
class OrderDetails {
    constructor(name, phone, email, items, total) {
        this.clientName = name;
        this.phone = phone;
        this.email = email;
        this.items = items;
        this.total = total;
    }
}

function displayCart() {
    const cartContainer = $('#cart-container');
    cartContainer.empty();

    if (cart.items.length === 0) {
        cartContainer.html('<p>Your cart is empty</p>');
        return;
    }

    // Display cart items
    cart.items.forEach(item => {
        const cartItem = `
            <div class="cart-item" data-id="${item.id}">
                <div class="row">
                    <div class="col-md-6">
                        <h4>${item.name}</h4>
                    </div>
                    <div class="col-md-2">
                        <input type="number" class="form-control quantity-update" 
                               value="${item.quantity}" min="1" max="10">
                    </div>
                    <div class="col-md-2">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-danger remove-from-cart">Remove</button>
                    </div>
                </div>
            </div>
        `;
        cartContainer.append(cartItem);
    });

    // Add total price
    const totalSection = `
        <div class="text-end mt-4 mb-4">
            <h4>Total1: $<span id="cart-total">${cart.getTotal().toFixed(2)}</span></h4>
        </div>
    `;
    cartContainer.append(totalSection);

    // Add checkout form with client details
    const checkoutForm = `
        <div class="checkout-form mt-4">
            <h3>Order Details</h3>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="clientName" class="form-label">Full Name</label>
                    <input type="text" class="form-control" id="clientName" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="phone" required>
                </div>
                <div class="col-md-12 mb-3">
                    <label for="email" class="form-label">Email address</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
            </div>
            <button class="btn btn-success w-100" id="checkout-btn">Send Order</button>
        </div>
    `;
    cartContainer.append(checkoutForm);

    // Event handlers for cart page
    $('.quantity-update').on('change', function() {
        const id = $(this).closest('.cart-item').data('id');
        const quantity = parseInt($(this).val());
        cart.updateQuantity(id, quantity);
        displayCart();
    });

    $('.remove-from-cart').on('click', function() {
        const id = $(this).closest('.cart-item').data('id');
        cart.removeItem(id);
        displayCart();
    });

    // Checkout button handler with validation
    $('#checkout-btn').on('click', async function() {
        const clientName = $('#clientName').val();
        const phone = $('#phone').val();
        const email = $('#email').val();

        // Basic validation
        if (!clientName || !phone || !email) {
            alert('Please fill in all fields');
            return;
        }

        // Phone validation (basic)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        $(this).prop('disabled', true).text('Sending...');
        
        const orderDetails = new OrderDetails(
            clientName,
            phone,
            email,
            cart.items,
            cart.getTotal()
        );
        
        const success = await cart.sendOrderEmail(orderDetails);
        
        if (success) {
            alert('Order sent successfully! Check your email.');
            window.location.href = 'index.html';
        } else {
            alert('Failed to send order. Please try again.');
            $(this).prop('disabled', false).text('Send Order');
        }
    });
} 