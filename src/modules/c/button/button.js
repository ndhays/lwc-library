import { LightningElement, api } from "lwc";

const DEFAULT_VARIANTS = ['brand', 'neutral', 'danger', 'warning', 'success'];
const ALL_VARIANTS = new Set([...DEFAULT_VARIANTS]);

export default class Button extends LightningElement {
  static DEFAULT_VARIANTS = DEFAULT_VARIANTS;
  static delegatesFocus = true;

  @api label;
  @api type = 'button';
  @api variant = this.constructor.DEFAULT_VARIANTS[0];

  get classes() {
    return [
      'button',
    ].join(' ');
  }

  handleKeyDown(event) {
    if (event.code === 'Enter') {
      this.click();
      // this.dispatchEvent(new CustomEvent('click'));
    }
  }

  renderedCallback() {
    ALL_VARIANTS.add(this.variant);
    // remove any other variant classes
    ALL_VARIANTS.forEach(variant => {
      this.classList.toggle(`button-${variant}`, variant === this.variant);
    });
  }
}