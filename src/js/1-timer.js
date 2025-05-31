import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { convertMs } from './convertMs';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  dateInput: document.querySelector('#datetime-picker'),
  daysSpan: document.querySelector('[data-days]'),
  hoursSpan: document.querySelector('[data-hours]'),
  minutesSpan: document.querySelector('[data-minutes]'),
  secondsSpan: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];
    if (selected <= new Date()) {
      showAlert('Please choose a date in the future', 'red');
      refs.startBtn.disabled = true;
    } else {
      userSelectedDate = selected;
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.dateInput, options);

refs.startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.dateInput.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateDisplay(0);
      refs.dateInput.disabled = false;
      return;
    }

    updateDisplay(diff);
  }, 1000);
});

function updateDisplay(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  refs.daysSpan.textContent = addLeadingZero(days);
  refs.hoursSpan.textContent = addLeadingZero(hours);
  refs.minutesSpan.textContent = addLeadingZero(minutes);
  refs.secondsSpan.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

export function showAlert(message, color = 'red') {
  iziToast.show({
    message,
    position: 'topRight',
    color,
    timeout: 3000,
  });
}
