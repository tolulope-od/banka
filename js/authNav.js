const dropDownBtn = document.getElementById("drop-down");
const dropDown = document.querySelector(".profile-dropdown");

const myDropdown = () => {
  if (dropDown.style.display === "none") {
    dropDown.style.display = "block";
  } else {
    dropDown.style.display = "none";
  }
};

dropDownBtn.addEventListener("click", () => {
  myDropdown();
});
