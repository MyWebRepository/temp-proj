import { css, html, LitElement } from 'lit-element';

export const DefaultMonthNames = [
  'January', 'Febuary', 'Match', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
export const DefaultLongWeekDayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];
export const DefaultShortWeekDayNames = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

export const fromAttribute = attr => attr.split(',');
export const toAttribute = prop => prop.join(',');

export class UsrCalender extends LitElement {
  static get styles() {
    return [

    ];
  }

  static get properties() {
    return {
      value: { type: String },
      monthNames: { 
        reflect: false,
        attribute: 'month-names',
        converter: { fromAttribute, toAttribute },
      },
      longWeekDayNames: { 
        reflect: false,
        attribute: 'long-weekday-names',
        converter: { fromAttribute, toAttribute },
      },
      shortWeekDayNames: { 
        reflect: false,
        attribute: 'short-weekday-names',
        converter: { fromAttribute, toAttribute },
      }
    }
  }

  constructor() {
    super();

    Date.prototype.getWeek = function() {
      let date = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((((this - date) / 86400000) + date.getDay() +1 ) / 7);
    };

    // Observables
    this.monthNames = DefaultMonthNames;
    this.longWeekDayNames = DefaultLongWeekDayNames;
    this.shortWeekDayNames = DefaultShortWeekDayNames;

    // Non-observables
    let parts = this._calenderParts;
    this.year = parts.year;
    this.month = this.monthNames[parts.month];
    this.day = parts.day;
    this.dayOfWeek = this.shortWeekDayNames[parts.dayOfWeek];
    this.week = parts.week; 
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    return html`
      <div>
        <div>
          <span>${this.year}-${this.month}-${this.day}-${this.dayOfWeek}-${this.week}</span>
        </div>
        <div>
          <span>&#9664;</span>
          <span>&#9724;</span>
          <span>&#9658;</span>
        </div>
        <div>
        </div>
      </div>
    `;
  }

  get _calenderParts() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let dayOfWeek = date.getDay();
    let week = date.getWeek();

    return { year, month, day, dayOfWeek, week };
  }
}

window.customElements.define('usr-calendar', UsrCalender);