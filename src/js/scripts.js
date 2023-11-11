includeHTML();

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
 
	return generateTreeRecursive(reakcia, plainTemplate).innerHTML;
}

function generateTreeRecursive(parent, plainTemplate){
	// console.log("Generating: "+parent.name)
	const htmlTemplate = new DOMParser().parseFromString(plainTemplate, "text/html");
	htmlTemplate.body.innerHTML = htmlTemplate.body.innerHTML.replace("%NAME%", parent.name);
	if(!parent.childs){
		htmlTemplate.body;
	}
	let childs = htmlTemplate.body.getElementsByClassName("childs")[0];
	for (var item of parent.childs) {
		childs.appendChild(generateTreeRecursive(item, plainTemplate));
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