# Save this file as: app.py
from flask import Flask, render_template, jsonify
import calendar_generator
from whitenoise import WhiteNoise # <--- IMPORT WHITENOISE

# --- App Initialization ---
app = Flask(__name__)

# --- WHITENOISE CONFIGURATION ---
# This is the crucial line that makes your CSS and JS files work on Render.
# It tells WhiteNoise to look in the "static/" folder for these files.
app.wsgi_app = WhiteNoise(app.wsgi_app, root="static/")


# --- API Routes ---
@app.route('/')
def homepage():
    """This route serves the main calendar page."""
    return render_template('index.html')

@app.route('/checkout')
def checkout_page():
    """NEW: This route serves the checkout page."""
    return render_template('checkout.html')

@app.route('/api/get-base-calendar')
def get_base_calendar_api():
    """
    This endpoint's ONLY job is to return the pre-built base calendar
    with holidays and dates. It does no processing and makes no network calls.
    """
    try:
        base_calendar = calendar_generator.get_base_calendar()
        return jsonify(base_calendar)
    except Exception as e:
        print(f"SERVER-ERROR: An unexpected error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# --- This part is only for local development ---
if __name__ == '__main__':
    # When you run this file directly, it uses the standard Flask server.
    # When Render runs it with Gunicorn, this part is ignored.
    app.run(debug=True, port=5000)
