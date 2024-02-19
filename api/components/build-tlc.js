const xlsx = require("node-xlsx").default;
const yaml = require("js-yaml");
const fs = require("fs");

async function buildTlc() {
  const workSheetsFromBuffer = xlsx.parse(`../../tlc.xlsx`);
  const outputObject = workSheetsFromBuffer[0]?.data.filter((item,index)=>item.length>0 && index!==0).map((item) => {
    return {'Term':item[0],
    'Api':item[1],
    'Attribute':item[2],
    'Owner':item[3],
    'Value':item[4],
    'Description':item[5]}})
  const yamlString = yaml.dump({ code: outputObject }, { encoding: 'utf8' });
  fs.writeFileSync(`./tlc/index.yaml`, yamlString);
}


module.exports = { buildTlc }
