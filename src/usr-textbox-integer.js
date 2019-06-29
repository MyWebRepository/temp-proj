import { UsrTextbox} from './usr-textbox';

export class UsrTextboxInteger extends UsrTextbox {
	constructor() {
		super();

		this._digits = '0123456789';
	}

	attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
	}
	
	onInput(event) {
		super.onInput(event);
		this._resetValueAndCursor(event);
	}

	set value(val) {
		let oldVal = this._value;
		this._value = this._removeNonDigits(val);
		this.requestUpdate('value', oldVal);
	}

	get value() {
		return this._value;
	}

	set integerValue(val) {
		this.value = String(val);
	}

	get integerValue() {
		return Number(this._value);
	}

	_resetValueAndCursor(event) {
		let cursorPosition = this._getCursorPosition(event);
		let value = event.target.value;
		this._value = event.target.value = this._removeNonDigits(value);

		// Calculates cursor's position offset for single input.
		let offset = (() => {
			if (value < this.value)
				return 1;
			else if (value > this.value)
				return -1;
			else
				return 0;
		})();

		this._setCursorPosition(event.target, cursorPosition + offset);
	}

	_getCursorPosition(event) {
		if (event && event.target) 
			return event.target.selectionStart;
		else 
			return 0; 
	}

	_setCursorPosition(element, positon) {
		element.setSelectionRange(positon, positon);
	}

	_removeNonDigits(val) {
		if (val) {
			let result = '';

			for (let i = 0; i < val.length; i++) {
				let c = val[i];

				if (i == 0 && (c == '+' || c == '-')) {
					result += c;
				} else if (this._digits.includes(c)) {
					result += c;
				}
			}

			return result;
		}
		
		return val;
	}

  _matches(val) { 
    return true;
	}
}

window.customElements.define('usr-textbox-integer', UsrTextboxInteger);