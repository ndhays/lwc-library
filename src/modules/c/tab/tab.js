import { LightningElement, api } from "lwc";

export default class Tab extends LightningElement {
  @api label;

  @api set tabId(value) {
    this._tabId = value;
  }
  get tabId() {
    return this._tabId || this.label.toLowerCase().replace(/ /g, '-');
  }

  @api lazyload;

  @api selected;

  @api disabled;

  get renderTab() {
    return !this.lazyload || this.selected;
  }

  renderedCallback() {
    this.setAttribute('id', this.tabId);
  }
}