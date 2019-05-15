/* eslint-disable no-unused-vars */
/* global window, document, fetch, localStorage, Headers */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["errors"] }] */

const API_PREFIX = 'https://bankaa-app.herokuapp.com/api/v1/';
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];
const modalContent = document.getElementById('account-modal-content');
const para = document.createElement('P');
const transactionsTable = document.getElementById('transactions-table');
const transactionsDisplay = document.getElementById('transactions');
const accountDetails = document.querySelector('.accnt-details');
const debitForm = document.getElementById('accnt-debit-form');
const creditForm = document.getElementById('accnt-credit-form');
const confirmDeleteMsg = document.getElementById('confirm-delete');
let text;

const handleError = errMessage => {
  para.innerHTML = '';
  text = document.createTextNode(errMessage);
  para.appendChild(text);
  modalContent.appendChild(para);
  modal.style.display = 'block';
};

// Gotten from https://blog.abelotech.com/posts/number-currency-formatting-javascript/
const formatNumber = num => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

const fetchAccountTransactionHistory = () => {
  para.innerHTML = '';
  para.innerHTML =
    '<center><img src="https://res.cloudinary.com/tolulope-od/image/upload/v1557908999/loading_o1y5v6.gif" width="150" /></center>';
  modalContent.appendChild(para);
  modal.style.display = 'block';
  const owner = localStorage.getItem('banka-account-owner');
  const status = localStorage.getItem('banka-account-status');
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
        const userType = localStorage.getItem('banka-app-user-type');

        if (status === 'active' && userType === 'staff') {
          document.getElementById('accnt-status-btn').innerHTML = 'Deactivate Account';
        }

        if (status !== 'active' && userType === 'staff') {
          document.getElementById('accnt-status-btn').innerHTML = 'Activate Account';
        }

        const deatils = `<div class="accnt-detail-hd">
            <p class="balance-text accnt-info-txt">Account Name:</p>
            <h3 class="accnt-name" id="accnt-name">${owner}</h3>
          </div>
          <div class="accnt-detail-hd">
            <p class="balance-text accnt-info-txt">Status:</p>
            ${
              status === 'active'
                ? `<p class="badge-active accnt-badge" id="accnt-badge">${status}</p>`
                : `<p class="badge-inactive accnt-badge" id="accnt-badge">${status}</p>`
            }
            
          </div>
          <div class="accnt-detail-hd">
            <p class="balance-text accnt-info-txt">Account Number:</p>
            <h3 class="accnt-name" id="accnt-number">${accountNumber}</h3>
          </div>
          <div class="accnt-detail-hd">
            <p class="balance-text accnt-info-txt">Created:</p>
            <h3 class="accnt-name" id="created-date">${createdDate.split('T')[0]}</h3>
          </div>`;

        accountDetails.innerHTML = deatils;

        data.forEach(transaction => {
          const transactionDetails = `<tr>
              <td>${transaction.createdon.split('T')[0]}</td>
              <td>${transaction.type}</td>
              <td>&#x20A6; ${formatNumber(transaction.amount)}</td>

              <td>&#x20A6; ${formatNumber(parseFloat(transaction.oldbalance).toFixed(2))}</td>
              <td>&#x20A6; ${formatNumber(parseFloat(transaction.newbalance).toFixed(2))}</td>

              <td>${transaction.cashiername}</td>
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
      const { log } = console;
      log(err.message);
      para.innerHTML = '';
      text = document.createTextNode('An error occurred');
      para.appendChild(text);
      modalContent.appendChild(para);
      modal.style.display = 'block';
    });
};

const showDebitForm = () => {
  // clear form area before displaying
  para.innerHTML = '';
  confirmDeleteMsg.style.display = 'none';
  creditForm.style.display = 'none';
  debitForm.style.display = 'block';
  modal.style.display = 'block';
};

const showCreditForm = () => {
  // clear form area before displaying
  para.innerHTML = '';
  confirmDeleteMsg.style.display = 'none';
  debitForm.style.display = 'none';
  creditForm.style.display = 'block';
  modal.style.display = 'block';
};

const showDeleteModal = () => {
  para.innerHTML = '';
  debitForm.style.display = 'none';
  creditForm.style.display = 'none';
  confirmDeleteMsg.style.display = 'block';
  modal.style.display = 'block';
};

const handleAccountDebit = () => {
  const debitAmount = document.getElementById('debit-amount').value;
  const debitBtn = document.getElementById('debit-btn');
  const accountNumber = localStorage.getItem('banka-account-number-view');
  const token = localStorage.getItem('banka-app-token');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);
  para.innerHTML = 'Transaction in progress...';
  debitBtn.value = 'LOADING..';
  debitBtn.disabled = true;
  debitBtn.style.backgroundColor = 'grey';
  fetch(`${API_PREFIX}/transactions/${accountNumber}/debit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ debitAmount })
  })
    .then(res => res.json())
    .then(response => {
      debitBtn.value = 'Confirm';
      debitBtn.disabled = false;
      debitBtn.style.backgroundColor = null;
      if (response.status === 200) {
        para.innerHTML = `${response.message}`;
      } else {
        para.innerHTML = `${response.error}`;
      }
    })
    .catch(err => {
      const { log } = console;
      log(err.message);
      handleError('An error occurred');
    });
};

const handleAccountCredit = () => {
  const creditAmount = document.getElementById('credit-amount').value;
  const creditBtn = document.getElementById('credit-btn');
  const accountNumber = localStorage.getItem('banka-account-number-view');
  const token = localStorage.getItem('banka-app-token');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);
  para.innerHTML = 'Transaction in progress...';
  creditBtn.value = 'LOADING..';
  creditBtn.disabled = true;
  creditBtn.style.backgroundColor = 'grey';
  fetch(`${API_PREFIX}/transactions/${accountNumber}/credit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ creditAmount })
  })
    .then(res => res.json())
    .then(response => {
      creditBtn.value = 'Confirm';
      creditBtn.disabled = false;
      creditBtn.style.backgroundColor = null;
      if (response.status === 200) {
        para.innerHTML = `${response.message}`;
      } else {
        para.innerHTML = `${response.error}`;
      }
    })
    .catch(err => {
      const { log } = console;
      log(err.message);
      handleError('An error occurred');
    });
};

const handleStatusChange = () => {
  const currentStatus = document.getElementById('accnt-status-btn').innerHTML;
  let newStatus;
  if (currentStatus === 'Deactivate Account') {
    newStatus = 'dormant';
  } else {
    newStatus = 'active';
  }
  const accountNumber = localStorage.getItem('banka-account-number-view');
  const token = localStorage.getItem('banka-app-token');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);
  fetch(`${API_PREFIX}/accounts/${accountNumber}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status: newStatus })
  })
    .then(res => res.json())
    .then(response => {
      const { data } = response;
      if (response.status === 200) {
        const accntBadge = document.getElementById('accnt-badge');
        localStorage.setItem('banka-account-status', data[0].status);
        if (data[0].status === 'active') {
          document.getElementById('accnt-status-btn').innerHTML = 'Deactivate Account';
          accntBadge.className = 'badge-active accnt-badge';
          accntBadge.innerHTML = `${data[0].status}`;
        } else {
          document.getElementById('accnt-status-btn').innerHTML = 'Activate Account';
          accntBadge.className = 'badge-inactive accnt-badge';
          accntBadge.innerHTML = `${data[0].status}`;
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
      const { log } = console;
      log(err.message);
      handleError('An error occurred. Please try again');
    });
};

const handleAccountDelete = () => {
  const accountNumber = localStorage.getItem('banka-account-number-view');
  const token = localStorage.getItem('banka-app-token');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', token);
  confirmDeleteMsg.innerHTML = 'Loading...';
  fetch(`${API_PREFIX}/accounts/${accountNumber}`, {
    method: 'DELETE',
    headers
  })
    .then(res => res.json())
    .then(response => {
      if (response.status === 200) {
        confirmDeleteMsg.innerHTML = `${response.message}`;
        setTimeout(() => {
          window.location = 'dashboard.html';
        }, 2000);
      } else {
        confirmDeleteMsg.innerHTML = `${response.error}`;
      }
    })
    .catch(err => {
      const { log } = console;
      log(err.message);
      handleError('An error occurred');
    });
};

const hideDeleteDisplay = () => {
  modal.style.display = 'none';
};

span.onclick = () => {
  modal.style.display = 'none';
};

window.onclick = event => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

window.onload(fetchAccountTransactionHistory());
