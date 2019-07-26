let PATH = {};

if ("develop") {
  PATH = {
    BOOKS: "./file/json/gotBook.json",
    CHARACTERS: "./file/json/gotCharacters.json",
    HIDE: false
  };
} else {
  PATH = {
    BOOKS: "https://www.anapioficeandfire.com/api/books/",
    CHARACTERS: "https://anapioficeandfire.com/api/characters/",
    HIDE: true
  };
}

const EVENT = {
  REQUESTS_CHARACTERS: "RequestsCharacters",
};

function createLinkCharacters(arr) {
  const numbersStr = arr.reduce((before, next) => before += next.match(/\d+$/)[ 0 ] + ",", "");
  
  return numbersStr.slice(0, (numbersStr.length - 1))
}

function dateFormat(str) {
  const date = new Date(str);
  
  return `${ date.getFullYear() }.${ date.getMonth() }.${ date.getDay() }`;
}

function isDate(date) {
  return ( date.length > 9 && new Date(date) !== "Invalid Date" && !isNaN(new Date(date)) ) ? true : false;
}


const sorting = {
  asc: (field) => (a, b) => (a[field] < b[field]) ? -1 : (a[field] > b[field]) ? 1 : 0,
  desc: (field) => (a, b) => (a[field] > b[field]) ? -1 : (a[field] < b[field]) ? 1 : 0,
  random: (a, b) => Math.random() - 0.5
};