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
      css`select {
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
      readonly: { type: String },
      disabled: { type: String },
    }
  }
  
  constructor() {
    super();

    // Observales
    this.value = null;
    this.readonly = null;
    this.disabled = null;

    // Non-observables
    this.hour = '00';
    this.minute = '00';
    this.second = '00';
    this.system = '--';
    this.inputId = 'hour';

    this.updateComplete.then(() => {
      this._setAttributes();
    });
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
    
    if (name == 'value') {
      let val = newValue;
      this._setTimeParts(val);
    }
  }

  render () {
    return html`
      <div class="container">
        <div class="slot-container">
          <slot></slot>
        </div>
        <div class="time-container"> 
          <input 
            id="hour" 
            type="text" 
            minlength="2" 
            maxlength="2"
            value="${this.hour}" 
            @input="${this.onInput}" 
            @focus="${this.onFocus}" 
            @blur="${this.onBlur}">
          <span>:</span>
          <input 
            id="minute" 
            type="text" 
            minlength="2" 
            maxlength="2"
            value="${this.minute}" 
            @input="${this.onInput}" 
            @focus="${this.onFocus}" 
            @blur="${this.onBlur}">
          <span>:</span>
          <input 
            id="second" 
            type="text" 
            minlength="2" 
            maxlength="2"
            value="${this.second}" 
            @input="${this.onInput}" 
            @focus="${this.onFocus}" 
            @blur="${this.onBlur}">
          <span>&nbsp;</span>
          <select 
            id="system" 
            @change="${this.onChange}"
            @focus="${this.onFocus}" 
            @blur="${this.onBlur}">
            <option value='--'>--</option>
            <option value='AM'>AM</option>
            <option value='PM'>PM</option>
          </select>
        </div>
      </div>
    `;
  }

  onChange(event) {
    let prevSystem = this.system;
    this.system = event.target.value;

    if (prevSystem == '--') {
      let hour = parseInt(this.hour);
      
      if (hour >= 12 && hour < 22) {
        this.hour = `0${String(hour - 12)}`;
        this.shadowRoot.querySelector('#hour').value = this.hour;
      }

      if (hour >= 22) {
        this.hour = String(hour - 12);
        this.shadowRoot.querySelector('#hour').value = this.hour;
      }
    }
  }

  onFocus(event) {
    event.target.style.backgroundColor = 'lightblue';
    this.shadowRoot.host.classList.add('usr-focus');
  }

  onBlur(event) {
    event.target.style.backgroundColor = '';
    this.shadowRoot.host.classList.remove('usr-focus');
    this._formatValue(event);
  }

  onInput(event) {
    this.inputId = event.target.id;
    
    switch(this.inputId) {
      case 'hour':
        this._maskHour(event);
        break;
      case 'minute':
        this._maskMinute(event);
        break;
      case 'second':
        this._maskSecond(event);
    }
  }

  set value(val) {
    let oldValue = this._value;
    this._value = val;
    this._setTimeParts(val);
    this.requestUpdate('value', oldValue);
  }

  get value() {
    this._value = `${this.hour}:${this.minute}:${this.second} ${this.system}`;
    return this._value;
  }

  _setTimeParts(val) {
    if (val == null || val == '') {
      return;
    }

    let [hour, minute, second, system] = val.replace(/ /g, ':').split(':');
      
    this.system = this._systemValid(system) ? system : '--';
    this.hour = this._hourValid(system, hour) ? hour : '00';
    this.minute = this._minuteValid(system, minute) ? minute : '00';
    this.second = this._secondValid(system, second) ? second : '00';

    if (!this._systemValid(system) || !this._hourValid(system, hour) || 
      !this._minuteValid(system, minute) || !this._secondValid(system, second)) {
      console.error('Time input is not in correct format.');
    }
  }
  
  _setAttributes() {
    if (this.disabled == '' || this.readonly == '') {
      let hourInput = this.shadowRoot.querySelector('#hour');
      let minuteInput = this.shadowRoot.querySelector('#minute');
      let secondInput = this.shadowRoot.querySelector('#second');
      let systemDDL = this.shadowRoot.querySelector('#type');

      if (this.disabled == '') {
        hourInput.setAttribute('disabled', '');
        minuteInput.setAttribute('disabled', '');
        secondInput.setAttribute('disabled', '');
        systemDDL.setAttribute('disabled', '');
      }

      if (this.readonly == '') {
        hourInput.setAttribute('readonly', '');
        minuteInput.setAttribute('readonly', '');
        secondInput.setAttribute('readonly', '');
        systemDDL.setAttribute('readonly', '');
      }
    }
  }

  _systemValid(system) {
    return (['--', 'AM', 'am', 'PM', 'pm'].includes(system)) ;
  }

  _hourValid(system, hour) {
    if (!this._systemValid(system)) {
      return false;
    }

    if (!isNaN(hour)) {
      if (system == '--') {
        return parseInt(hour) >= 0 && parseInt(hour) <= 23;
      } else {
        return parseInt(hour) >= 0 && parseInt(hour) <= 11;
      }
    } else {
      return false;
    }
  }

  _minuteValid(system, minute) {
    if (!this._systemValid(system)) {
      return false;
    }

    if (!isNaN(minute)) {
      return parseInt(minute) >= 0 && parseInt(minute) < 60;
    } else {
      return false;
    }
  }

  _secondValid(system, second) {
    if (!this._systemValid(system)) {
      return false;
    }

    if (!isNaN(second)) {
        return parseInt(second) >= 0 && parseInt(second) < 60;
    } else {
      return false;
    }
  }

  _maskHour(event) {
    const { value: val, selectionStart: start } = event.target;

    if (val == '' || val == this.hour) {
      this.hour = val;
    }

    if (val != '' && !isNaN(val)) { 
      if (this.system == '--') {
        if (parseInt(val) >= 0 && parseInt(val) < 24) {
          this.hour = val;
        } else {
          event.target.value = this.hour;
          event.target.setSelectionRange(start, start);
        } 
      }

      if (this.system != '--') {
        if (parseInt(val) >= 0 && parseInt(val) < 12) {
          this.hour = val;
        } else {
          event.target.value = this.hour;
          event.target.setSelectionRange(start, start);
        }
      }
    } else {
      event.target.value = this.hour;
      event.target.setSelectionRange(start, start);
    }
  }

  _maskMinute(event) {
    const { value: val, selectionStart: start } = event.target;

    if (val == '' || val == this.minute) {
      this.minute = val;
    }

    if (val != '' && !isNaN(val)) { 
      if (parseInt(val) >= 0 && parseInt(val) < 60) {
        this.minute = val;
      } else {
        event.target.value = this.minute;
        event.target.setSelectionRange(start, start);
      } 
    } else {
      event.target.value = this.minute;
      event.target.setSelectionRange(start, start);
    }
  }

  _maskSecond(event) {
    const { value: val, selectionStart: start } = event.target;

    if (val == '' || val == this.second) {
      this.second = val;
    }

    if (val != '' && !isNaN(val)) { 
      if (parseInt(val) >= 0 && parseInt(val) < 60) {
        this.second = val;
      } else {
        event.target.value = this.second;
        event.target.setSelectionRange(start, start);
      } 
    } else {
      event.target.value = this.second;
      event.target.setSelectionRange(start, start);
    }
  }

  _formatValue(event) {
    const { id, value: val } = event.target;

    if (!['hour', 'minute', 'second'].includes(id) || val.length == 2) {
      return;
    }

    if (val.length == 0) {
      this[id] = '00';
    } else if (val.length == 1) {
      this[id] = `0${val}`;
    }

    this.shadowRoot.querySelector(`#${id}`).value = this[id];
  }
}

window.customElements.define('usr-picker-time', UsrPickerTime);
