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
      css`:host {
        display: inline-block;
        border: solid 1px gray;
        padding: 5px 5px 5px 5px;
      }`,
      css`:host([disabled]), :host([readonly]),
        :host([disabled]) *, :host([readonly]) * {
        background-color: lightgray;
      }`,
      css`:host(.usr-focus) {
        outline: 2px solid var(--usr-outline-color, lightblue);
      }`,
      css`.container {
        display: line-block;
        overflow: hidden;
      }`,
      css`.upper-container {
        display: flex;
        flex-direction: column
        overflow: hidden;
        border: solid 1px gray;
        padding: 0 0 10px 0;
      }`,
      css`.upper-container > .date {
        width: 70%;
        text-align: left;
        border: solid 1px gray;
      }`,
      css`.upper-container > .action {
        width: 30%;
        text-align: right;
        border: solid 1px gray;
      }`,
      css`.upper-container > .action > .left-arrow{
        font-size: 0.3em;
        position: relative;
        top: -2px;
        left: 2px;
      }`,
      css`.upper-container > .action > .right-arrow {
        font-size: 0.3em;
        position: relative;
        top: -2px;
      }`,
      css`span {
        border: solid 1px red;
      }`,
      css`.lower-container {
        display: line-block;
      }`,
      css`.lower-container > table {
        width: auto;
        border-collapse: collapse;
      }`,
      css`.lower-container > table th {
        width: 14.28%;
        font-weight: normal;
        text-align: center;
        border: solid 1px gray;
        padding: 5px 2px 5px 2px;
        color: white;
        background-color: #1E90FF;
      }`,
      css`.lower-container > table td {
        width: 14.28%;
        text-align: center;
        border: solid 1px gray;
        padding: 3px 2px 3px 2px;
      }`
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

    // Extends Date class with getWeek method.
    Date.prototype.getWeek = function() {
      let date = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((((this - date) / 86400000) + date.getDay() + 1) / 7);
    };

    // Observables
    this.monthNames = DefaultMonthNames;
    this.longWeekDayNames = DefaultLongWeekDayNames;
    this.shortWeekDayNames = DefaultShortWeekDayNames;

    // Non-observables
    let parts = this._yearParts;
    this.year = parts.year;
    this.month = parts.month;
    this.day = parts.day;
    this.dayOfWeek = parts.dayOfWeek;
    this.week = parts.week; 

    this.currentMonthInfo = { year: this.year, month: this.month, day: this.day };
    this.prevMonthInfo = null;
    this.nextMonthInfo = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  render() {
    return html`
      <div class="container">
        <div class="upper-container">
          <div class="date">
            <span>${this.year}-${this.monthNames[this.month]}-${this.day}-${this.shortWeekDayNames[this.dayOfWeek]}</span>
          </div>
          <div class="action">
            <span class="left-arrow">&#9664;</span>
            <span>&#9724;</span>
            <span class="right-arrow">&#9654;</span>
          </div>
        </div>
        <div class="lower-container">
          <table>
            <thead>
              <tr>
                <th>${this.shortWeekDayNames[0]}</th>
                <th>${this.shortWeekDayNames[1]}</th>
                <th>${this.shortWeekDayNames[2]}</th>
                <th>${this.shortWeekDayNames[3]}</th>
                <th>${this.shortWeekDayNames[4]}</th>
                <th>${this.shortWeekDayNames[5]}</th>
                <th>${this.shortWeekDayNames[6]}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
              </tr>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
                <td>7</td>
              </tr>
            <tbody>
          </table>
        </div>
      </div>
    `;
  }



  get _calendarDays() {
    this._setInfo();

    let calendarDays = [];
    let lastDay = -1;
    let dayOfWeek = -1;

    // Following lines populate calendarDays in current month info.
    (() => {
      let { year, month, day: thisLastDay, dayOfWeek: thisDayOfWeek } = this._getLastDay(this.currentMonthInfo);
      lastDay = thisLastDay;
      
      for (let d = thisLastDay; d >= 1; d--) {
        if (d == thisLastDay) {
          dayOfWeek = thisDayOfWeek;
        }  else {
          dayOfWeek--;
        }
      
        calendarDays.unshift({ year, month, day: d, dayOfWeek: dayOfWeek });
      
        if (dayOfWeek == 0) {
          dayOfWeek = 6;
        }
      }
    })();

    // Following lines populate calendarDays in next month info.
    (() => {
      while(true) {

      }
    })();

    // Following lines populate calendarDays in previous month info.
    (() => {
      let { year, month, day: prevLastDay, dayOfWeek: prevDayOfWeek } = this._getLastDay(this.prevMonthInfo);
      dayOfWeek = prevDayOfWeek; 
      
      while(dayOfWeek >= 0) {
        calendarDays.unshift({ year, month, day: prevLastDay, dayOfWeek: dayOfWeek });
        prevLastDay--;
        dayOfWeek--
      }
    })();
  }

  _getLastDay({year, month}) {
    let lastDay = new Date(year, month + 1, 0);
    return { year, month, day: lastDay.getDate(), dayOfWeek: lastDay.getDay() };
  }

  // Set up info for previous and next months.
  _setInfo() {
    let { year: currentYear, month: currentMonth } = this.currentMonthInfo; 
    
    this.prevMonthInfo = { 
      year: currentMonth == 0 ? currentYear - 1 : currentYear,
      month: currentMonth == 0 ? 11 : currentMonth - 1,
      day: null
    };
    
    this.nextmonthInfo = {
      year: currentMonth == 11 ? currentYear + 1 : currentMonth,
      month: currentMonth == 11 ? 1 : currentMonth + 1,
      day: null
    }
  }

  // Get today's date info.
  get _yearParts() {
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