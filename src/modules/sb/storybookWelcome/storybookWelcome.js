import StorybookElement from 'sb/storybookElement';
import docsTemplate from './docs.html';

export default class StorybookWelcome extends StorybookElement {
  static category = 'Documentation';
  static title = 'Welcome';
  static selector = 'lwc-component';
  static docsTemplate = docsTemplate;
  static noPreview = true;
  static noCode = true;

}