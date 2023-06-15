

// tag.js

var TagData

function fetchData(url) {
  return fetch(url)
    .then(response => response.text())
    .then(yamlData => jsyaml.load(yamlData));
}

function loadTagSchema() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  dropdown1.innerHTML = '';

  // Populate dropdown1
  Object.keys(TagData).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown1.add(option);
  });
  loadTagPath()
}

function loadTagPath() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-path-dropdown');
  dropdown2.innerHTML = '';

  // Get the selected value from dropdown1
  var selectedValue1 = dropdown1.value;

  // Populate dropdown2
  let data = flattenObject(TagData[selectedValue1])
  Object.keys(data).forEach(function (key) {
    var option = document.createElement('option');
    option.text = key;
    dropdown2.add(option);
  });
  loadTagGroup()
}

function loadTagGroup() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-path-dropdown');
  var dropdown3 = document.getElementById('tag-group-dropdown');
  dropdown3.innerHTML = '';

  // Get the selected value from dropdown1
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;

  // Populate dropdown2
  let data = getAttribute(TagData[selectedValue1], selectedValue2.split("."))
  Object.keys(data).forEach(function (key) {
    var option = document.createElement('option');
    option.text = data[key]["code"];
    dropdown3.add(option);
  });
  loadTag()
}

function loadTag() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-path-dropdown');
  var dropdown3 = document.getElementById('tag-group-dropdown');
  var dropdown4 = document.getElementById('tag-dropdown');
  dropdown4.innerHTML = '';

  // Get the selected values from dropdown1 and dropdown2
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;
  var selectedValue3 = dropdown3.value;

  // Populate dropdown4
  let data = getAttribute(TagData[selectedValue1], selectedValue2.split("."))
  let selectedObject3 = data.find(obj => {
    if (obj["code"] === selectedValue3)
      return obj
  });
  let list = selectedObject3.list
  list.forEach(function (obj) {
    var option = document.createElement('option');
    option.text = obj["code"];
    dropdown4.add(option);
  })
  displayTagGroup()
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

function displayTagGroup() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-path-dropdown');
  var dropdown3 = document.getElementById('tag-group-dropdown');

  // Get the selected values from dropdown1, dropdown2
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;
  var selectedValue3 = dropdown3.value;
  // Get the table data
  let data = flattenObject(TagData[selectedValue1])
  let selectedObject2 = data[selectedValue2]
  let selectedObject3 = selectedObject2.find(obj => {
    if (obj["code"] === selectedValue3)
      return obj
  });
  var tableBody = document.getElementById('tag-group-table');
  if (tableBody && tableBody != {}) tableBody.innerHTML = '';
  insertRow(tableBody, "Code", selectedObject3.code)
  insertRow(tableBody, "Description", selectedObject3.description)
  // insertRow(tableBody, "Refrences", selectedObject3.reference)
  displayTag()
}

function displayTag() {
  var dropdown1 = document.getElementById('tag-schema-dropdown');
  var dropdown2 = document.getElementById('tag-path-dropdown');
  var dropdown3 = document.getElementById('tag-group-dropdown');
  var dropdown4 = document.getElementById('tag-dropdown');

  // Get the selected values from dropdown1, dropdown2, and dropdown4
  var selectedValue1 = dropdown1.value;
  var selectedValue2 = dropdown2.value;
  var selectedValue3 = dropdown3.value;
  var selectedValue4 = dropdown4.value;
  // Get the table data
  let data = flattenObject(TagData[selectedValue1])
  let selectedObject2 = data[selectedValue2]
  let selectedObject3 = selectedObject2.find(obj => {
    if (obj["code"] === selectedValue3)
      return obj
  });
  let list = selectedObject3["list"]

  var tableData = list.find(obj => {
    if (obj["code"] == selectedValue4)
      return obj
  });
  // Get the table body element
  var tableBody = document.getElementById('tag-table');
  if (tableBody && tableBody != {}) tableBody.innerHTML = '';
  insertRow(tableBody, "Code", tableData.code)
  insertRow(tableBody, "Description", tableData.description)
  // insertRow(tableBody, "Refrences", tableData.reference)

}

function insertRow(tableBody, key, value) {
  var row = tableBody.insertRow();
  var cell = row.insertCell();
  cell.innerHTML = key
  var cell = row.insertCell();
  cell.innerHTML = value;
}

function fetchTag() {
  var inputText = document.getElementById('tag_url').value;
  var result = inputText.toLowerCase();
  populateTags(result);
}

function populateTags(url) {
  // Example usage: fetch YAML data from a URL
  fetchData(url).then(data => {
    console.log(data)
    initTag(data)
  })
    .catch(error => {
      console.error('Error fetching or parsing YAML:', error);
    });
}

function initTag(data) {
  TagData = data
  loadTagSchema()
}


