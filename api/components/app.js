const fs = require("fs");
const yaml = require("js-yaml");
const path = require('path');

const $RefParser = require("json-schema-ref-parser");
const { execSync } = require("child_process");
const Ajv = require("ajv");
const ajv = new Ajv({
  allErrors: true,
  strict: "log",
});
const addFormats = require("ajv-formats");
ajv.addFormat("phone", "")
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
// const outputPath = `./build.yaml`;
// const unresolvedFilePath = `https://raw.githubusercontent.com/beckn/protocol-specifications/master/api/transaction/components/index.yaml`
const tempPath = `./temp.yaml`;
// add featureui docs
const markdownFiles = checkMDFiles();
writeFilenamesToYaml(markdownFiles);
compareFiles();
getSwaggerYaml("example_set", outputPath);
const { buildAttribiutes } = require('./build-attributes.js')
const { buildErrorCodes } = require('./build-error-code.js')
const { buildTlc } = require('./build-tlc.js')

const SKIP_VALIDATION = {
  flows: "skip1",
  examples: "skip2",
  enums: "skip3",
  tags: "skip4",
};

const BUILD = {
  attributes: "attributes",
  error: "errorCode",
  tlc: "tlc"
};

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
          // Not validating the flows for forms.
          if (step.api === api && step.api !== "form") {
            const result = await validateSchema(schemaMap[api], step.example);
            if (result) {
              console.log("Error[flows]:", `${flowItem?.summary + "/" + api}`);
              return (hasTrueResult = true);
            }
          }
        }
      }
    }
  }
}

async function validateExamples(exampleSets, schemaMap) {

  for (const example of Object.keys(exampleSets)) {
    for (const api of Object.keys(schemaMap)) {
      const exampleList = exampleSets[example].example_set[api]?.examples;
      if (exampleSets[example].example_set[api] && !exampleList) {
        throw Error(`Example not found for ${api}`);
      }

      if (exampleList !== undefined)
        for (const payload of Object.keys(exampleList)) {
          const result = await validateSchema(
            schemaMap[api],
            exampleList[payload]
          );
          if (result) {
            console.log("error[Example] :", `${example + "/" + api}`);
            return (hasTrueResult = true);
          }
        }
    }
  }
}

async function matchKeyType(
  currentAttrib,
  currentExamplePos,
  currentSchemaPos,
  logObject
) {
  const exampleArray = currentExamplePos[currentAttrib];
  const schemaType = currentSchemaPos[currentAttrib]?.type;
  const allOfType = currentSchemaPos[currentAttrib]?.allOf?.[0]?.type;
  const itemType = currentSchemaPos[currentAttrib]?.items?.allOf?.[0]?.type;

  for (let i = 0; i < exampleArray?.length; i++) {
    const checkEnum = exampleArray[i];
    //works for string
    let type = schemaType;
    //if type is array
    if (schemaType === "array") {
      type = itemType;
    } else if (currentSchemaPos[currentAttrib]?.allOf) {
      type = allOfType;
    }
    if (typeof checkEnum?.code != type) {
      throw Error(`Enum type not matched: ${currentAttrib} in ${logObject}`);
    }
  }
}

async function checkObjectKeys(currentExamplePos, currentSchemaPos, logObject) {
  for (const currentAttrib of Object.keys(currentExamplePos)) {
    const currentExample = currentExamplePos[currentAttrib];
    const currentSchema = currentSchemaPos[currentAttrib];
    if (currentSchema) {
      if (Array.isArray(currentExample)) {
        await matchKeyType(
          currentAttrib,
          currentExamplePos,
          currentSchemaPos,
          logObject
        );
      } else {
        let schema;
        if (currentSchema.type === "object") {
          schema = currentSchema.properties;
        } else if (currentSchema.type === "array") {
          schema =
            currentSchema.items?.properties || currentSchema.items?.allOf;
        } else {
          schema = currentSchema.allOf;
        }
        await checkObjectKeys(currentExample, schema, logObject);
      }
    } else {
      if (Array.isArray(currentSchemaPos)) {
        await checkObjectKeys(
          currentExamplePos,
          currentSchemaPos[0]?.properties || currentSchemaPos[0],
          logObject
        );
      } else {
        throw new Error(`Key not found: ${currentAttrib} in ${logObject}`);
      }
    }
  }
}

async function validateEnumsTags(exampleEnums, schemaMap) {
  for (const example of Object.keys(exampleEnums)) {
    const currentExample = exampleEnums[example];
    const currentSchema = schemaMap[example];

    //context & message loop
    for (const currentExamples of Object.keys(currentExample)) {
      const currentSchemaPos =
        currentSchema?.properties[currentExamples]?.properties ||
        currentSchema?.properties[currentExamples]?.allOf;
      const currentExamplePos = currentExample[currentExamples];
      const logObject = `${example}/${currentExamples}`;
      await checkObjectKeys(currentExamplePos, currentSchemaPos, logObject);
    }
  }
}

async function traverseTags(currentTagValue, schemaForTraversal, logObject) {
  for (const currentTagKey of Object.keys(currentTagValue)) {
    const currentTag = currentTagValue[currentTagKey];
    const schemaType = schemaForTraversal[currentTagKey];
    if (schemaType) {
      if (Array.isArray(currentTag)) {
        //write logic for matching tag values
      } else {
        //read from items if type is array.
        const schema =
          schemaType.type === "object"
            ? schemaType?.properties
            : schemaType.items?.properties ||
              schemaType.items?.allOf[0]?.properties ||
              schemaType.allOf[0]?.properties;
        await traverseTags(currentTag, schema, logObject);
      }
    } else {
      throw Error(`[Tags], Key not found: ${currentTagKey} in ${logObject}`);
    }
  }
}

async function validateTags(tags, schema,isAttribute) {
  for (const tag of Object.keys(tags)) {
    const currentTag = tags[tag];
    const currentSchema = schema[tag]?.properties;

    //context & message
    for (const tagItem of Object.keys(currentTag)) {
      const currentTagValue = currentTag[tagItem];
      let schemaForTraversal;
            if (currentSchema[tagItem]?.type === "object") {
        schemaForTraversal = currentSchema[tagItem]?.properties;
      }//for validating attribute contexts
      else if(currentSchema[tagItem]?.allOf[0] && isAttribute){
        schemaForTraversal = currentSchema[tagItem]?.allOf[0]?.properties;
      }
      const logObject = `${isAttribute}/${tag}/${tagItem}/`;
      if(isAttribute) await traverseAttributes(currentTagValue, schemaForTraversal, logObject);
      else await traverseTags(currentTagValue, schemaForTraversal, logObject);
    }
  }
}

async function traverseAttributes(currentAttributeValue, schemaForTraversal, logObject) {
  for (const currentAttributeKey of Object.keys(currentAttributeValue)) {
    const currentAttr = currentAttributeValue[currentAttributeKey];
    const schemaType = schemaForTraversal[currentAttributeKey];

        //&& 'type' in currentAttr && 'owner' in currentAttr && 'usage' in currentAttr && 'description' in currentAttr
    if ('required' in currentAttr ) {
      continue ;
    }
    if (schemaType) {
      if (Array.isArray(currentAttr)) {
        //write logic for matching attribute values
      } else {
        //read from items if type is array.
        const schema =
          schemaType.type === "object"
            ? schemaType?.properties
            : schemaType.items?.properties ||
              schemaType.items?.allOf[0]?.properties ||
              schemaType.allOf[0]?.properties;
        await traverseAttributes(currentAttr, schema, logObject);
      }
    } else {
      throw Error(`[Attribute], Key not found: ${currentAttributeKey} in ${logObject}`);
    }
  }
}

async function validateAttributes(attribute, schemaMap) {
  for (const example of Object.keys(attribute)) {
      validateTags(attribute[example].attribute_set,schemaMap,example);
  }
  }
async function getSwaggerYaml(example_set, outputPath) {
  try {
    const schema = await baseYMLFile(example_yaml);
    const baseYAML = await baseYMLFile(base_yaml);
    const { flows, examples: exampleSets, enum: enums, tags,attributes } = schema || [];
    const { paths } = baseYAML;
    let hasTrueResult = false; // Flag variable
    let schemaMap = {};
    
    if (process.argv.includes(BUILD.attributes)) {
      await buildAttribiutes()
    }

    if (process.argv.includes(BUILD.error)) {
      await buildErrorCodes()
    }

    if (process.argv.includes(BUILD.tlc)) {
      await buildTlc()
    }

    for (const path in paths) {
      const pathSchema =
        paths[path]?.post?.requestBody?.content?.["application/json"]?.schema;
      schemaMap[path.substring(1)] = pathSchema;
    }
    
    if (!process.argv.includes(SKIP_VALIDATION.flows)) {
      hasTrueResult = await validateFlows(flows, schemaMap);
    }
    if (!process.argv.includes(SKIP_VALIDATION.examples) && !hasTrueResult) {
      hasTrueResult = await validateExamples(exampleSets, schemaMap);
    }

    //move to separate files
    if (!process.argv.includes(SKIP_VALIDATION.enums) && !hasTrueResult) {
      hasTrueResult = await validateEnumsTags(enums, schemaMap);
    }
    if (!process.argv.includes(SKIP_VALIDATION.tags) && !hasTrueResult) {
      hasTrueResult = await validateTags(tags, schemaMap);
    }

    if (!process.argv.includes(SKIP_VALIDATION.attributes) && !hasTrueResult) {
      hasTrueResult = await validateAttributes(attributes, schemaMap);
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
  } catch (error) {
    console.log("Error generating build file", error);
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

function writeSchemaMap(folder, schemaMap) {
  for (const api of Object.keys(schemaMap)) {
    var schema_yaml = folder + "/" + api + ".yaml";
    var schmea = yaml.dump(schemaMap[api]);
    fs.writeFileSync(schema_yaml, schmea, "utf8");
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
  base["x-attributes"] = layer["attributes"];
  base["x-errorcodes"] = layer["error_codes"];
  base["x-tlc"] = layer["tlc"];
  base["x-featureui"] = layer["feature-ui"]
  base["x-sandboxui"] = layer["sandbox-ui"]

}

function GenerateYaml(base, layer, output_yaml) {
  const output = yaml.dump(base);
  fs.writeFileSync(output_yaml, output, "utf8");
  const baseData = base['x-examples'];
  for (const examplesKey of Object.keys(baseData)) {
    let {example_set:exampleSet} = baseData[examplesKey] || {}
    delete exampleSet.form;
  }
  const jsonDump = "let build_spec = " + JSON.stringify(base);
  fs.writeFileSync(uiPath, jsonDump, "utf8");
}

function checkMDFiles(){
  const filePath = './docs';
if(!fs.existsSync(path.join(filePath)))fs.mkdirSync(filePath) //create docs folder if not exists
  const files = fs.readdirSync(filePath);
  const markdownFiles=files.filter((file)=>file.endsWith(".md"))
 return markdownFiles
}

function readfileWithYaml(){
    const yamlFilePath = path.join('./docs/', '', 'index.yaml');
    const yamlData = yaml.load(fs.readFileSync(yamlFilePath, 'utf8'));
    return yamlData.filenames;
}


function compareFiles () {
    const mdFiles = checkMDFiles();
    const yamlFiles = readfileWithYaml();
  
    // Check if the arrays are equal
    const isEqual = JSON.stringify(mdFiles) === JSON.stringify(yamlFiles);
  
    if (isEqual) {
    } else {
      throw new Error(`Files at docs/index.yaml doesn't exist`);
    }
  };

  function writeFilenamesToYaml (filenames) {
    // Create an array of YAML links
    const yamlLinks = filenames.map(filename => `${filename}`);
    const yamlData = { filenames: yamlLinks };
    const yamlFilePath = path.join('./docs/', 'index.yaml');
    // Convert the data to YAML format and write it to the file
    const yamlString = yaml.dump(yamlData);
    fs.writeFileSync(yamlFilePath, yamlString, 'utf8');
  };
    
