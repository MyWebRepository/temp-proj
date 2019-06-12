import { UsrTextboxInteger } from './usr-textbox-integer';

export class UsrTextboxPhone extends UsrTextboxInteger {
  static get properties() {
    return {
      ...super.properties,
      format: { type: String, reflect: true }
    }
  }

	constructor() {
    super();

    // Observables
    this.value = null; 
    this.format = null;

    // Non-observable
    this.actionFromInput = false;
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
    /*if (name == 'value') {
      let val = this._removeDelimiters(newValue);
      this[name] = this._addDelimiters(val);
    } else {
      this[name] = newValue;
    }*/
  }

  firstUpdated() {
    let value = this.value;
    value = this._removeDelimiters(value);
    this.value = this._addDelimiters(value);
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
		this.value = this._removeDelimiters(value);
		this.requestUpdate('value', value);
  }

  onBlur(event) {
		super.onBlur(event);

    this.actionFromInput = false;
		let value = event.target.value;
		this.value = this._addDelimiters(value);
		this.requestUpdate('value', value);
  }

/*
  set value(val) {
		let oldVal = this._value;
    //val = this._removeDelimiters(val);
    //this._value = this._addDelimiters(val);

    //this._value = val;
    this.requestUpdate('value', oldVal);
	}

	get value() {
		return this._value;
  }
*/
  get rawValue() {
    return this._removeDelimiters(this.value);
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
    return this.required == null && this.format == null && this.minlength == null;
  }

  _matches(val) { 
    if (this.format == null && this.format == '') return true;
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