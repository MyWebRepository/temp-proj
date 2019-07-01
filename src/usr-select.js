import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

export const fromAttribute = attr => JSON.parse(unescape(attr));
export const toAttribute = prop => escape(JSON.stringify(prop));

export class UsrSelect extends LitElement {
  static get styles() {
    return [
      css`:host {
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
      css`input#textbox {
        box-sizing: border-box;
        width: 100%;
        padding: 1px 1px 1px 0px;
        border-style: none;
        outline: 0px;
        font-size: var(--usr-text-font-size, 14px);
        text-align: var(--usr-text-align, left);
      }`,
      css`.container {
        display: flex;
        flex-direction: row;
        overflow: hidden;
      }`,
      css`.slot-container {
        align-self: center;
        padding: 0 0.2em 0 0.2em;
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
    this.value = ''
    this.dataSource = [];
    this.firstItemValue = null;
    this.firstItemText = null;

    this._dataSource = [];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  set dataSource(val) {
    let oldValue = this._dataSource
    this._dataSource = val;
    this.requestUpdate('dataSource', oldValue);
  }

  get dataSource() {
    return this._dataSource;
  }

  get useEmptyItem() {
    return this.firstItemValue != null || this.firstItemText  != null;
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
            <li>
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
          <div></div>
          <div></div>
        </div>
        <div class="list-container">
          ${this._listBody}
        </div>
      </div>
    `;
  }
}

window.customElements.define('usr-select', UsrSelect);
