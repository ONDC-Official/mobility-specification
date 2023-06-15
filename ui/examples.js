
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
    addExample("on-demand")
}
function addExample(example_set) {
    // let base = jsyaml.load(openApiYaml)
    let base = build_spec;
    for (var key in examples[example_set]) {
        var list = examples[example_set][key]["examples"];
        base["paths"]["/" + key]["post"]["requestBody"]["content"]["application/json"]["examples"] = {};
        for (var key2 in list) {
            base["paths"]["/" + key]["post"]["requestBody"]["content"]["application/json"]["examples"]["e" + key2] = list[key2];
        }
    }
    const output = jsyaml.dump(base);
    loadSwaggerUIFile(output)
}