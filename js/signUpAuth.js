/* global window, document, fetch, localStorage, Headers */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["errors"] }] */

const API_PREFIX = 'https://bankaa-app.herokuapp.com/api/v1/';

const signUpBtn = document.getElementById('signup-btn');
const error = document.getElementById('login-error');
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];
const modalContent = document.getElementById('account-modal-content');
const para = document.createElement('P');
let text;

const clearErrors = errors => {
  errors.innerHTML = '';
};

const userRegistrationSuccess = response => {
  para.innerHTML = '';
  text = document.createTextNode(`${response.message}`);

  para.appendChild(text);
  modalContent.appendChild(para);
  modal.style.display = 'block';
};

const registerUser = e => {
  e.preventDefault();
  clearErrors(error);
  signUpBtn.value = 'LOADING..';
  signUpBtn.disabled = true;
  signUpBtn.style.backgroundColor = 'grey';
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const email = document.getElementById('user-signup-email').value;
  const password = document.getElementById('user-signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    error.innerHTML = 'Passwords must match';
    signUpBtn.value = 'SIGN UP';
    signUpBtn.disabled = false;
    signUpBtn.style.backgroundColor = null;
  } else {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    fetch(`${API_PREFIX}auth/signup`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ firstName, lastName, email, password })
    })
      .then(res => res.json())
      .then(response => {
        const { data } = response;
        signUpBtn.value = 'SIGN UP';
        signUpBtn.disabled = false;
        signUpBtn.style.backgroundColor = null;

        if (response.status === 201) {
          localStorage.setItem('banka-app-token', data[0].token);
          localStorage.setItem('banka-app-user-type', data[0].type);
          localStorage.setItem('banka-app-user-firstName', data[0].firstName);
          localStorage.setItem('banka-app-user-lastName', data[0].lastName);
          userRegistrationSuccess(response);

          setTimeout(() => {
            window.location = 'createaccount.html';
          }, 3000);
        }

        if (response.status === 400) {
          error.innerHTML = `${response.error}`;
        }

        if (response.status === 409) {
          error.innerHTML = `${response.error}`;
        }
      })
      .catch(err => {
        const { log } = console;
        error.innerHTML = `${err.message}`;
        log(err);
      });
  }
};

// eslint-disable-next-line no-unused-vars
const checkToken = () => {
  const isToken = localStorage.getItem('banka-app-token');
  if (isToken) {
    const userType = localStorage.getItem('banka-app-user-type');
    if (userType === 'staff') {
      window.location = 'admin/dashboard.html';
    } else {
      window.location = 'dashboard.html';
    }
  }
};

span.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = event => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

document.getElementById('sign-up-form').addEventListener('submit', registerUser);
