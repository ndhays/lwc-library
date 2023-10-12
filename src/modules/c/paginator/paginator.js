import { LightningElement, api } from "lwc";

export default class Paginator extends LightningElement {

  @api perPage = 10;
  @api total;
  @api set page(val) {
    this._page = val;
  }
  get page() {
    return this._page;
  }
  _page = 1;

  get totalPages() {
    return Math.ceil(this.total / this.perPage);
  }

  get itemStart() {
    return (this.page - 1) * this.perPage + 1;
  }

  get itemEnd() {
    return Math.min(this.page * this.perPage, this.total);
  }

  get isFirstPage() {
    return this._page === 1;
  }
  
  get isLastPage() {
    return this._page === this.totalPages;
  }

  handlePrevious() {
    this._page--;
    this.notify();
  }

  handleNext() {
    this._page++;
    this.notify();
  }

  notify() {
    this.dispatchEvent(new CustomEvent('change', { detail: { page: this.page } }));
  }
  
  get pageItems() {
    return this.algorithm().map((item, idx) => ({
      label: item,
      value: item,
      class: [
        'page-item',
        item === this.page ? 'page-item-active' : '',
      ].join(' '),
      isCurrent: item === this.page,
      key: 'item-' + idx,
    }));
  }

  handlePage(evt) {
    const { page } = evt.target.dataset;
    if (page === '...') {
      return;
    }
    this._page = parseInt(page, 10);
    this.notify();
  }

  /* from @zacfukuda */
  algorithm() {
    let items = [1];
    
    if (this.page === 1 && this.totalPages === 1) {
      return items;
    }
    if (this.page > 4) {
      items.push('...');
    }
  
    let r = 2, r1 = this.page - r, r2 = this.page + r;
  
    for (let i = r1 > 2 ? r1 : 2; i <= Math.min(this.totalPages, r2); i++) {
      items.push(i);
    }
  
    if (r2 + 1 < this.totalPages) {
      items.push('...');
    }
    if (r2 < this.totalPages) {
      items.push(this.totalPages);
    }
  
    return items;
  }
}