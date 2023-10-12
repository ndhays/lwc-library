import { LightningElement, api } from 'lwc';

export default class Accordion extends LightningElement {
  @api set allowMultipleOpen(val) {
    this._allowMultipleOpen = val;
    if (!val) {
      this.items.forEach((item) => { item.expanded = false; });
    }
  }
  get allowMultipleOpen() {
    return this._allowMultipleOpen || false;
  }

  get items() {
    // ensure component has 'expanded' property
    return [...this.querySelectorAll('c-accordion-item')];
  }

  handleToggle(event) {
    event.stopPropagation();
    if (this.allowMultipleOpen) {
      event.target.expanded = !event.target.expanded;
      event.target.classList.toggle('accordion-item-expanded', event.target.expanded);
    } else {
      this.items.forEach((item) => {
        item.expanded = (item === event.target) && !item.expanded;
        item.classList.toggle('accordion-item-expanded', item.expanded);
      });
    }
  }
  
  handleSlotChange(evt) {
    this.items.forEach((item) => {
      item.setAttribute('exportparts', 'toggle content');
    });
    this.items[this.items.length - 1].classList.add('accordion-item-last');
  }

}