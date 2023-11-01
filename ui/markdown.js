async function fetchMarkdown(branchName) {
  try {
    console.log('branchName', branchName)
    const container = document.getElementById("markdown-container").innerHTML;
    const response = await fetch(
      `https://api.github.com/repos/ondc-official/mobility-specification/contents/api/components/docs?ref=${branchName}`
    );
    const data = await response.json();
    if (data?.length == 0) container.innerHTML = "No files present";
    else {
      const filteredData = data?.filter((item) => item?.name.endsWith(".md"));
      if (filteredData.length == 0)
        container.innerHTML = "Markdown files not found";
      else {
    var setsDropDown = document.getElementById("feature-sets-dropdown");
        setsDropDown.innerHTML = "";
        filteredData?.forEach(function (item) {
          var option = document.createElement("option");
          const fileName = item?.name?.split('.md')[0];
          option.text = fileName;
          setsDropDown.add(option);
        });
        renderMarkdown(branchName,filteredData[0]?.name?.split('.md')[0]);
      }
    }
  } catch (error) {
    console.log("Error fetching contract", error?.message || error);
    document.getElementById("markdown-container").innerHTML = `Error while fetching files for branch ${branchName}`;
  }
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