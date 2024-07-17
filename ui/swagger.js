// swagger.js


function loadSwaggerUIFile(yamlFile) {
  const ui = SwaggerUIBundle({
    spec: jsyaml.load(yamlFile),
    dom_id: '#swagger-ui',
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    layout: "BaseLayout",
    deepLinking: true
  });
  window.ui = ui;
};

function loadSwaggerYaml() {
  var inputText = document.getElementById('swagger_url').value;
  var result = inputText.toLowerCase();
  loadSwaggerUI(result)
}

function display(result) {
  document.getElementById('output').innerText = result;
}

function loadSwaggerUI(url) {
  const ui = SwaggerUIBundle({
    url: url,
    dom_id: '#swagger-ui',
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    layout: "BaseLayout",
    deepLinking: true
  });
  window.ui = ui
};

