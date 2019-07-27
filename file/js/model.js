class ModelBook {
  constructor() {
    this._books = [];
    this._keyMainTable = [ "name", "authors", "mediaType", "numberOfPages", "publisher", "released", "characters" ];
    this._keyModalTable = [ "name", "gender", "playedBy", "aliases", "culture", "titles" ];
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
    return Object.values(this._characters);
  }
  
  getKeyModalTable() {
    return this._keyModalTable;
  }
  
  sortCharacters(field) {
    const collectBooks = this.getCharactersCollection();
    
    return collectBooks.sort(sorting[ this._sortTable ](field));
  }
  
}