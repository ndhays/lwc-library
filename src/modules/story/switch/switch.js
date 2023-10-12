import StorybookElement from 'sb/storybookElement';

import defaultTemplate from './switch.html';
import docsTemplate from './docs.html';

export default class Switch extends StorybookElement {
  static title = 'Switch';
  static selector = 'c-switch';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  static properties = {
    label: 'Switch',
    isOn: false,
  }

  static variants = {
    'With Visual Cue': {
      properties: {
        isOn: true,
      },
      classes: ['show-check']
    },
    'With Additional Labeling': {
      classes: ['show-check', 'show-labels'],
      properties: {
        isOn: true,
        labelWhenOff: 'De-activated',
        labelWhenOn: 'Activated!',
      }
    },
    'Custom Switch': {
      classes: ['switch-custom']
    }
  }

  static events = ['change'];

  static classes = {
    'jump': 'Removes the "slide" transition animation',
    'cursor-default': 'Changes the cursor to a normal cursor',
    'square': 'Makes the switch square instead of round',
    'show-check': 'Shows a checkmark visual cue when the switch is on',
    'show-labels': 'Shows additional labels for increased clarity / accessibility'
  }

  static parts = {
    'wrapper': 'the container element',
    'slider': 'the sliding element',
    'label-off': 'the label for when the switch is off (requires "show-labels" class)',
    'label-on': 'the label for when the switch is on (requires "show-labels" class)',
  }

  static styleHooks = {
    '--switch--background-color': '',
    '--switch--border--color': '',
    '--switch--border--style': '',
    '--switch--border--width': '',
    '--switch--box-shadow': '',
    '--switch--height': '',
    '--switch--width': '',
    '--switch--isOn--background-color': '',
    '--switch--isOn--border': '',
    '--switch--isOn--box-shadow': '',
  }

  static themeHooks = {
    '--switch--background-color': 'var(--color--secondary)',
    '--switch--isOn--background-color': 'var(--color--primary)',
  }

  static dependencies = [
    ...super.dependencies,
    'c/stylesShared',
  ]

}
