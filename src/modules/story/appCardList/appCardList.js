import StorybookElement from 'sb/storybookElement';
import Card from 'c/card';

import defaultTemplate from './appCardList.html';
import docsTemplate from './docs.html';

const cardMaker = (uid, id) => {
  const images = [
    { src: "/public/assets/placeholder.png", alt: "Placeholder image" },
    { src: "/public/assets/recipes-logo.png", alt: "Recipes" },
  ]
  const randomImage = images[Math.floor(Math.random() * images.length)];
  return {
    id: uid + '-' + id,
    title: "Card " + id,
    description: "This is card " + id,
    image: randomImage.src,
    imageAltText: randomImage.alt,
  }
}

export default class AppCardList extends StorybookElement {
  static category = 'Application';
  static title = 'Card List Example';
  static selector = 'c-app-provider';
  static template = defaultTemplate;
  static docsTemplate = docsTemplate;
  static properties = {
    showLoading: true,
    subscribeTo: 'getCards'
  }

  static events = ['message'];

  static dependencies = [
    ...super.dependencies,
    'c/application',
    'c/appProvider',
    'c/stylesShared',
    'c/list',
    'c/card'
  ]

  static slotContent = `
  <c-paginator per-page={perPage} total={total}
    onchange={handlePageChange}>
  </c-paginator>

  <c-list cmp={cardCmp} items={cards}></c-list>
`;

  static sources = [
    {
      name: 'getCards',
      description: 'Provides the data for the card list',
      providerDataSets: [
        {
          name: 'default',
          description: 'Mock data with placeholder images',
          params: { page: 1 },
          data: async ({ page }) => ({
            items: new Array(100).fill().map((_, idx) => cardMaker('def', ((page-1) * 100) + idx + 1)),
            total: 1000,
            perPage: 100
          })
        },
        {
          name: 'global biodiversity information facility',
          description: 'Mock data with placeholder images',
          params: { page: 1 },
          data: async ({ page }) => {
            const response = await fetch('https://api.gbif.org/v1/occurrence/search?year=1898,1899&limit=20&offset=' + (page - 1) * 20, {
              mode: 'cors',
            });
            const data = await response.json();
            return {
              items: data.results.map((result, idx) => {
                return {
                  id: 'bio-' + ((page-1) * 20) + idx + 1,
                  title: result.taxonomicStatus,
                  description: result.scientificName,
                  image: result.media.length && result.media[0].identifier || '/public/assets/placeholder.png',
                  imageAltText: "Placeholder image",
                }
              }),
              total: data.count,
              perPage: 20
            }
          }
        }
      ]
    }
  ]

  cardCmp = Card;

  cards = [];
  total = 0;

  handleAppMessage({ detail }) {
    const { loading, data } = detail || {};
    this.cards = [];
    if (data) {
      this.cards = data.items || [];
      this.total = data.total;
      this.perPage = data.perPage;
    }
  }

  handlePageChange({ detail: { page } }) {
    this.cards = [];
    this.refs.app.getApp().requestFrom('getCards', { page });
  }
}