import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './heading.html';
import docsTemplate from './docs.html';

export default class Heading extends StorybookElement {
  static category = 'Base UI';
  static title = 'Heading';
  static selector = 'c-heading';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  static properties = {
    level: 1,
  }

  static slotContent = '  The quick brown fox jumps over the lazy dog'

  static classes = {
    'h1': 'styles any heading level with h1 theme styles',
    'h2': 'styles any heading level with h2 theme styles',
    'h3': 'styles any heading level with h3 theme styles',
    'h4': 'styles any heading level with h4 theme styles',
    'h5': 'styles any heading level with h5 theme styles',
    'h6': 'styles any heading level with h6 theme styles',
  }

  static styleHooks = {
    '--heading--font-size': '',
    '--heading--font-weight': '',
    '--heading--line-height': '',
  }

  static themeHooks = {
    '--h1--font-size': '',
    '--h1--font-weight': '',
    '--h1--line-height': '',
    '--h2--font-size': '',
    '--h2--font-weight': '',
    '--h2--line-height': '',
    '--h3--font-size': '',
    '--h3--font-weight': '',
    '--h3--line-height': '',
    '--h4--font-size': '',
    '--h4--font-weight': '',
    '--h4--line-height': '',
    '--h5--font-size': '',
    '--h5--font-weight': '',
    '--h5--line-height': '',
    '--h6--font-size': '',
    '--h6--font-weight': '',
    '--h6--line-height': '',
  }

  static tooltips = {
    level: 'This property controls the semantic HTML heading level. It can be any value 1-6.',
    '--heading--font-size': 'Use this property to set the font size of a heading that is outside of the standard h1-h6 theme styles',
    '--heading--font-weight': 'Use this property to set the font weight of a heading that is outside of the standard h1-h6 theme styles',
    '--heading--line-height': 'Use this property to set the line height of a heading that is outside of the standard h1-h6 theme styles',
  }

  static dependencies = [
    ...super.dependencies,
    'c/stylesShared',
  ]

}
