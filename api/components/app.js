const fs = require("fs");
const yaml = require("js-yaml");
const $RefParser = require("json-schema-ref-parser");
const { execSync } = require("child_process");
const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  strict: "log",
});
const addFormats = require("ajv-formats");
addFormats(ajv);
require("ajv-errors")(ajv);
const process = require("process");

const args = process.argv.slice(2);
// var example_set = args[0]
// var flow_set = args[1]
var base_yaml = "./beckn_yaml.yaml"; //args[0];
var example_yaml = "./index.yaml"; //args[1];
var outputPath = "../build/build.yaml";
var uiPath = "../../ui/build.js";
const flowsPath = "./flow/index.yaml";
// const outputPath = `./build.yaml`;
// const unresolvedFilePath = `https://raw.githubusercontent.com/beckn/protocol-specifications/master/api/transaction/components/index.yaml`
const tempPath = `./temp.yaml`;

getSwaggerYaml("example_set", outputPath);

async function baseYMLFile(file) {
  try {
    const schema = await $RefParser.dereference(file);
    return schema;
  } catch (error) {
    console.error("Error parsing schema:", error);
  }
}

async function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data?.value);
  if (!valid) {
    console.log(validate.errors);
    return true;
  }
  return false;
}

async function validateFlows(flows, schemaMap) {
  for (const flowItem of flows) {
    const { steps } = flowItem;
    if (steps && steps?.length) {
      for (const step of steps) {
        for (const api of Object.keys(schemaMap)) {
          if (step.api === api) {
            const result = await validateSchema(schemaMap[api], step.example);
            if (result) return (hasTrueResult = true);
          }
        }
      }
    }
  }

  //console.log("schemaMap", schemaMap)
  // for (const flowItem of flows) {
  //   const { steps } = flowItem;
  //   if (steps && steps?.length) {
  //     for (const step of steps) {
  //       if (step.api === path.substring(1)) {
  //         const result = await validateSchema(pathSchema, step.example);
  //         if (result) return hasTrueResult = true;
  //       }
  //     }
  //   }
  // }
}

async function validateExamples(exampleSets, schemaMap) {
  for (const example of Object.keys(exampleSets)) {
    for (const api of Object.keys(schemaMap)) {
      const exampleList = exampleSets[example].example_set[api]?.examples;
      if (exampleList !== undefined)
        for (const payload of Object.keys(exampleList)) {
          const result = await validateSchema(
            schemaMap[api],
            exampleList[payload]
          );
          if (result) return (hasTrueResult = true);
        }
    }
  }
}

async function getSwaggerYaml(example_set, outputPath) {
  const schema = await baseYMLFile(example_yaml);
  const baseYAML = await baseYMLFile(base_yaml);
  const { flows, examples:exampleSets } = schema;
  const { paths } = baseYAML;
  let hasTrueResult = false; // Flag variable
  let schemaMap = {};

  for (const path in paths) {
    const pathSchema =
      paths[path]?.post?.requestBody?.content?.["application/json"]?.schema;
    schemaMap[path.substring(1)] = pathSchema;
  }

  if (!process.argv.includes("skip1")) {
    hasTrueResult = await validateFlows(flows, schemaMap);
  }
  if (!process.argv.includes("skip2")) {
    hasTrueResult = await validateExamples(exampleSets, schemaMap);
  }
  if (hasTrueResult) return;

  if (!hasTrueResult) {
    //remove these
    let examples = schema["examples"];
    examples = examples[example_set];
    buildSwagger(base_yaml, tempPath);
    const spec_file = fs.readFileSync(tempPath);
    const spec = yaml.load(spec_file);
    addEnumTag(spec, schema);
    GenerateYaml(spec, examples, outputPath);
    cleanup();
  }
}

function cleanup() {
  try {
    fs.unlinkSync(tempPath);
    console.log("Temporary file deleted");
  } catch (error) {
    console.error("Error deleting temporary file:", error);
  }
}

function buildSwagger(inPath, outPath) {
  try {
    const command = `swagger-cli bundle ${inPath} --outfile ${outPath} -t yaml`;
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(
      "An error occurred while generating the Swagger bundle:",
      error
    );
    process.exit(1);
  }
}

function addEnumTag(base, layer) {
  base["x-enum"] = layer["enum"];
  base["x-tags"] = layer["tags"];
  base["x-flows"] = layer["flows"];
  base["x-examples"] = layer["examples"];
}

function GenerateYaml(base, layer, output_yaml) {
  const output = yaml.dump(base);
  fs.writeFileSync(output_yaml, output, "utf8");
  const jsonDump = "let build_spec = " + JSON.stringify(base);
  fs.writeFileSync(uiPath, jsonDump, "utf8");
}
