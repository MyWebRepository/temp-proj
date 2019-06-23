import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

export class UsrSelectMultiple extends LitElement {
  static get styles() {
    return [

    ];
  }

  static get properties() {
    return {

    };
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="container">
        <ul>
        
        </ul>
      <div>
    `;
  }
}

window.customElements.define('usr-select-multiple', UsrSelectMultiple);
