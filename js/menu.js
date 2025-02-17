$(document).ready(function() {
    // Load menu items from JSON
    $.getJSON('data/menu.json', function(data) {
        displayMenuCategories(data);
    });

    function displayMenuCategories(menuData) {
        const menuContainer = $('#menu-container');
        menuContainer.empty();

        // Get current cart items for checking
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        // Display each category
        Object.entries(menuData).forEach(([category, items]) => {
            // Create category header
            const categoryHeader = `
                <div class="col-12 mb-4">
                    <h2 class="text-center">${formatCategoryName(category)}</h2>
                </div>
            `;
            menuContainer.append(categoryHeader);

            // Display items in this category
            items.forEach(item => {
                const isInCart = cartItems.some(cartItem => 
                    cartItem.id === item.id && cartItem.category === category
                );

                const menuItem = `
                    <div class="col-12">
                        <div class="menu-item" data-id="${item.id}" data-category="${category}">
                            <div class="main-row">
                                <h3 class="${isInCart ? 'in-cart' : ''}">${item.name}</h3>
                                <div class="htext">
                                    <div class="price">$${item.price.toFixed(2)}</div>
                                    <div class="input-group">
                                        <input type="number" class="form-control quantity-control" 
                                           value="1" min="1" max="10">
                                    <button class="btn btn-primary add-to-cart">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                           <div class="description-section  row">
                                <div class="col-md-3">
                                    <img src="${item.image}" alt="${item.name}">
                                </div>
                                <div class="col-md-8">
                                    <p>${item.description}</p>
                                </div>
                            </div>
                    </div>
                `;
                menuContainer.append(menuItem);
            });
        });
    }

    function formatCategoryName(category) {
        // Convert category name to title case and replace hyphens with spaces
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Toggle description section
    $(document).on('click', '.menu-item', function(e) {
        // Prevent toggle when clicking buttons or inputs
        if ($(e.target).closest('.input-group').length === 0) {
            const descriptionSection = $(this).find('.description-section');
            if (descriptionSection.is(':visible')) {
                descriptionSection.slideUp();
            } else {
                descriptionSection
                    .css('display', 'flex')
                    .hide()
                    .slideDown();
            }
        }
    });
}); 