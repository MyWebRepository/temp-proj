import { UsrTextbox } from './usr-textbox';

export class UsrTextboxEmail extends UsrTextbox {
	constructor() {
    super();
    //this.pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  }
}

window.customElements.define('usr-textbox-email', UsrTextboxEmail);
