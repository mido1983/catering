$(document).ready(function() {
    // Load menu items from JSON
    $.getJSON('data/menu.json', function(data) {
        displayMenuItems(data.dishes);
    });

    function displayMenuItems(dishes) {
        const menuContainer = $('#menu-container');
        
        dishes.forEach(dish => {
            const menuItem = `
                <div class="col-md-6 col-lg-4">
                    <div class="menu-item" data-id="${dish.id}">
                        <h3>${dish.name}</h3>
                        <p class="price">$${dish.price.toFixed(2)}</p>
                        <div class="input-group mb-3">
                            <input type="number" class="form-control quantity-control" 
                                   value="1" min="1" max="10">
                            <button class="btn btn-primary add-to-cart">
                                Add to Cart
                            </button>
                        </div>
                        <div class="description-section row">
                            <div class="col-md-4">
                                <img src="${dish.image}" alt="${dish.name}">
                            </div>
                            <div class="col-md-8">
                                <p>${dish.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            menuContainer.append(menuItem);
        });
    }

    // Toggle description section
    $(document).on('click', '.menu-item h3', function() {
        $(this).siblings('.description-section').slideToggle();
    });
}); 