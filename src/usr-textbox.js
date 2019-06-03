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

    // Observables
    this.value = '';
    this.readonly = null;
    this.disabled = null;
    this.required = null;
    this.pattern = null;

    // Non-observable
    this.validity = { requiredError: false, patternMismatch: false, valid: true };

    this.updateComplete.then(() => {
      if (this._noValidation()) return;

      let exists = this._exists(this.value);
      let matches = this._matches(this.value);
      let classes = ['usr-untouched', 'usr-pristine'];

      if (exists && matches) {
        classes.push('usr-valid');
        this.validity.valid = true;
      } else {
        classes.push('usr-invalid');
        this.validity.valid = false;
        this.validity.requiredError = !exists;
        this.validity.patternMismatch = !matches;
        let invalidEvent = new Event('invalid');
        this.dispatchEvent(invalidEvent);
      }

      this.shadowRoot.host.classList.add(...classes);
    });
  }

  onInput(e) {
    if (this._noValidation()) return;

    this.value = e.target.value;
    let exists = this._exists(this.value);
    let matches = this._matches(this.value);
    let classList = this.shadowRoot.host.classList;

    if (classList.contains('usr-untouched')) {
      classList.replace('usr-untouched', 'usr-touched');
    }
    
    if (classList.contains('usr-pristine')) {
      classList.replace('usr-pristine', 'usr-dirty');
    }

    if (exists && matches) {
      if (classList.contains('usr-invalid')) {
        classList.replace('usr-invalid', 'usr-valid');
        this.validity.valid = true;
        this.validity.requiredError = true;
        this.validity.patternMismatch = true;
      }
    } else {
      if (classList.contains('usr-valid')) {
        classList.replace('usr-valid', 'usr-invalid');
        this.validity.valid = false;
        this.validity.requiredError = !exists;
        this.validity.patternMismatch = !matches;
        let invalidEvent = new Event('invalid');
        this.dispatchEvent(invalidEvent);
      }
    }
  }

  onFocus(e) {
    //this.value = e.target.value;
  }

  onBlur(e) {
    //this.value = e.target.value;
  }

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
    return this.validity.valid;
  }

  _noValidation() {
    return this.required == null && this.pattern == null;
  }

  _exists(val) {
    if (this.required == null) return true;
    return val != null && val.trim() != '';
  }

  _matches(val) {
    if (this.pattern == null) return true;
    return (new RegExp(this.pattern)).test(val);
  }
}

window.customElements.define('usr-textbox', UsrTextbox);
