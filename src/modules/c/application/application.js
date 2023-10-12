/**
 * All Apps are singletons
 * An App is shared as a singleton across components
 * shared within Javascript context (same namespace w/ LWS)
 */
import Provider from "./provider";
import ProviderBus from "./providerBus";
import ProviderRedux from "./providerRedux";

const DEFAULT_APP_NAME = "__default__";
const DEFAULT_PROVIDER_TYPE = ProviderBus.type;

const apps = {};

export const getApp = (name) => {
  if (!name) {
    return apps[DEFAULT_APP_NAME];
  } else if (!apps[name]) {
    apps[name] = new App(name);
  }
  return apps[name];
}

const providerTypes = {};

export const registerProviderType = (providerType) => {
  if (!providerType instanceof Provider) {
    throw new Error(`Provider Type ${providerType} is not an instance of Provider`);
  }
  providerTypes[providerType.type] = providerType;
}

/* Default Provider Types */
registerProviderType(ProviderBus);
registerProviderType(ProviderRedux);

/**
 *
 * Base class for all Apps
 * (An App is a singleton)
 */
class App {
  name;
  provider = new ProviderBus(); // Pub/Sub used for all connections
  providers = caseFreeObject();
  channels = {};

  constructor(name) {
    this.name = name;
    this.providers[ProviderBus.type] = new ProviderBus();
    this.providers[ProviderRedux.type] = new ProviderRedux();
  }


  subscribeTo(channelOrChannels, callback, invoke) {
    const channels = this.getChannels(channelOrChannels);
    const unsubscribe = []
    channels.forEach(channel => {
      unsubscribe.push(this.provider.subscribe(channel, (message) => {
        const scopedMessage = channels.length > 1 ? { [channel]: message } : message;
        callback(scopedMessage);
      }, invoke));
      // create new channel if necessary
      if (!this.channels[channel]) {
        this.connectChannel(channel, DEFAULT_PROVIDER_TYPE, invoke);
      }
    });
    return () => {
      unsubscribe.forEach(unsub => unsub());
    };
  }

  publishTo(channelOrChannels, message) {
    const channels = this.getChannels(channelOrChannels);
    channels.forEach(channel => {
      this.provider.publish(channel, message);
    });
  }

  requestFrom(channelOrChannels, message) {
    const channels = this.getChannels(channelOrChannels);
    channels.forEach(channel => {
      this.provider.request(channel, { loading: true, params: message });
    });
  }

  connectChannel(channelOrChannels, providerType, invoke = true) {
    const channels = this.getChannels(channelOrChannels);
    let provider = providerType;
    if (!this.providers[provider]) {
      console.error(`Provider type "${provider}" does not exist. (Using default MessageBus)`);
      provider = DEFAULT_PROVIDER_TYPE;
    }
    // perf gain for redux
    if (this.providers[provider].type === 'redux') {
      this.providers[provider].superStore.addSliceIfNotExists(channels);
    }
    channels.forEach(channel => {
      console.info(`Connecting channel "${channel}" to provider "${provider}"`);
      if (this.channels[channel]) {
        this.channels[channel]();
      }
      // subscribes to underlying provider and publish to the main provider
      this.channels[channel] = this.providers[provider].subscribe(channel, (message) => {
        this.provider.publish(channel, message, true);
      }, invoke);
    });
  }

  disconnectChannel(channelOrChannels) {
    const channels = this.getChannels(channelOrChannels);
    channels.forEach(channel => {
      if (this.channels[channel]) {
        this.channels[channel]();
        delete this.channels[channel];
        delete this.provider._prevValues[channel];
      }
    });
  }

  get reduxStore() {
    return this.providers[ProviderRedux.type].superStore;
  }

  getChannels(channels) {
    if (channels === '*') {
      return Object.keys(this.channels);
    }
    if (typeof channels === 'string' || channels instanceof String) {
      return channels.split(',').map(channel => channel.trim()).filter(channel => channel);
    }
    let result = [...channels].filter(channel => channel);
    if (!result.length) {
      throw new Error(`Channel must be a comma-separated string or Array`, channels);
    }
    return result;
  }

}

const caseFreeObject = () => new Proxy({}, {
  get: (target, name) => {
    return target[name.toLowerCase()];
  },
  set: (target, name, value) => {
    target[name.toLowerCase()] = value;
    return true;
  }
});

/* Default Apps */
apps[DEFAULT_APP_NAME] = new App(DEFAULT_APP_NAME);