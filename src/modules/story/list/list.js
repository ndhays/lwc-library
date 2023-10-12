import StorybookElement from 'sb/storybookElement';
import Card from 'c/card';
import cardExampleTemplate from './cardExample.html';
import docsTemplate from './docs.html';

const cardMaker = (id) => {
  const images = [
    { src: "/public/assets/placeholder.png", alt: "Placeholder image" },
    { src: "/public/assets/recipes-logo.png", alt: "Recipes" },
  ]
  const randomImage = images[Math.floor(Math.random() * images.length)];
  return {
    id: id,
    title: "Card " + id,
    description: "This is card " + id,
    image: randomImage.src,
    imageAltText: randomImage.alt,
  }
}

export default class List extends StorybookElement {
  static category = 'Utilities';
  static title = 'List';
  static selector = 'c-list';
  
  static template = cardExampleTemplate;
  static docsTemplate = docsTemplate;

  static properties = {
    cmp: '',
    items: [],
  };

  static tooltips = {
    'cmp': 'Component (class constructor) to use for each item in the list',
    'items': 'List of items to display in the list (all items must have a valid "key" property)'
  }

  static variants= {
    'Default': {
      template: cardExampleTemplate,
      properties: {
        cmp: Card,
        itemClass: 'inverse',
        items: [
          cardMaker(1),
          cardMaker(2),
          cardMaker(3),
          cardMaker(4),
          cardMaker(5),
          cardMaker(6),
          cardMaker(7),
          cardMaker(8),
          cardMaker(9),
          cardMaker(10),
        ].map((item) => ({
          id: item.id,
          key: item.id,
          exportparts: 'card',
          title: item.title,
          description: item.description,
          image: item.image,
          imageAltText: item.imageAltText,
        })),
      }
    }
  }

  static dependencies = [
    ...super.dependencies,
    'c/stylesShared'
  ]

}