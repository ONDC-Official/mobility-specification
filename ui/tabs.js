
// tabs.js

function onFirstLoad(build_spec){
      let data = build_spec
      initSchema(data["x-enum"])
      initTag(data["x-tags"])
      loadExample(data["x-examples"])
      //addExample("on-demand")
      loadFlows(data["x-flows"])
      loadAttributes(data["x-attributes"])
      loadErrors(data["x-errorcodes"])
}

window.onload = function(){
      onFirstLoad(build_spec)
} 