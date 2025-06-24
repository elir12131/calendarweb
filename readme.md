# Custom Jewish Calendar Generator

This is a web application built with Python (Flask) and JavaScript that generates a custom Jewish calendar for September 2025. It allows users to input multiple US zipcodes to dynamically fetch and display local candle-lighting and Havdalah times.

## Features

-   Displays a full-month calendar for September 2025.
-   Hardcoded base data for holidays, Parsha readings, and Hebrew dates.
-   Client-side API calls to Hebcal.com to fetch times for any valid US zipcode.
-   Converts zipcodes to state abbreviations for a clean display (e.g., "11213" -> "NY").
-   Fully responsive design for desktop and mobile, with an interactive scrollbar for the calendar on smaller screens.
-   A checkout page that sends an email notification upon "purchase."

## Setup and Installation

To run this project locally, you will need Python 3 installed.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install the required packages:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create the environment file:**
    Create a file named `.env` in the root of the project directory. This file holds the secret credentials for the email notification system. Add the following variables and replace the placeholder values with your own:

    ```
    # .env file
    EMAIL_SENDER=your_email@gmail.com
    EMAIL_PASSWORD=your_16_character_app_password
    EMAIL_RECIPIENT=your_notification_email@example.com
    ```
    **Note:** This `.env` file is listed in `.gitignore` and will not be committed to the repository for security reasons.

5.  **Run the application:**
    ```bash
    python app.py
    ```
    The application will be available at `http://127.0.0.1:5000`.