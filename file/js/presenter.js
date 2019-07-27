class PresenterTable {
  constructor(model, view) {
    this._model = model;
    this._view = view;
  }
  
  initialize() {
    this._model.setBookCollection();
  
    this.createTable();
  }
  
  async createTable() {
    const collection = await this._model.getBookCollection();
    const keyTable = this._model._keyMainTable;
    const container = this._view.tableContainer;
  
    this._view.tableTemplate(container, collection, keyTable, this._model.keyUpperCase(keyTable));
  
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
  
  tableBodyTemplate(collection) {
    const table = this._view.getTable();
    const keyTable = this._model._keyMainTable;
    
    this._view.createTableBody(table, collection, keyTable, this._view.tableBodyCallback);
  }
  
  async sortTableBody(target) {
    const dataSortOrder = this._view.getAttributeSortOrder(target);
    
    this._model.setSortOrder(dataSortOrder);
    this._view.setAttributeSortOrder(target, this._model.getSortOrder());
    
    const attrName = target.getAttribute('data-name');
    const sortBooks = await this._model.sortBooks(attrName);
    
    this._view.removeTbodyTable();
    this.tableBodyTemplate(sortBooks)
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
  
  async createTable() {
    const collection = await this._model.getCharactersCollection();
    const keyTable = this._model.getKeyModalTable();
    const container = this._view.modal;
    
    this._view.tableTemplate(container, collection, keyTable, this._model.keyUpperCase(keyTable));
    
    this.eventBindingToTable(); //вызываем только после отрисовки таблицы потому что не на что вешать событие клика
  }
  
  eventBindingToTable() {
    this._view.toggleHeaderSorting((event) => {
      const target = event.target;
      
      if (target.tagName === 'TH') {
        this.sortTableBody(target);
      }
    })
  }
  
  tableBodyTemplate(collection) {
    const table = this._view.getTable();
    const keyTable = this._model.getKeyModalTable();
    
    this._view.createTableBody(table, collection, keyTable, this._view.tableBodyCallback);
  }
  
  async sortTableBody(target) {
    const dataSortOrder = this._view.getAttributeSortOrder(target);
    
    this._model.setSortOrder(dataSortOrder);
    this._view.setAttributeSortOrder(target, this._model.getSortOrder());
    
    const attrName = target.getAttribute('data-name');
    const sortBooks = await this._model.sortCharacters(attrName);
    
    this._view.removeTbodyTable();
    this.tableBodyTemplate(sortBooks)
  }
  
  
  buildModalWindow() {
    this._view.bindModalClose(this.closeModalCharacters.bind(this));
    
    customEvents.addListener(EVENT.REQUESTS_CHARACTERS, () => this.showModalCharacters());
    customEvents.addListener(EVENT.REQUESTS_CHARACTERS, () => this.createTable());
  }
}