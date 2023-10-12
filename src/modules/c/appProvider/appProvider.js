import { LightningElement, api } from "lwc";
import { getApp } from "c/application";

export default class AppProvider extends LightningElement {

  get application() {
    return getApp(); // allows for future multi-app support
  }

  @api invoke;
  @api showLoading = false;

  // channel can be a string, comma-separated, or an array
  @api set subscribeTo(val) {
    this._channels = val;
    this.renewSubscriptions();
  }
  get subscribeTo() {
    return this._channels;
  }

  get channels() {
    if (typeof this._channels === 'string' || this._channels instanceof String) {
      return this._channels.split(',').map(channel => channel.trim()).filter(channel => channel);
    }
    return [...this._channels].filter(channel => channel);
  }

  @api getApp() {
    return getApp();
  }

  loading = true;
  get showLoadingSlot() {
    return this.showLoading && this.loading;
  }

  showLoadingIfNecessary(message) {
    if (this.showLoading && typeof message === 'object' && message.loading !== undefined) {
      this.loading = message.loading;
    }
  }

  subscriptions = {};
  renewSubscriptions() {
    if (this.channels.length) {
      this.unsubscribe();
      this.channels.forEach(channel => {
        this.subscriptions[channel] = this.application.subscribeTo(channel, (message) => {
          this.showLoadingIfNecessary(message);
          this.notify(channel, message);
        }, this.invoke);
      });
    }
  }

  notify(channel, message) {
    // scope message to channel if multiple channels
    const detail = this.channels.length > 1 ? { [channel]: message } : message;
    this.dispatchEvent(new CustomEvent("message", { detail }));
  }

  unsubscribe() {
    Object.values(this.subscriptions).forEach((subscription) => subscription());
    this.subscriptions = {};
  }

  disconnectedCallback() {
    this.unsubscribe();
  }

}