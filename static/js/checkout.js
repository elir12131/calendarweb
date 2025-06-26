// static/js/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    const expiryInput = document.getElementById('expiry-date');
    const cvcInput = document.getElementById('cvc');
    const paymentForm = document.getElementById('payment-form');

    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    if (cvcInput) {
        // We no longer need a hidden field since this isn't a real payment
        cvcInput.addEventListener('input', (e) => {
            e.target.value = '*'.repeat(e.target.value.length);
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the default form submission


            const payButton = document.querySelector('.pay-button');
            payButton.textContent = 'Processing...';
            payButton.disabled = true;

            
            const savedZipcodes = sessionStorage.getItem('calendar_zipcodes');
            const zipcodes = savedZipcodes ? JSON.parse(savedZipcodes) : [];
            
            // Gather all the form data
            const formData = {
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                card_name: document.getElementById('card-name').value,
                notes: document.getElementById('notes').value,
                cvc: document.getElementById('real-cvc').value,
                zipcodes: zipcodes // Add the zipcodes to the data being sent
            };

            try {
                // Send the data to our backend API endpoint
                const response = await fetch('/api/process-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (result.success) {
                    // Redirect to the thank you page on success
                    window.location.href = '/thank-you';
                } else {
                    alert('There was an error processing your order. Please try again.');
                    payButton.textContent = 'Pay $39.99';
                    payButton.disabled = false;
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('A network error occurred. Please check your connection and try again.');
                payButton.textContent = 'Pay $39.99';
                payButton.disabled = false;
            }
        });
    }
});