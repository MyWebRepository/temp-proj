import { css, html, LitElement } from 'lit-element';

export class UsrPickerTime extends LitElement {
  static get styles() {
    return [
      css`:host {
        display: inline-block;
        border: solid 1px gray;
        padding: 2px 2px 2px 2px;
      }`,
      css`:host([disabled]), :host([readonly]),
        :host([disabled]) *, :host([readonly]) * {
        background-color: lightgray;
      }`,
      css`:host(.usr-focus) {
        outline: 2px solid var(--usr-outline-color, lightblue);
      }`,
      css`:host(.usr-slot-before) .slot-container {
        order: 1;
      }`,
      css`:host(.usr-slot-after) .slot-container {
        order: 2;
      }`,
      css`:host(.usr-slot-before) input {
        order: 2;
      }`,
      css`:host(.usr-slot-after) input {
        order: 1;
      }`,
      css`::slotted(span) {
        visibility: visible !important;
        font-size: var(--usr-icon-font-size, 14px);
      }`,
      css`input {
        display: inline;
        box-sizing: content-box;
        width: 2ch;
        padding: 1px 1px 1px 0px;
        border-style: none;
        outline: 0px;
        font-size: var(--usr-text-font-size, 14px);
        text-align: var(--usr-text-align, left);
      }`,
      css`.container {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        border: solid 1px black; 
      }`,
      css`.slot-container {
        align-self: center;
        padding: 0 0.2em 0 0.2em;
      }`,
      css`.time-container {
        display: flex;
        flex-direction: row;
      }`,
      css`.time-container span {
        align-self: center;
        margin-left: 0.18em;
        margin-right: 0.3em;
      }`
    ];
  }

  static get properties() {
    return {
      value: { type: String },
      hour: { type: String },
      minute: { type: String },
      second: { type: String },
      readonly: { type: String },
      disabled: { type: String },
    }
  }
  
  constructor() {
    super();

    this.hour = '00';
    this.minute = '00';
    this.second = '00';
    this.value = null;
    this.readonly = null;
    this.disabled = null;

    this.updateComplete.then(() => {
      this._setAttributes();
    });
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  render () {
    return html`
      <div class="container">
        <div class="slot-container">
          <slot></slot>
        </div>
        <div class="time-container"> 
          <input id="hour" type="text" value="${this.hour}" minlength="2" maxlength="2">
          <span>:</span>
          <input id="minute" type="text" value="${this.minute}" minlength="2" maxlength="2">
          <span>:</span>
          <input id="second" type="text" value="${this.second}" minlength="2" maxlength="2">
          <span>&nbsp;</span>
          <select id="type">
            <option value='--'>--</option>
            <option value='AM'>AM</option>
            <option value='PM'>PM</option>
          </select>
        </div>
      </div>
    `;
  }

  _setClasses() {
  
  }
  
  _setAttributes() {
    if (this.disabled == '' || this.readonly == '') {
      let hourInput = this.shadowRoot.querySelector('#hour');
      let minuteInput = this.shadowRoot.querySelector('#minute');
      let secondInput = this.shadowRoot.querySelector('#second');
      let typeDDL = this.shadowRoot.querySelector('#type');

      if (this.disabled == '') {
        hourInput.setAttribute('disabled', '');
        minuteInput.setAttribute('disabled', '');
        secondInput.setAttribute('disabled', '');
        typeDDL.setAttribute('disabled', '');
      }

      if (this.readonly == '') {
        hourInput.setAttribute('readonly', '');
        minuteInput.setAttribute('readonly', '');
        secondInput.setAttribute('readonly', '');
        typeDDL.setAttribute('readonly', '');
      }
    }
  }
}

window.customElements.define('usr-picker-time', UsrPickerTime);
