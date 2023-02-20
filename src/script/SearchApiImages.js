import axios from 'axios';

const KEY = '33551348-9d68666fc5ce894df97e3b30d';
const ENDPOINT = 'https://pixabay.com/api/';

export default class SearchApiImages {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = null;
    this.perPage = 12;
  }

  async getImages() {
    const options = {
      params: {
        q: `${this.searchQuery}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: `${this.perPage}`,
        page: `${this.page}`,
      },
    };

    // const URL = `${ENDPOINT}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;

    const URL = `${ENDPOINT}?key=${KEY}`;

    // const response = await axios(URL);

    const response = await axios.get(URL, options);

    const hits = await response.data.hits;

    this.totalHits = response.data.totalHits;
    this.nextPage();

    return hits;
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
