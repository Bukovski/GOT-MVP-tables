class ViewTable {
  constructor() {
    this._tableContainer = document.getElementById("container");
  }
  
  getTableContainer() {
    return this._tableContainer;
  }
  
  createTableHeader(table, fields, fieldTitles, callback) {
    table = table || document.createElement('table');
    const thead = document.createElement('thead');
    
    const thr = document.createElement('tr');
    thr.className = "table__line";
    
    fieldTitles.forEach((title, index) => {
      const th = document.createElement('th');
      
      th.className = "table__header";
      
      if (callback) {
        callback(th, fields[ index ]);
      }
      
      th.appendChild(document.createTextNode(title));
      
      thr.appendChild(th);
    });
    
    thead.appendChild(thr);
    table.appendChild(thead);
    
    return table;
  }
  
  createTableBody(table, objectArray, fields, callback) {
    const tbody = document.createElement('tbody');
    
    objectArray.forEach((object) => {
      const tr = document.createElement('tr');
      tr.className = "table__line";
      
      fields.forEach((field) => {
        const td = document.createElement('td');
        td.className = "table__cell";
        
        if (callback) {
          callback(td, field, object);
        } else {
          td.appendChild(document.createTextNode(object[ field ]));
        }
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    return table;
  }
  
  tableBodyCallback(td, field, object) {
    let appendData = null;
    const elem = object[ field ];
    
    if (field === "characters") {
      // if (Array.isArray(elem) && elem.length > 2) {
      const link = document.createElement("a");
      
      link.href = createLinkCharacters(elem);
      link.innerHTML = 'More info...';
      
      appendData = link;
    } else if (field === "released") {
      // } else if (isDate(elem)) {
      const date = dateFormat(elem);
      appendData = document.createTextNode(date);
    } else {
      appendData = document.createTextNode(elem);
    }
    
    td.appendChild(appendData);
  }
  
  tableTemplate(container, objectArray, fields, fieldTitles) {
    const table = document.createElement('table');
    table.className = "table";
    
    this.createTableHeader(table, fields, fieldTitles, (th, field) => {
      th.setAttribute("data-name", field);
    });
    
    this.createTableBody(table, objectArray, fields, this.tableBodyCallback);
    
    container.appendChild(table);
  }
  
  getTable() {
    return document.getElementsByClassName("table")[ 0 ];
  }
  
  removeTbodyTable() {
    const table = this.getTable();
    table.removeChild(table.tBodies[ 0 ])
  }
  
  toggleHeaderSorting(callback) {
    this.getTable().addEventListener("click", callback)
  }
  
  setAttributeSortOrder(domElement, order) {
    domElement.setAttribute("data-order", order);
  }
  
  getAttributeSortOrder(domElement) {
    return domElement.getAttribute("data-order");
  }
}


class ViewModal {
  constructor() {
    this._modal = document.getElementsByClassName("modal")[ 0 ];
    this._modalWrap = document.getElementsByClassName("modal__wrap")[ 0 ];
    this._crossClosure = document.getElementsByClassName("modal__close")[ 0 ];
    this._selectOfRecord = document.getElementById("modalSelect");
  }
  
  getModalContainer() {
    return this._modalWrap;
  }
  
  getSelectRecordContainer() {
    return this._selectOfRecord;
  }
  
  showModalWindow() {
    this._modal.style.display = "block";
  }
  
  hideModalWindow() {
    this._modal.style.display = "none";
  }
  
  removeModalWindowTable() {
    this._modal.querySelector("#modalTable").remove();
  }
  
  bindModalClose(callback) {
    this._crossClosure.addEventListener("click", callback);
  }
  
  createTableHeader(table, fields, fieldTitles, callback) {
    table = table || document.createElement('table');
    const thead = document.createElement('thead');
    
    const thr = document.createElement('tr');
    thr.className = "table__line";
    
    fieldTitles.forEach((title, index) => {
      const th = document.createElement('th');
      
      th.className = "table__header";
      
      if (callback) {
        callback(th, fields[ index ]);
      }
      
      th.appendChild(document.createTextNode(title));
      
      thr.appendChild(th);
    });
    
    thead.appendChild(thr);
    table.appendChild(thead);
    
    return table;
  }
  
  createTableBody(table, objectArray, fields, callback) {
    const tbody = document.createElement('tbody');
    
    objectArray.forEach((object) => {
      const tr = document.createElement('tr');
      tr.className = "table__line";
      
      fields.forEach((field) => {
        const td = document.createElement('td');
        td.className = "table__cell";
        
        if (callback) {
          callback(td, field, object);
        } else {
          td.appendChild(document.createTextNode(object[ field ]));
        }
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    return table;
  }
  
  tableBodyCallback(td, field, object) {
    let appendData = null;
    const item = object[ field ];
    
    if (!item.length || isArrayEmpty(item)) {
      appendData = document.createTextNode("-");
    } else {
      appendData = document.createTextNode(item);
    }
    
    td.appendChild(appendData);
  }
  
  tableTemplate(container, objectArray, fields, fieldTitles) {
    const table = document.createElement('table');
    table.className = "table";
    table.id = "modalTable";
  
    this.createTableHeader(table, fields, fieldTitles, (th, field) => {
      th.setAttribute("data-name", field);
    });
    
    this.createTableBody(table, objectArray, fields, this.tableBodyCallback);
    
    container.appendChild(table);
  }
  
  getTable() {
    return document.getElementById("modalTable");
  }
  
  removeTbodyTable() {
    const table = this.getTable();
    table.removeChild(table.tBodies[ 0 ])
  }
  
  toggleHeaderSorting(callback) {
    this.getTable().addEventListener("click", callback)
  }
  
  setAttributeSortOrder(domElement, order) {
    domElement.setAttribute("data-order", order);
  }
  
  getAttributeSortOrder(domElement) {
    return domElement.getAttribute("data-order");
  }
  
  selectOptionTemplate(parent, text, current) {
    const option = document.createElement('option');
    
    option.innerHTML = text;
    option.value = text;
    
    parent.appendChild(option)
  }
  
  toggleSelectRecordsOfPage(callback) {
    this._selectOfRecord.addEventListener("click", callback)
  }
}


class ViewPagination {
  constructor() {
    this._modalWrap = document.getElementsByClassName("modal__wrap")[ 0 ];
  
  }
  
  removePaginationOnPage() {
    this._modalWrap.querySelector("#modalPagination").remove();
  }
  
  paginationTemplate() {
    const wrapper = document.createElement('div');
    wrapper.className = "modal__pagination";
    wrapper.id = "modalPagination";
    
    const linkLeft = document.createElement('a');
    linkLeft.innerHTML = "&#9668";
    
    const linkRight = document.createElement('a');
    linkRight.innerHTML = "&#9658";
    
    const span = document.createElement('span');
    
    this._modalWrap.appendChild(wrapper);
    wrapper.appendChild(linkLeft);
    wrapper.appendChild(span);
    wrapper.appendChild(linkRight);
  }
  
  getPaginationSpan() {
    return this._modalWrap.querySelector("#modalPagination > span")
  }
  
  getPaginationLinks() {
    return this._modalWrap.getElementsByTagName("a");
  }
  
  getPaginationInnerButtons() {
    return this.getPaginationSpan().getElementsByTagName('a');
  }
  
  togglePaginationButtonLeft(callback) {
    this.getPaginationLinks()[ 0 ].addEventListener("click", callback)
  }
  
  togglePaginationButtonRight(callback) {
    this.getPaginationLinks()[ 1 ].addEventListener("click", callback)
  }
}