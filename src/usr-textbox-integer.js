import { UsrTextbox} from './usr-textbox';

export class UsrTextboxInteger extends UsrTextbox {
	constructor() {
		super();
		this._value = null;
	}

	onInput(event) {
		let cursorPosition = this._getCursorPosition(event);
		let value = event.target.value;
		this.value = event.target.value = this._removeNonDigit(value);

		super.onInput(event);

		if (value != this.value) {
			let input = this.shadowRoot.querySelector('input');
			this._setCursorPosition(input, cursorPosition - 1);
		}
	}

	updated(changedProperties) {
		console.log('updated');
	}

	set value(val) {
		let oldVal = this._value;
		this._value = this._removeNonDigit(val);
		this.requestUpdate('value', oldVal);
	}

	get value() {
		return this._value;
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

	_removeNonDigit(val) {
		if (val) {
			const digits = '0123456789';
			let result = '';
			for (let i = 0; i < val.length; i++) {
				let c = val[i];
				if (i == 0 && (c == '+' || c == '-')) {
					result += c;
				} else if (digits.includes(c)) {
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