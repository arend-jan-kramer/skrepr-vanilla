const template = document.createElement('template');
template.innerHTML = `


<div id="popup"><div class="inner-popup"><h1 id="popup-title" class="center"></h1><img src="" alt="" id="popup-image"></div></div>
`;

class GalleryImage extends HTMLElement {
    constructor() {
        super()
        this.showInfo = false
        this.shadow = this.attachShadow({ mode: 'open' })
    }

    get getSrc() {
        return this.getAttribute('src')
    }

    set setSrc(_src) {
        this.setAttribute('src', _src)
    }

    togglePopUp() {
        this.showInfo = !this.showInfo;

        if (this.showInfo) {
            this.shadow.querySelector('#popup').style.display = 'flex'
        } else {
            this.shadow.querySelector('#popup').style.display = 'none'
        }
    }

    get src() {
        return this.getAttribute('src')
    }

    set src(_src) {
        this.setAttribute('src', _src)
    }

    get title() {
        return this.getAttribute('title')
    }

    set title(_title) {
        this.setAttribute('title', _title)
    }

    get thumbnail() {
        return this.getAttribute('thumbnail')
    }

    set thumbnail(_thumbnail) {
        this.setAttribute('thumbnail', _thumbnail)
    }

    static get observedAttributes() {
        return ['src', 'title', 'thumbnail']
    }

    attributeChangedCallback(prop, oldVal, newVal) {
        if ('src' === prop) this.render()
        if ('title' === prop) this.render()
        if ('thumbnail' === prop) this.render()
    }

    connectedCallback() {
        this.shadow.innerHTML = this.render()
        let open = this.shadow.querySelector('#popup-open')
        open.addEventListener('click', this.togglePopUp.bind(this))
        let close = this.shadow.querySelector('#popup')
        close.addEventListener('click', this.togglePopUp.bind(this))
    }

    render() {
        return `
<style>
#popup {
    position: fixed;
    width:100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
    display: none;
    z-index: 9999;
}

.center {
    text-align: center;
}

#popup-title {
    position: absolute;
    max-width: 600px;
    width: 100%;
    right: 0;
    left: 0;
    top: 0;
}

.inner-popup {
    max-width: 600px;
    max-height: 600px;
    width: 100%;
    height: auto;
    margin: 0 32px;
    position: relative;
}

#popup-image {
    width: 100%;
    height: auto;
    border-radius: 15px;
}

.gallery-img {
    border-radius: 15px;
    cursor: pointer;
    position: relative;
}

.gallery-img-box {
    margin: 0 auto;
}
@media (hover: hover) and (pointer: fine) {
    .gallery-img:hover {
        box-shadow: 3px 3px 15px black;
    }
}
</style>
<div class="gallery-img-box"><img id="popup-open" class="gallery-img" src="${this.thumbnail}" alt="${this.title}"></div>
<div id="popup"><div class="inner-popup"><h1 id="popup-title" class="center"></h1><img src="${this.src}" alt="${this.title}" id="popup-image"></div></div>
`
    }
}

window.customElements.define('gallery-image', GalleryImage);

let randomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
let call = (id, callback) => fetch(settings.galleryImage.url+id).then((response) => {
    const data = response.json();
    if(!response.ok) {
        throw Error(data && data.message || response.status)
    }
    return data
}).then(callback).catch((error) => console.error('There was an error', error))

window.settings = {
    numbers: {
        max: 5000,
        min: 1
    },
    galleryImage: {
        limit: 5,
        id: [],
        url: 'https://jsonplaceholder.typicode.com/photos/'
    }
};

let addImage = (d) => {
    const instance = document.createElement('gallery-image', { is: 'gallery-image'});
    instance.setAttribute('thumbnail', d.thumbnailUrl)
    instance.setAttribute('src', d.url)
    instance.setAttribute('title', d.title)
    document.getElementById('gallery-grid').appendChild(instance);
}

let generateRandomImages = (callback = loadImages) => {
    let nr;
    let i = false;
    const list = []
    while (i === false) {
        nr = randomNumberBetween(settings.numbers.min, settings.numbers.max);
        if (list.length >= settings.galleryImage.limit || settings.galleryImage.id.length >= settings.numbers.max) i = true
        if (list.indexOf(nr) === -1 && settings.galleryImage.id.indexOf(nr) === -1 && i === false){
            list.push(nr);
            settings.galleryImage.id.push(nr)
        }
    }
    callback(list);
}

let loadImages = (gallery) => {
    gallery.forEach((i) => call(i, addImage));
}