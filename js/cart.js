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
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
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
}

const cart = new Cart();

// Event handlers for main page
$(document).ready(function() {
    // Add to cart
    $(document).on('click', '.add-to-cart', function() {
        const menuItem = $(this).closest('.menu-item');
        const id = parseInt(menuItem.data('id'));
        const name = menuItem.find('h3').text();
        const price = parseFloat(menuItem.find('.price').text().replace('$', ''));
        const quantity = parseInt(menuItem.find('.quantity-control').val());
        
        cart.addItem({ id, name, price, quantity });
    });

    // Cart page specific code
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});

function displayCart() {
    const cartContainer = $('#cart-container');
    cartContainer.empty();

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

    $('#cart-total').text(cart.getTotal().toFixed(2));

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
} 