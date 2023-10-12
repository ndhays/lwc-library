import { LightningElement, api } from "lwc";

export default class Tablist extends LightningElement {

  @api set selected(tabId) {
    this._selected = tabId;
    this.reset();
  }
  get selected() {
    return this._selected;
  }
  _selected;

  instructions = 'Use arrow keys to choose tabs. Content for the chosen tab will be revealed below.';

  tabs = [];

  get liveTabs() {
    return [...this.querySelectorAll('c-tab')];
  }

  handleSlotChange(event) {
    if (!this.selected) { // first time ?
      const selectedTab = this.liveTabs.find(tab => tab.selected) || this.liveTabs[0];
      this._selected = selectedTab.tabId;
    }
    this.reset();
  }

  handleClick(event) {
    event.preventDefault();
    const { owns } = event.currentTarget.dataset;
    this.changeTab(owns);
  }

  handleKeyDown(event) {
    if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
      const tabs = this.liveTabs;
      const currentIdx = tabs.findIndex(tab => tab.tabId === this.selected);
      let nextIdx = event.code === 'ArrowLeft' ? currentIdx - 1 : currentIdx + 1;
      if (nextIdx < 0) {
        nextIdx = tabs.length - 1;
      }
      if (nextIdx >= tabs.length) {
        nextIdx = 0;
      }
      const nextTab = tabs[nextIdx] || tabs[0];
      this.changeTab(nextTab.tabId);
      this.template.querySelector(`a[data-owns="${nextTab.tabId}"]`).focus();
    }
  }

  changeTab(tabId) {
    this._selected = tabId;
    this.reset();
    this.dispatchEvent(new CustomEvent('change', { detail: { tabId } }));
  }

  reset() {
    this.tabs = this.liveTabs.map((tab, idx) => {
      const id = tab.getAttribute('id');
      if (!tab.label) {
        tab.label = `Tab ${idx + 1}`;
      }
      const selected = this.selected === tab.tabId;
      tab.selected = selected;
      tab.style = selected ? 'display: block;' : 'display: none;';
      const parts = [
        'tab',
        (selected ? 'tab-selected' : ''),
        (idx === 0 ? 'tab-first' : ''),
        (idx === this.liveTabs.length - 1 ? 'tab-last' : ''),
      ]
      return {
        id,
        part: parts.join(' '),
        href: `#${id}`,
        selected,
        controls: id,
        tabIndex: selected ? 0 : -1,
        owns: tab.tabId,
        label: tab.label,
      };
    });
  }

}