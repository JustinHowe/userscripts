// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      0.97
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises/
// @match        https://www.reddit.com/r/GTAV_Cruises
// @match        https://www.reddit.com/r/gtav_cruises/
// @match        https://www.reddit.com/r/gtav_cruises
// @grant        none
// @require      http://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js
// ==/UserScript==

// Set up the iFrame for all upcoming events after page load.
$(window).load(function(){
	var timezone = jstz.determine();
	var currentTimezone = timezone.name(); 
	var currentLocation = currentTimezone.split("/");
	currentLocation = currentLocation[1].replace(/\_/g, "+");
	var getCountdownHref;
	var upcomingEventsLink = "https://www.reddit.com/r/GTAV_Cruises/search?q=flair%3A%22events%22&restrict_sr=on&sort=new&t=all#res-hide-options";
	var iframe = document.createElement('iframe');
	iframe.frameBorder=0;
	iframe.width="0px";
	iframe.height="0px";
	iframe.id="eventsiFrame";
	iframe.setAttribute("src", upcomingEventsLink);
	$("div.footer-parent").append(iframe);

	// Run everything after iFrame load.
	$("#eventsiFrame").load(function(){
		var eventsString = "";
		var events = $("#eventsiFrame").contents().find("header.search-result-header > span").filter(function() { return ($(this).text() === 'Event') }).next();
		for (var i=0; i < events.length; i++) {
			var eventString = events[i].innerHTML;
			var wellFormedEvent = eventString.match(/\|/g);
			if (wellFormedEvent.length == 4) {
				var href = $(events[i]).attr('href');
				var eventParts = eventString.split(" | ");
				var region = eventParts[0];

				//Determine date parts
				var date = eventParts[1];
				date = eventParts[1].replace(/\-/g, "/");
				date = eventParts[1].replace(/\|/g, "/");
				date = eventParts[1].split("/");
				var day = parseInt(date[0], 10);
				var month = parseInt(date[1], 10);
				var year = parseInt(date[2], 10);

				var title = eventParts[2];

				//Log original time and timezone
				console.log(title + " - " + eventParts[4] + " - " + day + "/" + month + "/" + year + " - " + eventParts[3]);

				//Convert time to four-digit military time of GMT 00:00 timezone.
				var time = eventParts[4].split(":");
				var hour = time[0];
				var minute = time[1];

				var timezone = eventParts[3];
				if (timezone.toLowerCase().indexOf("pst") >= 0) {
					timezone = "GMT-8";
				}
				if (timezone.toLowerCase().indexOf("pdt") >= 0) {
					timezone = "GMT-7";
				}
				if (timezone.toLowerCase().indexOf("est") >= 0) {
					timezone = "GMT-5";
				}
				if (timezone.toLowerCase().indexOf("edt") >= 0) {
					timezone = "GMT-4";
				}
				if (timezone.toLowerCase().indexOf("cst") >= 0) {
					timezone = "GMT-6";
				}
				if (timezone.toLowerCase().indexOf("cdt") >= 0) {
					timezone = "GMT-5";
				}

				timezone = timezone.replace(/ /g, "");
				var substringBoundry = timezone.length;
				var timezoneOffsetHours = parseInt(timezone.substring(4,substringBoundry), 10);
				var convertedHour;

	/*			if (timezone.indexOf("-") >= 0) {
					convertedHour = hour + timezoneOffsetHours;
				}
				if (timezone.indexOf("+") >= 0) {
					convertedHour = hour - timezoneOffsetHours;
				}

				if (convertedHour >= 24) {
					convertedHour = convertedHour - 24;
					day++;

					var daysInMonth = 31;
					if ([9,4,6,11].indexOf(month) >=0) {
						daysInMonth = 30;
					}
					if (month == 2) {
						daysInMonth = 28;
					}

					if (day > daysInMonth) {
						day = 1;
						month++;

						if (month > 12) {
							month = 1;
						}
					}
			
				}*/

				//Log new base time and timezone
				//console.log("Converted - " + title + " - " + convertedHour + ":" + minute + " - " + day + "/" + month + "/" + year);

				//getCountdownHref = "http://www.timeanddate.com/scripts/gocountdown.php?theme=text&msg=" + title.replace(/ /g, "+") + "&font=sanserif&month=" + month + "&day=" + day + "&year=" + year + "&hour=" + convertedHour + "&min=" + minute + "&sec=0&p0=%3A&p0txt=" + currentLocation;

				if (title.length > 25) {
					title = title.substring(0,25) + "...";
				}
				eventsString = eventsString + '<p style="float: left"><strong><a href="' + href + '" target="_blank">'+ title + '</a></strong></p><p style="float: right">' + eventParts[1] + ' @ ' + eventParts[4] + '</p><br /><br />';
			}
		}
		$(".md").prepend('<blockquote><h3>Upcoming Cruises (' + events.length + ')</h3><div id="upcomingEventText">' + eventsString + '<center><strong>Your timezone location: ' + currentLocation.replace(/\+/g, " ") + '</strong></center></div></blockquote>');
	})
})