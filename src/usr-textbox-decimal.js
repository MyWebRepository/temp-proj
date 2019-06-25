import { UsrTextboxInteger } from './usr-textbox-integer';

export class UsrTextboxDecimal extends UsrTextboxInteger {
	static get properties() {
		return {
			...super.properties,
			decimallength: { type: Number, reflect: false },
			decimalseparator: { type: String, reflect: false },
			thousandseparator: { type: String, reflect: false }
		};
	}

	constructor() {
    super();
    
    // Observables
		this.decimallength = 2;
		this.decimalseparator = '.';
		this.thousandseparator = ',';
    
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
      if (val.indexOf(this.decimalseparator) == -1) {
        val += this.decimalseparator;
      }
			if (val.endsWith('.')) {
				if (this.decimallength == 0) {
					val = val + '0';
				} else {
					val = val + '0'.repeat(this.decimallength);
				}
      }
      if (val.endsWith(this.decimalseparator + '0')) {
        val += '0';
      }

      val = this._round(val);

      let result = '';
			let indexOfDecimalSeparator = val.indexOf(this.decimalseparator);
			let hasSign = val.startsWith('+') || val.startsWith('-');
			let indexToStop = hasSign ? 1 : 0;

			for (let i = val.length - 1; i >= 0; i--) {
				let c = val[i];
				
				if (indexOfDecimalSeparator > i && indexToStop < i && 
					(indexOfDecimalSeparator - i + 1) % 3 == 1) {
					result = this.thousandseparator + c + result;
				} else {
					result = c + result;
				}
			}
			
      return result;
		}

		return val;
	}

  _round(val) {
    return String(parseFloat(val).toFixed(this.decimallength));
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