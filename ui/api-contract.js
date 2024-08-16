
var tokens = {
  first: "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",
  second: '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'
}
var token_flag = true 
function getStringAfterEquals(inputString) {
  const index = inputString.indexOf("=");
  if (index !== -1) {
    return inputString.slice(index + 1).trim();
  } else {
    return "";
  }
}

async function readBuildFile(branchName, isError) {
  if (!branchName) return;
  const url = `https://api.github.com/repos/ondc-official/mobility-specification/contents/ui/build.js?ref=${branchName}`;

  try {
    const {first, second} = tokens;  
    const response = await fetch(url, {
      headers: {
        Authorization: isError ? second: first,
      },
    });
    const formattedResponse = await response?.json();
    // reading data using github raw apis.
    if(formattedResponse?.download_url){
      setTimeout(async ()=>{
        const rawResponse = await fetch(formattedResponse.download_url, {
          // headers: {
          //   Authorization: "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",
          // },
        });
        const formattedrawResponse = await rawResponse?.text();
        build_spec = JSON.parse(getStringAfterEquals(formattedrawResponse));
        onFirstLoad(build_spec);
      },1200)
    }

    // let splitedText = atob(formattedResponse?.content);
    // build_spec = JSON.parse(getStringAfterEquals(splitedText));
    // onFirstLoad(build_spec);
    
  } catch (error) {
    //add logic to check correct error code for rate limiting
    if(token_flag){
      readBuildFile(branchName, true)
      token_flag = false;
    }
    
    console.log("Error fetching contract", error?.message || error);
    //alert('Something went wrong, Please try again later')
  }
}

async function fetchRequest(url){
  try{
    const response = await fetch(url, {
      headers: {
        Authorization: "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",
      },
    });
    return await response?.json();
  }catch{
    console.log("Error fetching contract", error?.message || error);
  }
}

async function loadContracts() {
  //fetch branches & tags from repo
  const BRANCHES_URL= "https://api.github.com/repos/ondc-official/mobility-specification/branches";
  const TAGS_URL= "https://api.github.com/repos/ondc-official/mobility-specification/tags";
                  
  let response1, response2;
  response1 = await fetchRequest(BRANCHES_URL)
  response2 = await fetchRequest(TAGS_URL)
  const response = [...response1,...response2]
  const selectedOption = document.getElementById("contract-dropdown");
  selectedOption.innerHTML = "";
  response.forEach((flow) => {
    var option = document.createElement("option");
    option.text = flow.name;
    selectedOption.add(option);
  });
  readBuildFile(response[0]?.name);
}

function upadteContract() {
  const selectedOption = document.getElementById("contract-dropdown")?.value;
  readBuildFile(selectedOption);
  //fetchMarkdown(selectedOption);
}

window.onload = function () {
  loadContracts()
};
