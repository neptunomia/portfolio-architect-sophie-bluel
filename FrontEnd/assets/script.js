// query to retrieve all works
fetch('http://localhost:5678/api/works')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
        showProjects(data);
    })

    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    })

// function to create and show projects
function showProjects(projects) {
    //console.log(projects)
    for (let project of projects) {

        const gallery = document.querySelector('div.gallery');
        const newFigure = document.createElement('figure');
        newFigure.setAttribute('category-id', project.categoryId)

        const newImage = document.createElement('img');
        newImage.setAttribute('crossorigin', 'anonymous')
        newImage.setAttribute('src', project.imageUrl);

        const newFigcaption = document.createElement('figcaption');
        newFigcaption.innerText = project.title;

        newFigure.appendChild(newImage);
        newFigure.appendChild(newFigcaption);
        gallery.appendChild(newFigure);
    }
}

fetch('http://localhost:5678/api/categories')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
    .then((categories) => {
        console.log(categories);
        createFilters(categories);
    })

    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    })

// function to create filters

function createFilters(filtersContent) {
    const filters = document.querySelector('ul.filters');

    for (let filter of filtersContent) {
        const newLi = document.createElement('li');
        newLi.innerText = filter.name;
        newLi.classList.add('filter');
        filters.appendChild(newLi);
    }
};