import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import { styleMap } from 'lit-html/directives/style-map';
import { classMap } from 'lit-html/directives/class-map';

const fromAttribute = attr => JSON.parse(unescape(attr));
const toAttribute = prop => escape(JSON.stringify(prop));
const timeDiff = 800; // In milliseconds

export class UsrSelect extends LitElement {
  static get styles() {
    return [
      css`:host {
        width: var(--usr-select-width, 100%);
        display: inline-block;
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
      css`.slot-container {
        align-self: center;
        padding: 0 0.2em 0 0.2em;
      }`,
      css`.container {
        width: 100%;
      }`,
      css`.value-container {
        box-sizing: border-box;
        display: inline-block;
        width: 100%;
        display: block;
        padding: 2px;
        border: solid 1px gray;
      }`,
      css`.value-container:hover {
        cursor: pointer;
      }`,
      css`.value-container div {
        display: inline-block;
        border: solid 0px gray;
      }`,
      css`.value-container .text {
        width: calc(100% - 35px);
        box-sizing: border-box;
        padding: 1px 1px 1px 0px;
        border-style: none;
        outline: 0px;
        font-size: var(--usr-text-font-size, 14px);
        text-align: var(--usr-text-align, left);
      }`,
      css`.value-container .icon {
        width: 20px;
        float: right;
        text-align: center;
      }`,
      css`.list-container {
        position: absolute;
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: scroll;
        margin-top: 1px;
        box-sizing: border-box;
        border: solid 1px gray;
        background-color: white;
        opacity: 1;
        z-index: var(--usr-select-list-z-index, 100);
      }`,
      css`ul {
        width: 100%;
        box-sizing: border-box;
        margin: 0px;
        padding-left: 0px;
        border: solid 0px red;
      }`,
      css`li {
        width: 100%;
        box-sizing: border-box;
        padding-right: 10px;
        list-style-type: none;
        text-align: left;
        padding: 0.3em;
      }`,
      css`li:hover {
        background-color: rgb(36, 106, 243);
        color: white;
        cursor: pointer;
      }`,
      css`.hide {
        display: none;
      }`,
      css`.show {
        display: block;
      }`
    ];
  }

  static get properties() {
    return {
      value: { 
        type: String, 
        reflect: false 
      },
      placeholder: {
        type: String,
        reflect: false
      },
      dataSource: {
        type: Array,
        reflect: false,
        converter: { 
          fromAttribute, 
          toAttribute 
        },
        attribute: 'data-source'
      },
      firstItemValue: { 
        type: String, 
        reflect: false, 
        attribute: 'first-item-value'
      },
      firstItemText: { 
        type: String, 
        reflect: false, 
        attribute: 'first-item-text'
      }
    };
  }

  constructor() {
    super();

    // Observables
    this.placeholder = '';
    this.firstItemValue = null;
    this.firstItemText = null;

    // Non-obervables
    this._dataSource = [];
    this._value = '1';
    this._listHide = true;
    this._prevTime = 0;
    this._prevInput = '';
    this._onDocClick = null;
    this._onDocKeyup = null;
    this._valueContainerWidth = 0;
    this._dataSource = [
      { value: '1', text:'item 1' },
      { value: '2', text:'item 2' },
      { value: '3', text:'item 3' },
      { value: '4', text:'item 4' },
      { value: '5', text:'item 5' },
      { value: '6', text:'item 6' },
      { value: '7', text:'item 7' },
      { value: '8', text:'item 8' },
      { value: '9', text:'item 9' },
      { value: '10', text:'item 10' },
      { value: '11', text:'item 11' },
      { value: '12', text:'item 12' },
      { value: '13', text:'item 13' },
      { value: '14', text:'item 14' },
      { value: '15', text:'item 15' },
      { value: '16', text:'item 16' }
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    if (this._useEmptyItem) {
      this._dataSource.unshift({
        value: this.firstItemValue, 
        text: this.firstItemText 
      });
    }

    this._valueContainerWidth = this.shadowRoot.querySelector('.value-container').offsetWidth;
    this._onDocClick = this.onDocClick.bind(this);
    document.addEventListener('click', this._onDocClick, false);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._onDocClick != null) {
      document.removeEventListener('click', this._onDocClick, false);
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="value-container">
          <input readonly class="text" value="${this._text}" 
            placeholder="${this.placeholder}" @click="${this.onTextClick}" 
          >
          <div class="icon" @click="${this.onTextClick}">&#9660</div>
        </div>
        <div 
          style="${styleMap({'min-width':this._valueContainerWidth+'px'})}" 
          class="${classMap(this._listHide?{hide:true,'list-container':true}:{show:true,'list-container':true})}"
        >
          ${this._listBody}
        </div>
      </div>
    `;
  }

  onTextClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this._listHide = false;
    this.requestUpdate();
  }

  onItemClick(event) {
    event.preventDefault();
    event.stopPropagation();

    this.value = event.target.getAttribute('value');
  }

  onDocClick(event) {
    this._listHide = true;
    this.requestUpdate();
  }

  onListMouseenter(event) {
    this._onDocKeyup = this.onDocKeyup.bind(this);
    document.addEventListener('keyup', this._onDocKeyup, false);
  }

  onListMouseleave(event) {
    if (this._onDocKeyup != null) {
      document.removeEventListener('keyup', this._onDocKeyup, false);
    }
  }

  onDocKeyup(event) {
    let key = event.key;
    let date = new Date();
    let currTime = date.getTime();
    
    if (this._prevTime == 0) {
      this._prevTime = currTime;
      this._prevInput = key;
      let input = key;
      console.log(1, input);
    } else {
      if (currTime - this._prevTime < timeDiff) {
        let input = this._prevInput + key;
        console.log(2, input);
      }

      this._prevTime = 0;
      this._prevInput = '';
    }
  }

  set dataSource(val) {
    let oldValue = this._dataSource;
    this._dataSource = val;
    this.requestUpdate('dataSource', oldValue);
  }

  get dataSource() {
    return this._dataSource;
  }

  set value(val) {
    let oldValue = this._value;
    this._value = val;
    this.requestUpdate('value', oldValue);
  }

  get value() {
    return this._value;
  }

  get _useEmptyItem() {
    if (this.firstItemValue != null || this.firstItemText  != null) {
      if (this.firstItemValue == null) {
        this.firstItemValue = '';
      }

      if (this.firstItemText == null) {
        this.firstItemText = '';
      }

      return true;
    }

    return false;
  }

  _search(key) {
    if (key && this._dataSource && Array.isArray(this._dataSource)) {
      return this._dataSource.find(i => i.text.startsWith(key));
    }

    return null;
  }

  get _text() {
    if (this._dataSource && Array.isArray(this._dataSource)) {
      let item = this._dataSource.find(i => i.value == this._value);

      if (item) {
        return item.text;
      } else {
        return '';
      }
    }

    return '';
  }

  get _listBody() {
    let i = 0;

    return html`
      <ul @mouseenter="${this.onListMouseenter}" @mouseleave="${this.onListMouseleave}">
        ${repeat(this.dataSource, item => `${i++}`, (item, index) => 
          html`
            <li @click="${this.onItemClick}" value="${item.value}">
              <span style="color:green;">&#10004;</span>
              <span>${item.text}</span>
            </li>
          `
        )}
      </ul>
    `;
  }
}

window.customElements.define('usr-select', UsrSelect);
