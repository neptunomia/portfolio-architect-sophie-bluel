// create a paragraph for authentication error
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
    };

    e.preventDefault();

    if (checkForm() === true) {
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
    };
});

function redirectToEditPage() {
    document.location.href = './index.html';
};

function incorrectCredentials() {
    document.querySelector('.error-message').innerText = '';
    newP.innerText = 'Erreur dans l’identifiant ou le mot de passe';
    form.reset();
};

function storeCredentials(user) {
    localStorage.setItem('token', user.token);
};

function checkForm() {
    const email = document.querySelector('#email');
    const emailValue = email.value;

    if (emailValue == "") {
        document.querySelector('.error-message').innerText = '';
        newP.innerText = 'Le champ "Email" doit être rempli.';
        return false;
    }

    const password = document.querySelector('#password');
    const passwordValue = password.value;

    if (passwordValue == "") {
        document.querySelector('.error-message').innerText = '';
        newP.innerText = 'Le champ "Mot de passe" doit être rempli.';
        return false
    }
    return true;
}