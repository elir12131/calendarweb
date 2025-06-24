// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT REFERENCES ---
    const calendarContainer = document.getElementById('calendar-container');
    const hiddenRenderContainer = document.getElementById('hidden-render-container');
    const calendarDisplayArea = document.getElementById('calendar-display-area');
    const updateBtn = document.getElementById('update-calendar-btn');
    const addZipBtn = document.getElementById('add-zip-btn');
    const zipInputsContainer = document.getElementById('zipcode-inputs');
    const addBirthdayBtn = document.getElementById('add-birthday-btn');
    const purchaseBtn = document.getElementById('add-to-cart-btn');
    const modal = document.getElementById('image-modal');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    let fullCalendarData = null;

    const zipToStateMap = { "010": "MA", "011": "MA", "012": "MA", "013": "MA", "014": "MA", "015": "MA", "016": "MA", "017": "MA", "018": "MA", "019": "MA", "020": "MA", "021": "MA", "022": "MA", "023": "MA", "024": "MA", "025": "MA", "026": "MA", "027": "MA", "028": "RI", "029": "RI","060": "CT", "061": "CT", "062": "CT", "063": "CT", "064": "CT", "065": "CT", "066": "CT", "067": "CT", "068": "CT", "069": "CT","100": "NY", "101": "NY", "102": "NY", "103": "NY", "104": "NY", "109": "NY", "110": "NY", "111": "NY", "112": "NY", "113": "NY", "114": "NY", "115": "NY", "116": "NY", "117": "NY", "118": "NY", "119": "NY", "120": "NY", "121": "NY", "122": "NY", "123": "NY", "124": "NY", "125": "NY", "126": "NY", "127": "NY", "128": "NY", "129": "NY", "130": "NY", "131": "NY", "132": "NY", "133": "NY", "134": "NY", "135": "NY", "136": "NY", "137": "NY", "138": "NY", "139": "NY", "140": "NY", "141": "NY", "142": "NY", "143": "NY", "144": "NY", "145": "NY", "146": "NY", "147": "NY", "148": "NY", "149": "NY","190": "PA", "191": "PA", "192": "PA", "193": "PA", "194": "PA", "195": "PA", "196": "PA","200": "DC", "201": "VA", "202": "DC", "203": "DC", "204": "DC", "205": "DC", "206": "MD", "207": "MD", "208": "MD", "209": "MD", "210": "MD", "211": "MD", "212": "MD","300": "GA", "301": "GA", "303": "GA","330": "FL", "331": "FL", "332": "FL", "333": "FL","440": "OH", "441": "OH","600": "IL", "601": "IL", "602": "IL", "603": "IL", "604": "IL", "605": "IL", "606": "IL", "607": "IL", "608": "IL","750": "TX", "751": "TX", "752": "TX", "753": "TX", "754": "TX", "770": "TX", "772": "TX","800": "CO", "801": "CO", "802": "CO","850": "AZ", "852": "AZ", "853": "AZ","900": "CA", "902": "CA", "903": "CA", "904": "CA", "905": "CA", "906": "CA", "907": "CA", "908": "CA", "910": "CA", "911": "CA", "912": "CA", "913": "CA", "914": "CA", "915": "CA", "916": "CA", "917": "CA", "918": "CA", "920": "CA", "921": "CA", "940": "CA", "941": "CA", "942": "CA", "943": "CA", "944": "CA","980": "WA", "981": "WA"};
    let locationColors = {};
    let nextColorIndex = 0;
    const customColors = ['#5bc0de', '#5cb85c', '#f0ad4e', '#6f42c1', '#d9534f', '#4a90e2', '#2a9d8f', '#e76f51'];
    let sampleBirthdayCount = 0;

    function getStateForZip(zipcode) { if (typeof zipcode === 'string' && zipcode.length >= 3) { const prefix = zipcode.substring(0, 3); return zipToStateMap[prefix] || zipcode; } return zipcode; }
    function getLocationStyling(zipcode) { if (!locationColors[zipcode]) { locationColors[zipcode] = customColors[nextColorIndex % customColors.length]; nextColorIndex++; } return `background-color: ${locationColors[zipcode]};`; }

    function renderCalendar(calendarData, container) {
        locationColors = {};
        nextColorIndex = 0;
        container.innerHTML = '';
        const monthKey = Object.keys(calendarData)[0];
        if (!monthKey) return;
        
        calendarDisplayArea.style.display = 'block';
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => { const headerCell = document.createElement('div'); headerCell.className = 'weekday-header'; headerCell.textContent = day; grid.appendChild(headerCell); });
        
        const month = calendarData[monthKey];
        month.weeks.forEach(week => { week.forEach(dayData => { const cell = document.createElement('div'); cell.className = 'day-cell'; if (dayData) { if (dayData.is_shabbat) cell.classList.add('is-shabbat'); if (dayData.is_holiday) cell.classList.add('is-holiday'); const mainContent = document.createElement('div'); mainContent.className = 'day-main-content'; const timesContainer = document.createElement('div'); timesContainer.className = 'day-times-container'; mainContent.innerHTML = `<div class="day-header"><span class="gregorian-day">${dayData.gregorian_day}</span><span class="hebrew-date">${dayData.hebrew_date}</span></div><div class="events-list">${dayData.events.join('<br>')}</div>`; if (dayData.times && dayData.times.length > 0) { dayData.times.sort((a, b) => a.loc.localeCompare(b.loc)); const timesList = document.createElement('div'); timesList.className = 'times-list'; dayData.times.forEach(timeItem => { const timeEl = document.createElement('span'); timeEl.className = 'time-item'; timeEl.style = getLocationStyling(timeItem.loc); const stateAbbr = getStateForZip(timeItem.loc); timeEl.textContent = `${stateAbbr}: ${timeItem.time}`; timesList.appendChild(timeEl); }); timesContainer.appendChild(timesList); } cell.appendChild(mainContent); cell.appendChild(timesContainer); } else { cell.classList.add('empty'); } grid.appendChild(cell); }); });
        container.appendChild(grid);
    }

    async function fetchAndRenderAll() {
        calendarContainer.innerHTML = '<div class="spinner"></div>';
        try {
            let response = await fetch('/api/get-base-calendar');
            if (!response.ok) throw new Error('Failed to fetch base calendar');
            fullCalendarData = await response.json();
            const zipInputs = document.querySelectorAll('.zip-input');
            const zipcodes = [...new Set(Array.from(zipInputs).map(input => input.value.trim()).filter(Boolean))];
            const timePromises = zipcodes.map(zip => { const url = `https://www.hebcal.com/hebcal?v=1&cfg=json&zip=${zip}&start=2025-09-01&end=2025-09-30&c=on`; return fetch(url).then(res => res.json()); });
            const allTimesData = await Promise.all(timePromises);
            allTimesData.forEach(zipData => { if (zipData.items && zipData.location && zipData.location.zip) { const location = zipData.location.zip; zipData.items.forEach(item => { if (item.category === 'candles' || item.category === 'havdalah') { const timeObj = new Date(item.date); const timeStr = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); const day = timeObj.getDate(); for (const week of fullCalendarData['2025-09'].weeks) { for (const dayData of week) { if (dayData && dayData.gregorian_day === day) { dayData.times.push({ loc: location, time: timeStr }); } } } } }); } });
            
            // Render both the visible preview and the hidden full-size calendar
            renderCalendar(fullCalendarData, calendarContainer);
            renderCalendar(fullCalendarData, hiddenRenderContainer);
            
            handleResize();
        } catch (error) {
            console.error("Failed to fetch calendar data:", error);
            calendarContainer.innerHTML = `<p style="text-align:center; color:red;">Could not load calendar data.</p>`;
        }
    }
    
    function addZipcodeField(value = '') { const newInput = document.createElement('input'); newInput.type = 'text'; newInput.className = 'zip-input'; newInput.placeholder = 'e.g., 90210'; newInput.setAttribute('maxlength', 5); newInput.value = value; zipInputsContainer.appendChild(newInput); if (!value) newInput.focus(); }
    function addSampleBirthday() { if (sampleBirthdayCount >= 4) return; const availableLists = Array.from(document.querySelectorAll('.events-list')); if (availableLists.length === 0) return; const randomList = availableLists[Math.floor(Math.random() * availableLists.length)]; const birthdayEl = document.createElement('div'); birthdayEl.className = 'sample-birthday'; birthdayEl.textContent = 'Happy Birthday!'; randomList.appendChild(birthdayEl); sampleBirthdayCount++; if (sampleBirthdayCount >= 4) { addBirthdayBtn.disabled = true; addBirthdayBtn.textContent = "Max Samples Added"; } }
    
    // --- MODAL AND RESIZE LOGIC ---
    function openModal() {
        modalContent.innerHTML = '<div class="spinner"></div>';
        modal.classList.add('active');
        // Use a small delay to ensure the hidden container is ready
        setTimeout(() => {
            html2canvas(hiddenRenderContainer.querySelector('.calendar-grid'), { scale: 2 }) // Use scale for higher resolution
                .then(canvas => {
                    modalContent.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = canvas.toDataURL('image/png');
                    img.className = 'modal-screenshot';
                    modalContent.appendChild(img);
                });
        }, 50);
    }
    function closeModal() { modal.classList.remove('active'); }
    function handleResize() {
        if (window.innerWidth <= 991) {
            calendarContainer.classList.add('mobile-preview');
        } else {
            calendarContainer.classList.remove('mobile-preview');
        }
    }

    calendarContainer.addEventListener('click', () => { if (calendarContainer.classList.contains('mobile-preview')) { openModal(); } });
    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) { closeModal(); } });
    
    updateBtn.addEventListener('click', fetchAndRenderAll);
    addZipBtn.addEventListener('click', () => addZipcodeField());
    addBirthdayBtn.addEventListener('click', addSampleBirthday);
    purchaseBtn.addEventListener('click', () => { window.location.href = '/checkout'; });
    
    window.addEventListener('resize', handleResize);
    addZipcodeField();
    fetchAndRenderAll();
});