import StorybookElement from 'sb/storybookElement';
import defaultTemplate from './appProvider.html';
import applicationTemplate from './application.html';
import providerTypesTemplate from './providerTypes.html';

export default class AppProvider extends StorybookElement {
  static category = 'Application';
  static title = 'App Provider';
  static selector = 'c-app-provider';
  static docsTemplate = defaultTemplate;
  static properties = {
  
  }

  static disabledProps = [
    'subscribeTo',
    'showLoading',
    'invoke'
  ];

  static tooltips = {
    'subscribeTo': 'Channel name(s) to subscribe to - use "*" for wildcard to subscribe to all channels',
    'showLoading': 'Boolean to show loading spinner based on message payload\'s "loading" property value',
    'invoke': 'Boolean to invoke the callback function immediately with the last message received on the channel'
  };

  static noPreview = true;
  static noCode = true;

  static events = ['message'];

  static methods = [
    {
      name: 'getApp',
      description: 'returns application object with pub/sub and provider type API'
    }
  ];

  static dependencies = [
    ...super.dependencies,
    'c/application',
    { name: '@reduxjs/toolkit', version: '1.9.5', size: '32kb', link: 'https://redux-toolkit.js.org/' },
  ]

  static variants = {
    'Default': {
      properties: {
        'subscribeTo': 'getCards',
        'showLoading': true,
        'invoke': false,
      }
    },
    'Application (JS)': {
      docsTemplate: applicationTemplate,
    },
    'Provider Types': {
      docsTemplate: providerTypesTemplate,
    },
  }

  _loading = true;
  handleTriggerAppEvent() {
    this._loading = !this._loading;
    this.template.querySelector('c-app-provider').getApp().publishTo('storybookLoading', { loading: this._loading });
  }

}