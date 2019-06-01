import { LitElement, html } from 'lit-element';

/**
 * `usr-textbox`
 * Create a custom textbox.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class UsrTextbox extends LitElement {
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

  /*createRenderRoot() {
    this.attachShadow({mode: "open"});
    return this;
  }*/

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;

    /*if (name == 'value') {
      let inputElement = this.shadowRoot.querySelector('input');

      if (inputElement != null) {
        this.shadowRoot.querySelector('input').value = this.value;
      }
    }*/
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
      <style>
        :host {
          display: inline-block;
          border: solid 1px gray;
        }
        ::slotted(*) {
          visibility: visible !important;
        }
        input {
          border-style: none;
        }
        .container {
          display: flex;
          flex-direction: row;
        }
        .slot-container {
          align-self: center;
          padding: 0 0 0 0.2em;
        }
      </style>
      <div class="container">
        <div class="slot-container"><slot></slot></div>
        <div>${this.inputHTML}</div>
      </div>
    `;
  }
}

window.customElements.define('usr-textbox', UsrTextbox);
