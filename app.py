# Save this file as: app.py
from flask import Flask, render_template, jsonify, request
import calendar_generator
import os # For reading environment variables
import smtplib
from email.message import EmailMessage
from whitenoise import WhiteNoise

app = Flask(__name__)

# This line is crucial for your CSS and JS to work on Render
app.wsgi_app = WhiteNoise(app.wsgi_app, root="static/")

# --- All your routes and functions go here ---

@app.route('/')
def homepage(): return render_template('index.html')

@app.route('/cart')
def cart_page():
    return render_template('cart.html')

@app.route('/checkout')
def checkout_page():
    return render_template('checkout.html')

@app.route('/thank-you')
def thank_you_page(): return render_template('thank-you.html')

@app.route('/api/get-base-calendar')
def get_base_calendar_api():
    try:
        base_calendar = calendar_generator.get_base_calendar()
        return jsonify(base_calendar)
    except Exception as e:
        print(f"SERVER-ERROR: {e}")
        return jsonify({"error": "Server error"}), 500

@app.route('/api/process-order', methods=['POST'])
def process_order():
    try:
        data = request.get_json()
        
        # This code reads the secrets you will set in the Render Dashboard
        email_sender = os.getenv('EMAIL_SENDER')
        email_password = os.getenv('EMAIL_PASSWORD')
        email_recipient = os.getenv('EMAIL_RECIPIENT')

        if all([email_sender, email_password, email_recipient]):
            msg = EmailMessage()
            msg['Subject'] = '🎉 New Custom Calendar Order!'
            msg['From'] = email_sender
            msg['To'] = email_recipient
            
            # Get the list of zipcodes from the submitted data
            zipcodes = data.get('zipcodes', [])
            zipcode_text = ", ".join(zipcodes) if zipcodes else "None specified"

            # Create the new, detailed email body
            content = f"""
You've received a new order for a custom calendar.

--- Order Details ---
Customer Email: {data.get('email', 'N/A')}
Customer Phone: {data.get('phone', 'N/A')}
Name on Card: {data.get('card_name', 'N/A')}
Notes: {data.get('notes', 'None')}

--- Requested Zipcodes ---
{zipcode_text}
--------------------
"""
            msg.set_content(content)
            
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                smtp.login(email_sender, email_password)
                smtp.send_message(msg)
            print("Email notification sent successfully!")
        else:
            print("Email credentials not fully configured. Skipping email.")

        return jsonify({"success": True, "message": "Order processed"})
    except Exception as e:
        print(f"ORDER PROCESSING ERROR: {e}")
        return jsonify({"success": False, "message": "Failed to process order"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)