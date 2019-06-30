import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

export const fromAttribute = attr => JSON.parse(attr);
export const toAttribute = prop => JSON.stringify(prop);

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

    if (this.firstItemValue != null || this.firstItemText != null) {
      //this._dataSource = 
    }
  }

  set dataSource(val) {
    this._dataSource = val;
    this.requestUpdate();
  }
  get dataSource() {
    return this._dataSource;
  }


  get _listBody() {
    return html`
      <ul>
        
      </ul>
    `;
  }

  render() {
    return html`
      <div>
        <div>
          <span></span><span><span>
        </div>
        <div>
        </div>
      </div>
    `;
  }
}

window.customElements.define('usr-select', UsrSelect);
