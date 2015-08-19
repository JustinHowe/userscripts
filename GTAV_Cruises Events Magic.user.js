// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      1.07
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises/
// @match        https://www.reddit.com/r/GTAV_Cruises
// @match        https://www.reddit.com/r/gtav_cruises/
// @match        https://www.reddit.com/r/gtav_cruises
// @grant        none
// @require      https://github.com/JustinHowe/userscripts/raw/master/jstz.min.js
// ==/UserScript==

//[Region] | [Date] | [Title] | [GMT] | [Time]

var countdowns = [];
var dates = [];
var times = [];
var zones = [];

console.log = function() {} //Comment to enable console logging. 

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function timerUpdate(n) {
	var timerString = "timer" + n;
	if (!isNaN(countdowns[n])) {
		s = countdowns[n]%60;
		m = (countdowns[n]-s)/60%60;
		h = ((countdowns[n]-s)/60 - m)/60%24;
		d = (((countdowns[n]-s)/60 - m)/60 - h)/24;

		if (d > 0) {
			var txt = d + " Days, " + h +" Hrs, " + m + " Min";
		} else {
			var txt = h +" Hrs, " + m + " Min";
		}
		document.getElementById(timerString).innerHTML = txt;
	} else {
		document.getElementById(timerString).innerHTML = '<font size="1">' + dates[n] + ' @ ' + times[n] + ' ' + zones[n] + '</font>';
	}
}

// Set up the iFrame for all upcoming events after page load.
$(window).load(function(){
	var jstzTimezone = jstz.determine();
	var currentTimezone = jstzTimezone.name(); 
	var currentLocation = currentTimezone.split("/");
	currentLocation = currentLocation[1].replace(/\_/g, "+");
	var countdownHref;
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
			console.log("Events Found: " + events.length);
			var eventString = events[i].innerHTML;
			var wellFormedEvent = eventString.match(/\|/g);
			if (wellFormedEvent.length == 4) {
				var href = $(events[i]).attr('href');
				var eventParts = eventString.split("|");
				var region = eventParts[0];

				//Determine date parts
				var date = eventParts[1];
				dates[i] = eventParts[1];
				date = eventParts[1].replace(/\-/g, "/");
				var day = "d";
				var month = "m";
				var year = "y";
				if (date.indexOf("/") >= 0) {
					date = eventParts[1].split("/");
					day = parseInt(date[0], 10);
					month = parseInt(date[1], 10);
					year = date[2];
					var yearFirstChar = year.charAt(0);

					if (yearFirstChar != "2") {
						year = "20" + year;
					}

					year = parseInt(year, 10);
				}
				
				//var title = toTitleCase(eventParts[2]); //Convert to lowercast starting with 2nd character of each word
				var title = eventParts[2];
				var titleShort;

				//Log original time and timezone
				console.log(title + " - " + eventParts[4] + " - " + day + "/" + month + "/" + year + " - " + eventParts[3]);

				//Convert to four-digit military time and UTC time zone.
				var time = eventParts[4].split(":");
				times[i] = eventParts[4];
				var hour = time[0];
				var minute = time[1];
				hour = hour.replace(/ /g, "");
				hour = parseInt(hour, 10);
				minute = minute.replace(/ /g, "");
				minute = parseInt(minute, 10);

				if (times[i].toLowerCase().indexOf("pm") >= 0) {
					hour = hour + 12;
				}

				console.log("24hr Hour: " + hour);

				var timezone = eventParts[3];
				zones[i] = timezone;
				if (timezone.toLowerCase().indexOf("pst") >= 0) {
					timezone = "UTC-8";
				}
				if (timezone.toLowerCase().indexOf("pdt") >= 0) {
					timezone = "UTC-7";
				}
				if (timezone.toLowerCase().indexOf("est") >= 0) {
					timezone = "UTC-5";
				}
				if (timezone.toLowerCase().indexOf("edt") >= 0) {
					timezone = "UTC-4";
				}
				if (timezone.toLowerCase().indexOf("cst") >= 0) {
					timezone = "UTC-6";
				}
				if (timezone.toLowerCase().indexOf("cdt") >= 0) {
					timezone = "UTC-5";
				}
				if (timezone.toLowerCase().indexOf("aest") >= 0) {
					timezone = "UTC+10";
				}
				if (timezone.toLowerCase().indexOf("aedt") >= 0) {
					timezone = "UTC+11";
				}

				timezone = timezone.replace(/ /g, "");
				var substringBoundry = timezone.length;
				console.log("Timezone Infos: " + timezone + ", length " + substringBoundry);

				var convertedHour = hour;
				console.log("Converted Hour 1: " + convertedHour);

				if (substringBoundry > 4) {
					var timezoneOffsetHours = timezone.substring(4,substringBoundry);
					console.log("Timezone Offset Hours String: " + timezoneOffsetHours);
					timezoneOffsetHours = parseInt(timezoneOffsetHours, 10);
					console.log("Timezone Offset Hours Integer: " + timezoneOffsetHours);

					if (timezone.indexOf("-") >= 0) {
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
				
					}
				}

				console.log("Converted Hour 2: " + convertedHour);

				//Output new UTC time
				console.log("Converted to UTC: " + title + " - " + convertedHour + ":" + minute + " - " + day + "/" + month + "/" + year);

				var epochFuture = Date.UTC(year,month-1,day,convertedHour,minute);
				console.log("Future Epoch Before MS: " + epochFuture);
				epochFuture = Math.floor(epochFuture/1000);
				//epochFuture = 1440050400;
				var epochNow = Math.floor(Date.now()/1000);
				countdowns[i] = epochFuture - epochNow;

				if (title.length > 25) {
					titleShort = title.substring(0,22) + "...";
				} else {
					titleShort = title;
				}
				
				if (!isNaN(countdowns[i])) {
					var localDate = new Date(epochFuture*1000);
					localDate = localDate.toString().substring(0,21);
					eventsString = eventsString + '<p style="float: left"><strong><a href="' + href + '" target="_blank">'+ titleShort + '</a></p><p style="float: right"><span id="timer' + i + '" style="color:#48a948"></span></strong></p><br /><br /><p style="float: left"><strong>' + currentLocation.replace(/\+/g, " ") + ' Time:</strong></p><p style="float: right"><strong><font size="1">' + localDate + '</font></strong></p><br /><p align="center"><img src="https://lh3.googleusercontent.com/6Evhp9jZ4ocalVFkHdRWgLkG9XkPrrKT0ATrQN0ruLnQ=w699-h9-no" border=0 width="100%"></p>';
				} else {
					eventsString = eventsString + '<p style="float: left"><strong><a title="No Countdown Timer - Bad Date - Should be day/month/year. err_code:id10t" href="' + href + '" target="_blank">'+ titleShort + '</a></p><p style="float: right"><span id="timer' + i + '"></span></p></strong><br /><p align="center"><img src="https://lh3.googleusercontent.com/6Evhp9jZ4ocalVFkHdRWgLkG9XkPrrKT0ATrQN0ruLnQ=w699-h9-no" border=0 width="100%"></p>';
				}
			}
		}

		$(".md").prepend('<blockquote><h3><a href="' + upcomingEventsLink + '"><font color="#ffffff">Upcoming Cruises (' + events.length + ')</font></a></h3><div id="upcomingEventText">' + eventsString + '<center><strong>Report Widget Bugs to <a title="All your base are belong to PapaSyntax" href="https://www.reddit.com/user/PapaSyntax/" target="_blank">PapaSyntax</a></strong></center></div></blockquote>');

		for (var i=0; i < events.length; i++) {
			timerUpdate(i);
			var funcInterval = setInterval(timerUpdate(i), 1000);
		}
	})
})