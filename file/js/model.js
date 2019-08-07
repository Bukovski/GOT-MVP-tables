class ModelBook {
  constructor() {
    this._books = [];
    this._keyMainTable = [ "name", "authors", "mediaType", "numberOfPages", "publisher", "released", "characters" ];
    this._keyModalTable = [ "name", "gender", "playedBy", "aliases", "culture", "titles" ];
    this._sortTable = "asc";
    this._charactersBuffer = {};
    this._filterIdCharacters = [];
    this._settingsPagination = {
      countItems: 5
    }
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
  
  keyUpperCase(arr) {
    const firstLetter = (str) => str[0].toUpperCase() + str.slice(1).replace(/([A-Z]+)/g, " $1");
    
    return arr.map(key => firstLetter(key))
  }
  
  async sortBooks(field) {
    const collectBooks = await this.getBookCollection();
    
    return collectBooks.sort(sorting[ this._sortTable ](field));
  }
  
  setSortOrder(order) {
    if (!order || order === "desc") {
      this._sortTable = "asc";
    } else {
      this._sortTable = "desc";
    }
  }
  
  getSortOrder() {
    return this._sortTable;
  }
  
  setArrayIDCharacters(arrId) {
    this._filterIdCharacters = arrId.reduce((before, item) => {
      const character = this._charactersBuffer[ item ];
    
      if (character) {
        return before.concat(character)
      }
    
      return before;
    }, []);
  }
  
  async setCharactersCollection(numberCharacters) {
    const idCharacters = numberCharacters.split(",");
    
    if (PATH.HIDE) {
      const arrRequests = idCharacters.map(async (number) => {
        if (!(number in this._charactersBuffer)) {
          return this._charactersBuffer[ number ] = await this.readDataFromServer(PATH.CHARACTERS + number);
        }
      });
      
      await Promise.all(arrRequests);
    } else {
      this._charactersBuffer = await this.readDataFromServer(PATH.CHARACTERS);
    }
    
    this.setArrayIDCharacters(idCharacters);
    
    customEvents.runListener(EVENT.REQUESTS_CHARACTERS);
  }
  
  getCharactersCollection() {
    return this._filterIdCharacters;
  }
  
  getKeyModalTable() {
    return this._keyModalTable;
  }
  
  sortCharacters(field) {
    const collectBooks = this.getCharactersCollection();
    
    return collectBooks.sort(sorting[ this._sortTable ](field));
  }
  
}