import StorybookElement from 'sb/storybookElement';
import ButtonLWC from 'c/button';

import defaultTemplate from './button.html';
import docsTemplate from './docs.html';

export default class Button extends StorybookElement {
  static category = 'Base UI'
  static title = 'Button';
  static selector = 'c-button';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;

  static events = ['click'];

  static classes = {
    'button-brand': 'Applies brand button styles',
    'button-neutral': 'Applies neutral button styles',
    'button-danger': 'Applies danger button styles',
    'button-warning': 'Applies warning button styles',
    'button-success': 'Applies success button styles',
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
    label: 'Button label',
    variant: 'brand',
  }

  static propertyOptions = {
    variant: ButtonLWC.DEFAULT_VARIANTS.concat('custom-purple')
  }

}
