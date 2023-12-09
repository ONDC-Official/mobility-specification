const xlsx = require("node-xlsx").default;
const yaml = require("js-yaml");
const fs = require("fs");

async function buildAttribiutes() {
  let attributes = {};
  const workSheetsFromBuffer = xlsx.parse(`../../metro_attributes.xlsx`);
  for (let i = 0; i < workSheetsFromBuffer.length; i++) {
    const array = workSheetsFromBuffer[i];
    const filterArray = array.data.filter((subArr) => subArr.length > 0);
    const response = formObject(filterArray);
    const addArrtibuteName = {
      [array?.name]: response,
    };
    attributes = { ...attributes, ...addArrtibuteName };
  }
  if (Object.keys(attributes)?.length) {
    const attributesYaml = yaml.dump(attributes);
    fs.writeFileSync(`./attributes/metro/index.yaml`, attributesYaml);
  }
}
function formObject(attributes) {
  const result = {};
  let dataValue = {};
  attributes.slice(1).forEach((item) => {
    const keys = item[0].split(".");
    let temp = result;
    const tempAtt = attributes[0].slice(1);
    const tempItem = item?.slice(1);
    keys.forEach((key, index) => {
      if (!temp[key]) {
        if (index === keys.length - 1) {
          for (const [i, step] of tempAtt?.entries()) {
            dataValue[tempAtt[i]?.toLowerCase()] = tempItem[i] || false;
          }
          temp[key] = dataValue;
        } else {
          temp[key] = {};
        }
        dataValue = {};
      }
      temp = temp[key];
    });
  });
  return result;
}


module.exports = { buildAttribiutes }
