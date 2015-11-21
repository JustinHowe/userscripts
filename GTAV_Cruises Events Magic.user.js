// ==UserScript==
// @name         GTAV_Cruises Events Magic 
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      2.0
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises
// @match        https://www.reddit.com/r/gtav_cruises
// @match        https://www.reddit.com/r/Gtav_cruises
// @match        https://www.reddit.com/r/GTAV_Cruises/*
// @match        https://www.reddit.com/r/gtav_cruises/*
// @match        https://www.reddit.com/r/Gtav_cruises/*
// @grant        none
// @require      https://github.com/JustinHowe/userscripts/raw/master/jstz.min.js
// ==/UserScript==

// Event Title Format: [Region] | [Date] | [Title] | [GMT] | [Time]

// Set up the iFrame for all upcoming events after page load.
$(window).load(function(){

	var jstzTimezone = jstz.determine();
	var currentTimezone = jstzTimezone.name();
	var currentLocation = currentTimezone.split("/");
	currentLocation = currentLocation[1].replace(/\_/g, "+");
	var upcomingEventsLink = "https://www.reddit.com/r/GTAV_Cruises/search?q=flair%3A%22events%22&restrict_sr=on&sort=new&t=all#res-hide-options";

	var eventOpenSansCSS = '<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700italic,700" rel="stylesheet" type="text/css">';
	var eventModuleCSS = '<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/JustinHowe/userscripts/master/event-module.css" media="all">';
	var eventAttendanceCSS = '<link rel="stylesheet" type="text/css" href="https://rawgit.com/JustinHowe/userscripts/master/event-attendance.css" media="all">';
	var eventModuleHTML = '<div id="eventsWidget"><blockquote class="events-module" style="text-align:center"><h3><a id="eventsHeader" href="' + upcomingEventsLink + '" style="color:#fff">GTAV_Cruises are Racist Children</a></h3><p id="topBodyText"><strong>You should leave, immaturity and ignorance is all that\'s here.</strong></p><div id="eventsContent"></div><div id="footer"><strong><a title="All your base are belong to PapaSyntax" href="https://www.reddit.com/user/PapaSyntax/" target="_blank">PapaSyntax has Struck</a></strong></div></blockquote></div>';

	$("head").append(eventOpenSansCSS + eventModuleCSS + eventAttendanceCSS);
	$(".side .md").prepend(eventModuleHTML);

})
