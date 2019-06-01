import { LitElement, html, css } from 'lit-element';

/**
 * `usr-textbox`
 * Create a custom textbox.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class UsrTextbox extends LitElement {
  static get styles() {
    return [ 
      css`:host { display: inline-block; border: solid 1px gray; }`,
      css`::slotted(*) { visibility: visible !important; }`,
      css`input { border-style: none; }`,
      css`.container { display: flex; flex-direction: row; }`,
      css`.slot-container { align-self: center; padding: 0 0 0 0.2em; }`
    ];
  }

  static get properties() {
    return {
      value: {type: String, reflect: true},
      readonly: {type: Boolean},
      disabled: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.value = '';
    this.readonly = false;
    this.disabled = false;
  }

  onInput(e) {
    this.value = e.target.value;
  }

  /*connectedCallback() { 
  }*/

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  get inputHTML() {
    if (String(this.disabled) == 'true') {
      return html`
        <input disabled type="text" value="${this.value}" @input="${this.onInput}">
      `;
    } else if (String(this.readonly) == 'true') {
      return html`
        <input readonly type="text" value="${this.value}" @input="${this.onInput}">
      `;
    } else {
      return html`
        <input type="text" value="${this.value}" @input="${this.onInput}">
      `;
    }
  }

  render () {
    return html`
      <div class="container">
        <div class="slot-container"><slot></slot></div>
        <div>${this.inputHTML}</div>
      </div>
    `;
  }
}

window.customElements.define('usr-textbox', UsrTextbox);
