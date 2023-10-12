/* This is the basic extensible Pub/Sub class */
/**
 * To extend, the following methods must be implemented:
 * - action(channel)
 * - subscribe(channel, callback)
 */
export default class Provider {
  
  /* Unique name for the type */
  static type = '';

  /* Library of actions */
  // registeredActions = {};

  /* Action should dispatch / publish messages to all subscribers */
  get actions() {
    return new Proxy(this.registeredActions, {
      get: (target, prop) => {
        if (target[prop]) {
          return target[prop];
        }
        throw new Error(`Missing action: ${prop} needs to be implemented for ${this.constructor.type}`);
      }
    });
  }

  /* Subscribe to a channel */
  subscribe(channel, callback, invoke) {
    throw new Error(`Missing: subscribe(channel, callback, invoke) needs to be implemented for ${this.constructor.type}`);
  }

  /* Publish to a channel */
  publish(channel, message) {
    throw new Error(`Missing: publish(channel, message) needs to be implemented for ${this.constructor.type}`);
  }

  request(channel, message) {
    throw new Error(`Missing: request(channel, message) needs to be implemented for ${this.constructor.type}`);
  }

}
