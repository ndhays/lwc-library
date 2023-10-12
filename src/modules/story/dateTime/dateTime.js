import StorybookElement from 'sb/storybookElement';
import defaultTemplate from './dateTime.html';
import docsTemplate from './docs.html';

export default class DateTime extends StorybookElement {
  static category = 'Utilities';
  static title = 'Date Time';
  static selector = 'div';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  static properties = {}
}