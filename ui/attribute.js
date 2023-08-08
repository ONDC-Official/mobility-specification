var attributes;

function updateAttribute() {
  var example_set = document.getElementById("attribute-dropdown");
  var selectedValue = example_set.value;
  document.querySelectorAll(".test").forEach((div) => div.remove());
  addAttributeSets(selectedValue);
}

function updateSetsAttribute() {
  var attributesDropDown = document.getElementById("attribute-dropdown");
  var example_set = document.getElementById("attribute-sets-dropdown");
  document.querySelectorAll(".test").forEach((div) => div.remove());
  var selectedValue = example_set.value;
  updateSets(attributesDropDown.value, selectedValue);
}

function loadAttributes(data) {
  attributes = data;
  var attributesDropDown = document.getElementById("attribute-dropdown");
  attributesDropDown.innerHTML = "";

  Object.keys(attributes).forEach(function (key) {
    var option = document.createElement("option");
    option.text = key;
    attributesDropDown.add(option);
  });
  const indexKey = Object.keys(attributes);
  addAttributeSets(indexKey[0]);
}

function updateSets(value, option) {
  const object = attributes[value]?.attribute_set;
  console.log('object[option]',object[option]["required_attributes"]);
  flattenObject(object[option],null,null,object[option]?.required_attributes);
}

function addAttributeSets(option) {
  const object = attributes[option]?.attribute_set;
  var setsDropDown = document.getElementById("attribute-sets-dropdown");
  setsDropDown.innerHTML = "";

  Object.keys(object).forEach(function (key) {
    var option = document.createElement("option");
    option.text = key;
    setsDropDown.add(option);
  });

  const firstKey = Object.keys(object)[0];
  const keyDetail = object[firstKey];
  console.log('object',object,keyDetail,keyDetail?.required_attributes  );
  const requiredAttr = 'required_attributes' in keyDetail
  console.log('requiredAttr', requiredAttr)
  flattenObject(keyDetail,null,null,keyDetail?.required_attributes);
}

function flattenObject(obj, prefix = "", result = {},requiredAttr) {
  if ("required" in obj) {
    if(requiredAttr===undefined || requiredAttr.includes(prefix)){
    var table = document.getElementById("tableset");
    const newRow = document.createElement("tr");
    newRow.classList.add("test");
    newRow.style.wordBreak = "break-all";
    const cell1 = document.createElement("td");
    const cell2 = document.createElement("td");
    const cell3 = document.createElement("td");
    const cell4 = document.createElement("td");

    cell1.textContent = prefix;
    cell2.textContent = obj["required"];
    cell3.textContent = obj["usage"];
    cell4.textContent = obj["description"];

    newRow.appendChild(cell1);
    newRow.appendChild(cell2);
    newRow.appendChild(cell3);
    newRow.appendChild(cell4);

    table.appendChild(newRow);
    }
    return;
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key!=='required_attributes') {
      const newKey = prefix ? prefix + "." + key : key;
      if (Array.isArray(obj[key])) {
        result[newKey] = obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        flattenObject(obj[key], newKey, result,requiredAttr);
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
}