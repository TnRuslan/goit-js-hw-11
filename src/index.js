const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const galery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let fetchName = '';
let pageNamber = 1;

form.addEventListener('submit', onFetchImagesByName);
loadMoreBtn.addEventListener('click', onLoadMoreImages);

function onFetchImagesByName(e) {
  e.preventDefault();
  pageNamber = 1;

  fetchName = e.target.elements.searchQuery.value;
  console.log(fetchName);

  fetchImages(fetchName).then(r => {
    galery.innerHTML = '';
    console.log(r.data.totalHits);
    if (r.data.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    removeLoadMoreBatton(r.data.totalHits);

    Notiflix.Notify.info(`Hooray! We found ${r.data.totalHits} images.`);
    galery.innerHTML = createMarkupByFetch(r.data.hits);
    const lightbox = new SimpleLightbox('.gallery div');

    pageNamber += 1;
  });
}

function removeLoadMoreBatton(totalHits) {
  if (totalHits > 40) {
    loadMoreBtn.classList.remove('hidden');
  }
}

function addLoadMoreBatton() {
  loadMoreBtn.classList.add('hidden');
}

function fetchImages(name) {
  return axios({
    method: 'get',
    url: 'https://pixabay.com/api/',
    params: {
      key: '31826070-5147e993357879bd9f8310722',
      q: `${name}`,
      image_tipe: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: `${pageNamber}`,
      per_page: 40,
    },
  });
}

function onLoadMoreImages() {
  fetchImages(fetchName)
    .then(r => {
      galery.insertAdjacentHTML('beforeend', createMarkupByFetch(r.data.hits));
    })
    .catch(error => {
      console.log(error);
      addLoadMoreBatton;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    });
  pageNamber += 1;
}

function createMarkupByFetch(datas) {
  return datas
    .map(
      data => `<div class="photo-card" href="${data.largeImageURL}">
  <img class="gallery-img" src="${data.webformatURL}" alt="${data.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${data.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${data.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${data.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${data.downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}
