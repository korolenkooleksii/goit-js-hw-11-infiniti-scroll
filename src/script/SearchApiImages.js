import axios from 'axios';

const KEY = '33551348-9d68666fc5ce894df97e3b30d';
const ENDPOINT = 'https://pixabay.com/api/';

export default class SearchApiImages {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalHits = null;
    this.perPage = 8;

    this.balancePage = null;
  }

  async getImages() {
    const URL = `${ENDPOINT}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`;

    const response = await axios(URL);
    const hits = response.data.hits;

    this.totalHits = response.data.totalHits;
    
    this.decrimentBalancePage();

    this.nextPage();

    return hits;
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  decrimentBalancePage() {
    this.balancePage = this.totalHits - this.perPage * this.page;
  }
}
