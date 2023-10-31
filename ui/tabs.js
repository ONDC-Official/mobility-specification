
// tabs.js

function onFirstLoad(build_spec){
      let data = build_spec
      data["x-enum"] && initSchema(data["x-enum"])
      data["x-tags"] && initTag(data["x-tags"])
      data["x-examples"] && loadExample(data["x-examples"])
      //addExample("on-demand")
      data["x-flows"] && loadFlows(data["x-flows"])
      data["x-attributes"] && loadAttributes(data["x-attributes"])
      data["x-errorcodes"] && loadErrors(data["x-errorcodes"]);
      data["x-tlc"] && loadTlc(data["x-tlc"]);
}

// window.onload = function(){
//       onFirstLoad(build_spec)
// } 