import { UsrTextbox} from './usr-textbox';

export class UsrTextboxInteger extends UsrTextbox {
	constructor() {
		super();
	}

	onInput(e) {
		let value = e.target.value;
		e.target.value = this._removeNonDigit(value);

		super.onInput(e);
	}

	//render() {
		//super.render();
	//}

	set value(val) {
		super.value = val;
	}

	get value() {
		return super.value;
	}

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