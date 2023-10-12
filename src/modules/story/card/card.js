import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './card.html';
import docsTemplate from './docs.html';

export default class Card extends StorybookElement {
  static title = 'Card';
  static selector = 'c-card';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;

  static properties = {
    title: 'Card',
    description: 'This is a card',
    image: '/public/assets/placeholder.png',
    imageAltText: 'Placeholder image',
  }

  static classes = {
    'inverse': 'Inverse color scheme'
  }

  static dependencies = [
    ...super.dependencies,
    'c/stylesShared'
  ]
}
