document.querySelector('#close-popup-area-summary').onclick = closeSummaryPopup;

function openSummaryPopup() {
  document.getElementById("close-popup-area-summary").style.display = "block";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";
  document.getElementById("connector-lines").style.filter = "blur(6px)";

  const collection = document.getElementsByClassName("summary-popup-skills-tree-content-detail");
  for (let i = 0; i < collection.length; i++) {
    let rect = collection[i].getBoundingClientRect();
    collection[i].style["margin-top"] = "-"+(rect.height+20)+"px"
  }
}


function closeSummaryPopup(event) {
  if(event && (event.srcElement.id != 'close-popup-area-summary' && event.srcElement.id != 'summary-popup-padding')) {
    return;
  }

  document.getElementById("close-popup-area-summary").style.display = "none";
  document.getElementById("tree-structrure-content").style.filter = "none";
  document.getElementById("connector-lines").style.filter = "none";

}

function inspectSkill(element){
  if(element.parentElement.parentElement.lastElementChild.lastElementChild.style["margin-top"] == "0px") {
    let rect = element.parentElement.parentElement.lastElementChild.lastElementChild.getBoundingClientRect();
    element.parentElement.parentElement.lastElementChild.lastElementChild.style["margin-top"] = "-"+(rect.height+20)+"px"
  } else {
    element.parentElement.parentElement.lastElementChild.lastElementChild.style["margin-top"]  = "0px"
  }
  // element.parentElement.parentElement.lastElementChild.lastElementChild.classList.toggle("summary-popup-skills-tree-content-detail-expanded")
}


