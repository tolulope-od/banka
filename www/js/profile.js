/* global document, localStorage, window */
const profileFirstName = document.getElementById('profile-first-name');
const profileLastName = document.getElementById('profile-last-name');
const profilePhone = document.getElementById('profile-phone');
const profileAddress = document.getElementById('profile-address');

const userFirstName = localStorage.getItem('banka-app-user-firstName');
const userLastName = localStorage.getItem('banka-app-user-lastName');

const setProfileFields = () => {
  profileFirstName.innerHTML = userFirstName;
  profileLastName.innerHTML = userLastName;
  profilePhone.innerHTML = 'N/a';
  profileAddress.innerHTML = 'N/a';
};

window.onload(setProfileFields());
