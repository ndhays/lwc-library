import { LightningElement, api } from 'lwc';

export default class AccordionItem extends LightningElement {
  @api name;
  @api label;
  @api expanded = false;

  headingLevel = 3;

  handleClick() {
    this.dispatchEvent(new CustomEvent('toggle', { bubbles: true, composed: true }));
  }

  renderedCallback() {
    const content = this.template.querySelector('.accordion-item-content');
    const final = () => {
      content.style.display = this.expanded ? 'block' : 'none';
      content.removeEventListener('transitionend', final);
    }
    if (content) {
      // calculate height and change style property
      content.style.display = 'block';
      const height = this.expanded ? content.scrollHeight : 0;
      const transitionProperties = getComputedStyle(content).transitionProperty.split(',').map((p) => p.trim());
      content.style.height = `${height}px`;
      content.addEventListener('transitionend', final);
    }
  }
}