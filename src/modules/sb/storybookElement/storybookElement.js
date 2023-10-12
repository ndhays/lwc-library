import { LightningElement, api, track } from "lwc";
import missingTemplate from './storybookElement.html';
import contextStyles from './context.css';
import resetStyles from './reset.css';
import revertStyles from './revert.css';
import utilStyles from './util.css';

import { getApp } from 'c/application';

/* This is the base class for all storybook elements. */

export default class extends LightningElement {
  static stylesheets = [contextStyles, resetStyles, revertStyles, utilStyles];

  static title = 'Storybook Element';
  static selector = '*';
  static variants = {};
  static template = missingTemplate;
  static docsTemplate = missingTemplate;
  static staticCode = ''; // static code to show in "Code" tab
  static events = [];
  static classes = {};
  static styleHooks = {};
  static parts = {};
  static slots = {};
  static themeHooks = {};

  static sources = [];
  static dependencies = [];

  static disabledProps = [];

  @api variant = 'Default';
  get variantIs() {
    return ['Default'].concat(Object.keys(this.constructor.variants))
      .reduce((acc, variant) => ({ ...acc, [variant]: this.variant === variant }), {});
  }

  @api isDocumentation;

  @track props = {};

  get myCmp() {
    return this.template.querySelector(this.constructor.selector);
  }

  @api setProperty(prop, value) {
    if (this.myCmp) {
      this.props[prop] = value;
      if (this.myCmp[prop] !== value) {
        this.myCmp[prop] = value;
      }
    }
  }

  @api setPropertyCSS(prop, value) {
    if (this.myCmp) {
      this.myCmp.style.setProperty(prop, value);
    }
  }

  @api getCurrentCSSValue(name) {
    if (this.myCmp) {
      return getComputedStyle(this.myCmp).getPropertyValue(name);
    }
  }

  @api setClasses(classes) {
    if (this.myCmp) {
      Object.keys(classes).sort().forEach(className => {
        this.myCmp.classList.toggle(className, classes[className]);
      });
    }
  }

  render() {
    let template = this.constructor.template;
    const docsTemplate = this.constructor.docsTemplate;
    if (this.constructor.variants) {
      const variant = this.constructor.variants[this.variant];
      template = this.isDocumentation ? (variant?.docsTemplate || docsTemplate) : (variant?.template || template);
    }
    return template || missingTemplate;
  }

  connectedCallback() {
    this.subscription = getApp().subscribeTo("theme", ({ currentTheme }) => {
      if (currentTheme) {
        this.changeTheme(currentTheme);
      }
    }, true);
  }

  disconnectedCallback() {
    if (this.myCmp) {
      this.constructor.events.forEach((event) => {
        this.myCmp.removeEventListener(event, this.handleEvent.bind(this));
      });
    }
    this.subscription();
  }

  _eventsSetup;
  renderedCallback() {
    if (this._renderThemeOnceRendered) {
      this.changeTheme(this._theme);
    }
    if (this.myCmp && !this._eventsSetup) {
      this._eventsSetup = true;
      this.constructor.events.forEach((event) => {
        this.myCmp.addEventListener(event, this.handleEvent.bind(this));
      });
    }
    // const code = this.template.querySelectorAll('code');
    // code.forEach((codeElement) => {
    //   window.hljs.highlightElement(codeElement);
    // });
  }

  changeTheme(theme) {
    if (this.myCmp) {
      if (this._theme) {
        this.myCmp.classList.toggle(`theme-${this._theme.toLowerCase()}`, false); // remove old theme
      }
      this.myCmp.classList.toggle(`theme-${theme.toLowerCase()}`, true);
    } else {
      this._renderThemeOnceRendered = true;
    }
    this._theme = theme;
    
  }

  handleEvent(event) {
    this.dispatchEvent(new CustomEvent('storybook', {
      detail: {
        name: event.type,
        payload: JSON.stringify(event.detail)
      },
      bubbles: true,
      composed: true
    }));
  }
}