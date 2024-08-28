// function renderDropdownMarkdown(branchname,filteredData){

//   var setsDropDown = document.getElementById("feature-sets-dropdown");
//     setsDropDown.innerHTML = "";
//     filteredData?.forEach(function (item) {
//       var option = document.createElement("option");
//       const fileName = item?.split('.md')[0];
//       option.text = fileName;
//       setsDropDown.add(option);
//     });
//     renderMarkdown(branchname,filteredData[0]?.split('.md')[0]);
// }
// //
// function renderMarkdown(branchName,file) {
//   fetch(
//     `https://raw.githubusercontent.com/ondc-official/mobility-specification/${branchName}/api/components/docs/${file}.md`
//   )
//     .then((response) => response.text())
//     .then((text) => {
//       const textWithBranchName = text.replace("branchName", branchName);
//       const html = marked.parse(textWithBranchName);
//       document.getElementById("markdown-container").innerHTML = html;
//     });
// }

// function updateFeature() {
//   var example_set = document.getElementById("feature-sets-dropdown");
//   const selectedOption = document.getElementById("contract-dropdown")?.value;
//   renderMarkdown(selectedOption,example_set.value);
// }

function renderDropdownMarkdown(branchname, filteredData) {
  var setsDropDown = document.getElementById("feature-sets-dropdown");
  setsDropDown.innerHTML = "";

  const updatedFilteredData = [];
  filteredData?.forEach(function (item) {
    if (item === "log-verification.md") return;
    updatedFilteredData.push(item)
    var option = document.createElement("option");
    const fileName = item?.split(".md")[0];
    option.text = fileName;
    setsDropDown.add(option);
    
  });
  renderMarkdown(branchname, updatedFilteredData[0]?.split(".md")[0]);
}

function renderMarkdown(branchName, file) {
  console.log("file---", file);
  fetch(
    `https://raw.githubusercontent.com/ondc-official/mobility-specification/${branchName}/api/components/docs/${file}.md`
  )
    .then((response) => response.text())
    .then(async (text) => {
      const result = await extractTextBetweenBackticks(text);
      const textWithBranchName = text.replace(/branchName/g, branchName);
      let textData = marked.parse(textWithBranchName);

      if (result?.length) {
        for (const [index, item] of result.entries()) {
          const mermaidDiagram = await mermaid.render(
            `marimaid-summary-${index}`,
            item
          );
          const mermaidPattern = /<code class="language-mermaid">[\s\S]*?code>/;
          textData = textData.replace(
            mermaidPattern,
            mermaidDiagram?.svg.replace(/\"/g, '"')
          );
        }
      }

      document.getElementById("markdown-container").innerHTML = textData;
    });
}

function updateFeature() {
  var example_set = document.getElementById("feature-sets-dropdown");
  const selectedOption = document.getElementById("contract-dropdown")?.value;
  renderMarkdown(selectedOption, example_set.value);
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
