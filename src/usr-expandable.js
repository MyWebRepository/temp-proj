import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';

export const fromAttribute = attr => JSON.parse(attr);
export const toAttribute = prop => JSON.stringify(prop);

export class UsrExpandable extends LitElement {
  static get styles() {
    return [

    ];
  }

  static get properties() {
    return {
      value: { type: String },
      dataSource: {
        reflect: false,
        converter: { fromAttribute, toAttribute },
        attribute: 'data-source'
      }
    };
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div>

      </div>
    `;
  }
}

window.customElements.define('usr-expandable', UsrExpandable);
