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
    let value = this.value;
    value = this._removeDelimiters(value);
    this.value = this._addDelimiters(value);
  }

	onFocus(event) {
		super.onFocus(event);

		//let value = event.target.value;
    //this.value = this._removeDelimiters(value);
    //setTimeout(() => {
      this._resetCursorPositionOnfocus(event);
    //}, 100);
  }

  onBlur(event) {
		super.onBlur(event);

		let value = event.target.value;
    this.value = this._addDelimiters(value);
  }

  set value(val) {
    //val = this._removeDelimiters(val);
    //val = this._addDelimiters(val);

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

  _resetCursorPosition(event) {
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
  
  _resetCursorPositionOnfocus(event) {
		let cursorPosition = this._getCursorPosition(event);
    let value = event.target.value;
    
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

    this.value = this._removeDelimiters(value);

		this._setCursorPosition(event.target, cursorPosition + offset);
  }

  _addDelimiters(val) {
    if (this.format && val) {
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
    return  length == val.length;
  }
}

window.customElements.define('usr-textbox-phone', UsrTextboxPhone);
