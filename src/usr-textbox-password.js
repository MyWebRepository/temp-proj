import { UsrTextbox} from './usr-textbox';

export class UsrTextboxPassword extends UsrTextbox {
	constructor() {
    super();
    this.inputType = 'password';
	}
}

window.customElements.define('usr-textbox-password', UsrTextboxPassword);
