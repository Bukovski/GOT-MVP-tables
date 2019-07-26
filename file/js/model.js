class ModelBook {
  constructor() {
    this._books = [];
    this._keyFilter = [ "name", "authors", "mediaType",
      "numberOfPages", "publisher", "released", "characters" ];
    this._sortTable = "asc";
    this._characters = {};
  }
  
  readDataFromServer(link) {
    return axios.get(link)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  
  setBookCollection() {
    this._books = this.readDataFromServer(PATH.BOOKS)
  }
  
  async getBookCollection() {
    return await this._books;
  }
  
  filterKey(obj) {
    const newObj = {};
    const dataObj = obj;
    
    for (let key in dataObj) {
      if (this._keyFilter.includes( key )) {
        newObj[ key ] = dataObj[ key ];
      }
    }
    
    return newObj
  }
  
  keyUpperCase(obj) {
    const dataForTable = this.filterKey(obj);
    const firstLetter = (str) => str[0].toUpperCase() + str.slice(1).replace(/([A-Z]+)/g, " $1");
    
    return Object.keys(dataForTable).map(key => firstLetter(key))
  }
  
  async sortBooks(field) {
    const collectBooks = await this.getBookCollection();
    
    return collectBooks.sort(sorting[ this._sortTable ](field));
  }
  
  setSortOrderBooks(order) {
    if (!order || order === "desc") {
      this._sortTable = "asc";
    } else {
      this._sortTable = "desc";
    }
  }
  
  getSortOrderBooks() {
    return this._sortTable;
  }
  
  async setCharactersCollection(numberCharacters) {
    if (PATH.HIDE) {
      const arrCharacters = numberCharacters.split(",");
  
      const arrRequests = arrCharacters.map(async (number) => {
        if (!(number in this._characters)) {
          return this._characters[ number ] = await this.readDataFromServer(PATH.CHARACTERS + number);
        }
      });
  
      await Promise.all(arrRequests);
    } else {
      this._characters = await this.readDataFromServer(PATH.CHARACTERS);
    }
    
    customEvents.runListener(EVENT.REQUESTS_CHARACTERS);
  }
  
  getCharactersCollection() {
    return this._characters;
  }
  
}