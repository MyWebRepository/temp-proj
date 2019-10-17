import { css, html, LitElement } from 'lit-element';

export const fromAttribute = attr => parseInt(attr);
export const toAttribute = prop => String(prop);

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
        padding: 0.2em;
      }`,
      css`:host([disabled]), :host([readonly]),
        :host([disabled]) *, :host([readonly]) * {
        background-color: lightgray;
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
        font-size: var(--usr-txt-icon-font-size, inherit);
      }`,
      css`input#textbox {
        box-sizing: border-box;
        width: 100%;
        padding: 1px 2px 1px 2px;
        // border-style: none;
        margin: 0px;
        border: 1px solid black;
        outline: 0px;
        font-size: var(--usr-txt-text-font-size, inherit);
        text-align: var(--usr-txt-text-align, left);
      }`,
      css`.container {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        border: 1px solid black;
        padding: 0px;
      }`,
      css`.slot-container {
        align-self: center;
        padding: 0 0.2em 0 0.2em;
        border: 1px solid black;
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
      dir: { 
        type: String 
      },
      readonly: { 
        type: Boolean, 
        reflect: false 
      },
      disabled: { 
        type: Boolean, 
        reflect: false 
      },
      required: { 
        type: Boolean, 
        reflect: false 
      },
      pattern: { 
        type: String, 
        reflect: false 
      },
      placeholder: {  
        type: String, 
        reflect: false 
      },
      autocomplete: {
        type: String,
        reflect: false
      },
      autocorrect: {
        type: String,
        reflect: false
      },
      autocapitalize: {
        type: String,
        reflect: false
      },
      spellcheck: {
        type: Boolean,
        reflect: false        
      },
      minlength: { 
        reflect: false,
        converter: { 
          fromAttribute, 
          toAttribute 
        }
      },
      maxlength: {
        reflect: false,
        converter: { 
          fromAttribute, 
          toAttribute 
        }
      },
      tabIndex: {
        type: Number,
        reflect: true,
        attribute: 'tabindex'
      }
    };
  }

  constructor() {
    super();

    // Observables
    this.value = '';
    this.dir = '';
    this.readonly = false;
    this.disabled = false;
    this.required = false;
    this.pattern = '';
    this.maxlength = NaN;
    this.minlength = NaN;
    this.placeholder = '';
    this.autocomplete= "off";
    this.autocorrect = "off";
    this.autocapitalize = "off";
    this.spellcheck = "false";
    this.tabIndex = "";
    
    // Non-observables
    this.validity = {
      errors: {
        required: false,
        minlength: false, 
        pattern: false
      },
      valid: true
    };
    this.validationEvent = new CustomEvent('validate', { 
      detail: { message: null },
      bubbles: false, 
      composed: false 
    });
    this.inputType = 'text';
    this._value = '';

    this.updateComplete.then(() => {
      console.log("updatecomplete");
      this._setClasses();
      this._setAttributes();
    });
  }

  onInput(event) {
    this._value = event.target.value;

    if (this._noValidation()) return;
    this._updateClasses(this._value);
  }

  onFocus(event) {
    this.shadowRoot.host.classList.add('usr-focus');
  }

  onBlur(event) {
    this.shadowRoot.host.classList.remove('usr-focus');
  }

  onClick(event) { 
  }

  click() {
    this.shadowRoot.querySelector('input#textbox').click();
  }

  focus() {
    this.shadowRoot.querySelector('input#textbox').focus();
  }

  blur() {
    this.shadowRoot.querySelector('input#textbox').blur();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  updated() {
    console.log("Updated");
    this.shadowRoot.querySelector('input#textbox').value = this.value;
  }

  set value(val) {
    let oldValue = this._value;
    this._value = val;
    this.requestUpdate('value', oldValue);
  }

  get value() {
    return this._value;
  }

  render() {
    console.log("render");
    console.log(this.value + '    1');
    return html`
      <div class="container">
        <div class="slot-container">
          <slot></slot>
        </div>
        <input 
          id="textbox"
          type="${this.inputType}"
          placeholder="${this.placeholder}"
          value="${this.value}"
          autocomplete="${this.autocomplete}" 
          autocorrect="${this.autocorrect}"
          autocapitalize="${this.autocapitalize}" 
          spellcheck="${this.spellcheck}"
          tabindex="${this.tabIndex}"
          @click="${this.onClick}"
          @input="${this.onInput}"
          @focus="${this.onFocus}"
          @blur="${this.onBlur}">
      </div>
    `;
  }

  // createRenderRoot() {
  //   return this.attachShadow({mode: 'closed'});
  // }

  checkValidity() {
    this.validationEvent.detail.message = this.validity.valid ? 'valid': 'invalid';
    this.dispatchEvent(this.validationEvent);
  }

  addEventListener(type = 'validate', func) {
    if (type && func && typeof func == 'function') {
      super.addEventListener(type, func);
      this.checkValidity();
    }
  }

  set onValidate(func) {
    if (func && typeof func == 'function') {
      super.addEventListener('validate', func);
      this.checkValidity();
    }
  }

  set trigger(name) {
    this[name] = (name) => {
      this.shadowRoot.querySelector('input#textbox')[name]();
    };
  }
  
  _noValidation() {
    return !this.required && this.pattern == '' && isNaN(this.minlength);
  }

  _exists(val) {
    if (!this.required) return true;
    return val != null && val.trim() != '';
  }

  _matches(val) {
    if (this.pattern == '') return true;
    return (new RegExp(this.pattern)).test(val);
  }

  _longEnough(val) {
    if (isNaN(this.minlength)) return true;
    return val.length >= this.minlength;
  }

  _setClasses() {
    if (this._noValidation()) return;

    let exists = this._exists(this.value);
    let matches = this._matches(this.value);
    let longEnough = this._longEnough(this.value);
    let classes = ['usr-untouched', 'usr-pristine'];

    if (exists && matches && longEnough) {
      classes.push('usr-valid');
      this.validity.valid = true;
      this.validationEvent.detail.message = 'valid';
      this.dispatchEvent(this.validationEvent);
    } else {
      classes.push('usr-invalid');
      this.validity.valid = false;
      this.validity.errors.required = !exists;
      this.validity.errors.pattern = !matches;
      this.validity.errors.minlength = !longEnough;
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
    let longEnough = this._longEnough(this.value);
    let classList = this.shadowRoot.host.classList;

    if (classList.contains('usr-untouched')) {
      classList.replace('usr-untouched', 'usr-touched');
    }
    
    if (classList.contains('usr-pristine')) {
      classList.replace('usr-pristine', 'usr-dirty');
    }

    if (exists && matches && longEnough) {
      if (classList.contains('usr-invalid')) {
        classList.replace('usr-invalid', 'usr-valid');
        this.validity.valid = true;
        this.validity.errors.required = false;
        this.validity.errors.pattern = false;
        this.validity.errors.minlength = false;
        this.validationEvent.detail.message = 'valid';
        this.dispatchEvent(this.validationEvent);
      }
    } else {
      if (classList.contains('usr-valid')) {
        classList.replace('usr-valid', 'usr-invalid');
        this.validity.valid = false;
        this.validity.errors.required = !exists;
        this.validity.errors.pattern = !matches;
        this.validity.errors.minlength = !longEnough;
        this.validationEvent.detail.message = 'invalid';
        this.dispatchEvent(this.validationEvent);
        let invalidEvent = new Event('invalid');
        this.dispatchEvent(invalidEvent);
      }
    }
  }

  _setAttributes() {
    let inputElement = this.shadowRoot.querySelector('input#textbox');
    if (inputElement == null) return;

    if (this.dir != null && this.dir != '') {
      inputElement.setAttribute('dir', this.dir);
    }
    if (this.disabled) {
      inputElement.setAttribute('disabled', '');
    }
    if (this.readonly) {
      inputElement.setAttribute('readonly', '');
    }
    if (!isNaN(this.maxlength)) {
      inputElement.setAttribute('maxlength', this.maxlength);
    }
    if (!isNaN(this.minlength)) {
      inputElement.setAttribute('minlength', this.minlength);
    }
  }
}

window.customElements.define('usr-textbox', UsrTextbox);
