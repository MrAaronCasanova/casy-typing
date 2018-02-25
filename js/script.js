// ********** DOM Elements **********

let textDisplayBox = document.querySelector('.text-display-box');
let score = document.querySelector('.score');
let startBtn = document.querySelector('.start-btn');

// ********** Start Game **********

startBtn.addEventListener('click', function () {
  let apis = [ronQuotes, numFacts, talaikis];
  let randomApi = Math.floor(Math.random() * apis.length);
  apis[randomApi]();

  // working ***
  // talaikis();
  // numFacts();
  // ronQuotes();

  // not working ***
  // quotesOnDesign();
  // forismatic();
  // catFacts();
});

// ********** Fetched Data **********

function ronQuotes() {
  let ronUrl = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
  let xhr = new XMLHttpRequest();
  xhr.open('GET', ronUrl);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = JSON.parse(xhr.responseText)[0];
      // display api content on page
      textDisplayBox.innerHTML = resData;

      // zero out score information on page
      score.textContent = '';

      // assign responce data to textData var for use in game logic
      textData = resData;

      // reset counters
      counter = 0;
      loserCount = 0;
    }
  };

  xhr.send();
}

function numFacts() {
  let numUrl = 'http://numbersapi.com/random/';
  let urlSuffix = ['trivia', 'year', 'date', 'math'];
  let randomSuffix = Math.floor(Math.random() * urlSuffix.length);
  let xhr = new XMLHttpRequest();
  xhr.open('GET', numUrl + urlSuffix[randomSuffix]);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = xhr.responseText;
      // display api content on page
      textDisplayBox.innerHTML = resData;

      // zero out score information on page
      score.textContent = '';

      // assign responce data to textData var for use in game logic
      textData = resData;

      // reset counters
      counter = 0;
      loserCount = 0;
    }
  };

  xhr.send();
}

function talaikis() {
  let talaikisUrl = 'https://talaikis.com/api/quotes/random/';
  let xhr = new XMLHttpRequest();
  xhr.open('GET', talaikisUrl);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = JSON.parse(xhr.responseText);
      let mainText = resData.quote + ' - ' + resData.author;
      // display api content on page
      textDisplayBox.innerHTML = mainText;

      // zero out score information on page
      score.textContent = '';

      // assign responce data to textData var for use in game logic
      textData = mainText;

      // reset counters
      counter = 0;
      loserCount = 0;
    }
  };

  xhr.send();
}

// function catFacts() {
//   let catUrl = 'https://cat-fact.herokuapp.com/facts';
//   fetch(catUrl)
//   .then(function () {
//     console.log('helloWorld');
//   });
// }

// function forismatic() {
//   let forisUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=xml&lang=en';
//   let xhr = new XMLHttpRequest();
//   xhr.open('GET', forisUrl);
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState == 4 && xhr.status == 200) {
//       let resData = xhr.responseText;
//       // display api content on page
//       textDisplayBox.innerHTML = resData;
//
//       // zero out score information on page
//       score.textContent = '';
//
//       // assign responce data to textData var for use in game logic
//       textData = resData;
//
//       // reset counters
//       counter = 0;
//       loserCount = 0;
//     }
//   };
//
//   xhr.send();
// }


// ********** Type Functionality **********

// successfull keypress
let counter = 0;

// incorrect keypress
let loserCount = 0;

// typing accuracy in percentage
let accuracy;

// start time stored in milliseconds from 1970
let startTime;

// end time stored in milliseconds from 1970
let endTime;

// difference of endTime and startTime and converted ms to sec
let finalTime;

// calcuation of gross words per minute not accounting for errors
let grossWPM;

// calcuation of net words per minute accounting for errors
let netWPM;

// textData holds fetch data
let textData;

// monitoring any keypress on the body of the page
let keypress = document.querySelector('body');
keypress.addEventListener('keypress', function (e) {
  // checks counter against textData.length to verify if game is active
  if (counter < textData.length) {
    // checks if keypress matches the charCode of specific textData char
    if (e.which === textData.charCodeAt(counter)) {
      // increment counter
      counter++;

      // update page contents to reflect successfull keypress
      textDisplayBox.innerHTML = '<span>' + textData.slice(0, counter) + '</span>' + textData.slice(counter);

      // start game timer - aka. holds starting time in variable via ms
      if (counter === 1) { startTime = new Date().getTime(); }
    } else {
      // increment loserCount
      loserCount++;

      // update page to reflect loserCount
      score.textContent = 'Wrong: ' + loserCount;
    }
  } else {
    // game over logic

    // stores end time in variable via ms
    endTime = new Date().getTime();

    // calulates total game play time and converts ms to sec
    finalTime = (endTime - startTime) / 1000;

    // calutates WPM logic - view resources for web reference
    // side note: finalTime / 60 converts seconds to minutes
    grossWPM = ((textData.length / 5) / (finalTime / 60)).toFixed(2);
    netWPM = (grossWPM - (loserCount / (finalTime / 60))).toFixed(2);

    // accuracy logic
    accuracy = (((textData.length - loserCount) / textData.length) * 100).toFixed(2);

    // update page with score information
    score.textContent = 'Nice work: Completed with ' + accuracy + '% accuracy!' + ' grossWPM: ' + grossWPM;
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

// ********** Resources **********
// https://www.speedtypingonline.com/typing-equations

// ********** TODO **********
// TODO: refactor duplicate update DOM code every xml request
// TODO: save textData.length to variable and refactor everywhere
// TODO: set .focus() method after start click button to point to the body
// TODO: turn incorrect letters red
// TODO: add if statement when game ends so no additional keypress will trigger game over data
// TODO: find more apis to use
// TODO: make a random api fetch selector using math random everytime you click
// TODO: eventually make backspace logic to correct errors
// TODO:  / reverse loserCount - only then can we use netWPM

// NOTE: https://www.programmableweb.com/api/notable-and-quotable-random-quote
// NOTE: https://www.programmableweb.com/api/cat-facts
// NOTE: https://www.programmableweb.com/api/act-facts
// NOTE: https://www.programmableweb.com/api/chuck-norris-facts
// NOTE: https://www.programmableweb.com/api/numbers
// NOTE: https://www.programmableweb.com/api/musicgraph
// NOTE: https://www.programmableweb.com/api/artfacts
// NOTE: https://www.programmableweb.com/api/tarya-technologies-randomquotes
// NOTE: https://www.programmableweb.com/api/quotations-book
