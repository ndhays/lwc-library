import { LightningElement, api } from "lwc";

export default class Link extends LightningElement {
  static delegatesFocus = true;

  @api label;
  @api href;
  @api target = "_blank";

  get classes() {
    return 'link';
  }

  handleKeyDown(event) {
    if (event.code === 'Enter') {
      this.click();
      // this.dispatchEvent(new CustomEvent('click'));
    }
  }
}