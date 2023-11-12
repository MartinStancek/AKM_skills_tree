function openInfoPopup(element) {
  document.getElementById("popupInfo").style.display = "block";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";
  document.getElementById("connector-lines").style.filter = "blur(6px)";

  targetNode = reakcia.filter(function(e){return e.name === element.parentElement.parentElement.id.replace(/-/g, " ")})[0];
  document.getElementById("info-popup-name").innerHTML = targetNode.name;
  document.getElementById("info-popup-popis").innerHTML = targetNode.description ? targetNode.description : "";
  console.log(targetNode);

}

function closeInfoPopup() {
  document.getElementById("popupInfo").style.display = "none";
  document.getElementById("tree-structrure-content").style.filter = "none";
  document.getElementById("connector-lines").style.filter = "none";

}