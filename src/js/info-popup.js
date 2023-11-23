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

  } else {
    document.getElementById("info-popup-star-button").classList.add("info-popup-star-button-active");
    document.getElementById("info-popup-star-button-star").setAttribute("src", "src/images/star-active.png");

  }
  document.getElementById("popupInfo").setAttribute("target-id", element.id)
  document.getElementById("info-popup-star-button-text").innerHTML =element.style["background-color"] == "" ? "Označiť" : "Vymazať";


  targetNode = reakcia.filter(function(e){return e.name === element.id.replace(/-/g, " ")})[0];
  let description = (targetNode.description ? targetNode.description : "").split("\n").map(e=>`<div class="info-popup-popis-div">${e}</div>`).join('');
  document.getElementById("info-popup-name").innerHTML = targetNode.name;
  document.getElementById("info-popup-popis").innerHTML = description;
  

  document.getElementById("popup-link-youtube").style.display = (targetNode.links && targetNode.links.youtube) ? "inline-block" : "none";
  document.getElementById("popup-link-podcast").style.display = (targetNode.links && targetNode.links.podcast) ? "inline-block" : "none";
  document.getElementById("popup-link-study").style.display = (targetNode.links && targetNode.links.doi) ? "inline-block" : "none";
  document.getElementById("popup-link-book").style.display = (targetNode.links && targetNode.links.book) ? "inline-block" : "none";

  document.getElementById("popup-link-youtube").setAttribute("href", targetNode.links && targetNode.links.youtube);
  document.getElementById("popup-link-podcast").setAttribute("href", targetNode.links && targetNode.links.podcast);
  document.getElementById("popup-link-study").setAttribute("href", targetNode.links && targetNode.links.doi);
  document.getElementById("popup-link-book").setAttribute("href", targetNode.links && targetNode.links.book);
  
}

function closeInfoPopup(event) {
  if(event && (event.srcElement.id != 'close-popup-area' && event.srcElement.id != 'info-popup-padding')) {
    return;
  }

  document.getElementById("close-popup-area").style.display = "none";
  document.getElementById("tree-structrure-content").style.filter = "none";
  document.getElementById("connector-lines").style.filter = "none";

}


