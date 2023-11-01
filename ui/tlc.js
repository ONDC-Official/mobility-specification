var tlc;

function loadTlc(data) {
  var elements = document.getElementsByClassName("tlc-test");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  tlc = data;
  const indexKey = Object.keys(tlc);
  addTlcSets(indexKey[0]);
}

function addTlcSets(option) {

  const elements= document.getElementById("tlcset").querySelectorAll('.tlc-row')
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  const object = tlc[option];
  let previousValues = {};
  const keys = ['Term', 'Api', 'Attribute', 'Owner', 'Value', 'Description'];
  object.forEach(function (key) {
    var table = document.getElementById("tlcset");
    const newRow = document.createElement("tr");
    newRow.classList.add("tlc-row");

    for (let i = 0; i < 6; i++) {
      const cell = document.createElement("td");
      const value = key[keys[i]] !== undefined ? key[keys[i]] : previousValues[keys[i]];
      cell.textContent = value;

      // Added classes to "Attribute" and "Value" cells
      if (keys[i] === 'Attribute' || keys[i] === 'Value' || keys[i] === 'Description') {
        cell.classList.add(keys[i]);
      }

      newRow.appendChild(cell);
      if (key[keys[i]] !== undefined) {
        previousValues[keys[i]] = key[keys[i]];
      }
    }

    table.appendChild(newRow);
  });
}