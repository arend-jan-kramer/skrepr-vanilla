let randomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
let call = (id, callback) => fetch(settings.galleryImage.url+id).then(response => response.json()).then(callback)

window.settings = {
    colors: {
        cyan: '#00FFFF',
        grey: '#454545',
        black: '#111111',
    },
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
    const title = document.createElement('h1');
    const imageDiv = document.createElement('div');
    const image = document.createElement('img');
    const popup = document.getElementById('popup');

    imageDiv.classList.add('gallery-img-box');
    image.src = d.thumbnailUrl;
    image.title = d.title;
    title.innerText = d.title;
    image.classList.add('gallery-img');
    imageDiv.append(image);

    document.getElementById('gallery-grid').append(imageDiv);

    image.addEventListener('click', (e) => {
        popup.classList.remove('hidden');
        document.getElementById('popup-image').src = d.url;
        document.getElementById('popup-title').innerText = d.title;
    });

    popup.addEventListener('click', () => popup.classList.add('hidden'));
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