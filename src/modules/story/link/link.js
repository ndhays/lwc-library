import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './link.html';
import docsTemplate from './docs.html';

export default class Link extends StorybookElement {
  static category = 'Base UI'
  static title = 'Link';
  static selector = 'c-link';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;

  static events = ['click'];

  static classes = {
    'no-transition': 'Removes button transition styles'
  };

  static styleHooks = {
    '--link--bg-color': '',
    '--link--bg-color-hover': '',
    '--link--border': '',
    '--link--border-color-hover': '',
    '--link--border-radius': '',
    '--link--color': '',
    '--link--color-hover': '',
    '--link--padding': '',
    '--link--transition-duration': '',
    '--link--transition-property': '',
    '--link--transition-timing-function': ''
  };

  static properties = {
    label: 'Link label',
    href: 'https://www.google.com'
  }

}
