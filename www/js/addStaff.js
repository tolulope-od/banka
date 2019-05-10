/* global window, document, fetch, localStorage, Headers */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["errors"] }] */

const API_PREFIX = 'https://bankaa-app.herokuapp.com/api/v1';
const addStaffBtn = document.getElementById('add-staff-btn');
const userType = document.getElementById('user-type');
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];
const modalContent = document.getElementById('account-modal-content');
const para = document.createElement('P');
let text;

const displayModalWithMessage = message => {
  para.innerHTML = '';
  text = document.createTextNode(message);
  para.appendChild(text);
  modalContent.appendChild(para);
  modal.style.display = 'block';
};

// eslint-disable-next-line no-unused-vars
const addNewStaff = () => {
  para.innerHTML = '';
  if (userType.value !== '') {
    addStaffBtn.value = 'LOADING..';
    addStaffBtn.disabled = true;
    addStaffBtn.style.backgroundColor = 'grey';
    const firstName = document.getElementById('staff-first-name').value;
    const lastName = document.getElementById('staff-last-name').value;
    const email = document.getElementById('staff-email').value;
    const token = localStorage.getItem('banka-app-token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    let admin;
    if (userType.value === 'admin') {
      admin = true;
      fetch(`${API_PREFIX}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ firstName, lastName, email, admin })
      })
        .then(res => res.json())
        .then(response => {
          addStaffBtn.value = 'Add Staff';
          addStaffBtn.disabled = false;
          addStaffBtn.style.backgroundColor = null;
          if (response.status === 201) {
            displayModalWithMessage(
              `${response.message}, Default password: ${response.data[0].lastname}`
            );
          } else {
            displayModalWithMessage(`${response.error}`);
          }
        })
        .catch(err => {
          const { log } = console;
          log(err.message);
          displayModalWithMessage('An error occurred');
        });
    }
    fetch(`${API_PREFIX}/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ firstName, lastName, email })
    })
      .then(res => res.json())
      .then(response => {
        addStaffBtn.value = 'Add Staff';
        addStaffBtn.disabled = false;
        addStaffBtn.style.backgroundColor = null;
        if (response.status === 201) {
          displayModalWithMessage(
            `${response.message}, Default password: ${response.data[0].lastName}`
          );
        } else {
          displayModalWithMessage(`${response.error}`);
        }
      })
      .catch(err => {
        const { log } = console;
        log(err.message);
        displayModalWithMessage('An error occurred');
      });
  } else {
    displayModalWithMessage('Please select staff type');
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
