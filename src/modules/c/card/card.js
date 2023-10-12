import { LightningElement, api } from "lwc";

export default class Card extends LightningElement {
  @api title;
  @api description;
  @api image;
  @api imageAltText;
}