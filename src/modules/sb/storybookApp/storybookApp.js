import { LightningElement, api, track } from 'lwc';
import ComponentLibrary from 'sb/storybookLibrary';
import { ThemeLibrary } from 'theme/themeLibrary';
import StorybookWelcome from 'sb/storybookWelcome';

ComponentLibrary.StorybookWelcome = StorybookWelcome; // info / story documentation component (default)

import { getApp } from 'c/application';

export default class StorybookApp extends LightningElement {

  defaultComponent = 'StorybookWelcome';

  selectedComponent = this.defaultComponent;
  selectedVariant = 'Default';

  selectedTheme = 'Light';

  componentListOpen = true;
  defaultCategory = 'UI Library';
  categoryOrder = ['Documentation', 'Base UI', 'UI Library', 'Utilities', 'Application', 'External'];

  isOpen = {};
  get componentsByCategory() {
    return Object.entries(ComponentLibrary).reduce((allCmp, [key, cmp]) => {
      const category = cmp.category || this.defaultCategory;
      let list = allCmp.find(c => c.name === category);
      if (!list) {
        list = { name: category, components: [] };
        allCmp.push(list);
      }
      // NOTE: use 'key' not cmp.name bc prod minimization makes class 'name' different
      list.components.push({
        title: cmp.title,
        name: key,
        variants: Object.keys(cmp.variants || {}).filter(variant => variant !== 'Default').map(variant => ({
          name: variant,
          isCustom: !!variant.match('Custom'),
          isSelected: (key === this.selectedComponent) && (variant === this.selectedVariant),
        })),
        isSelected: key === this.selectedComponent,
        isOpen: this.isOpen[key] || key === this.selectedComponent,
      });
      return allCmp;
    }, [])
    .map(category => ({ ...category, components: category.components.sort((a, b) => a.title.localeCompare(b.title)) }))
    .sort((a, b) => this.categoryOrder.indexOf(a.name) - this.categoryOrder.indexOf(b.name));
  }

  @track computedCss = {};
  renderedCallback() {
    const css = ComponentLibrary[this.selectedComponent]?.themeHooks || {};
    Object.keys(css).forEach(key => {
      if (this.refs.component) {
        this.computedCss[key] = this.refs.component.getCurrentCSSValue(key);
      }
    });
    if (this._restoreComponent && this.refs.component) {
      this._restoreComponent = false;
      this.refs.component.setProps(this.changedProps);
      this.refs.component.setPropsCSS(this.changedPropsCSS);
      this.refs.component.setPropsCSSTheme(this.changedPropsCSSTheme);
      this.refs.component.setClasses(this.changedClasses);
    }
    if (this._keepTab && this.refs.tabs) {
      this.refs.tabs.selected = this._keepTab;
      this._keepTab = null;
    }
  }

  connectedCallback() {
    getApp().connectChannel('theme', 'redux');
    getApp().reduxStore.actions().theme.update({ currentTheme: this.selectedTheme });
  }

  disconnectedCallback() {
    getApp().disconnectChannel('theme');
  }

  /* THEMES */
  themes = Object.keys(ThemeLibrary);
  get themeComponent() {
    return ThemeLibrary[this.selectedTheme];
  }
  
  loading;
  loadingDelay = 0;
  handleApplyTheme(event) {
    const theme = event.currentTarget.value;
    this.loading = true;
    this.selectedTheme = theme;
    this.refs.app.getApp().reduxStore.actions().theme.update({ currentTheme: theme });
    this._restoreComponent = true;
    this._keepTab = this.refs.tabs.selected;
    setTimeout(() => {
      this.refs.controls.resetData();
      this.loading = false;
    }, this.loadingDelay);
  }

  handleToggleComponent(event) {
    const { name } = event.currentTarget.dataset;
    if (this.selectedComponent === name) {
      if (this.selectedVariant === 'Default') {
        this.selectedComponent = this.defaultComponent;
        this.isOpen[name] = false;
      }
    } else {
      this.selectedComponent = name;
      this.isOpen[name] = true;
    }
    this.selectedVariant = 'Default';
    this.refresh();
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.refs.controls?.reset();
      this.refs.toggle.focus();
    }, this.loadingDelay);
  }

  handleSelectVariant(event) {
    const { name, variant } = event.currentTarget.dataset;
    this.loading = true;
    this.selectedComponent = name;
    this.selectedVariant = variant;
    this.refresh();
    setTimeout(() => {
      this.refs.controls?.reset();
    }, 10);
    setTimeout(() => {
      this.loading = false;
      this.refs.toggle.focus();
    }, this.loadingDelay);
  }

  refresh() {
    this.changedProps = {};
    this.changedPropsCSS = {};
    this.changedPropsCSSTheme = {};
    this.changedClasses = {};
    this.events = [];
  }

  @track events = [];
  handleStorybookEvent(event) {
    event.stopPropagation();
    const { name, payload } = event.detail;
    this.events.push({ key: this.events.length, name, payload });
  }

  @track changedProps = {};
  @track changedPropsCSS = {};
  @track changedPropsCSSTheme = {};
  @track changedClasses = {};
  
  handlePropChange(event) {
    const { name, value, type, isTheme } = event.detail;
    if (type === 'prop') {
      this.changedProps[name] = value;
      this.refs.component.setProps(this.changedProps);
    } else if (type === 'css') {
      if (isTheme) {
        this.changedPropsCSSTheme[name] = value;
        this.refs.component.setPropsCSSTheme(this.changedPropsCSSTheme);
      } else {
        this.changedPropsCSS[name] = value;
        this.refs.component.setPropsCSS(this.changedPropsCSS);
      }
    } else if (type === 'cssclass') {
      this.changedClasses = { ...value };
      this.refs.component.setClasses(this.changedClasses);
    } else if (type === 'dataset') {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 50);
    }
  }

  handleToggleComponentList() {
    this.componentListOpen = !this.componentListOpen;
  }

  get componentHasPreview() {
    return !ComponentLibrary[this.selectedComponent]?.noPreview;
  }

  get componentHasCode() {
    return !ComponentLibrary[this.selectedComponent]?.noCode;
  }

  code = '';
  copyText = 'Copy Code';
  handleTabChange({ detail }) {
    if (detail.tabId === 'code') {
      this.code = this.refs.controls.getHTMLCode();
      if (this.refs.code && this.code.length && window.hljs) {
        this.refs.code.innerHTML = this.code;
        window.hljs.highlightElement(this.refs.code);
      }
    }
  }

  handleCopyHTMLCode() {
    navigator.clipboard.writeText(this.refs.controls.getHTMLCode(true));
    this.copyText = 'Copied!';
    setTimeout(() => {
      this.copyText = 'Copy Code';
    }, 1000);
  }

  showGrid;
  handleToggleGrid() {
    this.showGrid = !this.showGrid;
  }
}