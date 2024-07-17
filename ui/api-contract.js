function getStringAfterEquals(inputString) {
  const index = inputString.indexOf("=");
  if (index !== -1) {
    return inputString.slice(index + 1).trim();
  } else {
    return "";
  }
}

async function readBuildFile(branchName) {
  if (!branchName) return;
  const url = `https://api.github.com/repos/ondc-official/mobility-specification/contents/ui/build.js?ref=${branchName}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "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",
      },
    });
    const formattedResponse = await response?.json();
    let splitedText = atob(formattedResponse?.content);
    build_spec = JSON.parse(getStringAfterEquals(splitedText));
    // onFirstLoad(build_spec);
  } catch (error) {
    console.log("Error fetching contract", error?.message || error);
    alert('Something went wrong, Please try again later')
  }
}

function upadteContract() {
  const selectedOption = document.getElementById("contract-dropdown")?.value;
  readBuildFile(selectedOption);
}

window.onload = function () {
  upadteContract();
};
