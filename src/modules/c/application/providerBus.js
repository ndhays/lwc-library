import Provider from './provider';

/* This is the default Pub/Sub class */
export default class ProviderBus extends Provider {
  
  static type = 'MessageBus';

  subscribers = {};
  _prevValues = {};
  _idx = 0;

  subscribe(channel, callback, getValueImmediately) {
    this._idx += 1;
    const idx = this._idx;
    if (!this.subscribers[channel]) {
      this.subscribers[channel] = {};
    }
    this.subscribers[channel][idx] = callback;

    if (getValueImmediately) {
      callback(this._prevValues[channel]);
    }
    return () => {
      delete this.subscribers[channel][idx];
      if (Object.keys(this.subscribers[channel]).length === 0) {
        delete this.subscribers[channel];
      }
    }
  }

  publish(channel, data, failSilently) {
    if (!this.subscribers[channel] && !failSilently) {
      console.info(`No subscribers for ${channel}`, data);
      return;
    }
    this._prevValues[channel] = data;
    let subscribers = Object.values(this.subscribers['*'] || []); // wildcard subscriber
    subscribers = subscribers.concat(Object.values(this.subscribers[channel] || []));
    subscribers.forEach((callback) => callback(data));
  }

  request(channel, params) {
    this.publish(channel, params);
  }

}
