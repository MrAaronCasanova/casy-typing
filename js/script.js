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
let startBtn = document.querySelector('.start-btn');

// ********** Fetched Data **********
let ronUrl = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';

startBtn.addEventListener('click', function () {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', ronUrl);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = JSON.parse(xhr.responseText)[0];
      textDisplayBox.innerHTML = '<span></span>' + resData;
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
    console.log('success');
    console.log(counter);
    console.log(textDisplayBox.innerHTML[counter]);
  } else {
    console.log('Loser');
  };

  // if (e.which === textData[counter]) {
  //
  // }

  // console.log(textData[counter]);
  // console.log(e.which)
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
