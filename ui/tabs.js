function onFirstLoad(build_spec) {
  let data = build_spec;
  const xProperties = [
    "x-enum",
    "x-tags",
    "x-examples",
    "x-flows",
    "x-attributes",
    "x-errorcodes",
    "x-tlc",
    "x-featureui",
    "x-sandboxui",
    "x-testcasesui",
    "x-changeLog"
  ];
  const dropdown = document.getElementById("contract-dropdown");
  const branch_name = dropdown.options[dropdown.selectedIndex].text;
  xProperties.forEach((xProperty) => {
    if (data[xProperty]) {
      switch (xProperty) {
        case "x-enum":
          initSchema(data[xProperty]);
          break;
        case "x-tags":
          initTag(data[xProperty]);
          break;
        case "x-examples":
          loadExample(data[xProperty]);
          break;
        case "x-flows":
          loadFlows(data[xProperty]);
          break;
        case "x-attributes":
            shouldDisplay(Object.keys(data[xProperty]), "attribute-navbar")
              loadAttributes(data[xProperty]);
              break;
        case "x-errorcodes":
          shouldDisplay(data[xProperty].code, "errorcodes-navbar");
          loadErrors(data[xProperty]);
          break;
        case "x-tlc":
          shouldDisplay(data[xProperty].code, "tlc-nav");
          loadTlc(data[xProperty]);
          break;
        case "x-featureui":
          if (shouldDisplay(data[xProperty].filenames, "feature-ui-nav"))
            renderDropdownMarkdown(branch_name, data[xProperty].filenames);
          break;
        case "x-sandboxui":
          if (shouldDisplay(data[xProperty].dropdown, "sandbox-nav"))
            loadSandbox(data[xProperty]);
          break;
        case "x-testcasesui":
          if (shouldDisplay(data[xProperty].filenames, "testcases-navbar"))
            renderDropdownCases(branch_name, data[xProperty].filenames);
          break;
        case "x-changeLog":
          if( shouldDisplay(data[xProperty].filenames, "change-log-nav")) {
          renderChangeLogDropDown(branch_name,data[xProperty].filenames)
          }
          break  

        default:
          break;
      }
    } else {
      //remove from dom if not found
      switch (`${xProperty}`) {
        case "x-attributes":
          shouldDisplay([], "attribute-navbar");
          break;
        case "x-featureui":
          shouldDisplay([], "feature-ui-nav");
          break;
        case "x-errorcodes":
          shouldDisplay([], "errorcodes-navbar");
          break;
        case "x-tlc":
          shouldDisplay([], "tlc-nav");
          break;
        case "x-sandboxui":
          shouldDisplay([], "sandbox-nav");
          break;
        case "x-testcasesui":
          shouldDisplay([], "testcases-navbar");
          break;
        case "x-changeLog":
          shouldDisplay([], "change-log-nav");
          const swaggerTab = document.getElementById("swagger-tab")
          swaggerTab.click()
          break;  

        default:
          break;
      }
      console.log(`${xProperty} is not present in the build_spec.`);
    }
  });
}

function shouldDisplay(data, id) {
  if (isNaN(data?.length) || data?.length < 1) {
    const element = document.getElementById(id);
    if (element) element.classList.add("d-none");
    return false;
  } else {
    const element = document.getElementById(id);
    if (element) element.classList.remove("d-none");
    return true;
  }
}
// window.onload = function(){
//       onFirstLoad(build_spec)
// }
