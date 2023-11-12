includeHTML();

var treeStructure = document.getElementById("tree-structrure-content");

let linesSvg = document.getElementById("connector-lines").firstChild;
linesSvg.setAttribute("height", treeStructure.getBoundingClientRect().bottom);
linesSvg.setAttribute("width", treeStructure.getBoundingClientRect().right);

resolveLines(treeStructure.firstElementChild);

function resolveLines(tree){
	let from = tree.firstElementChild.getBoundingClientRect();
	for(let child of tree.lastElementChild.children){
		let to = child.firstElementChild.getBoundingClientRect();
		var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
		newLine.setAttribute('id','line2');
		newLine.setAttribute('x1',(from.right+from.left)/2);
		newLine.setAttribute('y1',from.bottom);
		newLine.setAttribute('x2',(to.right+to.left)/2);
		newLine.setAttribute('y2',to.top);
		newLine.setAttribute("stroke", "black")
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
	let reakcia = JSON.parse(loadResource("src/data/reakcia.json"))
	const plainTemplate = loadResource("src/html/node.html");
 	
	return generateTreeRecursive(reakcia.filter(function(e){return e.root})[0].name, plainTemplate, reakcia).innerHTML;
}

function generateTreeRecursive(parentName, plainTemplate, data){
	// console.log("Generating: "+parent.name)
	let parent = data.filter(function(e){return e.name === parentName})[0];
	if(!parent) {console.error("Unable to find parent with name "+parentName);}
	const htmlTemplate = new DOMParser().parseFromString(plainTemplate, "text/html");
	htmlTemplate.body.innerHTML = htmlTemplate.body.innerHTML.replace("%NAME%", parent.name);
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
	console.log(element.style["background-color"])
	if(element.style["background-color"] == ""){
		element.style["background-color"] = "yellow"
	} else {
		element.style["background-color"] = ""
	}
}

