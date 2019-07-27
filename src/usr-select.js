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
      css`.container {
        display: flex;
        flex-direction: row;
        width: 100%;
        border: solid 1px gray;
      }`,
      css`.slot-container {
        flex-basis: 12px;
        flex-grow: 1;
        align-self: center;
        text-align: center;
        width: fit-content;
        white-space: nowrap;
        padding: 0 0.2em 0 0.2em;
        border: solid 0px gray;
      }`,
      css`.value-container {
        flex-grow: 100;
        padding: 2px;
        box-sizing: border-box;
        border: solid 0px gray;
      }`,
      css`.value-container:hover {
        cursor: pointer;
      }`,
      css`.value-container div {
        display: inline-block;
        padding-top: 1px;
        border: solid 1px gray;
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
      css`.value-container > .text:hover {
        cursor: pointer;
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
      css`li div {
        display: inline-block;
      }`,
      css`li div:nth-child(1) {
        width: 16px;
        color: green;
        text-align: center;
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
      { value: '1', text:'abitem 1' },
      { value: '2', text:'acitem 2' },
      { value: '3', text:'baitem 3' },
      { value: '4', text:'bbitem 4' },
      { value: '5', text:'eitem 5' },
      { value: '6', text:'fitem 6' },
      { value: '7', text:'gitem 7' },
      { value: '8', text:'hitem 8' },
      { value: '9', text:'iitem 9' },
      { value: '10', text:'jitem 10' },
      { value: '11', text:'kitem 11' },
      { value: '12', text:'litem 12' },
      { value: '13', text:'mitem 13' },
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

    this._valueContainerWidth = this.shadowRoot.querySelector('.container').offsetWidth;
    this._onDocClick = this.onDocClick.bind(this);
    document.addEventListener('click', this._onDocClick, false);

    this._checkSlotContent();
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
        <div class="slot-container">
          <slot></slot>
        </div>
        <div class="value-container" 
          @mouseenter="${this.onMouseenter}" 
          @mouseleave="${this.onMouseleave}"
        >
          <input readonly class="text" value="${this._text}" 
            placeholder="${this.placeholder}" @click="${this.onTextClick}" 
          >
          <div class="icon" @click="${this.onTextClick}">&#9660</div>
        </div>
      </div>
      <div 
        style="${styleMap({'min-width':this._valueContainerWidth+'px'})}" 
        class="${classMap(this._listHide?{hide:true,'list-container':true}:{show:true,'list-container':true})}"
      >
        ${this._listBody}
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

    let prevSpan = this.shadowRoot.querySelector('li .show');

    if (prevSpan != null) {
      prevSpan.classList.remove('show');
      prevSpan.classList.add('hide');
    }

    let target = event.currentTarget;
    let value = target.getAttribute('value');
    let span = target.querySelector('div:nth-child(1)>span');

    if (value != '') {
      span.classList.add('show');
    }

    this.value = value;
  }

  onDocClick(event) {
    this._listHide = true;
    this.requestUpdate();
  }

  onMouseenter(event) {
    this._onDocKeyup = this.onDocKeyup.bind(this);
    document.addEventListener('keyup', this._onDocKeyup, false);
  }

  onMouseleave(event) {
    if (this._onDocKeyup != null) {
      document.removeEventListener('keyup', this._onDocKeyup, false);
    }
  }

  onDocKeyup(event) {
    let key = event.key;
    let date = new Date();
    let currTime = date.getTime();
    
    let setValue = key => {
      let itemData = this._search(key);

      if (itemData) {
        this.value = itemData.value;
      }
    };

    if (this._prevTime == 0) { // Perfoem single char search 
      this._prevTime = currTime;
      this._prevInput = key;
      setValue(key);
    } else {
      if (currTime - this._prevTime < timeDiff) { // Perfoem 2-char search 
        let input = `${this._prevInput}${key}`;
        setValue(input);
      } else {
        setValue(key);
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

  _checkSlotContent() {
    let slot = this.shadowRoot.querySelector('slot');
    let hasSlotContent = false;

    if (slot == null) {
      return;
    }

    let nodes = slot.assignedNodes();

    if (nodes && nodes.length > 0) {
      for (let n of nodes) {
        if (n.tagName) {
          hasSlotContent = true;
          return;
        }
      }
    }

    if (!hasSlotContent) {
      let classList = this.shadowRoot.querySelector('.slot-container').classList;
      classList.remove('slot-container');
      classList.add('hide');
    }
  }

  _search(key) {
    if (key && this._dataSource && Array.isArray(this._dataSource)) {
      return this._dataSource.find(i => i.text.startsWith(key));
    }

    return null;
  }

  _getNode(val) {
    return this.shadowRoot.querySelector('li[value=${val}]');
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
      <ul @mouseenter="${this.onMouseenter}" @mouseleave="${this.onMouseleave}">
        ${repeat(this.dataSource, item => `${i++}`, (item, index) => 
          html`
            <li @click="${this.onItemClick}" value="${item.value}">
              <div><span class="hide">&#10004;</span></div>
              <div>${item.text}</div>
            </li>
          `
        )}
      </ul>
    `;
  }
}

window.customElements.define('usr-select', UsrSelect);
