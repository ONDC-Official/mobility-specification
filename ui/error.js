var errors;

function loadErrors(data) {
  var elements = document.getElementsByClassName("error-wrapper");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  errors = data;
  const indexKey = Object.keys(errors);
  addErrorSets(indexKey[0]);
}

function addErrorSets(option) {
  var elements = document.getElementsByClassName("error-row");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  const object = errors[option]
  object.forEach(function (key) {
    var table = document.getElementById("errorset");
    const newRow = document.createElement("tr");
    newRow.classList.add("error-row");
    newRow.style.wordBreak = "break-all";
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");
    const cell4 = document.createElement("td");

    cell1.style.minWidth = "65px";
    cell1.textContent = key["code"];
    cell2.textContent = key["From"];
    cell3.textContent = key["Event"];
    cell4.textContent = key["Description"];

    newRow.appendChild(cell1);
    newRow.appendChild(cell2);
    newRow.appendChild(cell3);
    newRow.appendChild(cell4);
    table.appendChild(newRow);
  });
}
