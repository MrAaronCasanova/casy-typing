// ********** DOM Elements **********

let textDisplayBox = document.querySelector('.text-display-box');
let score = document.querySelector('.score');
let startBtn = document.querySelector('.start-btn');

// ********** Start Game **********

startBtn.addEventListener('click', function () {
  newGame();
});

function newGame() {
  let apis = [ronQuotes, numFacts, talaikis];
  let randomApi = Math.floor(Math.random() * apis.length);
  apis[randomApi]();

  // reset counters
  counter = 0;
  loserCount = 0;
  loserArr = [];
  keypressArr = [];

  // // zero out score information on page
  score.textContent = 'Wrong: ' + loserArr.length + ' Count: ' + counter;

  // working ***
  // talaikis();
  // numFacts();
  // ronQuotes();

  // not working ***
  // quotesOnDesign();
  // forismatic();
  // catFacts();
}

// ********** Fetched Data **********

function ronQuotes() {
  let ronUrl = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
  let xhr = new XMLHttpRequest();
  xhr.open('GET', ronUrl);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = JSON.parse(xhr.responseText)[0];
      let mainText = resData + ' - Ron Swanson';

      // display api content on page
      textDisplayBox.innerHTML = mainText;

      // assign responce data to textData var for use in game logic
      textData = mainText;
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

      // assign responce data to textData var for use in game logic
      textData = resData;
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

      // assign responce data to textData var for use in game logic
      textData = mainText;
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
//       // assign responce data to textData var for use in game logic
//       textData = resData;
//     }
//   };
//
//   xhr.send();
// }

// ********** Type Functionality **********

// textData holds fetch data
let textData = 'Game Text Goes Here! - This will be overwritten everytime newGame() is invoked';

// current position
let counter = 0;

// incorrect keypress references
// are stored in loserArr
let loserArr = [];
let loserCount = 0;

// All keypress characters are stored in this array
let keypressArr = [];
let joinedText;

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

// backspace & enter keypress logic
document.addEventListener('keydown', function (e) {
  // targets the backspace keypress
  if (e.which === 8) {
    // won't let you backspace at starting position
    if (counter > 0) {
      // backspace logic

      // sets counter back
      counter--;

      // removes last item added to keypress array
      keypressArr.pop();

      // join keypress array for textDisplayBox
      joinedText = keypressArr.join('');

      // update DOM/Display text
      textDisplayBox.innerHTML = '<span>' + joinedText +
      '</span>' + textData.slice(counter);

      // checks if any incorrect keypress references match the current counter position (boolean)
      let checkCount = loserArr.some(function (val) {
        return val === counter;
      });

      // if checkCount is true / the incorrect keypress reference is remove from the array
      if (checkCount) loserArr.pop();

      // update page to reflect score
      score.textContent = 'Wrong: ' + loserArr.length + ' Count: ' + counter;
    }
  }

  // NOTE: WILL LEAVE THIS CODE FOR NOW / IF ENTER KEY BREAKS
  // if (e.which === 13) {
  //   // ^^^ targets the enter keypress
  //   // vvv only works works at the end of the game
  //   if (counter > textData.length) {
  //     // enter keypress logic
  //     newGame();
  //   }
  // }
});

// monitoring any keypress on the body of the page
let keypress = document.querySelector('body');
keypress.addEventListener('keypress', function (e) {
  // checks counter against textData.length to verify if game is active
  if (counter < textData.length && e.which !== 13) {
    // checks if keypress matches the charCode of specific textData char
    if (e.which === textData.charCodeAt(counter)) {
      // start game timer - aka. holds starting time in variable via ms
      if (counter === 0) startTime = new Date().getTime();

      // stores character at current counter position in keypress array
      keypressArr.push(textData[counter]);

      // join keypress array for textDisplayBox
      joinedText = keypressArr.join('');

      // update DOM/Display text
      textDisplayBox.innerHTML = '<span>' + joinedText +
      '</span>' + textData.slice(counter + 1);

      // increment counter / current position
      counter++;

      // update page to reflect score
      score.textContent = 'Wrong: ' + loserArr.length + ' Count: ' + counter;
    } else {
      // push incorrect keypress reference to loserArr
      loserArr.push(counter);

      // stores incorrect character at current counter position in keypress array
      keypressArr.push('<em>' +
      textData[counter] +
      '</em>');

      // join keypress array for textDisplayBox
      joinedText = keypressArr.join('');

      // update DOM/Display text
      textDisplayBox.innerHTML = '<span>' + joinedText +
      '</span>' + textData.slice(counter + 1);

      // increment counter / current position
      counter++;

      // update page to reflect score
      score.textContent = 'Wrong: ' + loserArr.length + ' Count: ' + counter;
    }
  } else {
    // game over logic

    // targets the enter keypress
    if (e.which === 13) {
      if (counter > textData.length) {
        // only works works at the end of the game
        newGame();
      } else if (e.shiftKey) {
        // force newGame with shift + enter
        newGame();
      }
    }

    if (counter === textData.length) {
      // increment counter so game can't continue
      counter++;

      // calculates loserCount from items left in loserArr
      loserCount = loserArr.length;

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
      score.textContent = 'Nice work: Completed with ' +
      accuracy + '% accuracy!' + ' grossWPM: ' +
      grossWPM + ' netWPM: ' + netWPM;
    }
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
// TODO: find more apis to use
// TODO: make score infor on page show count / textData length - aka count/out of some num

// NOTE: https://www.programmableweb.com/api/notable-and-quotable-random-quote
// NOTE: https://www.programmableweb.com/api/cat-facts
// NOTE: https://www.programmableweb.com/api/act-facts
// NOTE: https://www.programmableweb.com/api/chuck-norris-facts
// NOTE: https://www.programmableweb.com/api/numbers
// NOTE: https://www.programmableweb.com/api/musicgraph
// NOTE: https://www.programmableweb.com/api/artfacts
// NOTE: https://www.programmableweb.com/api/tarya-technologies-randomquotes
// NOTE: https://www.programmableweb.com/api/quotations-book
