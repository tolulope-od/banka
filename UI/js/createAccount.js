const selected = document.getElementById("account-type");
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];
const modalContent = document.getElementById("account-modal-content");
const para = document.createElement("P");
let text;

const handleAccountSubmit = e => {
  para.innerHTML = "";
  if (selected.value !== "") {
    text = document.createTextNode(`${selected.value} account created`);
  } else {
    text = document.createTextNode(`No account selected`);
  }

  para.appendChild(text);
  modalContent.appendChild(para);
  modal.style.display = "block";
};

span.onclick = () => {
  modal.style.display = "none";
};

window.onclick = event => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
