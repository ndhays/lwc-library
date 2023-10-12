import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './tablist.html';
import docsTemplate from './docs.html';

export default class Tablist extends StorybookElement {
  static title = 'Tabs';
  static selector = 'c-tablist';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  static properties = {}

  static classes = {
    file: 'Style the tabs like files in a filing cabinet'
  }
  
  static parts = {
    tabs: 'The tabs container',
    tab: 'The tab element',
    'tab-selected': 'The selected tab element',
    'tab-content': 'The tab content container'
  }

  static slotContent = `  <c-tab label="Tab 1">
    <h1>Tab One</h1>
    <p>Lorem ipsum dolor sit amet...</p>
  </c-tab>
  <c-tab label="Tab 2" selected>
    <h1>Tab Two</h1>
    <p>Lorem ipsum...</p>
  </c-tab>
  <c-tab label="Tab 3">
    <h1>Tab Three</h1>
    <p>...</p>
  </c-tab>`;

  static variants = {
    'Custom Tabs': {
      classes: ['tabs-funky']
    }
  }

  static dependencies = [
    ...super.dependencies,
    'c/stylesShared',
    'c/tab'
  ]
}
