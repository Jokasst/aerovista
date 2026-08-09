// ==========================================================================
// Переключение вкладок в форме поиска (Book a flight / Stopover / Manage / Status)
// ==========================================================================
document.querySelectorAll('.search-card__tabs').forEach((tabs) => {
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.search-card__tab');
    if (!btn) return;
    tabs.querySelectorAll('.search-card__tab').forEach((t) => t.classList.remove('search-card__tab--active'));
    btn.classList.add('search-card__tab--active');
  });
});

// ==========================================================================
// Переключение вкладок Vienna Duty Free / Starlink Wi-Fi / Bsuite
// ==========================================================================
document.querySelectorAll('.feature-tabs__nav').forEach((nav) => {
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.feature-tabs__link');
    if (!btn) return;
    nav.querySelectorAll('.feature-tabs__link').forEach((t) => t.classList.remove('feature-tabs__link--active'));
    btn.classList.add('feature-tabs__link--active');
  });
});

// ==========================================================================
// Мобильное меню
// ==========================================================================
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('nav--open');
  });
}

// ==========================================================================
// Swap From / To в форме поиска рейсов
// ==========================================================================
const fromInput = document.getElementById('fromInput');
const toInput = document.getElementById('toInput');
const swapBtn = document.querySelector('.search-card__swap');

if (swapBtn && fromInput && toInput) {
  swapBtn.addEventListener('click', () => {
    [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
  });
}

// ==========================================================================
// Panel Passengers / Class (в форме поиска рейсов)
// ==========================================================================
const passTrigger = document.getElementById('passengersTrigger');
const passPanel = document.getElementById('passengersPanel');
const passValue = document.getElementById('passengersValue');
const passDone = document.getElementById('passengersDone');

if (passTrigger && passPanel && passValue) {
  let counts = { adults: 1, children: 0 };
  let selectedClass = 'First class';

  function updatePassengersLabel() {
    const total = counts.adults + counts.children;
    const label = total === 1 ? 'Passenger' : 'Passengers';
    passValue.textContent = `${total} ${label} / ${selectedClass}`;
  }

  passTrigger.addEventListener('click', () => {
    passPanel.classList.toggle('passengers-panel--open');
  });

  passPanel.querySelectorAll('.passengers-panel__btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target; // 'adults' или 'children'
      const action = btn.dataset.action; // 'increase' или 'decrease'

      if (action === 'increase') {
        counts[target]++;
      } else if (target === 'adults' && counts.adults > 1) {
        counts.adults--; // минимум 1 взрослый
      } else if (target === 'children' && counts.children > 0) {
        counts.children--;
      }

      const countEl = document.getElementById(`${target}Count`);
      if (countEl) countEl.textContent = counts[target];
      updatePassengersLabel();
    });
  });

  passPanel.querySelectorAll('.passengers-panel__class').forEach((btn) => {
    btn.addEventListener('click', () => {
      passPanel.querySelectorAll('.passengers-panel__class').forEach((b) => b.classList.remove('passengers-panel__class--active'));
      btn.classList.add('passengers-panel__class--active');
      selectedClass = btn.dataset.class;
      updatePassengersLabel();
    });
  });

  if (passDone) {
    passDone.addEventListener('click', () => {
      passPanel.classList.remove('passengers-panel--open');
    });
  }

  document.addEventListener('click', (e) => {
    if (!passTrigger.contains(e.target) && !passPanel.contains(e.target)) {
      passPanel.classList.remove('passengers-panel--open');
    }
  });
}

// ==========================================================================
// Destinations — Return / One way (переключает даты на карточках городов)
// ==========================================================================
document.querySelectorAll('.destinations__toggle').forEach((toggle) => {
  toggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.destinations__toggle-btn');
    if (!btn) return;

    toggle.querySelectorAll('.destinations__toggle-btn').forEach((t) => t.classList.remove('destinations__toggle-btn--active'));
    btn.classList.add('destinations__toggle-btn--active');

    const isOneWay = btn.textContent.trim() === 'One way';

    document.querySelectorAll('.destination-card__dates').forEach((dateEl) => {
      const fullDates = dateEl.dataset.dates; // "05 Aug 2026 – 07 Aug 2026"
      if (!fullDates) return;

      if (isOneWay) {
        const departureOnly = fullDates.split('–')[0].trim();
        dateEl.textContent = departureOnly;
      } else {
        dateEl.textContent = fullDates;
      }
    });
  });
});

// ==========================================================================
// Destinations — редактируемое поле "From"
// ==========================================================================
document.querySelectorAll('.destinations__edit-icon').forEach((icon) => {
  icon.addEventListener('click', () => {
    const input = icon.closest('.destinations__from').querySelector('.destinations__from-input');
    if (!input) return;
    input.focus();
    input.select();
  });
});

// ==========================================================================
// Destinations — Class dropdown (Economy / Business / First class)
// ==========================================================================
const classTrigger = document.getElementById('classDropdownTrigger');
const classMenu = document.getElementById('classDropdownMenu');
const classValue = document.getElementById('classDropdownValue');

if (classTrigger && classMenu && classValue) {
  const classOptions = classMenu.querySelectorAll('.destinations__class-option');

  classTrigger.addEventListener('click', () => {
    const isOpen = classMenu.classList.toggle('destinations__class-menu--open');
    classTrigger.setAttribute('aria-expanded', isOpen);
  });

  classOptions.forEach((option) => {
    option.addEventListener('click', () => {
      const selected = option.dataset.value; // "Economy" / "Business" / "First class"

      // обновляем видимый текст в dropdown
      classValue.textContent = selected;

      // обновляем чекмарки
      classOptions.forEach((o) => {
        o.classList.remove('destinations__class-option--selected');
        const check = o.querySelector('.destinations__class-check');
        if (check) check.textContent = '';
      });
      option.classList.add('destinations__class-option--selected');
      const check = option.querySelector('.destinations__class-check');
      if (check) check.textContent = '✓';

      // обновляем класс на всех карточках направлений
      document.querySelectorAll('.destination-card__class').forEach((classEl) => {
        classEl.textContent = selected;
      });

      // закрываем меню
      classMenu.classList.remove('destinations__class-menu--open');
      classTrigger.setAttribute('aria-expanded', false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!classTrigger.contains(e.target) && !classMenu.contains(e.target)) {
      classMenu.classList.remove('destinations__class-menu--open');
      classTrigger.setAttribute('aria-expanded', false);
    }
  });
}

const returnField = document.getElementById('returnField');
const multicityFields = document.getElementById('multicityFields');

document.querySelectorAll('input[name="trip-type"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const value = radio.nextElementSibling.textContent.trim(); // "Return" / "One way" / "Multi-city"

    if (value === 'One way') {
      returnField.style.display = 'none';
      multicityFields.classList.remove('search-card__multicity--visible');
    } else if (value === 'Multi-city') {
      returnField.style.display = 'none';
      multicityFields.classList.add('search-card__multicity--visible');
    } else {
      // Return
      returnField.style.display = '';
      multicityFields.classList.remove('search-card__multicity--visible');
    }
  });
});

// Кнопка "+ Add city" — добавляет ещё одно поле города
document.getElementById('addCityBtn').addEventListener('click', () => {
  const newField = document.createElement('div');
  newField.className = 'search-field';
  newField.innerHTML = `
    <label>Add another city</label>
    <input type="text" placeholder="e.g. London LHR">
  `;
  document.getElementById('addCityBtn').before(newField);
});

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

let currentView = new Date(2026, 2, 1); // март 2026
let activeField = null; // 'departure' или 'return'

const calendarPopup = document.getElementById('calendarPopup');
const calendarDays = document.getElementById('calendarDays');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const departureTrigger = document.getElementById('departureTrigger');
const returnTrigger = document.getElementById('returnTrigger');

function renderCalendar() {
  calendarMonthLabel.textContent = `${monthNames[currentView.getMonth()]} ${currentView.getFullYear()}`;
  calendarDays.innerHTML = '';

  const firstDay = new Date(currentView.getFullYear(), currentView.getMonth(), 1);
  const daysInMonth = new Date(currentView.getFullYear(), currentView.getMonth() + 1, 0).getDate();

  // День недели первого числа (0=вс, переводим на пн=0)
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('span');
    empty.className = 'calendar-popup__day calendar-popup__day--empty';
    calendarDays.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calendar-popup__day';
    btn.textContent = day;
    btn.addEventListener('click', () => selectDate(day));
    calendarDays.appendChild(btn);
  }
}

function selectDate(day) {
  const formatted = `${String(day).padStart(2, '0')} ${monthNames[currentView.getMonth()].slice(0,3)} ${currentView.getFullYear()}`;

  if (activeField === 'departure') {
    departureTrigger.textContent = formatted;
  } else if (activeField === 'return') {
    returnTrigger.textContent = formatted;
  }

  calendarPopup.classList.remove('calendar-popup--open');
}

function openCalendar(triggerEl) {
  activeField = triggerEl === departureTrigger ? 'departure' : 'return';

  const fieldsContainer = document.querySelector('.search-card__fields');
  const fieldsRect = fieldsContainer.getBoundingClientRect();
  const triggerRect = triggerEl.getBoundingClientRect();

  const leftOffset = triggerRect.left - fieldsRect.left;
  calendarPopup.style.left = `${leftOffset}px`;

  calendarPopup.classList.toggle('calendar-popup--open');
  renderCalendar();
}

departureTrigger.addEventListener('click', () => openCalendar(departureTrigger));
returnTrigger.addEventListener('click', () => openCalendar(returnTrigger));

document.getElementById('calendarPrev').addEventListener('click', () => {
  currentView.setMonth(currentView.getMonth() - 1);
  renderCalendar();
});

document.getElementById('calendarNext').addEventListener('click', () => {
  currentView.setMonth(currentView.getMonth() + 1);
  renderCalendar();
});

document.addEventListener('click', (e) => {
  if (!calendarPopup.contains(e.target) && e.target !== departureTrigger && e.target !== returnTrigger) {
    calendarPopup.classList.remove('calendar-popup--open');
  }
});

const promoToggle = document.getElementById('promoToggle');
const promoInput = document.getElementById('promoInput');
const promoSuccess = document.getElementById('promoSuccess');

if (promoToggle && promoInput && promoSuccess) {
  promoToggle.addEventListener('click', () => {
    promoToggle.style.display = 'none';
    promoInput.classList.add('search-card__promo-input--visible');
    promoInput.focus();
  });

  promoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && promoInput.value.trim() !== '') {
      e.preventDefault(); // не даём форме случайно отправиться
      promoInput.classList.remove('search-card__promo-input--visible');
      promoSuccess.classList.add('search-card__promo-success--visible');
    }
  });

  promoInput.addEventListener('blur', () => {
    if (promoInput.value.trim() === '') {
      promoInput.classList.remove('search-card__promo-input--visible');
      promoToggle.style.display = 'flex';
    }
  });

  promoSuccess.addEventListener('click', () => {
    promoSuccess.classList.remove('search-card__promo-success--visible');
    promoInput.classList.add('search-card__promo-input--visible');
    promoInput.focus();
  });
}

let airportsData = [];
let airportsLoaded = false;

async function loadAirports() {
  if (airportsLoaded) return;
  try {
    const res = await fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json');
    const data = await res.json();
    airportsData = Object.values(data).filter(a => a.iata && a.iata.trim() !== '' && a.city);
    airportsLoaded = true;
  } catch (err) {
    console.error('Не удалось загрузить базу аэропортов', err);
  }
}

loadAirports();

const planeIcon = `
  <svg class="airport-suggestion__icon" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5799 4.40039C12.4661 4.40039 12.0847 4.40314 11.9773 4.40864L9.80427 4.4554C9.79298 4.45597 9.78171 4.45395 9.77172 4.44958C9.76174 4.44522 9.75342 4.43866 9.74769 4.43065L5.4091 0.0979087C5.38278 0.0692945 5.34921 0.045719 5.31071 0.0288137C5.2722 0.0119083 5.22969 0.002077 5.18611 0H4.28578L6.72996 4.4279C6.73579 4.43803 6.73831 4.44924 6.73727 4.46042C6.73623 4.47159 6.73168 4.48236 6.72404 4.49165C6.71641 4.50094 6.70597 4.50845 6.69374 4.51342C6.68151 4.5184 6.66791 4.52067 6.65429 4.52003L2.57987 4.56953C2.53747 4.57059 2.49537 4.56342 2.45697 4.5486C2.41858 4.53379 2.38497 4.51175 2.35889 4.48427L1.12006 3.24666C1.01961 3.13941 0.831443 3.08165 0.667716 3.08165H0.0362466C-0.00694516 3.08165 -0.000583587 3.11493 0.0111351 3.14848L0.675417 5.11271C0.72563 5.2179 0.72563 5.33479 0.675417 5.43998L0.0104654 7.39816C-0.00928891 7.45179 -0.00694516 7.48067 0.0697285 7.48067H0.669725C0.942268 7.48067 0.979433 7.45151 1.11872 7.3074L2.38099 6.05054C2.4073 6.02327 2.44095 6.00139 2.47929 5.9866C2.51763 5.9718 2.55962 5.96451 2.60197 5.96528L6.64257 6.03954C6.65728 6.03981 6.67169 6.04303 6.68454 6.04892C6.69739 6.05481 6.7083 6.06318 6.71632 6.07332C6.72434 6.08345 6.72922 6.09505 6.73055 6.10708C6.73187 6.11912 6.7296 6.13124 6.72393 6.1424L4.28578 10.5609H5.17773C5.22123 10.5589 5.26367 10.5491 5.30211 10.5322C5.34055 10.5153 5.37408 10.4918 5.40039 10.4633L9.74802 6.13305C9.76108 6.11655 9.81498 6.10829 9.83809 6.10829L11.9776 6.15505C12.0881 6.16055 12.4661 6.1633 12.5803 6.1633C14.0625 6.1633 15 5.82859 15 5.28047C15 4.73235 14.0665 4.40039 12.5799 4.40039Z" fill="currentColor"/>
  </svg>
`;

function getRandomAirports(count) {
  const shuffled = [...airportsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function setupAirportAutocomplete(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestionsBox = document.getElementById(suggestionsId);
  if (!input || !suggestionsBox) return;

  const popularCodes = ['ALA', 'VIE', 'KBP', 'LHR', 'BUS', 'JFK', 'DXB', 'CPH'];

  function renderSuggestions(query) {
    let filtered;

    if (!query) {
      // Случайные 8 из полной базы (~28 000 аэропортов)
      filtered = getRandomAirports(8);
    } else {
      filtered = airportsData
        .filter(a => a.city.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 8);
    }

    if (filtered.length === 0) {
      suggestionsBox.innerHTML = '<div class="airport-suggestions__group-label">No matches</div>';
      return;
    }

    suggestionsBox.innerHTML = `
      <div class="airport-suggestions__group-label">${query ? 'Suggestions' : 'Explore destinations'}</div>
      ${filtered.map(a => `
        <div class="airport-suggestion" data-city="${a.city}" data-code="${a.iata}">
          ${planeIcon}
          <div class="airport-suggestion__body">
            <div class="airport-suggestion__top">
              <span class="airport-suggestion__city">${a.city}, ${a.country}</span>
              <span class="airport-suggestion__code">${a.iata}</span>
            </div>
            <div class="airport-suggestion__airport">${a.name}</div>
          </div>
        </div>
      `).join('')}
    `;

    suggestionsBox.querySelectorAll('.airport-suggestion').forEach(item => {
      item.addEventListener('click', () => {
        input.value = `${item.dataset.city} ${item.dataset.code}`;
        suggestionsBox.classList.remove('airport-suggestions--open');
      });
    });
  }

  input.addEventListener('focus', () => {
    renderSuggestions(input.value);
    suggestionsBox.classList.add('airport-suggestions--open');
  });

  input.addEventListener('input', () => {
    renderSuggestions(input.value);
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.classList.remove('airport-suggestions--open');
    }
  });
}

setupAirportAutocomplete('fromInput', 'fromSuggestions');
setupAirportAutocomplete('toInput', 'toSuggestions');

