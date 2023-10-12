import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './accordion.html';
import customTemplate from './custom.html';
import docsTemplate from './docs.html';

export default class Accordion extends StorybookElement {
  static title = 'Accordion';
  static selector = 'c-accordion';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  
  static properties = {
    allowMultipleOpen: true
  };

  static slotContent = `  <c-accordion-item name="first" label="First">
    <p slot="content">...</p>
  </c-accordion-item>
  <c-accordion-item name="second" label="Second">
    <p slot="content">...</p>
  </c-accordion-item>
  <c-accordion-item name="third" label="Third">
    <p slot="content">...</p>
  </c-accordion-item>`;

    static variants = {
    'Custom Accordion': {
      template: customTemplate
    }
  };

  static classes = {
    'jump': 'Remove animation and open/close instantly',
  };

  static styleHooks = {
    '--accordion--transition-property': '',
    '--accordion--transition-duration': '',
    '--accordion--transition-timing-function': ''
  };
  
  static parts = {
    'toggle': 'The toggle button',
    'content': 'The content container'
  }

  static dependencies = [
    ...super.dependencies,
    'c/stylesShared',
    'c/accordionItem'
  ]
}
