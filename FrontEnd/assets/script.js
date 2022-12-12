// queries to show and filter projects
fetch('http://localhost:5678/api/works')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        } else if (response === 201) {
        }
        return response.json();
    })
    .then((projects) => {
        //console.log(projects);

        for (let project of projects) {
            showProjects(project); // show all projects
        }

        /////////////// 
        if (localStorage.getItem('token')) {
            editHomepage();

            const galleryEditButton = document.querySelector('.portfolio-title a');
            galleryEditButton.setAttribute('href', '#photo-gallery-modal');
            //console.log(galleryEditButton);
            galleryEditButton.addEventListener('click', openModal);

            for (let project of projects) {
                showImages(project);
            }

            const firstArrowsIcon = document.querySelector('.icon-div-arrows:first-child');
            firstArrowsIcon.classList.replace('icon-div-style-not-shown', 'icon-div-style-shown');

            const modalElements = Array.from((document.querySelectorAll('.gallery figure')));
            //console.log(modalDeletedElement);
            const galleryElements = Array.from((document.querySelectorAll('.pictures figure')))
            //console.log(galleryDeletedElement);

            const trashIcons = document.querySelectorAll('.icon-div-trash');
            //console.log(trashIcons);
            trashIcons.forEach((trashIcon) => {
                trashIcon.addEventListener('click', function () {
                    let id = trashIcon.getAttribute('id');
                    //console.log(id);

                    deleteRequest(id);

                    for (let element of modalElements) {
                        if (id === (element.getAttribute('id'))) {
                            element.remove();
                        }
                    }
                    for (let element of galleryElements) {
                        if (id === (element.getAttribute('id'))) {
                            element.remove();
                        }
                    }
                })
            });

            const addPhotoButton = document.querySelector('#add-photo-button');
            addPhotoButton.addEventListener('click', openAddPhotoModal);

            // preview image before upload
            const upFile = document.querySelector('#upfile');
            const newPhoto = document.createElement('img');
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
                    newPhoto.classList.add('new-image-style');
                    //document.querySelector('.form-layout-file').innerHTML = "";
                    document.querySelector('.landscape-icon').remove();
                    document.querySelector('#add-photo-label').remove();
                    document.querySelector('.form-layout-file span').remove();
                    document.querySelector('#upfile').style.top = '50px';
                    document.querySelector('.form-layout-file').appendChild(newPhoto);
                    addListenerToReader(reader);
                    reader.readAsDataURL(selectedFile);
                }
            }
            upFile.addEventListener('change', previewPhoto);
        }

        // request to add a new project
        const form = document.querySelector('#add-photo');

        /*const upFile = document.querySelector('#upfile').value;
        const title = document.querySelector('#title').value;

        if (upFile && title) {
            const validateSubmitButton = document.querySelector('.validate-submit-button')
            validateSubmitButton.style.background = '#1D6154';
        }*/

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newProject = new FormData(form);

            let token = localStorage.getItem('token');

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
                    showImages(value);
                    showProjects(value);
                    form.reset();
                    newForm();
                })
                .catch((error) => {
                    console.error('There has been a problem with your fetch operation:', error);
                })
        });

        ///////////////

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

                const filters = document.querySelectorAll('.filter');
                //console.log(filters);

                filters.forEach((filter, category) => { // loop to display the right projects on click based on filter and category
                    filter.addEventListener('click', function () {
                        document.querySelector('.gallery').innerHTML = '';
                        filter.classList.add('selected-filter');

                        for (let project of projects) {
                            if (category === project.categoryId) {
                                //console.log(category);
                                showProjects(project);
                            } else if (category === 0) {
                                //console.log(category);
                                showProjects(project);
                            }
                        };

                        const selectedFilter = document.querySelector('.selected-filter');
                        selectedFilter.classList.remove('selected-filter');
                    });
                });
            })

            .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
            })
    })

    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    })

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

function deleteRequest(id) {
    let token = localStorage.getItem('token');
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

function newForm() {
    const newForm = document.querySelector('.form-layout-file');
    newForm.innerHTML = "";
    const newFormContent = `<img src="./assets/icons/landscape.png" alt="Icône de payage" class="landscape-icon">				
    <label id="add-photo-label" for="upfile" accept="image/png, image/jpeg">+Ajouter photo</label>
	<input type="file" name="image" id="upfile">
    <span>jpg, png : 4mo max</span>`;
    newForm.insertAdjacentHTML("afterbegin", newFormContent);
}