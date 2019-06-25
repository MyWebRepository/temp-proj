import { UsrTextbox} from './usr-textbox';

export class UsrTextboxInteger extends UsrTextbox {
	constructor() {
		super();

		this._value = null;
		this._digits = '0123456789';
	}

	onInput(event) {
		let cursorPosition = this._getCursorPosition(event);
		let value = event.target.value;
		this.value = event.target.value = this._removeNonDigits(value);

		super.onInput(event);

		let offset = (() => {
			if (value < this.value)
				return 1;
			else if (value > this.value)
				return -1;
			else
				return 0;
		})();

		const input = this.shadowRoot.querySelector('input');
		this._setCursorPosition(input, cursorPosition + offset);
	}

	updated(changedProperties) {
		console.log('updated');
		console.log(this.value + ' 2');
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