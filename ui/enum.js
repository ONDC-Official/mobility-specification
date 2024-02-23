
// enums.js

var parsedData

function loadDropdown1() {
  var dropdown1 = document.getElementById('dropdown1');
  dropdown1.innerHTML = '';

  // Populate dropdown1
  Object.keys(parsedData).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown1.add(option);
  });
}

function loadDropdown2() {
  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');
  dropdown2.innerHTML = '';

  // Get the selected value from dropdown1
  var selectedValue1 = dropdown1.value;

  // Populate dropdown2
  let data = flattenObject(parsedData[selectedValue1])
  Object.keys(data).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown2.add(option);
  });
}

function loadDropdown4() {
  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');
  var dropdown4 = document.getElementById('dropdown4');
  dropdown4.innerHTML = '';

  // Get the selected values from dropdown1 and dropdown2
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;

  // Populate dropdown4
  let data = getAttribute(parsedData[selectedValue1], selectedValue2.split("."))
  data.forEach(function (item) {
    var option = document.createElement('option');
    option.text = item["code"];
    dropdown4.add(option);
  });
  displayTable()
}

function getAttribute(data, keyArr) {
  let key = isNaN(keyArr[0]) ? keyArr[0] : parseInt(keyArr[0]);
  if (data[key] && data[key] != undefined) {
    if (keyArr.length == 1) {
      return data[key];
    }
    return this.getAttribute(data[key], keyArr.slice(1, keyArr.length));
  }
  return undefined;
}

function flattenObject(obj, prefix = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? prefix + '.' + key : key;

      if (Array.isArray(obj[key])) {
        result[newKey] = obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}

function displayTable() {
  var dropdown1 = document.getElementById('dropdown1');
  var dropdown2 = document.getElementById('dropdown2');
  var dropdown4 = document.getElementById('dropdown4');

  // Get the selected values from dropdown1, dropdown2, and dropdown4
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;
  var selectedValue3 = dropdown4.value;

  // Get the table data
  let data = getAttribute(parsedData[selectedValue1], selectedValue2.split("."))
  var tableData = data.find(obj => {
    if (obj["code"] == selectedValue3)
      return obj
  });

  // Get the table body element
  var tableBody = document.getElementById('result-table');
  if (tableBody && tableBody != {}) tableBody.innerHTML = '';
  insertRow(tableBody, "ENUM", tableData.code)
  insertRow(tableBody, "Description", tableData.description)
  // insertRow(tableBody, "Refrences", tableData.reference)
  // insertRow(tableBody, "APIs", tableData.api)

}

function insertRow(tableBody, key, value) {
  var row = tableBody.insertRow();
  var cell = row.insertCell();
  cell.innerHTML = key
  var cell = row.insertCell();
  cell.innerHTML = value;
}

function fetchData(url) {
  return fetch(url)
    .then(response => response.text())
    .then(yamlData => jsyaml.load(yamlData));
}

function populateEnums(url) {
  // Example usage: fetch YAML data from a URL
  fetchData(url).then(data => {
    initSchema(data["x-enum"])
    initTag(data["x-tags"])
  })
    .catch(error => {
      console.error('Error fetching or parsing YAML:', error);
    });
}

function initSchema(data) {
    parsedData = data
    loadDropdown1()
    loadDropdown2()
    loadDropdown4()
}

