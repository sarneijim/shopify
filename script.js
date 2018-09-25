var button = document.getElementById("search__button");
var input = document.getElementById("search__input");

button.onclick = function(){
  search();
};

// Ajax call
function search(){
  var xhrObject = new XMLHttpRequest();
  var owner = input.value;
  if(owner == ""){
    //Remove results table
    removeResultsTable();
  }else{
    url = "https://api.github.com/search/repositories?q=user:" + owner + "&access_token=" + TOKEN;
    xhrObject.onreadystatechange = function() {
      if (xhrObject.readyState === 4) {
        if (xhrObject.status === 200 || xhrObject.status === 304) {
          //Remove results table
          removeResultsTable();

          response = JSON.parse(xhrObject.responseText);
          console.log(response);
          itemList = [];
          for (i = 0; i < 10; i++) {
            item = [response.items[i].id, response.items[i].full_name, response.items[i].language,'v1.0.0', ''];
            itemList.push(item);
          }
          showResults(itemList);
        }
      }
    };
    xhrObject.open(
      "GET",
      url,
      true
    );
    xhrObject.send();
  }
};

// Add element to the table
function showResults(items){
  var resultsBody = document.querySelector('#results tbody');
  //TABLE ROWS
  for (i = 0; i < items.length; i++) {
    var tr = document.createElement('TR');
    for (j = 0; j < items[i].length; j++) {
      var td = document.createElement('TD')
      td.appendChild(document.createTextNode(items[i][j]));
      tr.appendChild(td)
    }
    resultsBody.appendChild(tr);
    document.querySelectorAll("#favourites tbody tr").forEach(function(elem) {
      if(elem.firstChild.innerHTML == tr.firstChild.innerHTML){
        tr.lastChild.style.display = "none";
      }
    });
    var mytable = document.getElementById('results');
    addRow(mytable, 'Add', 'add');
  }
  var link = document.querySelectorAll(".add");
  link.forEach(function(elem) {
    elem.onclick = function(){
      addFavourite(this);
    }
  })
};

function addFavourite(elem){
  //Clone row
  var row = elem.closest("tr");
  var clone = row.cloneNode(true);
  //Add to favourite
  var favouriteBody = document.querySelector("#favourites tbody");
  favouriteBody.appendChild(clone);
  row.lastChild.style.display = "none";
  var mytable = document.getElementById('favourites');
  addRow(mytable, 'Remove', 'remove');
  // Provide event click to remove
  var link = document.querySelectorAll(".remove");
  link.forEach(function(elem) {
    elem.onclick = function(){
      removeFavourite(this);
    }
  })
};

//Add new row to the table
function addRow(table, text, className){
  //Generate link (add - remove)
  var a = document.createElement('a');
  a.setAttribute('class', className);
  a.setAttribute('href', '#');
  a.innerHTML = text;
  // Add to the table
  var rows = table.getElementsByTagName("tr");
  var lastrow = rows[rows.length -1];
  var cells = lastrow.getElementsByTagName("td");
  var lastcell = cells[cells.length -1];
  lastcell.innerHTML = '';
  lastcell.appendChild(a);
};

// Function delete all the element in the result table
function removeResultsTable(){
  var resultRows = document.querySelectorAll("#results tbody tr");
  resultRows.forEach(function(elem) {
    elem.remove()
  })
};

// Function favourite delete, delete a row in a favourite table
function removeFavourite(){
  var resultRows = document.querySelectorAll("#results tbody tr");
  var rowSelected = event.target.closest("tr");
  rowSelected.remove();
  resultRows.forEach(function(elem) {
    // If delete element is in the results table, show "Add"
    if(elem.firstChild.innerHTML == rowSelected.firstChild.innerHTML){
      elem.lastChild.style.display = "table-cell";
    }
  })
}
