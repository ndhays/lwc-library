import { wire } from "lwc";
import Provider from "c/provider";
import { CurrentPageReference } from "lightning/navigation";
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';

// import messageChannel from '@salesforce/messageChannel/...';

export default class PlatformProvider extends Provider {
  @wire(CurrentPageReference) pageRef;
  @wire(MessageContext) messageContext;

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        messageChannel,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleMessage(message) {
    this.update(message);
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }
}