import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { styleMap } from 'lit-html/directives/style-map';

export const fromAttribute = attr => JSON.parse(unescape(attr));
export const toAttribute = prop => escape(JSON.stringify(prop));

export class UsrSelect extends LitElement {
  static get styles() {
    return [
      css`:host {
        width: 100%;
        display: inline-block;
        border: solid 1px gray;
        padding: 2px 2px 2px 2px;
      }`,
      css`:host([disabled]), :host([readonly]),
        :host([disabled]) *, :host([readonly]) * {
        background-color: lightgray;
      }`,
      css`:host(.usr-focus) {
        outline: 2px solid var(--usr-outline-color, lightblue);
      }`,
      css`:host(.usr-slot-before) .slot-container {
        order: 1;
      }`,
      css`:host(.usr-slot-after) .slot-container {
        order: 2;
      }`,
      css`:host(.usr-slot-before) input {
        order: 2;
      }`,
      css`:host(.usr-slot-after) input {
        order: 1;
      }`,
      css`::slotted(span) {
        visibility: visible !important;
        font-size: var(--usr-icon-font-size, 14px);
      }`,
      css`.slot-container {
        align-self: center;
        padding: 0 0.2em 0 0.2em;
      }`,
      css`.container {
        width: 100%;
      }`,
      css`.value-container {
        display: block;
        border: solid 1px green;
      }`,
      css`.value-container:hover {
        cursor: pointer;
      }`,
      css`.value-container div {
        display: inline-block;
        border: solid 1px green;
      }`,
      css`.value-container .text {
        width: calc(100% - 35px);
        height: 100%;
      }`,
      css`.value-container .icon {
        width: 30px;
        float: right;
        text-align: center;
      }`,
      css`.list-container {
        display: none;
        height: 200px;
        overflow-x: hidden;
        overflow-y: scroll;
      }`,
      css`ul {
        padding-left: 0px;
        margin: 0px;
        border: solid 1px green;
      }`,
      css`li {
        border: solid 1px yellow;
        list-style-type: none;
        text-align: left;
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
      value: { 
        type: String, 
        reflect: false 
      },
      dataSource: {
        type: Array,
        reflect: false,
        converter: { 
          fromAttribute, 
          toAttribute 
        },
        attribute: 'data-source'
      },
      firstItemValue: { 
        type: String, 
        reflect: false, 
        attribute: 'first-item-value'
      },
      firstItemText: { 
        type: String, 
        reflect: false, 
        attribute: 'first-item-text'
      }
    };
  }

  constructor() {
    super();

    // Observables
    this.firstItemValue = null;
    this.firstItemText = null;

    this._dataSource = [];
    this._value = '1';
    this._listHide = true;
    this._dataSource = [
      { value: '1', text:'item 1' },
      { value: '2', text:'item 2' },
      { value: '3', text:'item 3' },
      { value: '4', text:'item 4' },
      { value: '5', text:'item 5' },
      { value: '6', text:'item 6' },
      { value: '7', text:'item 7' },
      { value: '8', text:'item 8' },
      { value: '9', text:'item 9' },
      { value: '10', text:'item 10' },
      { value: '11', text:'item 11' },
      { value: '12', text:'item 12' },
      { value: '13', text:'item 13' },
      { value: '14', text:'item 14' },
      { value: '15', text:'item 15' },
      { value: '16', text:'item 16' }
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    document.addEventListener('click', this.onDocClick.bind(this));
  }

  onTextClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this._listHide = false;
    this.requestUpdate();
  }

  onItemClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.value = event.target.getAttribute('value');
  }

  onDocClick(event) {
    this._listHide = true;
    this.requestUpdate();
  }

  set dataSource(val) {
    let oldValue = this._dataSource;
    this._dataSource = val;
    this.requestUpdate('dataSource', oldValue);
  }

  get dataSource() {
    return this._dataSource;
  }

  set value(val) {
    let oldValue = this._value;
    this._value = val;
    this.requestUpdate('value', oldValue);
  }

  get value() {
    return this._value;
  }

  get useEmptyItem() {
    return this.firstItemValue != null || this.firstItemText  != null;
  }

  get _text() {
    if (this._dataSource && Array.isArray(this._dataSource)) {
      let item = this._dataSource.find(i => i.value == this._value);
      if (item) {
        return item.text;
      } else {
        return '';
      }
    }

    return '';
  }

  get _listBody() {
    let i = 0;
    return html`
      <ul>
        ${this.useEmptyItem ? 
          html`
            <li>
              <span>&#9776<span>
              <span>${this.firstItemText}</span>
            </li>
          ` : '' 
        }
        ${repeat(this.dataSource, item => `${i++}`, (item, index) => 
          html`
            <li @click="${this.onItemClick}" value="${item.value}">
              <span>&#9776<span>
              <span>${item.text}</span>
            </li>
          `
        )}
      </ul>
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="value-container">
          <div class="text" @click="${this.onTextClick}">${this._text}</div>
          <div class="icon" @click="${this.onTextClick}">&#9660</div>
        </div>
        <div class="list-container" style="${styleMap(this._listHide?{display:'none'}:{display:'block'})}">
          ${this._listBody}
        </div>
      </div>
    `;
  }
}

window.customElements.define('usr-select', UsrSelect);
