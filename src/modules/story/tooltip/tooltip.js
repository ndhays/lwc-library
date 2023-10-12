import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './tooltip.html';
import docsTemplate from './docs.html';

export default class Tooltip extends StorybookElement {
  static title = 'Tooltip';
  static selector = 'c-tooltip';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;

  static slotContent = `  <button slot="trigger">Hover over or focus me to see a tooltip.</button>
  <span slot="tooltip">This is a basic tooltip.</span>`;

  static dependencies = [
    ...super.dependencies,
    'c/stylesShared',
  ]
}