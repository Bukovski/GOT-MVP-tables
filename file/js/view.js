class ViewTable {
  constructor() {
    this.container = document.getElementById("container");
  }
  
  drawTableHead(tr, text, attr) {
    const th = document.createElement("th");
    th.className = "table__header";
    th.setAttribute("data-name", attr);
    
    th.appendChild( document.createTextNode(text) );
    tr.appendChild( th );
  }
  
  drawTableRow(tr, elem) {
    let appendData = null;
    
    const td = document.createElement("td");
    td.className = "table__cell";
    
    if (Array.isArray(elem) && elem.length > 2) {
      const link = document.createElement("a");
      link.href = createLinkCharacters(elem);
      link.innerHTML = 'More info...';
      
      appendData = link;
    } else if (isDate(elem)) {
      const date = dateFormat(elem);
      appendData = document.createTextNode(date);
    } else {
      appendData = document.createTextNode(elem);
    }
    
    td.appendChild(appendData);
    tr.appendChild(td);
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
  
  removeAttributeSortOrder(domElement) {
    domElement.removeAttribute("data-order");
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
  
}