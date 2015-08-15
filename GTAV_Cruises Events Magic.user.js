// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      0.73
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises/
// @include      *.reddit.com/r/GTAV_Cruises/*
// @grant        none
// ==/UserScript==

// Event Title Format: [Region] | [Date] | [Title] | [Timezone] | [Time]

// Run everything as soon as the DOM is set up.
$(window).load(function(){

	$( "#siteTable" ).prepend( '<h3>Upcoming Cruises</h3><p><a href="http://www.google.com" target="_blank">Event 1</a></p>' );
})