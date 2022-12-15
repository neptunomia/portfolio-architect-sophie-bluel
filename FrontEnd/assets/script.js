const works = [];
let token = localStorage.getItem('token');

fetch('http://localhost:5678/api/categories')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then((categories) => {
        //console.log(categories);
        for (let category of categories) {
            createFilters(category);
        }
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    })

// queries to show and filter projects
fetch('http://localhost:5678/api/works')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then((projects) => {
        console.log(projects);
        projects.forEach(project => {
            works.push(project);
        })

        for (let project of projects) {
            showProjects(project);
            showImages(project);
        }
        if ((document.querySelector('.gallery').innerHTML != '') && document.querySelector('.pictures').innerHTML != '') {
            addArrows();
        }
        filter();
        deleteProject();
    })

    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    })

function viewProjects() {
    document.querySelector('.gallery').innerHTML = '';
    document.querySelector('.pictures').innerHTML = '';
    fetch('http://localhost:5678/api/works')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then((projects) => {

            for (let project of projects) {
                showProjects(project);
                showImages(project);
            }
            if ((document.querySelector('.gallery').innerHTML != '') && document.querySelector('.pictures').innerHTML != '') {
                addArrows();
            }
            deleteProject();
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        })
}

////
function showProjects(project) {
    const gallery = document.querySelector('div.gallery');
    const newFigure = document.createElement('figure');

    newFigure.setAttribute('id', project.id);

    const newImage = document.createElement('img');
    newImage.setAttribute('crossorigin', 'anonymous')
    newImage.setAttribute('src', project.imageUrl);

    const newFigcaption = document.createElement('figcaption');
    newFigcaption.innerText = project.title;

    newFigure.appendChild(newImage);
    newFigure.appendChild(newFigcaption);
    gallery.appendChild(newFigure);
};

////
function createFilters(category) {
    const filters = document.querySelector('ul.filters');
    const newLi = document.createElement('li');
    newLi.innerText = category.name;
    newLi.classList.add('filter');
    filters.appendChild(newLi);
};

function filter() {
    const filters = document.querySelectorAll('.filter');
    console.log(filters);
    filters.forEach((filter, category) => { // loop to display the right projects on click based on filter and category
        filter.addEventListener('click', function () {
            const selectedFilter = document.querySelector('.selected-filter');
            selectedFilter.classList.remove('selected-filter');
            filter.classList.add('selected-filter');

            document.querySelector('.gallery').innerHTML = '';

            for (let work of works) {
                if (category === work.categoryId) {
                    console.log(category);
                    showProjects(work);
                } else if (category === 0) {
                    console.log(category);
                    showProjects(work);
                }
            };
        });
    });
}

// change the homepage when the user is logged in
function editHomepage() {
    const editDivContent = `<div class="edit-margin">
    <a href="#"><i class="fa-regular fa-pen-to-square"></i>
    <span class="edit-span-margin">modifier</span></a></div>`;
    const editModeDivContent = `<div class="edit-header">
    <i class="fa-regular fa-pen-to-square"></i>
    <span class="edit-mode-margin">Mode édition</span></div>`;

    const header = document.querySelector('header');
    const headerNav = document.querySelector('.header');
    const newDiv = document.createElement('div');
    newDiv.innerHTML = editModeDivContent;
    header.insertBefore(newDiv, headerNav);

    const newButton = document.createElement('button');
    document.querySelector('.edit-header').appendChild(newButton);
    newButton.innerText = 'publier les changements';
    newButton.classList.add('publish-button');

    const article = document.querySelector('article');
    const figure = document.querySelector('.introduction figure');
    const portfolioSectionTitle = document.querySelector('.portfolio-title');

    article.insertAdjacentHTML("afterbegin", editDivContent);
    figure.insertAdjacentHTML("beforeend", editDivContent);
    portfolioSectionTitle.insertAdjacentHTML("beforeend", editDivContent);
}

// function to show images in modal window
function showImages(project) {
    const pictures = document.querySelector('.pictures');
    const figureModal = document.createElement('figure');
    const figcaptionModal = document.createElement('figcaption');

    figureModal.setAttribute('id', project.id);

    const imageModal = document.createElement('img');
    imageModal.setAttribute('crossorigin', 'anonymous')
    imageModal.setAttribute('src', project.imageUrl);

    figcaptionModal.innerText = 'éditer';

    const figureContent = `<div class="icon-div-style icon-div-arrows icon-div-style-not-shown">
    <i class="fa-solid fa-arrows-up-down-left-right icon-style"></i></div>
    <div id="${project.id}" class="icon-div-style icon-div-trash icon-div-style-shown">
    <i class="fa-regular fa-trash-can icon-style"></i></div>`;

    figureModal.appendChild(imageModal);
    figureModal.appendChild(figcaptionModal);
    figureModal.insertAdjacentHTML('afterbegin', figureContent);
    pictures.appendChild(figureModal);
}

function addArrows() {
    const firstArrowsIcon = document.querySelector('.icon-div-arrows:first-child');
    firstArrowsIcon.classList.replace('icon-div-style-not-shown', 'icon-div-style-shown');
};

///////////////

let modal = null;

function openModal(e) {
    e.preventDefault();
    modal = document.querySelector('#photo-gallery-modal');
    modal.style.display = null;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.close-icon').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
}

function closeModal(e) {
    if (modal === null) return
    e.preventDefault();
    modal = document.querySelector('#photo-gallery-modal');
    modal.style.display = 'none';
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.close-icon').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
}

function stopPropagation(e) {
    e.stopPropagation();
}

window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
})

///////////////

function openAddPhotoModal(e) {
    e.preventDefault();
    document.querySelector('#photo-gallery-modal').style.display = 'none';
    modal = document.querySelector('#add-photo-modal');
    modal.style.display = null;
    modal.addEventListener('click', closeAddPhotoModal);
    modal.querySelector('.close-icon2').addEventListener('click', closeAddPhotoModal);
    modal.querySelector('.return-icon').addEventListener('click', returnToGalleryModal);
    modal.querySelector('.js-modal-stop2').addEventListener('click', stopPropagation);
}

function closeAddPhotoModal(e) {
    if (modal === null) return
    e.preventDefault();
    modal = document.querySelector('#add-photo-modal');
    modal.style.display = 'none';
    modal.removeEventListener('click', closeAddPhotoModal);
    modal.querySelector('.close-icon2').removeEventListener('click', closeAddPhotoModal);
    modal.querySelector('.js-modal-stop2').removeEventListener('click', stopPropagation);
    modal = null;
}

function returnToGalleryModal(e) {
    e.preventDefault();
    modal.style.display = 'none';
    document.querySelector('#photo-gallery-modal').style.display = null;
}

///////////////

if (localStorage.getItem('token')) {
    editHomepage();
    document.querySelector('.filters').style.display = 'none';
    const loginButton = document.querySelector('.login');
    loginButton.innerText = 'logout';
    loginButton.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    })

    const galleryEditButton = document.querySelector('.portfolio-title a');
    galleryEditButton.setAttribute('href', '#photo-gallery-modal');
    //console.log(galleryEditButton);
    galleryEditButton.addEventListener('click', openModal);
}



//////// request to add a new project
const form = document.querySelector('#add-photo');

/*const upFile = document.querySelector('#upfile').value;
const title = document.querySelector('#title').value;

if (upFile && title) {
    const validateSubmitButton = document.querySelector('.validate-submit-button')
    validateSubmitButton.style.background = '#1D6154';
}*/

function addNewProject() {
    const newProject = new FormData(form);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: newProject,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            };
            return response.json();
        })
        .then((value) => {
            console.log(value);
            viewProjects();
            form.reset();
            document.querySelector('.landscape-icon').style.display = null;
            document.querySelector('#add-photo-label').style.display = null;
            document.querySelector('.form-layout-file span').style.display = null;
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewProject();
    document.querySelector('.new-image-style').style.display = 'none';
});

function deleteRequest(id) {
    fetch('http://localhost:5678/api/works/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            };
        })
        .then(() => {
            viewProjects();
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        })
}

function deleteProject() {
    let trashIcons = document.querySelectorAll('.icon-div-trash');
    //console.log(trashIcons);
    trashIcons.forEach((trashIcon) => {
        trashIcon.addEventListener('click', function () {
            console.log(trashIcon);
            let id = trashIcon.getAttribute('id');
            console.log(id);

            deleteRequest(id);
        })
    })
};

function deleteAllProjects() {
    const allProjects = document.querySelectorAll('.pictures figure');
    console.log(allProjects);
    allProjects.forEach((project) => {
        let id = project.getAttribute('id');
        fetch('http://localhost:5678/api/works/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                };
            })
            .then(() => {
                viewProjects();
            })
            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            })
    })
}

document.querySelector('.delete-gallery').addEventListener('click', deleteAllProjects);

//////

const addPhotoButton = document.querySelector('#add-photo-button');
addPhotoButton.addEventListener('click', openAddPhotoModal);

// preview image before upload
const upFile = document.querySelector('#upfile');
const newPhoto = document.querySelector('.new-image-style');
const reader = new FileReader();

function modifyNewPhotoSrc() {
    newPhoto.src = reader.result;
};

function addListenerToReader(reader) {
    reader.addEventListener('load', modifyNewPhotoSrc);
};

function previewPhoto() {
    const selectedFile = upFile.files[0];
    if (selectedFile) {
        //newPhoto.classList.add('new-image-style');
        //document.querySelector('.form-layout-file').innerHTML = "";
        newPhoto.style.display = null;
        document.querySelector('.landscape-icon').style.display = 'none';
        document.querySelector('#add-photo-label').style.display = 'none';
        document.querySelector('.form-layout-file span').style.display = 'none';
        document.querySelector('#upfile').style.top = '50px';
        // document.querySelector('.form-layout-file').appendChild(newPhoto);
        addListenerToReader(reader);
        reader.readAsDataURL(selectedFile);
    }
}
upFile.addEventListener('change', previewPhoto);

////////