
// tabs.js


window.onload = function () {
      let data = build_spec
      initSchema(data["x-enum"])
      initTag(data["x-tags"])
      loadExample(data["x-examples"])
      addExample("on-demand")
      loadFlows(data["x-flows"])
}