import { LightningElement, api } from "lwc";
import anime from './anime.min.js';
import Library from './library.js';

export default class Animation extends LightningElement {
  @api layer;
  @api name;
  @api pinFor;

  @api animationData = {};
  @api selector;

  @api get anime() {
    return anime;
  }

  get animation() {
    return this.name;
  }

  get layerClasses() {
    return [
      'layer',
      'layer-' + this.layer,
      this.pinFor ? 'pin' : '',
      this.animation
    ].join(' ');
  }

  get layerCmp() {
    return this.template.querySelector('.layer');
  }

  handleIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('animation--> ', this.pinFor, this.animation)
        entry.target.classList.add('animate');
        this.dispatchEvent(new CustomEvent('animate'));
        this._observer.unobserve(entry.target);
        this.animate();
      } else {
        entry.target.classList.remove('animate');
      }
    });
  }

  _observer;
  createObserver() {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    if (this._observer) {
      this._observer.disconnect();
    }
    this._observer = new IntersectionObserver(this.handleIntersect.bind(this), options);
    this._observer.observe(this.layerCmp);
  }

  renderedCallback() {
    this.createObserver();
    this.prepare();
  }

  disconnectedCallback() {
    this._observer.disconnect();
  }

  prepare() {
    const layerContainer = this.template.querySelector('.layer-container');
    layerContainer.style.visibility = 'hidden';
    if (this.pinFor) {  
      let pinFor = parseInt(this.pinFor);
      if (this.pinFor.match(/vh$/)) {
        pinFor = window.innerHeight * pinFor / 100;
      }
      layerContainer.style.height = this.layerCmp.offsetHeight + pinFor + 'px';
    }
  }

  animate() {
    const layerContainer = this.template.querySelector('.layer-container');
    layerContainer.style.visibility = 'visible';
    if (this.animation) {
      const animation = Library[this.animation];
      if (!animation) {
        throw new Error('Animation not found', this.animation);
      }
      anime({
        targets: this.layerCmp,
        ...animation,
        // begin: () => {
        //   console.log('begin!');
        // },
        complete: () => {
          this.dispatchEvent(new CustomEvent('animationcomplete'));
        }
      });
    } else if (this.animationData) {
      this.animateCustom();
    }
  }

  animateCustom() {
    const targets = this.querySelectorAll(this.selector || '.layer-container');
    anime({
      targets,
      ...this.animationData,
      // begin: () => {
      //   console.log('begin!');
      // },
      complete: () => {
        this.dispatchEvent(new CustomEvent('animationcomplete'));
      }
    })

  }
}