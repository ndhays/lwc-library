import StorybookElement from 'sb/storybookElement';
import defaultTemplate from './animation.html';
import docsTemplate from './docs.html';

export default class Animation extends StorybookElement {
  static category = 'Utilities';
  static title = 'Animation';
  static selector = 'c-animation';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  static properties = {};

  static dependencies = [
    ...super.dependencies,
    { name: 'animeJS (included)', version: '3.2.1', size: '18kb', link: 'https://animejs.com/' }
  ]

  renderedCallback() {
    super.renderedCallback();
    const firstTargets = this.template.querySelectorAll('h3 span');
    const secondTargets = this.template.querySelectorAll('h3');
    if (!this.refs) return;
    this.refs.animeJS.anime.timeline({ loop: true })
      .add({
        targets: firstTargets,
        scale: [3, 1],
        opacity: [0, 1],
        translateZ: 1,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el, i) => 70 * i
      }).add({
        targets: secondTargets,
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }
}