// Helper function to calculate the duration between a given time and the current time
// It returns an object with the unit and the value of the duration
// The unit can be: year, month, week, day, hour, minute, second
// The value is a positive or negative integer

function duration(time) {
  const now = new Date();
  const date = new Date(time);
  const sign = Math.sign(now - date);
  const diff = Math.abs(now - date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  if (years > 0) {
    return { unit: "year", value: -sign * years };
  } else if (months > 0) {
    return { unit: "month", value: -sign * months };
  } else if (weeks > 0) {
    return { unit: "week", value: -sign * weeks };
  } else if (days > 0) {
    return { unit: "day", value: -sign * days };
  } else if (hours > 0) {
    return { unit: "hour", value: -sign * hours };
  } else if (minutes > 0) {
    return { unit: "minute", value: -sign * minutes };
  } else if (seconds >= 0) {
    return { unit: "second", value: -sign * seconds };
  }
}

class RelativeTime extends HTMLTimeElement {
  static get observedAttributes() {
    return ['datetime', 'format'];
  }

  constructor() {
    super();
    this.updateTime();
  }

  get datetime() {
    return this.getAttribute('datetime');
  }

  set datetime(value) {
    this.setAttribute('datetime', value);
  }

  get format() {
    return this.getAttribute('format');
  }

  set format(value) {
    this.setAttribute('format', value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.updateTime();
    }
  }

  updateTime() {
    const date = new Date(this.datetime);
    const lang = this.closest('[lang]')?.getAttribute('lang') || 'en';
    if (this.format === 'absolute') {
      this.textContent = new Intl.DateTimeFormat(lang).format(date);
    } else if (this.format === 'relative') {
      const { unit, value } = duration(date);
      this.textContent = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(value, unit);
    }
  }
}

customElements.define('relative-time', RelativeTime, { extends: 'time' });
