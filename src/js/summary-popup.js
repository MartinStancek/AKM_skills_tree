document.querySelector('#close-popup-area-summary').onclick = closeSummaryPopup;

const lineTemplate = loadResource("src/html/summary-popup-skill-line.html");
const parentTemplate = loadResource("src/html/summary-popup-skill-parent.html");


function openSummaryPopup() {
  document.getElementById("close-popup-area-summary").style.display = "block";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";
  document.getElementById("connector-lines").style.filter = "blur(6px)";

  let skillsTreeParent = document.getElementById("summary-popup-skills-tree-parent");
  
  // TODO: iterovat cez vsetky skillstree

  let linesHtml = "";
  
  const collection = document.getElementsByClassName("root-active");

  for (let i = 0; i < collection.length; i++) {
    let data = reakcia.filter(e=>e.name == collection[i].id.replace(/-/g, " "))[0]

    linesHtml+=lineTemplate.replace("%NAME%", data.name)
                           .replace("%DESCRIPTION%", data.description)
                           .replace("%DATA_NAME%", collection[i].id)
  }

  if(linesHtml == ""){
    linesHtml = '<div class="summary-popup-skills-tree-content-any">Žiadne vybraté skills</div>'
  }

  const parentHtmlTemplate = new DOMParser().parseFromString(parentTemplate.replace("%LINES%", linesHtml), "text/html");
  skillsTreeParent.innerHTML = ""
  skillsTreeParent.appendChild(parentHtmlTemplate.body.lastElementChild);


  includeHTML();

  const collection2 = document.getElementsByClassName("summary-popup-skills-tree-content-detail");
  for (let i = 0; i < collection2.length; i++) {
    let rect = collection2[i].getBoundingClientRect();
    collection2[i].style["margin-top"] = "-"+(rect.height+20)+"px"
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

function summaryRemoveStar(targetId, element){
  element.parentElement.parentElement.remove()

  markStarRootElem(document.getElementById(targetId));

}


