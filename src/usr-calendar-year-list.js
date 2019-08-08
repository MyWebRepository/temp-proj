import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

const NoOfPaddingYears = 20;
const DefaultMonthNames = [
  'January', 'Febuary', 'Match', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export class UsrCalendarYearList extends LitElement {
  static get styles() {
    return [
      css`div {
        display: inline-block;
        border: solid 1px red;
        overflow-x: hidden;
        overflow-y: scroll;
        height: 200px;
        width: 250px;
      }`,
      css`ul {
        padding-left: 0px;
        margin: 0px;
        border: solid 1px green;
      }`,
      css`li {
        border: solid 1px yellow;
        list-style-type: none;
        text-align: center;
        padding: 5px 0 5px 0;
      }`,
      css`li:hover {
        color: white;
        background-color: rgb(36, 106, 243);
        cursor: pointer;
      }`
    ];
  }

  static get properties() {
    return {

    };
  }

  constructor() {
    super();

    this._currentYear = this._getYear();
    this._noOfYear = 2 * NoOfPaddingYears + 1;
    this._initialPosition = null;
    this._itemHeight = 0;
    this._prevTop = 0;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name. oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    let elem = this.shadowRoot.querySelector('#id21');
    elem.scrollIntoView();

    this._initialPosition = this._getPosition(elem);
    this._prevTop = this._initialPosition.top;
    this._itemHeight = this.initialPosition / this._noOfYear;
  }

  onScroll(event) {
    event.preventDefault();
    event.stopPropagation();

    let currTop = event.target.scrollTop;

    if (currTop > this._prevTop) { // Move down
      this._prevTop = currTop;


    } else { // Move up
      this._prevTop = currTop;

    }

  }

  onItemClick(event) {

  }

  render() {
    return html`
      <div @scroll=${this.onScroll}>
        ${this._listHTML}
      </div>
    `;
  }

  get _listHTML() {
    let yearList = this._yearList(this._currentYear);
    return html`
      <ul>
        ${repeat(yearList, year => '', (year, index) => {
          return html`
            <li id="id${index}" @click="${this.onItemClick}">${year}</li>
          `;
        })}
      </ul>
    `;
  }

  _getPosition(elem) {
    let { scrollTop: top, scrollHeight: height, clientHeight } = elem;
    return { top, height, clientHeight };
  }

  _getYear() {
    return (new Date()).getFullYear();
  }

  _yearList(year) {
    let list = [];

    for (let i = year - NoOfPaddingYears; i <= year + NoOfPaddingYears; i++) {
      list.push(i);
    }

    return list;
  }
}

window.customElements.define('usr-calendar-year-list', UsrCalendarYearList)
