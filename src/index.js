import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchApiImages from './script/SearchApiImages.js';
import throttle from 'lodash.throttle';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
let totalPages = null;
const gifLoading = document.querySelector('.loading');
const arrowUp = document.querySelector('.icon-arrow-up');

const searchApiImages = new SearchApiImages();
const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', searchImg);
window.addEventListener('scroll', throttle(infinitiScroll, 250));

async function infinitiScroll(e) {
  const height = gallery.scrollHeight;
  // gallery.scrollHeight - высота документа (контейнера gallery);

  const screenHeight = window.innerHeight;
  // window.innerHeight - высота экрана (вьюпорта);

  const scrolled = window.scrollY;
  // window.scrollY количество проскроллиніх пикселей;

  const threshold = height - screenHeight / 4;
  // порог, по приближении к нему будем вызывать действие

  const position = scrolled + screenHeight;
  // отслеживаем где находится низ экрана по отношению к документуж

  if (position >= threshold) {
    await fetchImages();
  }

  if (window.scrollY > 700) {
    arrowUp.classList.remove('ishide');
    addClickToArrow();
  } else if (window.scrollY < 700) {
    arrowUp.classList.add('ishide');
    removeClickFromArrow();
  }
}

function searchImg(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const value = form.elements.search.value.trim();
  if (value === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  searchApiImages.searchQuery = value;

  searchApiImages.resetPage();
  clearImagesCollection();
  showGifLoading();
  fetchImages();
  resetForm();
}

async function fetchImages() {
  try {
    const hits = await searchApiImages.getImages();

    totalPages = Math.ceil(searchApiImages.totalHits / searchApiImages.perPage);

    if (hits.length === 0 && totalPages > 1) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      hideGifLoading();

      return;
    }

    if (hits.length === 0 && totalPages === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearImagesCollection();
      hideGifLoading();
      return;
    }

    if (totalPages === 1) {
      Notify.success(`Hooray! We found ${searchApiImages.totalHits} images.`);
      createImagesCollection(hits);
      hideGifLoading();
      lightbox.refresh();
      return;
    }

    if (searchApiImages.page === 2) {
      Notify.success(`Hooray! We found ${searchApiImages.totalHits} images.`);
    }

    // if (searchApiImages.page > totalPages) {
    //   Notify.info("We're sorry, but you've reached the end of search results.");
    //   hideGifLoading();

    // }

    createImagesCollection(hits);

    // hideGifLoading();
    lightbox.refresh();

    // if (searchApiImages.page > 2) scrollTheCollection();
  } catch {
    hideGifLoading();
    errorShow();
  }
}

function createImagesCollection(arr) {
  const markupImagesCollectiom = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <div class="wrap-photo">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="640"
  /></a>
  </div>
  <div class="info">
    <p class="info-item"><b>Likes</b>${likes}</p>
    <p class="info-item"><b>Views</b>${views}</p>
    <p class="info-item"><b>Comments</b>${comments}</p>
    <p class="info-item"><b>Downloads</b>${downloads}</p>
  </div>
</div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markupImagesCollectiom);
}

function clearImagesCollection() {
  gallery.innerHTML = '';
}

function resetForm() {
  form.reset();
}

function errorShow(error) {
  Notify.failure('Error');
  console.error(error.massege);
}

function scrollTheCollection() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function hideGifLoading() {
  gifLoading.classList.add('visually-hidden');
}
function showGifLoading() {
  gifLoading.classList.remove('visually-hidden');
}

function addClickToArrow() {
  arrowUp.addEventListener('click', clickToArrow);
}

function removeClickFromArrow() {
  arrowUp.removeEventListener('click', clickToArrow);
}

function clickToArrow() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}
