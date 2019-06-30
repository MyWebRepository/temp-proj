import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

export const fromAttribute = attr => JSON.parse(unescape(attr));
export const toAttribute = prop => escape(JSON.stringify(prop));

export class UsrSelect extends LitElement {
  static get styles() {
    return [

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
        attribute: 'first-item-Text'
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
    let oldValue = this._dataSourcel
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
