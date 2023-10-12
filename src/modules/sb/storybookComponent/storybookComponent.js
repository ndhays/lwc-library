import { LightningElement, api } from "lwc";
import ComponentLibrary from 'sb/storybookLibrary';
import defaultTemplate from './storybookComponent.html';
import storyTemplate from './story.html';

export default class StorybookComponent extends LightningElement {
  static delegatesFocus = true;
  
  @api componentName;
  @api variant;

  @api isDocumentation;
  @api showGrid;

  @api setProps(props) {
    Object.keys(props).forEach(prop => {
      this.refs.dynamic.setProperty(prop, props[prop]);
    });
  }

  @api setClasses(classes) {
    this.refs.dynamic.setClasses(classes);
  }

  @api setPropsCSS(props) {
    Object.keys(props).forEach(prop => {
      this.refs.dynamic.setPropertyCSS(prop, props[prop]);
    });
  }

  /* Sets on the parent / container to pierce down through Shadow DOM */
  @api setPropsCSSTheme(props) {
    Object.keys(props).forEach(prop => {
      this.refs.dynamic.style.setProperty(prop, props[prop]);
    });
  }

  @api getCurrentCSSValue(name) {
    return this.refs.dynamic.getCurrentCSSValue(name);
  }

  get cmpConstructor() {
    return ComponentLibrary[this.componentName];
  };

  render() {
    return this.componentName ? storyTemplate : defaultTemplate;
  }

  renderedCallback() {
    if (this.refs?.dynamic) {
      // sets initial values
      // props
      const component = ComponentLibrary[this.componentName];
      let props = component.properties || {};
      props = { ...props, ...component.variants[this.variant]?.properties || {} };
      Object.keys(props).forEach(prop => {
        if (!(component.disabledProps || []).includes(prop)) {
          this.refs.dynamic.setProperty(prop, props[prop]);
        }
      });
      // classes
      let classes = ComponentLibrary[this.componentName].variants[this.variant]?.classes || [];
      this.refs.dynamic.setClasses(classes.reduce((acc, cls) => ({ ...acc, [cls]: true }), {}));
    }
  }
}