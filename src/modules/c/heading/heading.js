import { LightningElement, api } from 'lwc';

import h1 from './h1.html';
import h2 from './h2.html';
import h3 from './h3.html';
import h4 from './h4.html';
import h5 from './h5.html';
import h6 from './h6.html';

import headingStyles from './heading.css';

const templates = {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6
};

export default class Heading extends LightningElement {
  static stylesheets = [headingStyles];

  @api level = 'h1';

  get formattedLevel() {
    // add h if necessary
    const level = String(this.level).toLowerCase();
    if (level.length === 1) {
      return `h${level}`;
    }
    return level;
  }
  
  render() {
    return templates[this.formattedLevel] || templates['h1'];
  }
}