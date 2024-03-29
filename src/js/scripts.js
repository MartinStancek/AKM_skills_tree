const treeMetadata = JSON.parse(loadResource('src/data/trees.json'))


const params = new URLSearchParams(window.location.search);


if(params.get('t') == null) {
	// Get current URL parts
	const path = window.location.pathname;
	const hash = window.location.hash;

	// Update query string values
	params.set('t', treeMetadata.filter(e=>e.id == 1)[0].pathName);

	// Encode URL
	// numerical=123&string=yummy&multiple=a%2Cb%2Cc&foreignChar=%C3%A9
	// console.log(params.toString());

	// Update URL
	window.history.replaceState({}, '', `${path}?${params.toString()}${hash}`);

	// window.location.search = `?${tre}`;
}



const actualTreeMetadata = treeMetadata.filter(e=>e.pathName== params.get("t"))[0]

const reakcia = JSON.parse(loadResource(`src/data/${actualTreeMetadata.fileName}`))


includeHTML();


var treeStructure = document.getElementById("tree-structrure-content");

let linesSvg = document.getElementById("connector-lines").firstChild;
linesSvg.setAttribute("height", treeStructure.getBoundingClientRect().bottom+window.pageYOffset);
linesSvg.setAttribute("width", treeStructure.getBoundingClientRect().right+window.pageXOffset);



resolveLines(treeStructure.firstElementChild);


function resolveLines(tree){
	let from = tree.firstElementChild.getBoundingClientRect();
	for(let child of tree.lastElementChild.children){
		let to = child.firstElementChild.getBoundingClientRect();
		var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
		// newLine.setAttribute('id','line2');
		newLine.setAttribute('x1',(from.right+window.pageXOffset+from.left+window.pageXOffset)/2);
		newLine.setAttribute('y1',from.bottom+window.pageYOffset);
		newLine.setAttribute('x2',(to.right+window.pageXOffset+to.left+window.pageXOffset)/2);
		newLine.setAttribute('y2',to.top+window.pageYOffset);
		newLine.setAttribute('style', 'fill:black;stroke:black;stroke-width:2;opacity:1');
		linesSvg.append(newLine);
		resolveLines(child);

	}

}

function includeHTML() {
	var z, i, elmnt, file, xhttp;
	/* Loop through a collection of all HTML elements: */
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
		elmnt = z[i];
    	/*search for elements with a certain atrribute:*/
    	file = elmnt.getAttribute("include-html");
    	if (file) {
    		loadedFile = loadResource(file);
    		elmnt.innerHTML = loadedFile;
    		elmnt.removeAttribute("include-html");
    		includeHTML();
    		return;
    	}
    	if(elmnt.childNodes && elmnt.childNodes[0] && elmnt.childNodes[0].nodeValue && elmnt.childNodes[0].nodeValue.match(/%/)){
    		elmnt.innerHTML = includeAttribute(elmnt.innerHTML)
    	}
    }
}

function includeAttribute(innerHtml){
	let argName = innerHtml.match(/(%.+%)/)[1];
	// console.log("processing "+argName);

	switch(argName){
	case "%GENERATE_TREE%": return generateTree();
	case "%SKILL_TREE_NAME%": return actualTreeMetadata.displayName;
	case "%SETTINGS_LINLS%": return generateTreeLinks();
	default: throw new Error("Unknown argName:"+argName);
	}

}

function generateTree(){
	const plainTemplate = loadResource("src/html/node.html");
 	const cookieArr = getCookieData().filter(e=>e.tId ==actualTreeMetadata.id)[0].elems

	return generateTreeRecursive(/*id=*/1, plainTemplate, reakcia, cookieArr).innerHTML;
}

function generateTreeRecursive(parentId, plainTemplate, data, cookiesArr){
	// console.log("Generating: "+parent.name)
	let parent = data.filter(function(e){return e.id === parentId})[0];
	if(!parent) {console.error("Unable to find parent with name "+parentName);}
	const htmlTemplate = new DOMParser().parseFromString(plainTemplate, "text/html");
	htmlTemplate.body.innerHTML = htmlTemplate.body.innerHTML
			.replace("%NAME%", parent.name)
			.replace("%NODE_ID%", parent.name.replace(/ /g, "-"))
			.replace("%DATA_ID%", parent.id);

	if(cookiesArr.includes(""+parent.id)){
		htmlTemplate.body.firstElementChild.firstElementChild.lastElementChild.firstElementChild.firstElementChild.setAttribute("src", "src/images/star-active.png");
		htmlTemplate.body.firstElementChild.firstElementChild.classList.add("root-active");
	}

	if(!parent.childs){
		return htmlTemplate.body;
	}



	let childs = htmlTemplate.body.getElementsByClassName("childs")[0];
	for (var childId of parent.childs) {
		childs.appendChild(generateTreeRecursive(childId, plainTemplate, data, cookiesArr));
	}

	return htmlTemplate.body;
}

function loadResource(path){
	/* Make an HTTP request using the attribute value as the file name: */
	const request = new XMLHttpRequest();
	request.open("GET", path, false); // `false` makes the request synchronous
	request.send();

	if (request.status !== 200) {
		console.error(`request to ${path} failed with http status ${request.status}`)
	}
	return request.responseText;
}

function recalculateStars(){
	let count = document.getElementsByClassName("root-active").length;
	document.getElementById("header-menu-summary-button-number-text").innerHTML = count;
}

function markStar(element){
	let root = element.parentElement.parentElement;
	markStarRootElem(root);
}

function markStarRootElem(root){
	popEfect(root);
	console.log(root)

	let cookieArr = getCookieData()

	console.log(cookieArr)

	if(!root.classList.contains("root-active")){
		root.lastElementChild.firstElementChild.firstElementChild.setAttribute("src", "src/images/star-active.png");
		root.classList.add("root-active");
		cookieArr.filter(e=>e.tId ==actualTreeMetadata.id)[0].elems.push(root.getAttribute("data-id"))
	} else {
		root.lastElementChild.firstElementChild.firstElementChild.setAttribute("src", "src/images/star.png");
		root.classList.remove("root-active");
		let elems = cookieArr.filter(e=>e.tId ==actualTreeMetadata.id)[0].elems;

		cookieArr.filter(e=>e.tId ==actualTreeMetadata.id)[0].elems = elems.filter(e=>e != root.getAttribute("data-id"))
	}
	setCookie("data", JSON.stringify(cookieArr), 14)
	recalculateStars();
}

function markStarFromPopUp(element){
	const target = element.parentElement.parentElement.getAttribute("target-id");
	let root = document.getElementById(target);
	popEfect(element);

	if(!root.classList.contains("root-active")){
		element.classList.add("info-popup-star-button-active");
		document.getElementById("info-popup-star-button-text").innerHTML = "Vymazať";
		document.getElementById("info-popup-star-button-star").setAttribute("src", "src/images/star-active.png");

	} else {
		element.classList.remove("info-popup-star-button-active");
		document.getElementById("info-popup-star-button-text").innerHTML = "Označiť";
		document.getElementById("info-popup-star-button-star").setAttribute("src", "src/images/star.png");
	}
	markStarRootElem(root);

	// document.getElementById(target).style["background-color"] = element.style["background-color"]
	recalculateStars();
}

function popEfect(element){
	let delay = "130"
	element.style.transform = "scale(1.1)"
  	element.style.transition = delay+"ms"
  	setTimeout(() => {
	  element.style.transform = "scale(1)"
	}, delay);
}


function adjustSize(event){
	elemt1.remove()
	if(window.innerWidth < finalWidth) {
		bottomMenu.appendChild(elemt1);
		let scale = window.innerWidth / parseInt(style1) /1.2;
		elemt1.style.scale = scale > 1 ? 1 : scale;
	} else {
		headerMenu.insertBefore(elemt1, headerMenu.childNodes[2]);
		elemt1.style.scale = "";

	}
}

const headerMenu = document.getElementById("header-menu");
const bottomMenu = document.getElementById("bottom-menu");
const elemt1 = document.getElementById("header-menu-summary");
const elemt2 = document.getElementById("header-menu-settings");
const elemt3 = document.getElementById("header-menu-logo");
const style1 = window.getComputedStyle(elemt1)["min-width"].replace(/px/, ""); 
const style2 = window.getComputedStyle(elemt2)["min-width"].replace(/px/, ""); 
const style3 = window.getComputedStyle(elemt3)["min-width"].replace(/px/, ""); 
const finalWidth = (parseInt(style1)+parseInt(style2)+parseInt(style3)+150);
addEventListener("resize", adjustSize);
adjustSize();


document.querySelector('#close-popup-area-settings').onclick = closeSettingsPopup;

function openSettingsPopup() {
  document.getElementById("close-popup-area-settings").style.display = "flex";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";
  document.getElementById("connector-lines").style.filter = "blur(6px)";

}
function closeSettingsPopup(event) {
  if(event && (event.srcElement.id != 'close-popup-area-settings' && event.srcElement.id != 'settings-popup-padding')) {
    return;
  }

  document.getElementById("close-popup-area-settings").style.display = "none";
  document.getElementById("tree-structrure-content").style.filter = "none";
  document.getElementById("connector-lines").style.filter = "none";

}


function generateTreeLinks(){
	let resHtml = ""
	for (var i = 0; i < treeMetadata.length; i++) {
		resHtml+=`<div class="settings-popup-link-subtree" onclick=redirectToTree("${treeMetadata[i].pathName}")>${treeMetadata[i].displayName}</div>`
	}
	return resHtml;
}

function redirectToTree(treePath) {
	params.set('t', treePath);

	window.location.search = params.toString();
}










/*
 * cookie section
 */
function getCookieData(){
	let cookieData = getCookie("data");
	if(cookieData == ""){
		return treeMetadata.map(e=> {return {"tId": e.id, "elems": []}})
	}
	return JSON.parse(cookieData);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}