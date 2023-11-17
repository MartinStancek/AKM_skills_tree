document.querySelector('#close-popup-area').onclick = closeInfoPopup;
for(var e of document.getElementsByClassName('root')){
  e.onclick = openInfoPopup
}

function openInfoPopup(element) {
  if(element.srcElement.parentElement.className == "root-star") return;
  element = element.srcElement;
  while(element.className !== "root"){
    element = element.parentElement;
  }
  document.getElementById("close-popup-area").style.display = "block";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";
  document.getElementById("connector-lines").style.filter = "blur(6px)";
  document.getElementById("info-popup-star-button").style["background-color"] = element.style["background-color"];
  document.getElementById("popupInfo").setAttribute("target-id", element.id)

  targetNode = reakcia.filter(function(e){return e.name === element.id.replace(/-/g, " ")})[0];
  let description = (targetNode.description ? targetNode.description : "").split("\n").map(e=>`<div class="info-popup-popis-div">${e}</div>`).join('');
  document.getElementById("info-popup-name").innerHTML = targetNode.name;
  document.getElementById("info-popup-popis").innerHTML = description;

}

function closeInfoPopup(event) {
  if(event && (event.srcElement.id != 'close-popup-area' && event.srcElement.id != 'info-popup-padding')) {
    return;
  }

  document.getElementById("close-popup-area").style.display = "none";
  document.getElementById("tree-structrure-content").style.filter = "none";
  document.getElementById("connector-lines").style.filter = "none";

}


