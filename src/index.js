const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let fetchName = '';
let pageNamber = 1;
const imagesPerPage = 40;
let totalImages = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', onFetchImagesByName);
loadMoreBtn.addEventListener('click', onLoadMoreImages);

async function onFetchImagesByName(e) {
  e.preventDefault();
  pageNamber = 1;
  totalImages = 0;
  fetchName = e.target.elements.searchQuery.value;

  removeLoadMoreBatton();

  const dataByFetch = await fetchImages(fetchName);

  gallery.innerHTML = '';

  if (dataByFetch.data.total === 0) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  incrimentTotalImages();

  if (dataByFetch.data.totalHits > imagesPerPage) {
    addLoadMoreBatton();
  }

  Notiflix.Notify.success(
    `Hooray! We found ${dataByFetch.data.totalHits} images.`
  );

  gallery.innerHTML = createMarkupByFetch(dataByFetch.data.hits);

  lightbox.refresh();

  scroll();

  pageNamber += 1;
}

function incrimentTotalImages() {
  totalImages += imagesPerPage;
}

function addLoadMoreBatton() {
  loadMoreBtn.classList.remove('hidden');
}

function removeLoadMoreBatton() {
  loadMoreBtn.classList.add('hidden');
}

async function fetchImages(name) {
  return await axios({
    method: 'get',
    url: 'https://pixabay.com/api/',
    params: {
      key: '31826070-5147e993357879bd9f8310722',
      q: `${name}`,
      image_tipe: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: `${pageNamber}`,
      per_page: `${imagesPerPage}`,
    },
  });
}

async function onLoadMoreImages() {
  const dataByFetch = await fetchImages(fetchName);

  gallery.insertAdjacentHTML(
    'beforeend',
    createMarkupByFetch(dataByFetch.data.hits)
  );

  incrimentTotalImages();

  if (totalImages > dataByFetch.data.totalHits) {
    removeLoadMoreBatton();
    return Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }

  lightbox.refresh();

  pageNamber += 1;
}

function createMarkupByFetch(datas) {
  return datas
    .map(
      data => `
      <a class="photo-card" href="${data.largeImageURL}">
        <div>
          <img class="gallery-img" src="${data.webformatURL}" alt="${data.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes: ${data.likes}</b>
            </p>
            <p class="info-item">
              <b>Views: ${data.views}</b>
            </p>
            <p class="info-item">
              <b>Comments: ${data.comments}</b>
            </p>
            <p class="info-item">
              <b>Downloads: ${data.downloads}</b>
            </p>
          </div>
        </div>
      </a>`
    )
    .join('');
}

// const card = {
//   height: 200,
// };

// const { height: cardHeight } =
//   document.querySelector('.gallery').firstElementChild.getBoundingClientRect()
//     .bottom + window.scrollY;

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

gallery.getBoundingClientRect();
