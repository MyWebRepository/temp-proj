import { UsrTextbox} from './usr-textbox';

export class UsrTextboxInteger extends UsrTextbox {
	constructor() {
		super();
		this.cursorPosition = 0;
	}

	onInput(event) {
		this.cursorPosition = this._getCursorPosition(event);

		let value = event.target.value;
		this.value = event.target.value = this._removeNonDigit(value);

		super.onInput(event);

		if (value != this.value) {
			let input = this.shadowRoot.querySelector('input');
			this._setCursorPosition(input, this.cursorPosition - 1);
		}
	}

	updated(changedProperties) {
		console.log('updated');
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

	//set value(val) {
	//	super.value = val;
	//}

	//get value() {
	//	return super.value;
	//}

	_removeNonDigit(val) {
		if (val) {
			let result = '';
			for (let c of val) {
				if ('0123456789'.includes(c)) {
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