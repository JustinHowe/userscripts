// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      0.75
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises/
// @include      *.reddit.com/r/GTAV_Cruises/*
// @grant        none
// ==/UserScript==

// Event Title Format: [Region] | [Date] | [Title] | [Timezone] | [Time]

// Run everything after page load.
$(window).load(function(){
	var eventsString;
	var eventTitle;
	var events = $x("//span[@title='Event']/..//a[contains(@class, 'title')]");
	for (var i=0; i < events.length; i++) {
		eventTitle = events[i].innerHTML;
		eventsString = eventsString + '<a href="http://www.google.com" target="_blank">' + eventTitle + '</a><br /><br />'
	}
	$( ".md" ).prepend( '<blockquote><h3>Upcoming Cruises</h3><p>' + eventsString + '</p></blockquote>' );
})