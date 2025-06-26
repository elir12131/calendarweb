document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const filledCartContent = document.getElementById('filled-cart-content');

    // Retrieve the saved zipcodes from session storage
    const savedZipcodes = sessionStorage.getItem('calendar_zipcodes');
    const zipcodes = savedZipcodes ? JSON.parse(savedZipcodes) : [];

    if (zipcodes.length > 0) {
        // If we have items, show the cart content and hide the empty message
        emptyCartMessage.style.display = 'none';
        filledCartContent.style.display = 'block';

        // Create a list item for each zipcode
        const zipcodeList = zipcodes.map(zip => `<li>${zip}</li>`).join('');
        
        // Populate the cart item details
        cartItemsContainer.innerHTML = `
            <div class="cart-item">
                <div class="item-details">
                    <p class="item-title">Custom Jewish Calendar (PDF)</p>
                    <p class="item-desc">Includes times for the following locations:</p>
                    <ul class="zipcode-list">${zipcodeList}</ul>
                </div>
                <div class="item-price">$39.99</div>
            </div>
        `;
    } else {
        // If no items, show the empty message and hide the cart content
        emptyCartMessage.style.display = 'block';
        filledCartContent.style.display = 'none';
    }
});