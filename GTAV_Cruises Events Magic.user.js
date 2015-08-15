// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      0.77
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises/
// @grant        none
// ==/UserScript==

// Event Title Format: [Region] | [Date] | [Title] | [Timezone] | [Time]

// Run everything after page load.
$(window).load(function(){

	var upcomingEventsLink = "https://www.reddit.com/r/GTAV_Cruises/search?q=flair%3A%22events%22&restrict_sr=on&sort=new&t=all#res-hide-options";
	var iframe = document.createElement('iframe');
	iframe.frameBorder=0;
	iframe.width="0px";
	iframe.height="0px";
	iframe.id="eventsiFrame";
	iframe.setAttribute("src", upcomingEventsLink);
	$( "#header" ).prepend(iframe);

	$("#eventsiFrame").load(function(){

		var eventsString = "";
		var eventTitle;
		var events = $("#eventsiFrame").contents().find("span").filter(function() { return ($(this).text() === 'Event') }).next();
		for (var i=0; i < events.length; i++) {
			eventTitle = events[i].innerHTML;
			eventsString = eventsString + '<a href="http://www.google.com" target="_blank">' + eventTitle + '</a><br /><br />'
		}
		$( ".md" ).prepend( '<blockquote><h3>Upcoming Cruises</h3><p>' + eventsString + '</p></blockquote>' );
	});
});