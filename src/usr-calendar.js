import { css, html, LitElement } from 'lit-element';

export class UsrCalender extends LitElement {
  static get styles() {
    return [

    ];
  }

  static get properties() {
    return {
      value: { type: String },
      monthNames: { 
        type: {
          fromAttribute: attr => attr.split(','),
          toAttribute: prop => prop.join(',')
        },
        attribute: 'month-names'
      },
      longWeekNames: { 
        type: {
          fromAttribute: attr => attr.split(','),
          toAttribute: prop => prop.join(',')
        },
        attribute: 'long-week-names'
      },
      shortWeekNames: { 
        type: {
          fromAttribute: attr => attr.split(','),
          toAttribute: prop => prop.join(',')
        },
        attribute: 'short-week-names'
      }
    }
  }

  constructor() {
    super();

    let parts = this._calenderParts;
    this.year = parts.year;
    this.month = parts.month;
    this.day = parts.day;
    this.dayOfWeek = parts.dayOfWeek;
    this.week = parts.week; 
  }

  render() {
    return html`
      <div>
        <div>
          <span>${this.year}-${this.month}-${this.day}-${this.dayOfWeek}-${this.week}</span>
        </div>
        <div>
        </div>
      </div>
    `;
  }

  get _calenderParts() {
    Date.prototype.getWeek = function() {
      var d = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((((this - d) / 86400000) + d.getDay() +1 ) / 7);
    };

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