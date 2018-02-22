// start/fetch data
//
// display content
//
// stor paragraph length in counter for index reference
//
// if  keypress matches index val true  increase counter
//
// false move on

// ********** DOM Elements **********

let textDisplayBox = document.querySelector('.text-display-box');
let successKeys = document.querySelector('.success-keys');
let startBtn = document.querySelector('.start-btn');

// ********** Fetched Data **********
let ronUrl = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';

startBtn.addEventListener('click', function () {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', ronUrl);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = JSON.parse(xhr.responseText)[0];
      textDisplayBox.innerHTML = resData;
      textData = resData;
      counter = 0;
    }
  };

  xhr.send();
});

// ********** Type Functionality **********
let counter = 0;

// textData holds fetch data
let textData = 'starting text';

let keypress = document.querySelector('body');
keypress.addEventListener('keypress', function (e) {

  if (e.which === textData.charCodeAt(counter)) {
    counter++;
    textDisplayBox.innerHTML = '<span>' + textData.slice(0, counter) + '</span>' + textData.slice(counter);
  } else {
    console.log('Loser');
  }
});

// ********** Custom Code **********

// https://github.com/react-bootstrap/react-bootstrap/issues/1300
// Deselects button after initial click
// & spacebar won't click the button
document.addEventListener('click', function (e) {
  if (document.activeElement.toString() == '[object HTMLButtonElement]') {
    document.activeElement.blur();
  }
});
