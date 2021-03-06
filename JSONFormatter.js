// ==UserScript==
// @name	   JSON formatter
// @version        1.0
// @run-at         document-idle
// @description	   Formats JSON if the document only contains JSON
// ==/UserScript==
(function(){
	var indentation = 4;//Change this to vary the indentation

	var pre = document.querySelector('body pre:only-child');
	if(!pre) return; //Don't do anything if this don't seem to be a json only document
	try{		
		pre.innerHTML = JSON.stringify(JSON.parse(pre.innerHTML), null,indentation);
	}
	catch(e){
		console.log(e);	
	}
})();
