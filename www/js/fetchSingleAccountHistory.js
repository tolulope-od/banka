/* global window, document, fetch, localStorage, Headers */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["errors"] }] */

const API_PREFIX = 'https://bankaa-app.herokuapp.com/api/v1/';
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];
const modalContent = document.getElementById('account-modal-content');
const para = document.createElement('P');
const transactionsTable = document.getElementById('transactions-table');
const transactionsDisplay = document.getElementById('transactions');
let text;

// Gotten from https://blog.abelotech.com/posts/number-currency-formatting-javascript/
const formatNumber = num => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

const fetchAccountTransactionHistory = () => {
  para.innerHTML = '';
  text = document.createTextNode('Loading...');

  para.appendChild(text);
  modalContent.appendChild(para);
  modal.style.display = 'block';
  const owner = localStorage.getItem('banka-account-owner'); // Should be the owners name
  const status = localStorage.getItem('banka-account-status'); // should be the account's status
  const accountNumber = localStorage.getItem('banka-account-number-view');
  const createdDate = localStorage.getItem('banka-account-created-date');
  const token = localStorage.getItem('banka-app-token');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);
  fetch(`${API_PREFIX}/accounts/${accountNumber}/transactions`, {
    method: 'GET',
    headers
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === 200) {
        modal.style.display = 'none';
        const { data } = response;
        document.getElementById('accnt-name').innerHTML = owner;
        document.getElementById('accnt-badge').innerHTML = status;
        document.getElementById('accnt-number').innerHTML = accountNumber;
        document.getElementById('created-date').innerHTML = `${createdDate.split('T')[0]}`;
        data.forEach(transaction => {
          const transactionDetails = `<tr>
              <td>${transaction.createdon.split('T')[0]}</td>
              <td>${transaction.type}</td>
              <td>&#x20A6; ${formatNumber(Math.round(transaction.amount * 100) / 10)}</td>

              <td>&#x20A6; ${formatNumber(Math.round(transaction.oldbalance * 100) / 10)}</td>
              <td>&#x20A6; ${formatNumber(Math.round(transaction.newbalance * 100) / 10)}</td>

              <td>${transaction.cashier}</td>
            </tr>`;
          transactionsTable.innerHTML += transactionDetails;
        });

        if (data.length === 0) {
          transactionsDisplay.innerHTML = `<h2>There are no transactions on this account at this time</h2>`;
        }
      } else {
        para.innerHTML = '';
        text = document.createTextNode(response.error);
        para.appendChild(text);
        modalContent.appendChild(para);
        modal.style.display = 'block';
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};

span.onclick = () => {
  modal.style.display = 'none';
};

window.onload(fetchAccountTransactionHistory());
