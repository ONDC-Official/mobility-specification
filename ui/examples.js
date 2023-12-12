
// examples.js

var examples

function updateExample() {
    var example_set = document.getElementById('example-set');
    // Get the selected value from dropdown1
    var selectedValue = example_set.value;
    addExample(selectedValue)
}

function loadExample(data) {
    examples = data
    var exampleDropDown = document.getElementById('example-set');
    exampleDropDown.innerHTML = '';

    // Populate exampleDropDown
    Object.keys(examples).forEach(function (key) {
        var option = document.createElement('option');
        option.text = key;
        exampleDropDown.add(option);
    });
    
    addExample(Object.keys(examples)[0])
}
function addExample(example_set) {
    // let base = jsyaml.load(openApiYaml)
    const matchText = 'form/' 
    let base = build_spec;
    base["info"]["title"] = examples[example_set]["summary"]
    base["info"]["description"] = examples[example_set]["description"]
    let examplesList = examples[example_set]["example_set"]
    for (var key in examplesList) {
        //for forms
        if(key.match(matchText)) continue;
        var list = examplesList[key]["examples"];
        base["paths"]["/" + key]["post"]["requestBody"]["content"]["application/json"]["examples"] = {};
        for (var key2 in list) {
            base["paths"]["/" + key]["post"]["requestBody"]["content"]["application/json"]["examples"]["e" + key2] = list[key2];
        }
    }
    const output = jsyaml.dump(base);
    loadSwaggerUIFile(output)
}