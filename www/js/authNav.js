/* global document, localStorage, window */
const dropDownBtn = document.getElementById('drop-down');
const dropDown = document.querySelector('.profile-dropdown');
const logOutBtn = document.getElementById('logout-btn');

const myDropdown = () => {
  if (dropDown.style.display === 'none') {
    dropDown.style.display = 'block';
  } else {
    dropDown.style.display = 'none';
  }
};

dropDownBtn.addEventListener('click', () => {
  myDropdown();
});

// eslint-disable-next-line no-unused-vars
const checkAuth = () => {
  const isToken = localStorage.getItem('banka-app-token');
  if (!isToken) {
    window.location.href = '/login.html';
  }
};

const logOut = () => {
  localStorage.removeItem('banka-app-token');
  localStorage.removeItem('banka-app-user-type');
};

logOutBtn.addEventListener('click', logOut);
