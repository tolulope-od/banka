/* global document, localStorage, window */
const dropDownBtn = document.getElementById('drop-down');
const dropDown = document.querySelector('.profile-dropdown');
const logOutBtn = document.getElementById('logout-btn');
const sideNavName = document.getElementById('side-nav-name');

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
    window.location = 'index.html';
  } else {
    const userFirstName = localStorage.getItem('banka-app-user-firstName');
    sideNavName.innerHTML = `${userFirstName}`;
  }
};

const logOut = () => {
  localStorage.clear();
};

logOutBtn.addEventListener('click', logOut);
