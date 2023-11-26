const reakcia = JSON.parse(loadResource("src/data/reakcia.json"))


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
		newLine.setAttribute('id','line2');
		newLine.setAttribute('x1',(from.right+window.pageXOffset+from.left+window.pageXOffset)/2);
		newLine.setAttribute('y1',from.bottom+window.pageYOffset);
		newLine.setAttribute('x2',(to.right+window.pageXOffset+to.left+window.pageXOffset)/2);
		newLine.setAttribute('y2',to.top+window.pageYOffset);
		newLine.setAttribute('style', 'fill:red;stroke:black;stroke-width:5;opacity:0.5');
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
	default: throw new Error("Unknown argName:"+argName);
	}

}

function generateTree(){
	const plainTemplate = loadResource("src/html/node.html");
 	
	return generateTreeRecursive(reakcia.filter(function(e){return e.root})[0].name, plainTemplate, reakcia).innerHTML;
}

function generateTreeRecursive(parentName, plainTemplate, data){
	// console.log("Generating: "+parent.name)
	let parent = data.filter(function(e){return e.name === parentName})[0];
	if(!parent) {console.error("Unable to find parent with name "+parentName);}
	const htmlTemplate = new DOMParser().parseFromString(plainTemplate, "text/html");
	htmlTemplate.body.innerHTML = htmlTemplate.body.innerHTML
			.replace("%NAME%", parent.name)
			.replace("%NODE_ID%", parent.name.replace(/ /g, "-"));

	if(!parent.childs){
		return htmlTemplate.body;
	}

	let childs = htmlTemplate.body.getElementsByClassName("childs")[0];
	for (var childName of parent.childs) {
		childs.appendChild(generateTreeRecursive(childName, plainTemplate, data));
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

function markStar(element){
	let root = element.parentElement.parentElement;
	popEfect(root);

	if(!root.classList.contains("root-active")){
		element.firstElementChild.setAttribute("src", "src/images/star-active.png");
		root.classList.add("root-active");
	} else {
		element.firstElementChild.setAttribute("src", "src/images/star.png");
		root.classList.remove("root-active");
	}
}

function markStarFromPopUp(element){
	const target = element.parentElement.parentElement.getAttribute("target-id");
	let root = document.getElementById(target);
	popEfect(root);
	popEfect(element);

	if(!root.classList.contains("root-active")){
		element.classList.add("info-popup-star-button-active");
		document.getElementById("info-popup-star-button-text").innerHTML = "Vymazať";
		document.getElementById("info-popup-star-button-star").setAttribute("src", "src/images/star-active.png");
		root.lastElementChild.firstElementChild.firstElementChild.setAttribute("src", "src/images/star-active.png");
		root.classList.add("root-active");

	} else {
		element.classList.remove("info-popup-star-button-active");
		document.getElementById("info-popup-star-button-text").innerHTML = "Označiť";
		document.getElementById("info-popup-star-button-star").setAttribute("src", "src/images/star.png");
		root.lastElementChild.firstElementChild.firstElementChild.setAttribute("src", "src/images/star.png");
		root.classList.remove("root-active");
	}

	document.getElementById(target).style["background-color"] = element.style["background-color"]
}

function popEfect(element){
	let delay = "130"
	element.style.transform = "scale(1.1)"
  	element.style.transition = delay+"ms"
  	setTimeout(() => {
	  element.style.transform = "scale(1)"
	}, delay);
}

