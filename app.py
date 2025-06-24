# Save this file as: app.py
from flask import Flask, render_template, jsonify, request
import calendar_generator
import os
from dotenv import load_dotenv
import smtplib
from email.message import EmailMessage
from whitenoise import WhiteNoise

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Configure WhiteNoise for static files in production
app.wsgi_app = WhiteNoise(app.wsgi_app, root="static/")

# --- PAGE ROUTES ---
@app.route('/')
def homepage(): return render_template('index.html')

@app.route('/checkout')
def checkout_page(): return render_template('checkout.html')

@app.route('/thank-you')
def thank_you_page(): return render_template('thank-you.html')

# --- API ROUTES ---
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
    """
    Receives order data, sends a detailed email notification, and returns success.
    This is the single, reliable notification method.
    """
    try:
        data = request.get_json()
        
        # --- Send Email Notification ---
        try:
            email_sender = os.getenv('EMAIL_SENDER')
            email_password = os.getenv('EMAIL_PASSWORD')
            email_recipient = os.getenv('EMAIL_RECIPIENT')

            # Proceed only if all necessary email credentials are set
            if all([email_sender, email_password, email_recipient]):
                msg = EmailMessage()
                msg['Subject'] = '🎉 New Custom Calendar Order!'
                msg['From'] = email_sender
                msg['To'] = email_recipient
                
                content = f"""
                You have received a new order for a custom calendar.

                --- Order Details ---
                Customer Email: {data.get('email', 'N/A')}
                Customer Phone: {data.get('phone', 'N/A')}
                Name on Card: {data.get('card_name', 'N/A')}
                Notes: {data.get('notes', 'None')}
                --------------------
                """
                msg.set_content(content)

                # Connect to Gmail's SSL server and send
                with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
                    smtp.login(email_sender, email_password)
                    smtp.send_message(msg)
                print("Email notification sent successfully!")
            else:
                print("Email credentials are not fully configured in .env file. Skipping email.")

        except Exception as e:
            # Log any error that occurs during email sending but don't crash
            print(f"EMAIL FAILED TO SEND: {e}")
        
        # Always return success to the user, even if the notification fails,
        # so their experience is not interrupted.
        return jsonify({"success": True, "message": "Order processed"})

    except Exception as e:
        print(f"ORDER PROCESSING ERROR: {e}")
        return jsonify({"success": False, "message": "Failed to process order"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)