import StorybookElement from 'sb/storybookElement';
import defaultTemplate from './default.html';
import docsTemplate from './docs.html';
import './helloWorld';

export default class Solid extends StorybookElement {
  static category = 'External';
  static title = 'Hello World (SolidJS)';
  static selector = 'hello-world';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  static properties = {
    name: 'World'
  }

}