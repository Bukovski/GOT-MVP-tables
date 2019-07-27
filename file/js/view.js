class ViewTable {
  constructor() {
    this.tableContainer = document.getElementById("container");
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
    this.modal = document.getElementsByClassName("modal")[ 0 ];
    this.crossClosure = document.getElementsByClassName("modal__close")[ 0 ];
  }
  
  showModalWindow() {
    this.modal.style.display = "block";
  }
  
  hideModalWindow() {
    this.modal.style.display = "none";
  }
  
  bindModalClose(callback) {
    this.crossClosure.addEventListener("click", callback);
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
  
}