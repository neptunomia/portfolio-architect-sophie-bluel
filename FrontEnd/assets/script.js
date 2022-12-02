// queries
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
                        for (let project of projects) {
                            if (category === project.categoryId) {
                                //console.log(category);
                                showProjects(project);
                            } else if (category === 0) {
                                //console.log(category);
                                showProjects(project);
                            }
                        };
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