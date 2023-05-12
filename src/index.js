import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from "axios";
import Notiflix from "notiflix";
const inputEl = document.querySelector('input[name="searchQuery"]');
const btnEl = document.querySelector('button[type="submit"]');
let galleryEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-more')

const API_URL = 'https://pixabay.com/api/?key=36318494-588897fc86ad50d359fa41850&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

let pageNumber = 1;

async function fetchData(q, page) {
    try {
        const response = await axios.get(`${API_URL}&q=${encodeURIComponent(q)}&page=${page}`)
        console.log(response.data)
        generate(response.data)
    }
    catch (err) {
        console.error(err)
    }
}

function generate(response) {
    if (response.totalHits == 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        loadBtnEl.classList.add('hidden')
        return;
    }
    if (response.hits.length === 0) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
        loadBtnEl.classList.add('hidden')
        return;
    } 
    if (pageNumber === 1) {
        Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`)
    }
    loadBtnEl.classList.remove('hidden')
    response.hits.map(element => {
        let photoCard = document.createElement('div');
        photoCard.href = element.largeImageURL;
        photoCard.classList.add('photo-card');
        let img = document.createElement('img');
        img.src = element.previewURL
        img.alt = element.tags
        img.loading = "lazy"
        photoCard.appendChild(img)
        
        let infoDiv = document.createElement('div');
        infoDiv.classList.add('info');
        
        ["likes", "views", "comments", "downloads"].map(k => {
            infoDiv.appendChild(stats(element, k))
        })

        photoCard.appendChild(infoDiv);
        galleryEl.appendChild(photoCard);
    })
}

function stats(element, key) {

    let pEl = document.createElement('p');
        pEl.classList.add('info-item');
    let bEl = document.createElement('b');
    
    bEl.innerHTML = key;
    pEl.appendChild(bEl);
    pEl.innerHTML += element[key]
    
    return pEl;
}

btnEl.addEventListener('click', e => {
    e.preventDefault();
    loadBtnEl.classList.add('hidden')
    while (galleryEl.firstChild) {
        galleryEl.firstChild.remove()
    }
    pageNumber = 1;
    if (inputEl.value != '') {
        fetchData(inputEl.value, 1)

    } 
})
loadBtnEl.addEventListener('click', e => {
    pageNumber++
    fetchData(inputEl.value, pageNumber)
})
