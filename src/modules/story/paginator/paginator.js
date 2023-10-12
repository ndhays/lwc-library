import StorybookElement from 'sb/storybookElement';
import defaultTemplate from './paginator.html';
import docsTemplate from './docs.html';

export default class Paginator extends StorybookElement {
  static category = 'Utilities';
  static title = 'Paginator';
  static selector = 'c-paginator';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  static properties = {
    perPage: 10,
    total: 100,
    page: 5
  }
  static events = ['change']
}