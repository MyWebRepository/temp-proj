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
      css`:host { display: inline-block; border: solid 1px gray; padding: 2px 2px 2px 2px; }`,
      css`::slotted(span) { visibility: visible !important; font-size: var(--usr-icon-font-size, 14px) }`,
      css`input { box-sizing: border-box; width: 100%; padding: 1px 1px 1px 0px; border-style: none; outline: 0px; font-size: var(--usr-text-font-size, 14px) }`,
      css`.container { display: flex; flex-direction: row; overflow: hidden; }`,
      css`.slot-container { align-self: center; padding: 0 0 0 0.2em; }`
    ];
  }

  static get properties() {
    return {
      value: { 
        type: String, 
        reflect: true, 
        hasChanged(newVal, oldVal) {
          return newVal == oldVal; 
        } 
      },
      readonly: { type: String },
      disabled: { type: String },
      required: { type: String },
      pattern: { type: String },
      minlength: { type: Number },
      maxlength: { type: Number }
    };
  }

  constructor() {
    super();
    this.value = '';
    this.readonly = null;
    this.disabled = null;
    this.required = null;
    this.pattern = null;
    this._valid = true;

    this.updateComplete.then(() => {
      if (this.required == null && this.pattern == null) return;

      let classes = ['usr-untouched', 'usr-pristine'];
      if (this.value != null && this.value.trim() != '') {
        classes.push('usr-valid');
        this._valid = true;
      } else {
        classes.push('usr-invalid');
        this._valid = false;
        let invalidEvent = new Event('invalid');
        this.dispatchEvent(invalidEvent);
      }

      this.shadowRoot.host.classList.add(...classes);
    });
  }

  onInput(e) {
    if (this.required == null && this.pattern == null) return;

    this.value = e.target.value;
    let classList = this.shadowRoot.host.classList;

    if (classList.contains('usr-untouched')) {
      classList.replace('usr-untouched', 'usr-touched');
    }
    if (classList.contains('usr-pristine')) {
      classList.replace('usr-pristine', 'usr-dirty');
    }
    if (this.value != null && this.value.trim() != '') {
      if (classList.contains('usr-invalid')) {
        classList.replace('usr-invalid', 'usr-valid');
        this._valid = true;
      }
    } else {
      if (classList.contains('usr-valid')) {
        classList.replace('usr-valid', 'usr-invalid');
        this._valid = false;
        let invalidEvent = new Event('invalid');
        this.dispatchEvent(invalidEvent);
      }
    }
  }

  onKeyup(e) {
    //this.value = e.target.value;
  }

  /*connectedCallback() { 
  }*/

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  get inputHTML() {
    if (this.disabled != null) {
      return html`
        <input disabled type="text" value="${this.value}" @input="${this.onInput}" @keyup="${this.onKeyup}">
      `;
    } else if (this.readonly != null) {
      return html`
        <input readonly type="text" value="${this.value}" @input="${this.onInput}" @keyup="${this.onKeyup}">
      `;
    } else {
      return html`
        <input type="text" value="${this.value}" @input="${this.onInput}" @keyup="${this.onKeyup}">
      `;
    }
  }

  render () {
    return html`
      <div class="container">
        <div class="slot-container"><slot></slot></div>
        ${this.inputHTML}
      </div>
    `;
  }

  checkValidity() {
    return this._valid;
  }
}

window.customElements.define('usr-textbox', UsrTextbox);
