document.querySelector('#close-popup-area').onclick = closeInfoPopup;

function openInfoPopup(element) {
  document.getElementById("close-popup-area").style.display = "block";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";
  document.getElementById("connector-lines").style.filter = "blur(6px)";

  targetNode = reakcia.filter(function(e){return e.name === element.parentElement.parentElement.id.replace(/-/g, " ")})[0];
  document.getElementById("info-popup-name").innerHTML = targetNode.name;
  document.getElementById("info-popup-popis").innerHTML = targetNode.description ? targetNode.description : "";

}

function closeInfoPopup(event) {
  if(event && (event.srcElement.id != 'close-popup-area' && event.srcElement.id != 'info-popup-padding')) {
    return;
  }

  document.getElementById("close-popup-area").style.display = "none";
  document.getElementById("tree-structrure-content").style.filter = "none";
  document.getElementById("connector-lines").style.filter = "none";

}

