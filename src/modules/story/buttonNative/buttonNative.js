import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './buttonNative.html';
import docsTemplate from './docs.html';

export default class ButtonNative extends StorybookElement {
  static category = 'Base UI'
  static title = 'Button (native)';
  static selector = 'button';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;

  static events = ['click'];

  static classes = {
    'no-transition': 'Removes button transition styles'
  };

  static styleHooks = {
    '--button--bg-color': '',
    '--button--bg-color-hover': '',
    '--button--border': '',
    '--button--border-color-hover': '',
    '--button--border-radius': '',
    '--button--color': '',
    '--button--color-hover': '',
    '--button--padding': '',
    '--button--transition-duration': '',
    '--button--transition-property': '',
    '--button--transition-timing-function': ''
  };

  static properties = {

  }

}
