import { UsrTextboxInteger } from './usr-textbox-integer';

export class UsrTextboxPhone extends UsrTextboxInteger {
  static get properties() {
    return {
      ...super.properties,
      format: { type: String, reflect: false }
    }
  }

	constructor() {
    super();

    // Observable
    this.format = '';

    // Non-observable
    this._value = '';
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  firstUpdated() {
    // When value assignement from attribute happens, format property
    // is not ready, so the method _addDelimiters doesn't work. Following
    // code is used to format or reformat the value property.
    let value = this.value;
    value = this._removeDelimiters(value);
    this.value = this._addDelimiters(value);
  }

  onClick(event) {
    this._resetValueAndCursorOnclick(event);
  }

  onFocus(event) {
    super.onFocus(event);
  }

  onBlur(event) {
    super.onBlur(event);

    let value = event.target.value;
    this.value = this._addDelimiters(value);
  }

  set value(val) {
    val = String(val);
    if (this._isDigits(val)) {
      val = this._addDelimiters(val);
    }

    let oldValue = this._value;
    this._value = val;
    this.requestUpdate('value', oldValue);
  }

  get value() {
    return this._value;
  }

  get rawValue() {
    return this._removeDelimiters(this._value);
  }

  _isDigits(val) {
    if (!val || val == '') {
      return false;
    }

    for (let c of val) {
      if (!this._digits.includes(c)) {
        return false;
      }
    }

    return true;
  }

  _resetValueAndCursor(event) {
		let cursorPosition = this._getCursorPosition(event);
		let value = event.target.value;
		this._value = event.target.value = this._removeNonDigits(value);

		// Calculates cursor's position offset for single input.
		let offset = (() => {
			if (value < this._value)
				return 1;
			else if (value > this._value)
				return -1;
			else
				return 0;
		})();

		this._setCursorPosition(event.target, cursorPosition + offset);
  }
  
  _resetValueAndCursorOnclick(event) {
    let cursorPosition = this._getCursorPosition(event);
    let value = event.target.value;
    this._value = event.target.value = this._removeDelimiters(value);

		// Calculates cursor's position offset for single input.
		let offset = (() => {
      let count = 0;
      for (let i = 0; i < cursorPosition; i++) {
        if (!this._digits.includes(value[i])) {
          count++;
        }
      }

			return -count;
		})();

		this._setCursorPosition(event.target, cursorPosition + offset);
  }

  _addDelimiters(val) {
    if (this.format.trim() != '' && val) {
      let result = '';
      let index = 0;

      for (let i = 0; i < this.format.length; i++) {
        let c = this.format[i];
        if (c != '#') {
          result += c;
        } else if (index < val.length) {
          result += val[index];
          index++;
        }
      }

      return result;
    }

    return val ? val : '';
  }

  _removeDelimiters(val) {
    if (val) {
      let result = '';

      for (let c of val) {
        if (this._digits.includes(c)) {
          result += c;
        }
      }

      return result;
    }

    return '';
  }

  _noValidation() {
    return !this.required && this.format == '' && isNaN(this.minlength);
  }

  _matches(val) { 
    if (this.format == '') return true;
    return this._matchesFormat(val);
  }
  
  _matchesFormat(val) {
    if (!val) {
      return false;
    } 

    val = this._removeDelimiters(val);
    let length = this.format.split('').filter(i => i == '#').length;
    return  length <= val.length;
  }
}

window.customElements.define('usr-textbox-phone', UsrTextboxPhone);