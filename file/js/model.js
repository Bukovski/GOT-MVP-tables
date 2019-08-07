class ModelBook {
  constructor() {
    this._books = [];
    this._keyMainTable = [ "name", "authors", "mediaType", "numberOfPages", "publisher", "released", "characters" ];
    this._keyModalTable = [ "name", "gender", "playedBy", "aliases", "culture", "titles" ];
    this._sortTable = "asc";
    this._charactersBuffer = {};
    this._filterIdCharacters = [];
    this._paginationCharacters = [];
    this._settingsPagination = {
      notes: 8, //количество записей в таблице
      size: 10, // количество кнопок в пагинации
      page: 1,  // старовать с номера страницы
      step: 3   // количество кнопок перед и поесле активной кнопки
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
    const notesOnPage = this._settingsPagination.notes;
    
    this._settingsPagination.size = Math.ceil(this._filterIdCharacters.length / notesOnPage);
    
    const pageNum = 2; //<-- +target.innerHTML
    const start = (pageNum - 1) * notesOnPage;
    const end = start + notesOnPage;
    
    const notes = this._filterIdCharacters.slice(start, end);
    console.log(notes)
    return notes;
    
    return this._filterIdCharacters;
  }
  
  getKeyModalTable() {
    return this._keyModalTable;
  }
  
  sortCharacters(field) {
    const collectBooks = this.getCharactersCollection();
    
    return collectBooks.sort(sorting[ this._sortTable ](field));
  }
  
  getPaginationSettings() {
    return this._settingsPagination
  }
  
  setPaginationSettings(...collection) {
    const checkDataObject = (before, item) => {
      if (keySettings.includes( Object.keys(item)[ 0 ] )) {
        return before = Object.assign(before, item)
      }
  
      return before
    };
    
    const keySettings = Object.keys(this._settingsPagination);
    const getObjectData = collection.reduce(checkDataObject, {});

    this._settingsPagination = Object.assign(this._settingsPagination, getObjectData);
  }
  
}