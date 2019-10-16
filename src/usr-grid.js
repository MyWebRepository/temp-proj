import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { styleMap } from 'lit-html/directives/style-map';
import { classMap } from 'lit-html/directives/class-map';

const fromAttribute = attr => JSON.parse(unescape(attr));
const toAttribute = prop => escape(JSON.stringify(prop));

export class UsrGrid extends LitElement {
  static get styles() {
    return [];
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="usr-container">
        <div class="usr-grid">
          <div class="usr-header">
          </div>
          <div class="usr-body">
          </div>
        </div>
        <div class="usr-pager">
        </div>
      </div>
    `;
  }
}

window.customElements.define('usr-grid', UsrGrid);