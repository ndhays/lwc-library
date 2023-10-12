import { LightningElement, api } from "lwc";

export default class Tooltip extends LightningElement {
  @api focusable;

  inactive = true;

  get tooltipClass() {
    return this.inactive ? "tooltip tooltip--inactive sr-only" : "tooltip";
  }

  handleSlotChange() {
    if (this.focusable) {
      this.querySelectorAll(this.focusable).forEach((element) => {
        element.addEventListener("focus", this.handleActivate.bind(this));
        element.addEventListener("blur", this.handleDeactivateBlur.bind(this));
      });
    }
  }

  disconnectedCallback() {
    if (this.focusable) {
      this.querySelectorAll(this.focusable).forEach((element) => {
        element.removeEventListener("focus", this.handleActivate.bind(this));
      });
    }
  }

  handleKeyPress(event) {
    if (event.key === "Escape") {
      this.inactive = true;
    }
  }

  handleActivate() {
    this.inactive = false;
  }

  handleDeactivate() {
    this.inactive = true;
  }

  handleDeactivateBlur() {
    setTimeout(() => {
      const focusedWithin = this.template.querySelector('slot:focus-within');
      if (!focusedWithin) {
        this.inactive = true;
      }
    }, 0);
  }
}