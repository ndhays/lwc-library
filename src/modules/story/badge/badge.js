import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './badge.html';
import docsTemplate from './docs.html';

export default class Badge extends StorybookElement {
  static category = 'UI Library'
  static title = 'Badge';
  static selector = 'c-badge';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  
  static properties = {

  }

}
