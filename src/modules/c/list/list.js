import { LightningElement, api } from "lwc";

export default class List extends LightningElement {
  @api cmp;
  @api items = [];
  @api itemClass = '';

  get formattedItems() {
    return (this.items || []).map((item, idx) => {
      const { key, exportparts, cmp, ...props } = item;
      delete props.class;
      const cmpClass = cmp || this.cmp;
      if (!cmpClass) {
        throw new Error('Missing Component class for list item');
      }
      return {
        cmp: cmpClass,
        key: key || props.id || 'missing-key-' + idx,
        exportparts,
        class: [this.itemClass, item.class].filter(c => c).join(' '),
        props,
      };
    });
  }
}