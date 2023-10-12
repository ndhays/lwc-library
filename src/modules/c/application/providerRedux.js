import Provider from "./provider";
import SuperStore from "./superStore";

/* This is the Redux provider type class */
export default class ProviderRedux extends Provider {
  
  static type = 'redux';

  constructor() {
    super();
    this.superStore = new SuperStore();
  }

  subscribe(channel, callback, getValueImmediately) {
    let selector = state => state;
    if (this.superStore.selectors()[channel]) {
      selector = this.superStore.selectors()[channel];
    } else if (typeof channel === 'string' && channel !== '*') {
      this.superStore.addSliceIfNotExists(channel);
      // memoizes the slice for the channel
      selector = SuperStore.createSelector(state => state[channel], channelState => channelState); // default
    }
    const selectedState = () => selector(this.superStore.getStore().getState());
    if (getValueImmediately) {
      callback(selectedState());
    }
    return this.superStore.getStore().subscribe(() => {
      callback(selectedState());
    });
  }

  publish(channel, message) {
    this.superStore.actions()[channel].update(message);
  }

  request(channel, message) {
    this.superStore.actions()[channel].update(message);
  }

  createApi() {

  }
}
