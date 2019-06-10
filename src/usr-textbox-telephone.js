import { UsrTextboxInteger } from './usr-textbox-integer';

export class UsrTextboxTelephone extends UsrTextboxInteger {
  static get properties() {
    return {
      ...super.properties,
      format: { type: String }
    }
  }

	constructor() {
    super();
    this.format = ''; // '(###) ###-####';
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;

    if (name == 'format') {
      if (newValue) {
        this[name] = newValue;
      }
      this['maxlength'] = this[name].length;
    }
  }

  _extractDelimiters(val) {
    if (val) {
      let result = '';
      for (let c of val) {
        if (c != '#' && !result.includes(c)) {
          result += c;
        }
      }
    }

    return val;
  }

  _matches(val) { 
    return true;
	}
}

window.customElements.define('usr-textbox-telephone', UsrTextboxTelephone);
