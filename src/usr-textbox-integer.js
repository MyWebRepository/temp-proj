import { css, html, LitElement } from 'lit-element';
import { UsrTextbox} from './usr-textbox';

export class UsrTextboxInteger extends UsrTextbox {

    constructor() {
        super();
    }
}

window.customElements.define('usr-textbox-integer', UsrTextboxInteger);