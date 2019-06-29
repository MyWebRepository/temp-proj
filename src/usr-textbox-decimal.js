import { UsrTextbox } from './usr-textbox';

export class UsrTextboxDecimal extends UsrTextbox {
	static get properties() {
		return {
			...super.properties,
			decimalLength: { 
				type: Number, 
				reflect: false, 
				attribute: 'decimal-length' 
			},
			decimalSeparator: { 
				type: String, 
				reflect: false, 
				attribute: 'decimal-separator' 
			},
			thousandSeparator: { 
				type: String, 
				reflect: false, 
				attribute: 'thousand-separator' 
			}
		};
	}

	constructor() {
    super();
    
    // Observables
		this.decimalLength = 2;
		this.decimalSeparator = '.';
		this.thousandSeparator = ',';
    
    // Non-observables
    this.actionFromInput = false;
		this.decimalSeparatorIndexInOldValue = -1;
  }

	attributeChangedCallback(name, oldValue, newValue) {
		super.attributeChangedCallback(name, oldValue, newValue);
	}

  firstUpdated() {
    let value = this.value;
    this.value = this._addThousandSeparators(value);
  }

  updated(changedProperties) {
    if (!this.actionFromInput) {
      this.actionFromInput = false;
      this.shadowRoot.querySelector('input').value = this.value;
    }
  }
  
  onInput(event) {
    this.actionFromInput = true;
    super.onInput(event);
  }

	onFocus(event) {
		super.onFocus(event);

		let value = event.target.value;
		this.value = this._removeThousandSeparators(value);
		this.requestUpdate('value', value);
  }

  onBlur(event) {
		super.onBlur(event);

    this.actionFromInput = false;
		let value = event.target.value;
		this.value = this._addThousandSeparators(value);
		this.requestUpdate('value', value);
  }

  get rawValue() {
    return parseFloat(this._removeThousandSeparators(this.value));
  }

	_addThousandSeparators(val) {
		if (val) {
      if (val.indexOf(this.decimalSeparator) == -1) {
        val += this.decimalSeparator;
      }
			if (val.endsWith('.')) {
				if (this.decimalLength == 0) {
					val = val + '0';
				} else {
					val = val + '0'.repeat(this.decimalLength);
				}
      }
      if (val.endsWith(this.decimalSeparator + '0')) {
        val += '0';
      }

      val = this._round(val);

      let result = '';
			let indexOfDecimalSeparator = val.indexOf(this.decimalSeparator);
			let hasSign = val.startsWith('+') || val.startsWith('-');
			let indexToStop = hasSign ? 1 : 0;

			for (let i = val.length - 1; i >= 0; i--) {
				let c = val[i];
				
				if (indexOfDecimalSeparator > i && indexToStop < i && 
					(indexOfDecimalSeparator - i + 1) % 3 == 1) {
					result = this.thousandSeparator + c + result;
				} else {
					result = c + result;
				}
			}
			
      return result;
		}

		return val;
	}

  _round(val) {
    return String(parseFloat(val).toFixed(this.decimalLength));
  }

	_removeThousandSeparators(val) {
		if (val) {
			return val.split(this.thousandSeparator).join('');
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

				if (c == this.decimalSeparator && 
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
	
	_getCursorPosition(event) {
		if (event && event.target) 
			return event.target.selectionStart;
		else 
			return 0; 
	}

	_setCursorPosition(element, positon) {
		element.setSelectionRange(positon, positon);
	}
}

window.customElements.define('usr-textbox-decimal', UsrTextboxDecimal);