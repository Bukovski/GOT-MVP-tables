const ModelBook = (function () {
  let _sortTable = "asc";
  
  return class {
    constructor() {
      this._books = [];
      this._keyMainTable = [ "name", "authors", "mediaType", "numberOfPages", "publisher", "released", "characters" ];
      this._keyModalTable = [ "name", "gender", "playedBy", "aliases", "culture", "titles" ];
      this._characters = {};
      this._filterIdCharacters = [];
      this._settingsPagination = {
        notes: 8, // count of record on the modal table
        size: 10, // count of number buttons in pagination
        page: 1,  // start pagination from number
        step: 3   // count of button before and after active button
      };
      
      Object.freeze(this);
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
    
    async setBookCollection() {
      const arrBooks = await this.readDataFromServer(PATH.BOOKS);
      this._books.push(...arrBooks);
    }
    
    getBookCollection() {
      return this._books;
    }
    
    keyUpperCase(arr) {
      const firstLetter = (str) => str[ 0 ].toUpperCase() + str.slice(1).replace(/([A-Z]+)/g, " $1");
      
      return arr.map(key => firstLetter(key))
    }
    
    sortBooks(field) {
      const collectBooks = this.getBookCollection();
      
      return collectBooks.sort(sorting[ _sortTable ](field));
    }
    
    setSortOrder(order) {
      if (!order || order === "desc") {
        _sortTable = "asc";
      } else {
        _sortTable = "desc";
      }
    }
    
    getSortOrder() {
      return _sortTable;
    }
    
    setArrayIDCharacters(arrId) {
      const idCharacters = arrId.reduce((before, item) => {
        const character = this._characters[ item ];
        
        if (character) {
          return before.concat(character)
        }
        
        return before;
      }, []);
      
      this._filterIdCharacters.push(...idCharacters)
    }
    
    async setCharactersCollection(numberCharacters) {
      const idCharacters = numberCharacters.split(",");
      let charactersBuffer;
      
      if (PATH.HIDE) {
        const arrRequests = idCharacters.map(async (number) => {
          if (!(number in this._characters)) {
            return charactersBuffer[ number ] = await this.readDataFromServer(PATH.CHARACTERS + number);
          }
        });
        
        await Promise.all(arrRequests);
      } else {
        charactersBuffer = await this.readDataFromServer(PATH.CHARACTERS);
      }
      
      Object.assign(this._characters, charactersBuffer);
      
      this.setArrayIDCharacters(idCharacters);
      
      customEvents.runListener(EVENT.REQUESTS_CHARACTERS);
    }
    
    getCharactersCollection(pageNumber = 1) {
      const recordsPerPage = this._settingsPagination.notes;
      
      this._settingsPagination.size = Math.ceil(this._filterIdCharacters.length / recordsPerPage);
      
      const pageNum = parseInt(pageNumber) - 1;
      const start = pageNum * recordsPerPage;
      const end = start + recordsPerPage;
      
      const records = this._filterIdCharacters.slice(start, end);
      
      return records;
    }
    
    getKeyModalTable() {
      return this._keyModalTable;
    }
    
    sortCharacters(field) {
      const collectBooks = this._filterIdCharacters;
      
      return collectBooks.sort(sorting[ _sortTable ](field));
    }
    
    getPaginationSettings() {
      return this._settingsPagination
    }
    
    setPaginationSettings(...collection) {
      const checkDataObject = (before, item) => {
        if (keySettings.includes(Object.keys(item)[ 0 ])) {
          return before = Object.assign(before, item)
        }
        
        return before
      };
      
      const keySettings = Object.keys(this._settingsPagination);
      const getObjectData = collection.reduce(checkDataObject, {});
      
      Object.assign(this._settingsPagination, getObjectData);
    }
  }
})();