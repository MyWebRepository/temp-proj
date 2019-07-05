import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

const NoOfPaddingYear = 10;

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
        background-color: gray;
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
    this._noOfYear = 2 * NoOfPaddingYear + 1;
    this._initialPosition = null;
    this._itemHeight = 0;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name. oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    let elem = this.shadowRoot.querySelector('#id11');
    elem.scrollIntoView();

    this._initialPosition = this._getPosition(elem);
    this._itemHeight = this.initialPosition / this._noOfYear;
  }

  _getPosition(elem) {
    let { scrollTop: top, scrollHeight: height, clientHeight } = elem;
    return { top, height, clientHeight };
  }

  onScroll(event) {
    event.preventDefault();
    event.stopPropagation();

    let e = event;
    let top = event.target.scrollTop;
    let height = event.target.scrollHeight;
    console.log(top, height);
  }

  render() {
    return html`
      <div @scroll=${this.onScroll}>
        ${this._listHTML}
      </div>
    `;
  }

  get _listHTML() {
    let i = 0;
    let yearList = this._yearList(this._currentYear);
    return html`
      <ul>
        ${repeat(yearList, year => i++, (year, index) => {
          return html`
            <li id="id${i}">${year}</li>
          `;
        })}
      </ul>
    `;
  }

  _getYear() {
    return (new Date()).getFullYear();
  }

  _yearList(year) {
    let list = [];

    for (let i = year - 10; i <= year + 10; i++) {
      list.push(i);
    }

    return list;
  }

}

window.customElements.define('usr-calendar-year-list', UsrCalendarYearList)
