// create a paragraph for the error message
const loginSectionH2 = document.querySelector('#login h2');
const newP = document.createElement('p');
newP.classList.add('error-message');
loginSectionH2.appendChild(newP);

// manage user login
const form = document.querySelector('#login-form');
form.addEventListener('submit', (e) => {

    let user = {
        "email": document.querySelector('#email').value,
        "password": document.querySelector('#password').value
    }

    e.preventDefault();

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(user) // convert user's JavaScript value to JSON string
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })

        .then((user) => {
            console.log(user);
            storeCredentials(user);
            redirectToEditPage();
        })

        .catch((error) => {
            incorrectCredentials();
            console.error('There has been a problem with your fetch operation:', error);
        })
})

function redirectToEditPage() {
    document.location.href = './index.html';
}

function incorrectCredentials() {
    document.querySelector('.error-message').innerText = '';
    newP.innerText = 'Erreur dans l’identifiant ou le mot de passe';
    form.reset();
}

function storeCredentials(user) {
    sessionStorage.setItem('token', user.token);
}