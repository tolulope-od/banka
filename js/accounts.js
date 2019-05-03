/* global window, document, fetch, localStorage, Headers */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["errors"] }] */

const API_PREFIX = 'https://bankaa-app.herokuapp.com/api/v1/';
const accountsTable = document.getElementById('accnts-table');
const accountsViewArea = document.getElementById('accnt-info-disp');
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];
const modalContent = document.getElementById('account-modal-content');
const para = document.createElement('P');
let text;

const fetchAccounts = () => {
  para.innerHTML = '';
  text = document.createTextNode('Loading...');

  para.appendChild(text);
  modalContent.appendChild(para);
  modal.style.display = 'block';

  const token = localStorage.getItem('banka-app-token');
  const firstName = localStorage.getItem('banka-app-user-firstName');
  const lastName = localStorage.getItem('banka-app-user-lastName');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);
  fetch(`${API_PREFIX}/accounts`, {
    method: 'GET',
    headers
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === 200) {
        modal.style.display = 'none';
        const { data } = response;
        data.forEach(datum => {
          const allAccounts = `<tr class="admin-accnts-tr">
              <td class="admin-accnts-td">${firstName} ${lastName}</td>
              <td class="admin-accnts-td">${datum.accountnumber}</td>
              <td class="admin-accnts-td">${datum.createdon.split('T')[0]}</td>
              <td class="admin-accnts-td">
              ${
                datum.status === 'active'
                  ? `<p class="badge-active accnt-badge" id="accnt-badge">${datum.status}</p>`
                  : `<p class="badge-inactive accnt-badge" id="accnt-badge">${datum.status}</p>`
              }
                
              </td>
              <td class="admin-accnts-td">
                <a href="accountinfo.html" class="admin-view-details" data-account-id=${
                  datum.id
                }>Details</a>
              </td>
            </tr>`;
          accountsTable.innerHTML += allAccounts;
        });
      }
      if (response.data.length === 0) {
        modal.style.display = 'none';
        accountsViewArea.innerHTML = '<h1>You have no accounts at this time.</h1>';
      }
    })
    .catch(err => {
      para.innerHTML = '';
      text = document.createTextNode(`${err.message}`);
      para.appendChild(text);
      modalContent.appendChild(para);
      modal.style.display = 'block';
    });
};

span.onclick = () => {
  modal.style.display = 'none';
};

window.onload(fetchAccounts());
