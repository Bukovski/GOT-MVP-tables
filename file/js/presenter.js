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
  
    this.eventBindingToTable(); //call only after drawing the table (for events click)
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
    this._paginationLayout = "";
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
    this.createTable(); //must be first for get data before drawn
    
    this._view.showModalWindow(); //drawn modal window
    
    this.showPagination();
    this.showSelectOption();
  }
  
  closeModalCharacters(event) {
    this._view.hideModalWindow();
    
    this.resetDataInsideModalWindow();
  }
  
  showPagination() {
    this._view.paginationTemplate(); //drawn pagination
    this.eventPagination();
    this.startPagination();
  }
  
  showSelectOption() {
    this.addOptionToSelect();
    this.eventOptionOfSelect();
  }
  
  createTable() {
    const collection = this._model.getCharactersCollection();
    const keyTable = this._model.getKeyModalTable();
    const container = this._view.modal;
    
    this._view.tableTemplate(container, collection, keyTable, this._model.keyUpperCase(keyTable));
    
    this.eventBindingToTable(); //call only after drawing the table (for events click)
  }
  
  resetDataInsideModalWindow() {
    this._view.removeModalWindowTable();
    this._view.removeModalWindowPagination();
  
    this._model.setPaginationSettings({ page: 1 });
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
  
  sortTableBody(target) {
    const dataSortOrder = this._view.getAttributeSortOrder(target);
    
    this._model.setSortOrder(dataSortOrder);
    this._view.setAttributeSortOrder(target, this._model.getSortOrder());
    
    const attrName = target.getAttribute('data-name');
    this._model.sortCharacters(attrName);
    
    const currentPageNumber = this._model.getPaginationSettings().page;
    const getPieceOfData = this._model.getCharactersCollection(currentPageNumber);
    
    this._view.removeTbodyTable();
    
    this.tableBodyTemplate(getPieceOfData)
  }
  
  eventPagination() {
    this._view.togglePaginationButtonLeft((event) => {
      let pageNumber = this._model.getPaginationSettings().page;
      
      pageNumber--;
      
      this._model.setPaginationSettings({ page: pageNumber });

      if (pageNumber < 1) {
        this._model.setPaginationSettings({ page: 1 });
      }
      
      this.startPagination();
    });
    
    
    this._view.togglePaginationButtonRight((event) => {
      let { size, page } = this._model.getPaginationSettings();
  
      page++;
  
      this._model.setPaginationSettings({ page: page });
  
      if (page > size) {
        this._model.setPaginationSettings({ page: size });
      }
  
      this.startPagination();
    });
  }
  
  addPagesNumberPagination(from, to) {
    for (let item = from; item < to; item++) {
      this._paginationLayout += `<a>${ item }</a>`;
    }
  }
  
  addFirstPagePagination() {
    this._paginationLayout += '<a>1</a><i>...</i>';
  }
  
  addLastPagePagination() {
    const pageSize = this._model.getPaginationSettings().size;
  
    this._paginationLayout += `<i>...</i><a>${ pageSize }</a>`;
  }
  
  writePagination() {
    this._view.getPaginationSpan().innerHTML = this._paginationLayout;
    this._paginationLayout = "";
  
    this.writeButtonsNumberPagination();
  }
  
  writeButtonsNumberPagination() {
    let pageNumber = this._model.getPaginationSettings().page;
    const tagLinc = this._view.getPaginationInnerButtons();
    
    const buttonsClick = (event) => {
      const numberPage = +event.target.innerHTML; //get number of click button
      
      this._model.setPaginationSettings({ page: numberPage });
      this.startPagination();
    };
    
    for (let item = 0, len = tagLinc.length; item < len; item++) {
      const tag = tagLinc[ item ];
      
      if (parseInt(tag.innerHTML) === pageNumber) {
        this._view.removeTbodyTable();
        
        this.tableBodyTemplate(this._model.getCharactersCollection( parseInt(tag.innerHTML)) );
        
        tag.className = 'modal__current-page';
      }
      
      tag.addEventListener('click', buttonsClick);
    }
  }
  
  startPagination() {
    const { step, size, page } = this._model.getPaginationSettings();
    
    const stepBothSide = step * 2;
    
    if ( size < stepBothSide + 6 ) {
      this.addPagesNumberPagination( 1, size + 1 );
    } else if ( page < stepBothSide + 1 ) {
      this.addPagesNumberPagination(1, stepBothSide + 4);
      this.addLastPagePagination();
    } else if ( page > size - stepBothSide ) {
      console.log( (size - stepBothSide) - 2, size + 1 );
      this.addFirstPagePagination();
      this.addPagesNumberPagination( (size - stepBothSide) - 2, size + 1 );
    } else {
      this.addFirstPagePagination();
      this.addPagesNumberPagination( (page - step), ((page + step) + 1) );
      this.addLastPagePagination()
    }
    
    this.writePagination()
  }
  
  addOptionToSelect() {
    const whereToInsert = this._view.selectOfRecord;
    const currentCountOfRecords = this._model.getPaginationSettings().notes;
    let select;
    
    for (let item = 1; item < 16; item++) {
      
      if (currentCountOfRecords === item) {
        select = item;
      }
      
      this._view.selectOptionTemplate(whereToInsert, item);
    }
    
    whereToInsert[ select - 1 ].selected = true;
  }
  
  eventOptionOfSelect() {
    const resetDataOnPage = () => {
      const currentPageNumber = this._model.getPaginationSettings().page;
      const getPieceOfData = this._model.getCharactersCollection(currentPageNumber);
  
      this._view.removeTbodyTable();
      this._view.removeModalWindowPagination();
  
      this.tableBodyTemplate(getPieceOfData);
  
      this.showPagination();
    };
    
    const currentCountOfRecords = this._model.getPaginationSettings().notes;
    
    this._view.toggleSelectRecordsOfPage((even) => {
      const target = even.target;
      const valueOfOption = parseInt(target.options[ target.selectedIndex ].value);
      
      if (currentCountOfRecords !== valueOfOption) {
        this._model.setPaginationSettings({ notes: valueOfOption });
  
        resetDataOnPage();
      }
    })
  }
  
  buildModalWindow() {
    this._view.bindModalClose(this.closeModalCharacters.bind(this));
    
    customEvents.addListener(EVENT.REQUESTS_CHARACTERS, () => this.showModalCharacters());
  }
}