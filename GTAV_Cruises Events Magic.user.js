// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      0.85
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises/
// @grant        none
// @require		 http://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js
// ==/UserScript==

// Set up the iFrame for all upcoming events after page load.
$(window).load(function(){
	var timezone = jstz.determine();
	var currentTimezone = timezone.name(); 
	var upcomingEventsLink = "https://www.reddit.com/r/GTAV_Cruises/search?q=flair%3A%22events%22&restrict_sr=on&sort=new&t=all#res-hide-options";
	var iframe = document.createElement('iframe');
	iframe.frameBorder=0;
	iframe.width="0px";
	iframe.height="0px";
	iframe.id="eventsiFrame";
	iframe.setAttribute("src", upcomingEventsLink);
	$("#header").prepend(iframe);

	// Run everything after iFrame load.
	$("#eventsiFrame").load(function(){
		var eventsString = "";
		var events = $("#eventsiFrame").contents().find("header.search-result-header > span").filter(function() { return ($(this).text() === 'Event') }).next();
		for (var i=0; i < events.length; i++) {
			var eventString = events[i].innerHTML;
			var href = $(events[i]).attr('href');
			var eventParts = eventString.split(" | ");
			var region = eventParts[0];
			var date = eventParts[1];
			var title = eventParts[2];
			var timezone = eventParts[3];
			var time = eventParts[4];

			eventsString = eventsString + '<strong><a href="' + href + '" target="_blank">'+ title + '</a></strong><br /><br />';
		}
		$(".md").prepend('<blockquote><h3>Upcoming Cruises (' + events.length + ')</h3><p>' + eventsString + '<center><strong>Your timezone ' + currentTimezone + '</strong></center></p></blockquote>');
		$("#eventsiFrame").remove();
	})
})