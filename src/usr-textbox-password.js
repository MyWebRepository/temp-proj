import { UsrTextbox } from './usr-textbox';

export class UsrTextboxPassword extends UsrTextbox {
  constructor() {
    super();
    
    this.inputType = 'password';
  }
  
  // Override the method in parent class.
  _matches(val) { 
    return true;
  }
}

window.customElements.define('usr-textbox-password', UsrTextboxPassword);
