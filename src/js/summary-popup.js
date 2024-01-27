document.querySelector('#close-popup-area-summary').onclick = closeSummaryPopup;

const lineTemplate = loadResource("src/html/summary-popup-skill-line.html");
const parentTemplate = loadResource("src/html/summary-popup-skill-parent.html");

function sendEmail(event){
  event.preventDefault();
  document.getElementById('summary-popup-mail-box-submit').classList.remove("summary-popup-mail-box-submit-active");
  document.getElementById('summary-popup-mail-box-submit').classList.add("summary-popup-mail-box-submit-disabled");
  document.getElementById('summary-popup-mail-box-submit').disabled="disabled";

  var http = new XMLHttpRequest();
  var url = 'email.php';
  var name = document.getElementById('summary-popup-mail-box-name').value;
  var email = document.getElementById('summary-popup-mail-box-email').value;
  var contactBack = document.getElementById('summary-popup-mail-box-contact-back-checkbox').checked;
  var jsonData = JSON.stringify(getCookieData());
  console.log("url="+url);
  console.log("name="+name);
  console.log("email="+email);
  console.log("contactBack="+contactBack);
  console.log("jsonData="+jsonData);

  if(isBlank(name)){
    alert("Je potrebné zadať meno");
    return;
  }

  if(isBlank(email)){
    alert("Je potrebné zadať emailovú adresu");
    return;
  }
  if(!isValidEmail(email)){
    alert("Je potrebné zadať validnú emailovú adresu");
    return;
  }



  var params = `name=${name}&email=${email}"&contact-back=${contactBack?"on":"off"}&jsonData=${jsonData}`;
  http.open('POST', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
        document.getElementById("summary-popup-skills-result").style.display = "block";
        document.getElementById("summary-popup-skills-text").style.display = "none";
        document.getElementById("summary-popup-skills-tree-parent").style.display = "none";
        document.getElementById("summary-popup-skills-result").innerHTML = http.responseText;
      } else if (http.readyState == 4){
        alert("Chyba odoslania emailu. Skúste to prosím neskôr.")
      }
  }
  http.send(params);

}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
function isValidEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};




function openSummaryPopup() {
  document.getElementById("close-popup-area-summary").style.display = "block";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";
  document.getElementById("connector-lines").style.filter = "blur(6px)";
  document.getElementById("summary-popup-skills-result").style.display = "none";
  document.getElementById("summary-popup-skills-text").style.display = "block";
  document.getElementById("summary-popup-skills-tree-parent").style.display = "block";
  document.getElementById('summary-popup-mail-box-submit').classList.remove("summary-popup-mail-box-submit-disabled");
  document.getElementById('summary-popup-mail-box-submit').classList.add("summary-popup-mail-box-submit-active");
  document.getElementById('summary-popup-mail-box-submit').disabled=undefined;

  let skillsTreeParent = document.getElementById("summary-popup-skills-tree-parent");
  skillsTreeParent.innerHTML = ""


  


  for (var j = 0; j < treeMetadata.length; j++) {
    let linesHtml = "";
    let actualTreeMetadata = treeMetadata[j] 
    let cookieArr = getCookieData().filter(e=>e.tId ==actualTreeMetadata.id)[0].elems
    let nodesData = JSON.parse(loadResource(`src/data/${actualTreeMetadata.fileName}`))

    for (let i = 0; i < cookieArr.length; i++) {
      let data = nodesData.filter(e=>e.id == cookieArr[i])[0]
      console.log(data);

      linesHtml+=lineTemplate.replace("%NAME%", data.name)
                             .replace("%DESCRIPTION%", data.description)
                             .replace("%DATA_NAME%", data.name.replace(/ /g, "-"))
                             .replace("%DATA_TREE_ID%", actualTreeMetadata.id)
                             .replace("%TARGET_ELEM_ID%", data.id)
    }

    if(linesHtml == ""){
      linesHtml = '<div class="summary-popup-skills-tree-content-any">Žiadne vybraté skills</div>'
    }

    const parentHtmlTemplate = new DOMParser().parseFromString(parentTemplate
                                                                  .replace("%LINES%", linesHtml)
                                                                  .replace("%REDIRECT_LINK%", actualTreeMetadata.pathName)
                                                                  .replace("%SKILL_TREE_NAME%", actualTreeMetadata.displayName), "text/html");
    skillsTreeParent.appendChild(parentHtmlTemplate.body.lastElementChild);
  }

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

function summaryRemoveStar(targetId, element, treeId, targetElemId){
  element.parentElement.parentElement.remove()

  let target = document.getElementById(targetId);
  if(target) {
    markStarRootElem(target);
  } else {
    let cookieArr = getCookieData()
    let elems = cookieArr.filter(e=>e.tId ==treeId)[0].elems;

    cookieArr.filter(e=>e.tId == treeId)[0].elems = elems.filter(e=>e != ""+targetElemId)
    console.log(targetElemId)
    console.log(cookieArr.filter(e=>e.tId == treeId)[0].elems)
    setCookie("data", JSON.stringify(cookieArr), 14)

  }

}


