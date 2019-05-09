/* global window, document, fetch, localStorage, Headers */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["errors"] }] */

const API_PREFIX = 'https://bankaa-app.herokuapp.com/api/v1/';
const usersTable = document.getElementById('users-table');
const usersViewArea = document.getElementById('users-info-disp');
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

const fetchStaff = () => {
  displayModalWithMessage('Loading...');
  const token = localStorage.getItem('banka-app-token');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);
  fetch(`${API_PREFIX}/users`, {
    method: 'GET',
    headers
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === 200) {
        const { data } = response;
        if (data.length === 0) {
          modal.style.display = 'none';
          usersTable.innerHTML = "<h1>That's weird, there are no users at this time.</h1>";
        }
        modal.style.display = 'none';
        data.forEach(user => {
          const allUsers = `<tr class="admin-accnts-tr">
              <td class="user-info">${user.firstname} ${user.lastname}</td>
              <td class="user-info">${user.createdat.split('T')[0]} ${
            user.createdat.split('T')[1]
          }</td>
              <td class="user-info">
              ${
                user.isadmin
                  ? '<p class="badge-active accnt-badge" id="accnt-badge">Admin</p>'
                  : '<p class="badge-inactive accnt-badge" id="accnt-badge">Non-Admin</p>'
              }
              </td>
              <td class="user-info">
                <p class=""></p>
              </td>
            </tr>`;
          usersViewArea.innerHTML += allUsers;
        });
      }
    })
    .catch(err => {
      const { log } = console;
      log(err.message);
      displayModalWithMessage('An error occured.');
    });
};

span.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = event => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

window.onload(fetchStaff());
