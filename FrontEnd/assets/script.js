const projects = [];
let token = localStorage.getItem('token');

///// categories and projects display by default
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
    .then(() => {
        viewProjectsByDefault();
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    })

function viewProjectsByDefault() {
    fetch('http://localhost:5678/api/works')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
        .then((works) => {
            console.log(works);
            works.forEach(work => {
                projects.push(work);
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
}

///// function to update projects
function viewProjects() {
    document.querySelector('.gallery').innerHTML = '';
    document.querySelector('.pictures').innerHTML = '';
    for (let project of projects) {
        showProjects(project);
        showImages(project);
    }
    if ((document.querySelector('.gallery').innerHTML != '') && document.querySelector('.pictures').innerHTML != '') {
        addArrows();
    }
    deleteProject();
}

/////
function showProjects(project) { // in the DOM
    const gallery = document.querySelector('div.gallery');
    const newFigure = document.createElement('figure');

    newFigure.setAttribute('data-id', project.id);

    const newImage = document.createElement('img');
    newImage.setAttribute('crossorigin', 'anonymous')
    newImage.setAttribute('src', project.imageUrl);

    const newFigcaption = document.createElement('figcaption');
    newFigcaption.innerText = project.title;

    newFigure.appendChild(newImage);
    newFigure.appendChild(newFigcaption);
    gallery.appendChild(newFigure);
};

function createFilters(category) { // in the DOM
    const filters = document.querySelector('ul.filters');
    const newLi = document.createElement('li');
    newLi.innerText = category.name;
    newLi.classList.add('filter');
    newLi.setAttribute('data-id', category.id);
    filters.appendChild(newLi);
};

function filter() {
    const filters = document.querySelectorAll('.filter');
    //console.log(filters);
    filters.forEach((filter) => { // loop to display the right projects on click based on filter and category
        filter.addEventListener('click', function () {
            let id = filter.getAttribute('data-id');
            console.log(id);
            const selectedFilter = document.querySelector('.selected-filter');
            selectedFilter.classList.remove('selected-filter');
            filter.classList.add('selected-filter');

            document.querySelector('.gallery').innerHTML = '';

            for (let project of projects) {
                if (id == project.categoryId) {
                    console.log(id);
                    showProjects(project);
                } else if (id == 0) {
                    console.log(id);
                    showProjects(project);
                }
            };
        });
    });
}

/////

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
    galleryEditButton.addEventListener('click', openModal);
}

/////

let modal = null;

function openModal(e) {
    e.preventDefault();
    modal = document.querySelector('#photo-gallery-modal');
    modal.style.display = null;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.close-icon').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    document.querySelector('body').style.overflow = 'hidden';
}

function closeModal(e) {
    if (modal === null) return
    e.preventDefault();
    modal = document.querySelector('#photo-gallery-modal');
    modal.style.display = 'none';
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.close-icon').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    document.querySelector('body').style.overflow = null;
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

function openAddPhotoModal(e) {
    e.preventDefault();
    document.querySelector('#photo-gallery-modal').style.display = 'none';
    modal = document.querySelector('#add-photo-modal');
    modal.style.display = null;
    modal.addEventListener('click', closeAddPhotoModal);
    modal.querySelector('.close-icon2').addEventListener('click', closeAddPhotoModal);
    modal.querySelector('.return-icon').addEventListener('click', returnToGalleryModal);
    modal.querySelector('.js-modal-stop2').addEventListener('click', stopPropagation);
    document.querySelector('body').style.overflow = 'hidden';
}

function closeAddPhotoModal(e) {
    if (modal === null) return
    e.preventDefault();
    modal = document.querySelector('#add-photo-modal');
    modal.style.display = 'none';

    resetAddPhotoForm();

    modal.removeEventListener('click', closeAddPhotoModal);
    modal.querySelector('.close-icon2').removeEventListener('click', closeAddPhotoModal);
    modal.querySelector('.js-modal-stop2').removeEventListener('click', stopPropagation);
    document.querySelector('body').style.overflow = null;
    modal = null;
}

function returnToGalleryModal(e) {
    e.preventDefault();
    modal.style.display = 'none';
    document.querySelector('#photo-gallery-modal').style.display = null;
    resetAddPhotoForm();
}

/////
function showImages(project) { // in modal window
    const pictures = document.querySelector('.pictures');
    const figureModal = document.createElement('figure');
    const figcaptionModal = document.createElement('figcaption');

    figureModal.setAttribute('data-id', project.id);

    const imageModal = document.createElement('img');
    imageModal.setAttribute('crossorigin', 'anonymous')
    imageModal.setAttribute('src', project.imageUrl);

    figcaptionModal.innerText = 'éditer';

    const figureContent = `<div class="icon-div-style icon-div-arrows icon-div-style-not-shown">
    <i class="fa-solid fa-arrows-up-down-left-right icon-style"></i></div>
    <div data-id="${project.id}" class="icon-div-style icon-div-trash icon-div-style-shown">
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

/////
const addPhotoButton = document.querySelector('#add-photo-button');
addPhotoButton.addEventListener('click', openAddPhotoModal);

const form = document.querySelector('#add-photo');

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
            projects.push(value);
            resetAddPhotoForm();
        })
        .then(() => {
            viewProjects();
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        })
}

const messageError2 = `<p class="error-message2"></p>`;
const divInfos = document.querySelector('.form-layout-infos');
divInfos.insertAdjacentHTML("afterbegin", messageError2);

function checkAddForm() {
    const upFile = document.querySelector('#upfile');
    const title = document.querySelector('#title');
    if (!(upFile.files[0]) || !(title.value)) {
        alert('Tous les champs doivent être remplis.');

        resetAddPhotoForm();

        return false;
    }
    return true;
}

form.addEventListener('input', () => {
    const upFile = document.querySelector('#upfile');
    const title = document.querySelector('#title');
    if (upFile.files[0] && title.value) {
        document.querySelector('.validate-submit-button').style.background = '#1D6154';
    } else {
        document.querySelector('.validate-submit-button').style.background = '#A7A7A7';
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (checkAddForm() === true) {
        addNewProject();
        console.log(projects);
    }
});

/////
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
            let id = trashIcon.getAttribute('data-id');
            console.log(id);

            deleteRequest(id);

            let projectId = projects.findIndex(project => project.id == id);
            console.log(projectId);
            projects.splice(projectId, 1);
            console.log(projects);

            viewProjects();
        })
    })
};

function deleteAllProjects() {
    const allProjects = document.querySelectorAll('.pictures figure');
    console.log(allProjects);
    allProjects.forEach((project) => {
        let id = project.getAttribute('data-id');

        deleteRequest(id);

        let projectId = projects.findIndex(project => project.id == id);
        console.log(projectId);
        projects.splice(projectId, 1);
        console.log(projects);

        viewProjects();
    })
}

document.querySelector('.delete-gallery').addEventListener('click', deleteAllProjects);

///// preview image before upload
const upFile = document.querySelector('#upfile');
function viewPhoto() {
    const newPhoto = document.querySelector('.new-image-style');
    let selectedFile;
    upFile.addEventListener('change', () => {
        const newFile = upFile.files[0];
        const upFileSize = 4000000;
        const upFileTypes = ["image/png", "image/jpeg"];

        if ((newFile.size > upFileSize) || !(upFileTypes.includes(newFile.type))) {
            alert('Le fichier ne doit pas dépasser 4 mo et seuls les fichiers au format jpg ou jpeg sont acceptés.');
            return;
        }
        const reader = new FileReader();

        reader.onload = () => {
            selectedFile = reader.result;
            newPhoto.setAttribute('src', selectedFile);
        }
        reader.readAsDataURL(newFile);

        newPhoto.style.display = null;
        document.querySelector('.landscape-icon').style.display = 'none';
        document.querySelector('#add-photo-label').style.display = 'none';
        document.querySelector('.form-layout-file span').style.display = 'none';
        document.querySelector('#upfile').style.top = '50px';
    })
}
viewPhoto();

function resetAddPhotoForm() {
    document.querySelector('#add-photo').reset();
    document.querySelector('.new-image-style').setAttribute('src', "#");
    document.querySelector('.new-image-style').style.display = 'none';
    document.querySelector('.landscape-icon').style.display = null;
    document.querySelector('#add-photo-label').style.display = null;
    document.querySelector('.form-layout-file span').style.display = null;
}