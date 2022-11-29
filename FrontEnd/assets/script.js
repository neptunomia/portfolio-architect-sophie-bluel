// query with fetch
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

function showProjects(projects) {
    //console.log(projects)
    for (let project of projects) {

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
    }
}