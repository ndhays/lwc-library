import { LightningElement, api } from "lwc";
import ComponentLibrary from 'sb/storybookLibrary';

export default class StorybookControls extends LightningElement {
  
  @api selectedComponent;
  @api selectedVariant;
  @api computedCss = {};
  @api events = [];

  controlsOpen = false;

  changedProps = {};
  changedPropsCSS = {};
  classes = {};
  
  @api reset() {
    this.changedProps = {};
    this.changedPropsCSS = {};
    this.classes = {};
    this.selectedTab = 'Props';
    if (this._renderedOnce) {
      this._resetData();
    }
  }

  @api resetData() {
    this._resetData();
  }
  
  selectedTab = 'props';

  get tabs() {
    return ['Props', 'Methods', 'Events', 'Style', 'Theme', 'Application', 'Dependencies'].map(tab => ({
      name: tab,
      isActive: this.selectedTab === tab,
      count: tab === 'Events' ? this.events.length : undefined,
      show: this.controlsOpen
    }));
  }

  get tabIs() {
    return this.tabs.reduce((acc, tab) => ({ ...acc, [tab.name]: tab.isActive }), {});
  }

  get component() {
    return ComponentLibrary[this.selectedComponent];
  }

  get props() {
    const defaultProps = this.component?.properties || {};
    let props = this.component?.variants?.[this.selectedVariant]?.properties || {};
    return { ...defaultProps, ...props, ...this.changedProps };
  }

  get disabledProps() {
    return (this.component?.disabledProps || []).concat(
      'subscribeTo',
    );
  }

  tooltip(prop) {
    const tooltips = {
      subscribeTo: 'This is the name of the channel for provider data (See "Application" Tab for more.)',
      ...this.component?.tooltips
    }
    return tooltips[prop];
  }

  get formattedProps() {
    const props = this.props;
    const disabledProps = this.disabledProps;
    return Object.keys(props).map(prop => {
      let inputType = "text";
      if (typeof props[prop] === "boolean") {
        inputType = "toggle";
      }
      if (typeof props[prop] === "number") {
        inputType = "number";
      }
      let value = this.changedProps.hasOwnProperty(prop) ? this.changedProps[prop] : props[prop];
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      if (typeof value === 'function') {
        disabledProps.push(prop);
        value = 'ƒ Function() ... this property value is a function or class definition';
      }
      const options = this.component?.propertyOptions?.[prop] || [];
      return {
        name: prop,
        value,
        checked: typeof props[prop] === "boolean" && props[prop],
        type: typeof props[prop],
        tooltip: this.tooltip(prop),
        disabled: disabledProps.includes(prop),
        options: options.map(option => ({ label: option, value: option, isSelected: option === value })),
        inputType,
        inputClass: [
          "border p-1",
          inputType === "text" ? "w-full" : ""
        ].join(" "),
        isToggle: inputType === "toggle",
        isJson: typeof props[prop] === "object",
      };
    });
  }

  @api getHTMLCode(unsafe) {
    const component = this.component;
    if (component.staticCode) {
      return component.staticCode;
    }
    if (component.variants[this.selectedVariant]?.codeType === 'CSS') {
      return this.CSSCode;
    }
    const selector = component.selector;
    let slotContent = component.slotContent || component.variants[this.selectedVariant]?.slotContent || '';
    slotContent = slotContent ? `\n${slotContent}\n` : '';
    let props = this.props;
    const toDashCase = (str) => str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
    let result = `<${selector}`;
    const variantClasses = component.variants[this.selectedVariant]?.classes || [];
    const classes = variantClasses.concat(Object.keys(this.classes).map(className => this.classes[className] ? className : '')
      .filter(className => !!className)).join(' ');
    result = classes ? result + ` class="${classes}"` : result;
    let propsResult = Object.keys(props).filter(prop => props[prop])
      .map(prop => {
        if (typeof props[prop] === 'boolean') {
          return props[prop] ? ('  ' + toDashCase(prop)) : '';
        }
        if (['function', 'object'].includes(typeof props[prop])) {
          return `  ${toDashCase(prop)}={${prop}}`;
        }
        return `  ${toDashCase(prop)}="${props[prop]}"`;
      }).join('\n');
    result = propsResult ? result + `\n${propsResult}\n` : result;
    // add events
    const events = new Set(this.events.map(({ name }) => name));
    events.forEach(event => {
      result = result + `  on${event}={handle${event[0].toUpperCase() + event.slice(1)}}\n`;
    });
    result = result + `>${slotContent}</${selector}>`;
    // escape html
    if (!unsafe) {
      result = result.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return result;
  }

  get CSSCode() {
    const component = this.component;
    let content = '';
    this.cssVarsTheme.forEach(({ name, value }) => {
      const realValue = this.changedPropsCSS.hasOwnProperty(name) ? this.changedPropsCSS[name] : (value || this.computedCss[name]);
      content = content + `${name}: ${realValue};\n`;
    });
    return content;
  }

  get cssVars() {
    const defaultCss = this.component?.styleHooks || {};
    let css = this.component?.variants?.[this.selectedVariant]?.styleHooks || {};
    css = { ...defaultCss, ...css };
    const getValue = prop => this.changedPropsCSS.hasOwnProperty(prop) ? this.changedPropsCSS[prop] : (css[prop] || this.computedCss[prop]);
    return Object.keys(css).map(prop => ({
      name: prop,
      value: getValue(prop) || '',
      tooltip: this.component?.tooltips?.[prop],
    }));
  }

  get cssParts() {
    const parts = this.component?.parts || {};
    return Object.keys(parts).map(part => ({
      name: part,
      description: parts[part]
    }));
  }

  get cssVarsTheme() {
    const defaultCss = this.component?.themeHooks || {};
    let css = this.component?.variants?.[this.selectedVariant]?.themeHooks || {};
    css = { ...defaultCss, ...css };
    const getValue = prop => this.changedPropsCSS.hasOwnProperty(prop) ? this.changedPropsCSS[prop] : (css[prop] || this.computedCss[prop]);
    return Object.keys(css).map(prop => ({
      name: prop,
      value: getValue(prop) || '',
      tooltip: this.component?.tooltips?.[prop],
    }));
  }

  get cssClasses() {
    let css = this.component?.classes || {};
    const isToggled = this.component?.variants?.[this.selectedVariant]?.classes || [];
    return Object.keys(css).map(prop => ({
      name: prop,
      description: css[prop],
      toggled: !!isToggled.includes(prop)
    }));
  }

  get methods() {
    return this.component?.methods || [];
  }

  get sources() {
    return (this.component?.sources || []).map((source) => ({
      ...source,
      providerDataSets: source.providerDataSets.map((dataSet) => ({
        ...dataSet,
        isSelected: this.selectedDataSets[source.name] === dataSet.name,
      })),
      providerDelays: this.providerDelays.map((delay) => ({
        ...delay,
        isSelected: this.selectedDelays[source.name] === String(delay.value),
      })),
    }));
  }

  get dependencies() {
    return (this.component?.dependencies || []).map((dependency) => {
      return typeof dependency === 'string' ? { name: dependency, version: 'beta' } : dependency;
    });
  }

  handleToggleControls() {
    this.controlsOpen = !this.controlsOpen;
  }

  handleToggleTab(event) {
    const { tab } = event.currentTarget.dataset;
    this.selectedTab = tab;
  }

  handleCopyThemeCode() {
    navigator.clipboard.writeText(this.CSSCode);
  }

  handlePropChange(event) {
    const { name, json } = event.currentTarget.dataset;
    let newValue;
    if (event.detail) { // switch
      newValue = event.detail.value;
    } else if (event.currentTarget.type === "number") {
      newValue = parseInt(event.currentTarget.value);
    } else if (event.currentTarget.type === "text") {
      newValue = event.currentTarget.value;
      if (json === "true") {
        try {
          newValue = JSON.parse(newValue);
          event.currentTarget.dataset.error = false;
        } catch (e) {
          event.currentTarget.dataset.error = true;
          return;
        }
      }
    } else if (event.currentTarget.type === "select-one") {
      newValue = event.currentTarget.value;
    }
    this.changedProps[name] = newValue;
    this.dispatchEvent(new CustomEvent('propchange', { detail: {
      name,
      value: newValue,
      type: 'prop'
    } }));
  }

  handlePropChangeKeyup(event) {
    const { json } = event.currentTarget.dataset;
    if ((json !== "true") || (event.key === "Enter")) {
      this.handlePropChange(event);
    }
  }

  handleClassChange(event) {
    const { classname } = event.currentTarget.dataset;
    this.classes = { ...this.classes, [classname]: !!event.detail.value };
    this.dispatchEvent(new CustomEvent('propchange', { detail: {
      value: this.classes,
      type: 'cssclass'
    } }));
  }

  handlePropCSSChange(event) {
    const { name, theme } = event.currentTarget.dataset;
    let newValue = event.currentTarget.value;
    this.changedPropsCSS[name] = newValue;
    this.dispatchEvent(new CustomEvent('propchange', { detail: {
      name,
      value: newValue,
      type: 'css',
      isTheme: !!theme
    } }));
  }

  _debounceCSSChange;
  handlePropCSSChangeKeyup(event) {
    let value = event.currentTarget.value;
    const { json, name, theme } = event.currentTarget.dataset;
    const isNumerical = value.match(/^([0-9\.]+)(rem|px)$/);
    if (isNumerical && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      if (event.key === "ArrowUp") {
        value = parseFloat(isNumerical[1]) + 1 + isNumerical[2];
      } else if (event.key === "ArrowDown") {
        value = parseFloat(isNumerical[1]) - 1 + isNumerical[2];
      }
      event.currentTarget.value = value;
      this.handlePropCSSChange(event);
    } else {
      clearTimeout(this._debounceCSSChange);
      this._debounceCSSChange = setTimeout(() => {
        if ((json !== "true") || (event.key === "Enter")) {
          this.changedPropsCSS[name] = value;
          this.dispatchEvent(new CustomEvent('propchange', { detail: {
            name, value, type: 'css', isTheme: !!theme
          } }));
        }
      }, 500);
    }
  }

  renderedCallback() {
    this._renderedOnce = true;
  }

  selectedDataSets = {};
  _resetData() {
    if (this.sources.length) {
      this.sources.forEach((source) => {
        const initialSet = source.providerDataSets[0].name;
        this.selectedDataSets[source.name] = initialSet;
        this.helperLoadData(source.name);
      });
    }
  }

  handleChangeProviderDataSet(event) {
    const { source } = event.currentTarget.dataset;
    const selectedSet = event.currentTarget.value;
    this.selectedDataSets[source] = selectedSet;
    this.helperLoadData(source);
    this.dispatchEvent(new CustomEvent('propchange', { detail: {
      type: 'dataset',
    }}));
  }

  selectedDelays = {};
  get providerDelays () {
    return [
      { label: 'No Delay', value: 1 },
      { label: '1 second', value: 1000 },
      { label: '2 seconds', value: 2000 },
      { label: '5 seconds', value: 5000 },
      { label: '100 seconds', value: 100000 },
    ];
  }
  handleChangeProviderDelay(event) {
    const { source } = event.currentTarget.dataset;
    const delay = event.currentTarget.value;
    this.selectedDelays[source] = delay;
    this.helperLoadData(source);
    this.dispatchEvent(new CustomEvent('propchange', { detail: {
      type: 'dataset',
    }}));
  }

  _setupRedux;
  async helperLoadData(source, params) {
    if (!this._setupRedux) {
      this.refs.app.getApp().connectChannel(this.channels, 'redux');
      this._setupRedux = true;
    }
    const selectedSet = this.selectedDataSets[source];
    const dataSet = this.sources.find(({ name }) => name === source).providerDataSets
      .find(({ name }) => name === selectedSet);
    const data = await dataSet.data(params || dataSet.params);
    await new Promise(r => setTimeout(r, this.selectedDelays[source] || 200));
    this.refs.app.getApp().reduxStore.actions()[source].update({ loading: false, data });
  }

  get channels() {
    return this.sources.map(({ name }) => name);
  }

  handleAppMessage({ detail }) {
    Object.keys(detail || {}).forEach(async (source) => {
      if (source === 'loading' && detail[source]) {
        this.helperLoadData(this.channels[0], detail.params);
      }
      if (detail[source]?.loading) {
        if (this.channels.includes(source)) {
          this.helperLoadData(source, detail[source].params);
        }
      }
    });
  }
}