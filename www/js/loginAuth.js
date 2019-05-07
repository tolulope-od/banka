/* global window, document, fetch, localStorage, Headers */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["errors"] }] */

const API_PREFIX = 'https://bankaa-app.herokuapp.com/api/v1/';

const loginBtn = document.getElementById('login-btn');
const error = document.getElementById('login-error');

const clearErrors = errors => {
  errors.innerHTML = '';
};

const loginUser = e => {
  e.preventDefault();
  clearErrors(error);
  loginBtn.value = 'LOADING..';
  loginBtn.disabled = true;
  loginBtn.style.backgroundColor = 'grey';
  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  fetch(`${API_PREFIX}auth/signin`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(response => {
      const { data } = response;
      loginBtn.value = 'LOGIN';
      loginBtn.disabled = false;
      loginBtn.style.backgroundColor = null;
      if (response.status === 200) {
        localStorage.setItem('banka-app-token', data[0].token);
        localStorage.setItem('banka-app-user-type', data[0].type);
        localStorage.setItem('banka-app-user-firstName', data[0].firstName);
        localStorage.setItem('banka-app-user-lastName', data[0].lastName);

        if (data[0].type === 'client') {
          window.location = 'dashboard.html';
        }

        if (data[0].type === 'staff') {
          window.location = 'admin/dashboard.html';
        }
      }

      if (response.status === 400) {
        error.innerHTML = `${response.error}`;
      }

      if (response.status === 404) {
        error.innerHTML = `${response.error}`;
      }
    })
    .catch(err => {
      const { log } = console;
      loginBtn.value = 'LOGIN';
      loginBtn.disabled = false;
      loginBtn.style.backgroundColor = null;
      error.innerHTML = 'An error occurred';
      log(err);
    });
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

document.getElementById('login-form').addEventListener('submit', loginUser);
