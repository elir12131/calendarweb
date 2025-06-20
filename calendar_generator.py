# Save this file as: calendar_generator.py

import collections
from datetime import datetime
import copy

# --- BASE DATA IS HARDCODED FOR RELIABILITY AND SPEED ---

HARDCODED_EVENTS = {
    "2025-09-06": {"type": "parasha", "title": "Ki Teitzei"},
    "2025-09-13": {"type": "parasha", "title": "Ki Tavo"},
    "2025-09-20": {"type": "parasha", "title": "Nitzavim"},
    "2025-09-22": {"type": "holiday", "title": "Erev Rosh Hashana"},
    "2025-09-23": {"type": "holiday", "title": "Rosh Hashana 5786"},
    "2025-09-24": {"type": "holiday", "title": "Rosh Hashana II"},
    "2025-09-25": {"type": "holiday", "title": "Fast of Gedaliah"},
    "2025-09-27": {"type": "parasha", "title": "Vayeilech"},
}

HARDCODED_HEBREW_DATES = {
    1: "6 Elul", 2: "7 Elul", 3: "8 Elul", 4: "9 Elul", 5: "10 Elul", 6: "11 Elul", 7: "12 Elul", 
    8: "13 Elul", 9: "14 Elul", 10: "15 Elul", 11: "16 Elul", 12: "17 Elul", 13: "18 Elul", 14: "19 Elul",
    15: "20 Elul", 16: "21 Elul", 17: "22 Elul", 18: "23 Elul", 19: "24 Elul", 20: "25 Elul", 21: "26 Elul",
    22: "27 Elul", 23: "1 Tishrei", 24: "2 Tishrei", 25: "3 Tishrei", 26: "4 Tishrei", 27: "5 Tishrei",
    28: "6 Tishrei", 29: "7 Tishrei", 30: "8 Tishrei"
}

def _create_base_calendar_template():
    """Builds the master calendar template with all non-time-sensitive data."""
    calendar = collections.OrderedDict()
    month_key = "2025-09"
    calendar[month_key] = {"month_name": "September", "year": 2025, "weeks": []}
    
    first_day = datetime(2025, 9, 1)
    start_weekday = (first_day.weekday() + 1) % 7
    week = [None] * start_weekday

    for day in range(1, 31):
        date_key = f"2025-09-{day:02d}"
        day_data = {
            "gregorian_day": day,
            "is_shabbat": datetime(2025, 9, day).weekday() == 5,
            "is_holiday": False,
            "hebrew_date": HARDCODED_HEBREW_DATES.get(day, ""),
            "events": [],
            "times": [] # Times will be added by JavaScript
        }
        event = HARDCODED_EVENTS.get(date_key)
        if event:
            day_data['events'].append(event['title'])
            if event['type'] == 'holiday':
                day_data['is_holiday'] = True
        week.append(day_data)
        if len(week) == 7:
            calendar[month_key]['weeks'].append(week)
            week = []
    if week:
        week.extend([None] * (7 - len(week)))
        calendar[month_key]['weeks'].append(week)
    return calendar

# The base calendar is created ONCE when the app starts.
_BASE_CALENDAR = _create_base_calendar_template()

def get_base_calendar():
    """
    Returns a fresh, clean copy of the base calendar for a new web request.
    This is now the ONLY function needed by the app.
    """
    return copy.deepcopy(_BASE_CALENDAR)