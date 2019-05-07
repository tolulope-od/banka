/* global window, document, fetch, localStorage, Headers */
const API_PREFIX = 'https://bankaa-app.herokuapp.com/api/v1/';
const selected = document.getElementById('account-type');
const modal = document.getElementById('myModal');
const span = document.getElementsByClassName('close')[0];
const modalContent = document.getElementById('account-modal-content');
const para = document.createElement('P');
const firstName = localStorage.getItem('banka-app-user-firstName');
const lastName = localStorage.getItem('banka-app-user-lastName');
document.getElementById('account-first-name').value = firstName;
document.getElementById('account-last-name').value = lastName;
let text;

const handleError = errMessage => {
  para.innerHTML = '';
  text = document.createTextNode(errMessage);
  para.appendChild(text);
  modalContent.appendChild(para);
  modal.style.display = 'block';
};

// eslint-disable-next-line no-unused-vars
const handleAccountSubmit = () => {
  para.innerHTML = '';
  if (selected.value !== '') {
    text = document.createTextNode(`Creating your account....`);
    para.appendChild(text);
    modalContent.appendChild(para);
    modal.style.display = 'block';
    const type = selected.value;
    const token = localStorage.getItem('banka-app-token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    fetch(`${API_PREFIX}/accounts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ type })
    })
      .then(res => res.json())
      .then(response => {
        if (response.status === 201) {
          para.innerHTML = '';
          text = document.createTextNode(
            `${response.message}\nAccount Number: ${response.data[0].accountNumber}\nType: ${
              response.data[0].type
            }`
          );
          para.appendChild(text);
          modalContent.appendChild(para);
          modal.style.display = 'block';
          span.onclick = () => {
            modal.style.display = 'none';
            window.location = 'dashboard.html';
          };
          window.onclick = event => {
            if (event.target === modal) {
              modal.style.display = 'none';
              window.location = 'dashboard.html';
            }
          };
        } else {
          para.innerHTML = '';
          text = document.createTextNode(`${response.error}`);
          para.appendChild(text);
          modalContent.appendChild(para);
          modal.style.display = 'block';
        }
      })
      .catch(err => {
        const { log } = console;
        log(err.message);
        handleError('An error occurred');
      });
  } else {
    text = document.createTextNode(`No account selected`);
    para.appendChild(text);
    modalContent.appendChild(para);
    modal.style.display = 'block';
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
