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
    const charactersCollection = this._model.getCharactersCollection();
    
    console.log(charactersCollection[ 38 ]);
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
    this._view.paginationTemplate(); //<-- отрисовываем шаблон для пагинации
    this.eventPagination();
    this.startPagination();
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
    const sortBooks = this._model.sortCharacters(attrName);
    
    this._view.removeTbodyTable();
    this.tableBodyTemplate(sortBooks)
  }
  
  eventPagination() {
    this._view.togglePaginationButtonLeft((event) => {
      let pageNumber = this._model.getPaginationSettings().page;
      
      pageNumber--;
      
      this._model.setPaginationSettings({ page: pageNumber });

      if (pageNumber < 1) {
        this._model.setPaginationSettings({ page: 1 });
      }
      
      console.log(this._model.getPaginationSettings())
      this.startPagination();
  
    });
    
    
    this._view.togglePaginationButtonRight((event) => {
      let pageNumber = this._model.getPaginationSettings().page;
      let pageSize = this._model.getPaginationSettings().size;
  
      pageNumber++;
  
      this._model.setPaginationSettings({ page: pageNumber });
  
      if (pageNumber > pageSize) {
        this._model.setPaginationSettings({ page: pageSize });
      }
  
      console.log(this._model.getPaginationSettings())
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
    
    const buttonsClick = () => { //вешаем события на кнопки с номерами
      pageNumber = +this.innerHTML; //получаем номер из кнопки на которую нажали и сохраняем в настройках
      
      this.startPagination();
    };
    
    for (let item = 0, len = tagLinc.length; item < len; item++) {
      if (+tagLinc[ item ].innerHTML === pageNumber) {
        // showPage(tagLinc[ item ]); //отрисовать таблицу с текущим номером пагинации
        
        tagLinc[ item ].className = 'modal__current-page';
      }
      
      tagLinc[ item ].addEventListener('click', buttonsClick);
    }
  }
  
  startPagination() {
    const pageStep = this._model.getPaginationSettings().step;
    const pageSize = this._model.getPaginationSettings().size;
    const pageNumber = this._model.getPaginationSettings().page;
    const stepBothSide = pageStep * 2; //отступаем с двух сорон от номера 6
    // showPage(settings.step)
    
    if ( pageSize < stepBothSide + 6 ) { //6 потому что по бокам стрелка + номер (1 или 30) + ...
      this.addPagesNumberPagination( 1, pageSize + 1 ); //1-30 в том случае когда не нежно отрисовывать троеточие по бокам
    } else if ( pageNumber < stepBothSide + 1 ) { //когда находимся на 2 странице
      this.addPagesNumberPagination(1, stepBothSide + 4);
      this.addLastPagePagination();
    } else if ( pageNumber > pageSize - stepBothSide ) { // если текущая страница больше 24 то вставляем первую страницу в начало
      this.addFirstPagePagination();
      this.addPagesNumberPagination( (pageSize - stepBothSide) - 2, pageSize + 1 );
    } else { //добавляем числа в начало и в конец, а в центре выводим нумерацию страниц
      this.addFirstPagePagination();
      this.addPagesNumberPagination(pageNumber - pageStep, (pageNumber + pageStep) + 1);
      this.addLastPagePagination()
    }
    
    this.writePagination()
  }
  
  
  buildModalWindow() {
    this._view.bindModalClose(this.closeModalCharacters.bind(this));
    
    customEvents.addListener(EVENT.REQUESTS_CHARACTERS, () => this.showModalCharacters());
    customEvents.addListener(EVENT.REQUESTS_CHARACTERS, () => this.createTable());
  }
}