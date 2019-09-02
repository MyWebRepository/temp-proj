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
        border: 1px solid green;
      }`,
      css`li {
        border: 1px solid rgb(36, 106, 243);;
        list-style-type: none;
        text-align: center;
        padding: 3px 0 3px 0;
      }`,
      css`li:hover {
        color: white;
        background-color: rgb(36, 106, 243);
        cursor: pointer;
      }`,
      css`table {
        width: 100%;
        border-collapse: collapse;
      }`,
      css`td {
        padding: 3px 0 3px 0;
        width: 33.3%;
        border: 1px solid white;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
      }`,
      css`td:hover {
        color: white;
        background-color: rgb(36, 106, 243);
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
    this._yearList = [];
    this._initialPosition = 0;
    this._startYear = 0;
    this._endYear = 0;
    this._itemHeight = 0;
    this._prevTop = 0;
    this._clickedIndex = -1;

    this._padYears(this._currentYear);
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
      //this._updateYearList('down');
      //this.requestUpdate();
    } else { // Move up
      this._prevTop = currTop;
      //this._updateYearList('up');
      //this.requestUpdate();
    }
  }

  onItemClick(index) {
    this._clickedIndex = index;
    this.requestUpdate();
  }

  onMonthClick(index) {
    
  }

  render() {
    return html`
      <div @scroll=${this.onScroll}>
        ${this._yearHTML}
      </div>
    `;
  }

  get _yearHTML() {
    return html`
      <ul>
        ${repeat(this._yearList, () => '', (year, index) => {
          return html`
            <li id="id${index}" @click="${() => this.onItemClick(index)}">${year}</li>
            ${this._clickedIndex == index ? html`${this._monthHTML}`: ''}
          `;
        })}
      </ul>
    `;
  }

  get _monthHTML() {
    return html`
      <table>
        <tbody>
          ${repeat([0, 1, 2, 3], () => '', (row, index) => {
            return html`
              <tr>
                ${repeat([0, 1, 2], () => '', (col, index) => {
                  return html`
                    <td @click="${() => this.onMonthClick(3*row+col)}">
                      ${DefaultMonthNames[3*row+col]}
                    </td>
                  `;
                })}
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  _getPosition(elem) {
    let { scrollTop: top, scrollHeight: height, clientHeight } = elem;
    return { top, height, clientHeight };
  }

  _getYear() {
    return (new Date()).getFullYear();
  }

  _padYears(year) {
    this._startYear = year - NoOfPaddingYears;
    this._endYear = year + NoOfPaddingYears;

    for (let i = this._startYear; i <= this._endYear; i++) {
      this._yearList.push(i);
    }
  }

  _updateYearList(dir) {
    if (dir == 'up') {
      for (let i = 1; i <= 5; i++) { 
        this._yearList.unshift(this._startYear - i);
      }
      for (let i = 1; i <= 5; i++) { 
        this._yearList.pop();
      }
      this._startYear -= 5;
      this._endYear -= 5;
    } else {
      for (let i = 1; i <= 5; i++) { 
        this._yearList.shift();
      }
      for (let i = 1; i <= 5; i++) { 
        this._yearList.push(this._endYear + 1);
      }
      this._startYear += 5;
      this._endYear += 5;
    }
  }
}

window.customElements.define('usr-calendar-year-list', UsrCalendarYearList);

