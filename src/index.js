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
const border = document.querySelector('.border');

const searchApiImages = new SearchApiImages();
const lightbox = new SimpleLightbox('.gallery a');


form.addEventListener('submit', searchImg);
// window.addEventListener('scroll', throttle(scrollToArrow, 250));

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
      observer.unobserve(border);

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

    if (totalPages === 1 && searchApiImages.page === 2) {
      Notify.success(`Hooray! We found ${searchApiImages.totalHits} images.`);
      createImagesCollection(hits);
      hideGifLoading();
      lightbox.refresh();
      return;
    }

    if (searchApiImages.page === 2) {
      Notify.success(`Hooray! We found ${searchApiImages.totalHits} images.`);
    }
    createImagesCollection(hits);
    hideGifLoading();
    lightbox.refresh();
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

function hideGifLoading() {
  gifLoading.classList.add('visually-hidden');
}
function showGifLoading() {
  gifLoading.classList.remove('visually-hidden');
}

// function scrollToArrow() {
//   if (window.scrollY > 700) showArrow();
//   else if (window.scrollY < 700) hideArrow();
// }

function showArrow() {
  arrowUp.classList.remove('ishide');
  arrowUp.addEventListener('click', clickToArrow);
}

function hideArrow() {
  arrowUp.classList.add('ishide');
  arrowUp.removeEventListener('click', clickToArrow);
}

function clickToArrow() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
  hideArrow();
}

const callback = function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && searchApiImages.searchQuery !== '') {
      console.log(entry);
      showGifLoading();
      fetchImages();
      showArrow();
    } 
  });
};

const options = {
  root: null,
  rootMargin: '0px 0px 150px 0px',
  threshold: 0,
};

const observer = new IntersectionObserver(callback, options);

observer.observe(border);
