class PresenterTable {
  constructor(model, view) {
    this._model = model;
    this._view = view;
  }
  
  initialize() {
    this._model.setBookCollection();
  
    this.createTable();
  }
  
  createTableHead(tr, obj) {
    const arrKey = this._model.keyUpperCase(obj);
    const attribute = Object.keys(this._model.filterKey(obj));
    
    for (let i = 0, len = arrKey.length; i < len; i++) {
      this._view.drawTableHead(tr, arrKey[ i ], attribute[ i ]);
    }
    
    return tr;
  }
  
  async createTableBody(collection, table) {
    collection = collection || await this._model.getBookCollection();
    table = table || this._view.getTable();
    
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    this._view.container.appendChild(table);
  
    let td = null;
  
    for (let i = 0, len = collection.length; i < len; i++) {
      const trBody = document.createElement("tr");
      trBody.className = "table__line";
    
      td = this.createTableRow(trBody, collection[ i ]);
      tbody.appendChild(td);
    }
  }
  
  createTableRow(tr, obj) {
    const filterKey = this._model.filterKey(obj);
    
    for (let key in filterKey) {
      const elem = filterKey[ key ];
      
      this._view.drawTableRow(tr, elem);
    }
    
    return tr;
  }
  
  async createTable() {
    const bookCollection = await this._model.getBookCollection();
  
    const table = document.createElement("table");
    table.className = "table";
    
    const thead = document.createElement("thead");
    
    const trHead = document.createElement("tr");
    trHead.className = "table__line";
    
    const tRow = this.createTableHead(trHead, bookCollection[ 0 ]);
    
    thead.appendChild(tRow);
    table.appendChild(thead);
    
    this.createTableBody(bookCollection, table);
  
    this.eventBindingToTable(); //вызываем только после отрисовки таблицы потому что не на что вешать событие клика
  }
  
  eventBindingToTable() {
    this._view.toggleHeaderSorting((event) => {
      const target = event.target;
      
      if (target.tagName === 'TH') {
        this.sortTableBody(target);
      }
      if (target.tagName === 'A') {
        event.preventDefault();
        
        this._model.setCharactersCollection(target.getAttribute("href"));
      }
    })
  }
  
  async sortTableBody(target) {
    const dataSortOrder = this._view.getAttributeSortOrder(target);
    
    this._model.setSortOrderBooks(dataSortOrder);
    this._view.setAttributeSortOrder(target, this._model.getSortOrderBooks());
    
    const attrName = target.getAttribute('data-name');
    const sortBooks = await this._model.sortBooks(attrName);
    
    this._view.removeTbodyTable();
    this.createTableBody(sortBooks)
  }
}


class PresenterModal {
  constructor(model, view) {
    this._model = model;
    this._view = view;
  }
  
  initialize(presenter) {
    presenter.initialize();
    
    this.initListeners();
    this.buildModalWindow();
  }
  
  initListeners() {
    customEvents.registerListener(EVENT.REQUESTS_CHARACTERS);
  }
  
  showModalCharacters() {
    const charactersCollection = this._model.getCharactersCollection();
    
    console.log(charactersCollection[ 238 ]);
    
    this._view.showModalWindow();
  }
  
  closeModalCharacters(event) {
    this._view.hideModalWindow();
  }
  
  
  buildModalWindow() {
    this._view.bindModalClose(this.closeModalCharacters.bind(this));
    
    customEvents.addListener(EVENT.REQUESTS_CHARACTERS, () => this.showModalCharacters());
  }
}