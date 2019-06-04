import { css, html, LitElement } from 'lit-element';

/**
 * `usr-textbox`
 * Create a custom textbox.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class UsrTextbox extends LitElement {
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
        outline: 2px solid var(--usr-highlight-color, lightblue);
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
      css`input { 
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
        reflect: true, 
        hasChanged: (newVal, oldVal) => {
          return newVal != oldVal; 
        } 
      },
      dir: { type: String },
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
    this.dir = null;
    this.readonly = null;
    this.disabled = null;
    this.required = null;
    this.pattern = null;
    this.maxlength = null;
    this.minlength = null;

    // Non-observables
    this.validity = { 
      requiredError: false, 
      patternMismatch: false, 
      valid: true 
    };
    this.validationEvent = new CustomEvent('validation', { 
      detail: { message: null },
      bubbles: false, 
      composed: false 
    });

    this.updateComplete.then(() => {
      console.log("updatecomplete");
      this._setClasses();
      this._setAttributes();
    });
  }

  onInput(e) {
    if (this._noValidation()) return;

    this.value = e.target.value;
    this._updateClasses(this.value);
  }

  onFocus(e) {
    this.shadowRoot.host.classList.add('usr-focus');
  }

  onBlur(e) {
    this.shadowRoot.host.classList.remove('usr-focus');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  firstUpdated() {
    console.log("firstUpdated");
  }

  render () {
    console.log("render");
    return html`
      <div class="container">
        <div class="slot-container"><slot></slot></div>
        <input type="text" 
          value="${this.value}" 
          @input="${this.onInput}" 
          @focus="${this.onFocus}" 
          @blur="${this.onBlur}">
      </div>
    `;
  }

  checkValidity() {
    this.validationEvent.detail.message = this.validity.valid ? 'valid': 'invalid';
    this.dispatchEvent(this.validationEvent);
  }

  addEventListener(type = 'validation', fun) {
    if (type && fun && typeof(fun) == 'function') {
      super.addEventListener(type, fun);
      this.checkValidity();
    }
  }

  set onValidation(fun) {
    if (fun && typeof(fun) == 'function') {
      this.addEventListener('validation', fun);
      this.checkValidity();
    }
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

  _setClasses() {
    if (this._noValidation()) return;

    let exists = this._exists(this.value);
    let matches = this._matches(this.value);
    let classes = ['usr-untouched', 'usr-pristine'];

    if (exists && matches) {
      classes.push('usr-valid');
      this.validity.valid = true;
      this.validationEvent.detail.message = 'valid';
      this.dispatchEvent(this.validationEvent);
    } else {
      classes.push('usr-invalid');
      this.validity.valid = false;
      this.validity.requiredError = !exists;
      this.validity.patternMismatch = !matches;
      this.validationEvent.detail.message = 'invalid';
      this.dispatchEvent(this.validationEvent);
      let invalidEvent = new Event('invalid');
      this.dispatchEvent(invalidEvent);
    }

    this.shadowRoot.host.classList.add(...classes);
  }

  _updateClasses(val) {
    let exists = this._exists(val);
    let matches = this._matches(val);
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
        this.validationEvent.detail.message = 'valid';
        this.dispatchEvent(this.validationEvent);
      }
    } else {
      if (classList.contains('usr-valid')) {
        classList.replace('usr-valid', 'usr-invalid');
        this.validity.valid = false;
        this.validity.requiredError = !exists;
        this.validity.patternMismatch = !matches;
        this.validationEvent.detail.message = 'invalid';
        this.dispatchEvent(this.validationEvent);
        let invalidEvent = new Event('invalid');
        this.dispatchEvent(invalidEvent);
      }
    }
  }

  _setAttributes() {
    let inputElement = this.shadowRoot.querySelector('input');
    if (inputElement == null) return;

    if (this.dir != null && this.dir != '') {
      inputElement.setAttribute('dir', this.dir);
    }
    if (this.disabled != null) {
      inputElement.setAttribute('disabled', '');
    }
    if (this.readonly != null) {
      inputElement.setAttribute('readonly', '');
    }
    if (this.maxlength != null && this.maxlength != '') {
      inputElement.setAttribute('maxlength', this.maxlength);
    }
    if (this.minlength != null && this.minlength != '') {
      inputElement.setAttribute('minlength', this.minlength);
    }
  }
}

window.customElements.define('usr-textbox', UsrTextbox);
