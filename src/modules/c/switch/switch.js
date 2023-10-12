import { LightningElement, api } from "lwc";

export default class Switch extends LightningElement {
  @api label;
  @api labelWhenOn = 'on';
  @api labelWhenOff = 'off';
  @api set isOn(val) {
    this._isOn = val;
  }
  get isOn() {
    return this._isOn;
  }

  @api name;
  @api value;
  @api disabled;

  _isOn;
  handleChange() {
    if (this.disabled) {
      return;
    }
    this._isOn = !this._isOn;
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this._isOn }
      })
    );
  }
}
