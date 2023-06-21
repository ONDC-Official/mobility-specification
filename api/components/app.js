const fs = require('fs');
const yaml = require('js-yaml');
const $RefParser = require('json-schema-ref-parser');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
// var example_set = args[0]
// var flow_set = args[1]
var base_yaml = "./beckn_yaml.yaml"//args[0]; 
var example_yaml = "./index.yaml"//args[1];
var outputPath = "../build/build.yaml"
var uiPath = "../../ui/build.js"

// const outputPath = `./build.yaml`;
// const unresolvedFilePath = `https://raw.githubusercontent.com/beckn/protocol-specifications/master/api/transaction/components/index.yaml`
const tempPath = `./temp.yaml`;

getSwaggerYaml("example_set", outputPath);

function getSwaggerYaml(example_set, outputPath){

  $RefParser.dereference(example_yaml)
    .then((schema) => {
      let examples = schema["examples"]
      examples = examples[example_set];
      buildSwagger(base_yaml, tempPath);
      var spec_file = fs.readFileSync(tempPath)
      var spec = yaml.load(spec_file)
      addEnumTag(spec, schema)

      GenerateYaml(spec, outputPath, uiPath);
      cleanup()
    })
    .catch((error) => {
      console.error('Error parsing schema:', error);
    });

}

function cleanup() {
  try {
    fs.unlinkSync(tempPath);
    console.log('Temporary file deleted');
  } catch (error) {
    console.error('Error deleting temporary file:', error);
  }
}

function buildSwagger(inPath, outPath) {
  try {
    const command = `swagger-cli bundle ${inPath} --outfile ${outPath} -t yaml`;
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('An error occurred while generating the Swagger bundle:', error);
    process.exit(1);
  }
}

function addEnumTag(base, layer) {
  base["x-enum"] = layer["enum"]
  base["x-tags"] = layer["tags"]
  base["x-flows"] = layer["flows"]
  base["x-examples"] = layer ["examples"]
}

function GenerateYaml(base, output_yaml, uiPath) {
  const output = yaml.dump(base);
  fs.writeFileSync(output_yaml, output, 'utf8');
  const jsonDump = "let build_spec = " + JSON.stringify(base);
  fs.writeFileSync(uiPath, jsonDump, 'utf8');
}
