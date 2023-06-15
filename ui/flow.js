// flow.js

function loadSteps(steps) {
    const stepsList = document.getElementById('steps-list');
    const stepSummary = document.getElementById('step-summary');
    const stepDescription = document.getElementById('step-description');
    const yamlContent = document.getElementById('yaml-content');
    stepsList.innerHTML = '';
    stepSummary.innerHTML = '';
    stepDescription.innerHTML = '';
    yamlContent.innerHTML = '';
    // Render the steps list
    steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.textContent = step["summary"]+" API:"+step["api"];
        li.classList.add('step');
        li.dataset.index = index;
        stepsList.appendChild(li);
    });

    // Add click event listener to each step
    const flowElements = document.getElementsByClassName('step');
    Array.from(flowElements).forEach(step => {
        step.addEventListener('click', handleFlowClick);
    });

    // Handle step click event
    function handleFlowClick(event) {
        const clickedStep = event.target;
        const stepIndex = clickedStep.dataset.index;

        // Remove 'active' class from all steps
        Array.from(flowElements).forEach(flow => {
            flow.classList.remove('active');
        });

        // Add 'active' class to clicked step
        clickedStep.classList.add('active');

        // Get YAML content for the selected step index
        const selectedStep = steps[stepIndex];
        stepSummary.textContent = selectedStep["summary"]
        stepDescription.textContent = selectedStep["description"]
        yamlContent.textContent = JSON.stringify(selectedStep["example"]["value"], null, 2);
    }

};


function loadFlow(flows) {
    const flowsList = document.getElementById('flows-list');
    const flowSummary = document.getElementById('flow-summary');
    const flowDescription = document.getElementById('flow-description');
    flowsList.innerHTML = '';
    flowSummary.innerHTML = '';
    flowDescription.innerHTML = '';
    // Render the steps list
    flows.forEach((flow, index) => {
        const li = document.createElement('li');
        li.textContent = flow["summary"];
        li.classList.add('flow');
        li.dataset.index = index;
        flowsList.appendChild(li);
    });

    // Add click event listener to each step
    const flowElements = document.getElementsByClassName('flow');
    Array.from(flowElements).forEach(step => {
        step.addEventListener('click', handleFlowClick);
    });

    // Handle step click event
    function handleFlowClick(event) {
        const clickedStep = event.target;
        const flowIndex = clickedStep.dataset.index;

        // Remove 'active' class from all steps
        Array.from(flowElements).forEach(flow => {
            flow.classList.remove('active');
        });

        // Add 'active' class to clicked step
        clickedStep.classList.add('active');

        // Get YAML content for the selected step index
        const selectedFlow = flows[flowIndex];
        flowSummary.textContent = selectedFlow["summary"]
        flowDescription.textContent = selectedFlow["description"]
        loadSteps(selectedFlow["steps"])
    }

};