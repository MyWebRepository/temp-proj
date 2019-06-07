import { UsrTextboxInteger} from './usr-textbox-integer';

export class UsrTextboxDecimal extends UsrTextboxInteger {
	static get properties() {
		return {
			decimalLength: { 
				type: Number,
				hasChanged: (newVal, oldVal) => {
          return newVal != oldVal; 
        } 
			},
			decimalSeparator: { 
				type: String,
				hasChanged: (newVal, oldVal) => {
          return newVal != oldVal; 
				} 
			},
			thousandSeparator: { 
				type: String,
				hasChanged: (newVal, oldVal) => {
          return newVal != oldVal; 
				} 
			}
		};
	}

	constructor() {
		super();
		this.decimalLength = null;
		this.decimalSeparator = null;
		this.thousandSeparator = null;
  }
		
	onFocus(event) {
		super.onFocus(event);
		this.value = this._removeThousandSeparators(this.value);
  }

  onBlur(event) {
		this.value = this._addThousandSeparators(this.value);
    super.onBlur(event);
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
	}
	
	_addThousandSeparators(val) {
		if (val) {
			if (val.endsWith('.')) {
				if (this.decimalLength == null) {
					val = val + '0';
				} else {
					val = val + '0'.repeat(parseInt(this.decimalLength));
				}
			}

			let result = '';
			let indexOfDecimalSeparator = val.indexOf;
			let hasSign = val.startsWith('+') || val.startsWith('-');
			let indexToStop = hasSign ? 3 : 2;
			for (let i = val.length - 1; i > indexToStop; i--) {
				let c = val[i];
				if ((indexOfDecimalSeparator - i + 1) % 3 == 1) {
					result = this.thousandSeparator + c + result;
				} else {
					result = c + result;
				}
			}
		}
	}

	_removeThousandSeparators(val) {
		if (val) {
			return val.split(this.thousandSeparator).join('');
		} else {
			return val;
		}
	}

	_removeNonDigit(val) {
		if (val) {
			const digits = '0123456789';
			let result = '';
			let hasDecimalSeparator = false;
			for (let i = 0; i < val.length; i++) {
				let c = val[i];
				if (!hasDecimalSeparator && c == this.decimalSeparator) {
					result += c;
					hasDecimalSeparator = true;
				} else if (i == 0 && (c == '+' || c == '-')) {
					result += c;
				} else if (digits.includes(c)) {
					result += c;
				}
			}
			return result;
		}
		return val;
	}
}

window.customElements.define('usr-textbox-decimal', UsrTextboxDecimal);