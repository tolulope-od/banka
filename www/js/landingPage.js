/* global document, window */
const scrollFunction = () => {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById('navbar').style.padding = '35px 10px';
    document.getElementById('logo').style.fontSize = '25px';
    document.getElementById('navbar-right').style.fontSize = '15px';
  } else {
    document.getElementById('navbar').style.padding = '40px 10px';
    document.getElementById('logo').style.fontSize = '35px';
    document.getElementById('navbar-right').style.fontSize = '18px';
  }
};

window.onscroll = () => {
  scrollFunction();
};
