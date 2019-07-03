import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

export class UsrCalendarYearList extends LitElement {
  static get styles() {
    return [
      css`div {
        display: inline-block;
        border: solid 1px gray;
        overflow-x: hidden;
        overflow-y: scroll;
        height: 150px;
        width: 200px;
      }`
    ];
  }

  static get properties() {
    return {

    };
  }

  constructor() {
    super();

    this.currentYear = this._currentYear;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name. oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  onScroll(event) {
    let e = event;
  }

  render() {
    return html`
      <div @scroll=${this.onScroll}>
        ${this._listHTML}
      <div>
    `;
  }

  get _listHTML() {
    let i = 0;
    let yearList = this._yearList(this.currentYear);
    return html`
      <ul>
        ${repeat(yearList, year => i++, (year, index) => {
          return html`
            <li>${year}</li>
          `;
        })}
      </ul>
    `;
  }

  get _currentYear() {
    return (new Date()).getFullYear();
  }

  _yearList(thisYear) {
    let list = [];

    for (let i = thisYear - 10; i <= thisYear + 10; i++) {
      list.push(i);
    }

    return list;
  }

}

window.customElements.define('usr-calendar-year-list', UsrCalendarYearList)
