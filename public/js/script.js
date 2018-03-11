// ********** Global Variables **********

// textData holds fetch data
let textData = null;

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

// categories pointing to each xhr
let apis = [randomCategory, ronQuotes, numFacts, talaikis, catFacts, csTerms];

// used to display selected category
let categoryDesc = ['Random Category', 'Ron Swanson Quotes', 'Numeric Facts', 'Quotes on Quotes on Quotes', 'Cat Facts', 'Computer Science Terms'];

// starting category - updates via range slider
let currentCategory = randomCategory;

// ********** DOM Elements **********

let startBtn = document.querySelector('.start-btn');
let score = document.querySelector('.score');
let textCategory = document.querySelector('.text-category');
let textDisplayBox = document.querySelector('.text-display-box');
let capsLock = document.querySelector('.caps-lock');
let cardFooter = document.querySelector('.card-footer');
let wpmDisp = document.querySelector('.wpmDisp');
let accuracyDisp = document.querySelector('.accuracyDisp');
let correctDisp = document.querySelector('.correctDisp');
let incorrectDisp = document.querySelector('.incorrectDisp');

// ********** Fetched Data **********

textCategory.addEventListener('input', function () {
  textCategory.blur();
  score.textContent = categoryDesc[textCategory.value];
  currentCategory = apis[textCategory.value];
});

function randomCategory() {
  let randomApi = Math.floor(Math.random() * apis.length);
  newGame(apis[randomApi]);
}

function csTerms() {
  // terms from http://www.labautopedia.org/mw/List_of_programming_and_computer_science_terms
  let termsUrl = 'https://raw.githubusercontent.com/MrAaronCasanova/casy-typing-resources/master/labautopedia-terms/labautopedia-terms';
  let urlSuffix = '.json';
  let randomUrlNum = Math.floor(Math.random() * 13);
  let xhr = new XMLHttpRequest();
  xhr.open('GET', termsUrl + randomUrlNum + urlSuffix);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = JSON.parse(xhr.responseText);
      let randomNum = Math.floor(Math.random() * resData.length);
      let mainText = resData[randomNum];

      // display api content on page
      textDisplayBox.innerHTML = '<span></span>' + mainText;

      // assign responce data to textData var for use in game logic
      textData = mainText;
    }
  };

  xhr.send();
}

function ronQuotes() {
  let ronUrl = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
  let xhr = new XMLHttpRequest();
  xhr.open('GET', ronUrl);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = JSON.parse(xhr.responseText)[0];
      let mainText = resData + ' - Ron Swanson';

      // display api content on page
      textDisplayBox.innerHTML = '<span></span>' + mainText;

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
      textDisplayBox.innerHTML = '<span></span>' + resData;

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
      textDisplayBox.innerHTML = '<span></span>' + mainText;

      // assign responce data to textData var for use in game logic
      textData = mainText;
    }
  };

  xhr.send();
}

function catFacts() {
  let catFactsUrl = 'https://raw.githubusercontent.com/vadimdemedes/cat-facts/master/cat-facts.json';
  let xhr = new XMLHttpRequest();
  xhr.open('GET', catFactsUrl);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let resData = JSON.parse(xhr.responseText);
      let randomNum = Math.floor(Math.random() * resData.length);
      let mainText = resData[randomNum];

      // display api content on page
      textDisplayBox.innerHTML = '<span></span>' + mainText;

      // assign responce data to textData var for use in game logic
      textData = mainText;
    }
  };

  xhr.send();
}

// ********** Start Game **********

startBtn.addEventListener('click', function () {
  newGame(currentCategory);
});

function newGame(category) {
  category();

  // reset counters
  counter = 0;
  loserCount = 0;
  loserArr = [];
  keypressArr = [];

  // zero out score information on page
  score.textContent = 'Count: ' + counter + ' Wrong: ' + loserArr.length;

  // hides score card
  cardFooter.classList.add('hide');

  // removes focus outline on startBtn
  startBtn.blur();
}

// ********** Main Typing Functionality **********

// monitoring any keypress on the body of the page
let keypress = document.querySelector('body');
keypress.addEventListener('keypress', function (e) {
  // checks counter against textData.length to verify if game is active
  if (textData !== null && counter < textData.length && e.which !== 13) {
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
      score.textContent = 'Count: ' + counter + ' Wrong: ' + loserArr.length;
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
      score.textContent = 'Count: ' + counter + ' Wrong: ' + loserArr.length;
    }
  } else {
    // game over logic

    if (textData !== null && counter === textData.length) {
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
      score.innerHTML = 'Press Enter to Start New Game';

      wpmDisp.textContent = netWPM;
      accuracyDisp.textContent = accuracy + '%';
      correctDisp.textContent = textData.length - loserCount;
      incorrectDisp.textContent = loserCount;

      cardFooter.classList.toggle('hide');
    }
  }
});

// backspace, enter & capslock keypress logic
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
      score.textContent = 'Count: ' + counter + ' Wrong: ' + loserArr.length;
    }
  }

  // targets the enter keypress
  if (e.which === 13) {
    if (e.shiftKey) {
      // force newGame with shift + enter
      newGame(currentCategory);
    } else if (textData !== null && counter > textData.length) {
      // only works works at the end of the game
      newGame(currentCategory);
    }
  }

  // true when you press the keyboard CapsLock key
  let caps = e.getModifierState('CapsLock');
  if (!caps) capsLock.classList.add('hide');
  else capsLock.classList.remove('hide');
});

// ********** Resources **********
// https://www.speedtypingonline.com/typing-equations

// ********** TODO **********
// TODO: find more apis to use
// TODO: make score infor on page show count / textData length - aka count/out of some num
// TODO: disable spacebar scrolling
// TODO: turn selectCategory field into dropdown
// TODO: change category function&descArray to an array with nested objects

// ********** NOTE **********
// NOTE: https://www.programmableweb.com/api/notable-and-quotable-random-quote
// NOTE: https://www.programmableweb.com/api/cat-facts
// NOTE: https://www.programmableweb.com/api/act-facts
// NOTE: https://www.programmableweb.com/api/chuck-norris-facts
// NOTE: https://www.programmableweb.com/api/numbers
// NOTE: https://www.programmableweb.com/api/musicgraph
// NOTE: https://www.programmableweb.com/api/artfacts
// NOTE: https://www.programmableweb.com/api/tarya-technologies-randomquotes
// NOTE: https://www.programmableweb.com/api/quotations-book
// NOTE: https://fact.birb.pw/

// NOTE: http://www.labautopedia.org/mw/List_of_programming_and_computer_science_terms
// NOTE: https://www.computerhope.com/jargon/program.htm
// NOTE: http://computer.yourdictionary.com/#

// NOTE: Solved 'Access-Control-Allow-Origin' with 'All Orgins'
// http://multiverso.me/AllOrigins/

// Fix below vvv

// fetch('http://allorigins.me/get?url=' + encodeURIComponent('https://fact.birb.pw/api/v1/dog'))
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     console.log(JSON.parse(myJson.contents).string);
//   });
