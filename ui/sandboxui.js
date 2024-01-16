function loadSandbox(data){
    const dropdown = data.dropdown
    const sandboxDropdown = document.getElementById("sandbox-dropdown");
    sandboxDropdown.innerHTML = "";
    dropdown.forEach((dropdown) => {
        var option = document.createElement("option");
        option.text = dropdown["environment-name"];
        option.setAttribute("link",dropdown.link)
        sandboxDropdown.add(option);
        updateSandbox()
      });
}

function updateSandbox(){
    const dropdown = document.getElementById("sandbox-dropdown");
    const iframe = document.getElementById("sandbox-iframe")
    const iframe_link = dropdown.options[dropdown.selectedIndex].getAttribute("link")
    iframe.setAttribute("src",iframe_link)
}
