document.querySelector('#close-popup-area').onclick = closeInfoPopup;
for(var e of document.getElementsByClassName('root')){
  e.onclick = openInfoPopup
}

function openInfoPopup(element) {
  if(element.srcElement.parentElement.className == "root-star") return;
  element = element.srcElement;
  while(!element.classList.contains("root")){
    element = element.parentElement;
  }
  document.getElementById("close-popup-area").style.display = "block";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";
  document.getElementById("connector-lines").style.filter = "blur(6px)";
  if(!element.classList.contains("root-active")){
    document.getElementById("info-popup-star-button").classList.remove("info-popup-star-button-active");
    document.getElementById("info-popup-star-button-star").setAttribute("src", "src/images/star.png");
    document.getElementById("info-popup-star-button-text").innerHTML = "Označiť";

  } else {
    document.getElementById("info-popup-star-button").classList.add("info-popup-star-button-active");
    document.getElementById("info-popup-star-button-star").setAttribute("src", "src/images/star-active.png");
    document.getElementById("info-popup-star-button-text").innerHTML = "Vymazať";
  }
  document.getElementById("popupInfo").setAttribute("target-id", element.id)


  targetNode = reakcia.filter(function(e){return e.name === element.id.replace(/-/g, " ")})[0];

  if(targetNode["embeded-youtube"]){
    document.getElementById("info-popup-embeded-youtube").firstElementChild.setAttribute("src", targetNode["embeded-youtube"]);
    document.getElementById("info-popup-embeded-youtube").style.display = "block"

  } else {
    document.getElementById("info-popup-embeded-youtube").style.display = "none"
  }

  let description = (targetNode.description ? targetNode.description : "").split("\n").map(e=>`<div class="info-popup-popis-div">${e}</div>`).join('');
  document.getElementById("info-popup-name").innerHTML = targetNode.name;
  document.getElementById("info-popup-popis").innerHTML = description;
  
  let links = targetNode.links && targetNode.links || {};
  let keys = Object.keys(links);
  console.log(keys)
  let linkHtml = ""
  for(let key of keys){

    linkHtml += `<button id=popup-link-${key} class="popup-link-button" href=${links[key]}><div class="popup-link-button-text">${key}</div></button>`
  }
  document.getElementById("popup-link-panel").innerHTML = linkHtml;
}


function closeInfoPopup(event) {
  if(event && (event.srcElement.id != 'close-popup-area' && event.srcElement.id != 'info-popup-padding')) {
    return;
  }

  document.getElementById("close-popup-area").style.display = "none";
  document.getElementById("tree-structrure-content").style.filter = "none";
  document.getElementById("connector-lines").style.filter = "none";

}


