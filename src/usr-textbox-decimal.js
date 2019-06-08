import { UsrTextboxInteger } from './usr-textbox-integer';

export class UsrTextboxDecimal extends UsrTextboxInteger {
	static get properties() {
		return {
			...super.properties,
			decimallength: { 
				type: Number,
				reflect: true,
				hasChanged: (newVal, oldVal) => {
          return newVal != oldVal; 
        } 
			},
			decimalseparator: { 
				type: String,
				reflect: true,
				hasChanged: (newVal, oldVal) => {
          return newVal != oldVal; 
				} 
			},
			thousandseparator: { 
				type: String,
				reflect: true,
				hasChanged: (newVal, oldVal) => {
          return newVal != oldVal; 
				} 
			}
		};
	}

	constructor() {
		super();
		this.decimallength = null;
		this.decimalseparator = null;
		this.thousandseparator = null;
		
		this.decimalSeparatorIndexInOldValue = -1;
  }

	onFocus(event) {
		super.onFocus(event);

		let value = event.target.value;
		this.value = this._removeThousandSeparators(value);
		this.requestUpdate('value', value);
  }

  onBlur(event) {
		super.onBlur(event);

		let value = event.target.value;
		this.value = this._addThousandSeparators(value);
		this.requestUpdate('value', value);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this[name] = newValue;
	}

	_addThousandSeparators(val) {
		if (val) {
			if (val.endsWith('.')) {
				if (this.decimallength == null) {
					val = val + '0';
				} else {
					val = val + '0'.repeat(parseInt(this.decimallength));
				}
			}

			let result = '';
			let indexOfDecimalSeparator = val.indexOf(this.decimalseparator);
			let hasSign = val.startsWith('+') || val.startsWith('-');
			let indexToStop = hasSign ? 3 : 2;
			for (let i = val.length - 1; i > indexToStop; i--) {
				let c = val[i];
				if ((indexOfDecimalSeparator - i + 1) % 3 == 1) {
					result = this.thousandseparator + c + result;
				} else {
					result = c + result;
				}
			}
			return result;
		}
		return val;
	}

	_removeThousandSeparators(val) {
		if (val) {
			return val.split(this.thousandseparator).join('');
		} else {
			return val;
		}
	}

	_removeNonDigit(val) {
		if (val && this.decimalseparator != null && this.decimalseparator != undefined) {
			const digits = '0123456789';
			let result = '';
			let decimalSeparatorIndexInNewValue = val.indexOf(this.decimalseparator);
			for (let i = 0; i < val.length; i++) {
				let c = val[i];
				if (c == this.decimalseparator && 
					(this.decimalSeparatorIndexInOldValue == -1 ||
					(this.decimalSeparatorIndexInOldValue == decimalSeparatorIndexInNewValue && 
						this.decimalSeparatorIndexInOldValue == i) ||
					(this.decimalSeparatorIndexInOldValue + 1 == decimalSeparatorIndexInNewValue && 
						this.decimalSeparatorIndexInOldValue + 1 == i) ||
					(this.decimalSeparatorIndexInOldValue - 1 == decimalSeparatorIndexInNewValue && 
						this.decimalSeparatorIndexInOldValue - 1 == i) ||
					(this.decimalSeparatorIndexInOldValue > decimalSeparatorIndexInNewValue && 
						this.decimalSeparatorIndexInOldValue + 1 == i))) {
						this.decimalSeparatorIndexInOldValue = i;
						result += c;
				} else if (i == 0 && (c == '+' || c == '-')) {
					result += c;
				} else if (digits.includes(c)) {
					result += c;
				}
			}
			this.decimalSeparatorIndexInOldValue = result.indexOf(this.decimalseparator);
			return result;
		}
		return val;
	}
}

window.customElements.define('usr-textbox-decimal', UsrTextboxDecimal);