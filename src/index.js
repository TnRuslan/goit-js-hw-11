const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');

axios({
  method: 'get',
  url: 'https://pixabay.com/api/',
  params: {
    key: '31826070-5147e993357879bd9f8310722',
    q: 'cat',
    image_tipe: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  },
}).then(r => console.log(r.data.hits));
