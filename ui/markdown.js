
function renderDropdownMarkdown(branchname,filteredData){

  var setsDropDown = document.getElementById("feature-sets-dropdown");
    setsDropDown.innerHTML = "";
    filteredData?.forEach(function (item) {
      var option = document.createElement("option");
      const fileName = item?.split('.md')[0];
      option.text = fileName;
      setsDropDown.add(option);
    });
    renderMarkdown(branchname,filteredData[0]?.split('.md')[0]);
}
//
function renderMarkdown(branchName,file) {
  fetch(
    `https://raw.githubusercontent.com/ondc-official/mobility-specification/${branchName}/api/components/docs/${file}.md`
  )
    .then((response) => response.text())
    .then((text) => {
      const textWithBranchName = text.replace("branchName", branchName);
      const html = marked.parse(textWithBranchName);
      document.getElementById("markdown-container").innerHTML = html;
    });
}

function updateFeature() {
  var example_set = document.getElementById("feature-sets-dropdown");
  const selectedOption = document.getElementById("contract-dropdown")?.value;
  renderMarkdown(selectedOption,example_set.value);
}