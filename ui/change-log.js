function renderChangeLogDropDown(branchname, filteredData) {
  var setsDropDown = document.getElementById("change-log-dropdown");
  setsDropDown.innerHTML = "";
  filteredData?.forEach(function (item) {
    var option = document.createElement("option");
    const fileName = item?.split(".md")[0];
    option.text = fileName;
    setsDropDown.add(option);
  });
  renderMDFile(branchname, filteredData[0]?.split(".md")[0]);
}

function updateChangeLog() {
  var example_set = document.getElementById("change-log-dropdown");
  const selectedOption = document.getElementById("contract-dropdown")?.value;
  renderMDFile(selectedOption, example_set.value);
}

function extractTextBetweenBackticks(inputString) {
  const mermaidRegex = /```mermaid([\s\S]*?)```/g;
  let matches;
  const diagrams = [];

  while ((matches = mermaidRegex.exec(inputString)) !== null) {
    diagrams.push(matches[1].trim());
  }

  return diagrams;
}

function renderMDFile(branchName, file) {
  console.log('branchName', branchName)
  fetch(
    `https://raw.githubusercontent.com/ONDC-Official/mobility-specification/${branchName}/api/components/docs/changeLog/${file}.md`
  )
    .then((response) => response.text())
    .then(async (text) => {
      const result = await extractTextBetweenBackticks(text);
      //if mermaid diagram exist
      let createMermaid;
      if (result?.length) {
        //const modifiedText = result[0].replace(/mermaid/g, '');
        createMermaid = await mermaid.render(`main-summary1`, result[1]);
      }
      const removedMermaidData = text.replace(/```mermaid[\s\S]+?```/g, "");
      const textWithBranchName = removedMermaidData.replace(
        /branchName/g,
        branchName
      );
      const textData = marked.parse(textWithBranchName);

      document.getElementById("change-log-container").innerHTML =
        textData + (createMermaid?.svg ? createMermaid?.svg : "");
    });
}
