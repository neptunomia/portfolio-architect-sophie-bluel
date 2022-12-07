//// queries to show and filter projects
fetch('http://localhost:5678/api/works')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then((projects) => {
        //console.log(projects);

        for (let project of projects) {
            showProjects(project); // show all projects
        }

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

// function to create and show projects
function showProjects(project) {
    const gallery = document.querySelector('div.gallery');
    const newFigure = document.createElement('figure');

    const newImage = document.createElement('img');
    newImage.setAttribute('crossorigin', 'anonymous')
    newImage.setAttribute('src', project.imageUrl);

    const newFigcaption = document.createElement('figcaption');
    newFigcaption.innerText = project.title;

    newFigure.appendChild(newImage);
    newFigure.appendChild(newFigcaption);
    gallery.appendChild(newFigure);
};

// function to create filters
function createFilters(category) {
    const filters = document.querySelector('ul.filters');
    const newLi = document.createElement('li');
    newLi.innerText = category.name;
    newLi.classList.add('filter');
    filters.appendChild(newLi);
};

//// change the homepage when the user is logged in
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
}