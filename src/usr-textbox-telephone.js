import { UsrTextbox } from './usr-textbox';

export class UsrTextboxTelephone extends UsrTextbox {
  static get properties() {
    return {
      ...super.properties,
      format: { type: String }
    }
  }

	constructor() {
    super();
    this.format = '(###) ###-####';
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

}

window.customElements.define('usr-textbox-telephone', UsrTextboxTelephone);
