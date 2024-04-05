const xlsx = require("node-xlsx").default;
const yaml = require("js-yaml");
const fs = require("fs");

async function buildErrorCodes() {
  const workSheetsFromBuffer = xlsx.parse(`../../Error-codes.xlsx`);
  const outputObject = workSheetsFromBuffer[0]?.data.filter((item,index)=>item.length>0 && index!==0).map(([Event,Description,From,code]) => ({
    Event,
    Description,
    From,
    code
  }))
  const yamlString = yaml.dump({ code: outputObject });
  fs.writeFileSync(`./error_codes/index.yaml`, yamlString);
}


module.exports = { buildErrorCodes }
