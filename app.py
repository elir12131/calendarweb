# Save this file as: app.py
from flask import Flask, render_template, jsonify
import calendar_generator

app = Flask(__name__)

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
    """This endpoint provides the base calendar data."""
    try:
        base_calendar = calendar_generator.get_base_calendar()
        return jsonify(base_calendar)
    except Exception as e:
        print(f"SERVER-ERROR: An unexpected error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)