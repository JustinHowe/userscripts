// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    https://github.com/yogensia/userscripts/
// @version      1.39
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises/
// @match        https://www.reddit.com/r/GTAV_Cruises
// @match        https://www.reddit.com/r/gtav_cruises/
// @match        https://www.reddit.com/r/gtav_cruises
// @grant        none
// @require      https://github.com/yogensia/userscripts/raw/master/jstz.min.js
// ==/UserScript==

//[Region] | [Date] | [Title] | [GMT] | [Time]

var countdowns = [];
var dates = [];
var times = [];
var zones = [];
var day = "d";
var month = "m";
var year = "y";

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

		var txt;
		var inProgress = false;

		if (d != 0) {
			txt = "Starting in " + d + " Days, " + h +" Hrs, " + m + " Min";
			$("#event-block-" + n).addClass("state-upcoming");
		}
		if ((d == 0) && (h != 0)) {
			txt = "Starting in " + h +" Hrs, " + m + " Min";
			$("#event-block-" + n).addClass("state-upcoming");
		}
		if ((d == 0) &&(h == 0) && (m != 0)) {
			txt = "Starting in " + m + " Min";
			$("#event-block-" + n).addClass("state-upcoming");
		}
		if ((d != 0) &&(h == 0) && (m != 0)) {
			txt = "Starting in " + d + " Days, " + m + " Min";
			$("#event-block-" + n).addClass("state-upcoming");
		}

		if ((d != 0) &&(h != 0) && (m == 0)) {
			txt = "Starting in " + d + " Days, " + h + " Hrs";
			$("#event-block-" + n).addClass("state-upcoming");
		}
		if ((d == 0) && ((h >= -1) && (h <= 0)) && (m <= 0)) {
			txt = 'In Progress';
			$("#event-block-" + n).addClass("state-progress");
			inProgress = true;
		}
		if ((m <= 0) && !inProgress) {
			txt = 'Finished';
			$("#event-block-" + n).removeClass("state-upcoming").addClass("state-finished");
		}

		document.getElementById(timerString).innerHTML = txt;
	} else {
		document.getElementById(timerString).innerHTML = dates[n] + ' @ ' + times[n] + ' ' + zones[n];
	}
}

function getBadDate(badDate) {
	if (badDate.indexOf("jan") >= 0) {
		month = 1
	}
	if (badDate.indexOf("feb") >= 0) {
		month = 2
	}
	if (badDate.indexOf("mar") >= 0) {
		month = 3
	}
	if (badDate.indexOf("apr") >= 0) {
		month = 4
	}
	if (badDate.indexOf("may") >= 0) {
		month = 5
	}
	if (badDate.indexOf("jun") >= 0) {
		month = 6
	}
	if (badDate.indexOf("jul") >= 0) {
		month = 7
	}
	if (badDate.indexOf("aug") >= 0) {
		month = 8
	}
	if (badDate.indexOf("sep") >= 0) {
		month = 9
	}
	if (badDate.indexOf("oct") >= 0) {
		month = 10
	}
	if (badDate.indexOf("nov") >= 0) {
		month = 11
	}
	if (badDate.indexOf("dec") >= 0) {
		month = 12
	}

	year = badDate.match(/\d{4}/);
	day = badDate.replace(year, "");
	day = day.replace(/\D+/g, "");
	day = parseInt(day, 10);
}

// Set up the iFrame for all upcoming events after page load.
$(window).load(function(){

	var eventOpenSansCSS = '<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700italic,700" rel="stylesheet" type="text/css">';
	var eventModuleCSS = '<link rel="stylesheet" type="text/css" href="https://rawgit.com/yogensia/userscripts/master/event-module.css" media="all">';
	var eventModuleHTML = '<div id="eventsWidget"><blockquote><h3>Upcoming Cruises</h3><p align="center">Loading Cruises...</p><p align="center">Report Widget Bugs to <a title="All your base are belong to PapaSyntax" href="https://www.reddit.com/user/PapaSyntax/">PapaSyntax</a></p></blockquote></div>';

	$(".md").prepend(eventOpenSansCSS + eventModuleCSS + eventModuleHTML);

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
			var wellFormedEvent = eventString.replace(/[^\|]/g, "").length;
			if (wellFormedEvent == 4) {
				eventString = eventString.replace(/\[/g, "");
				eventString = eventString.replace(/\]/g, "");
				console.log("Event String: " + eventString);
				var href = $(events[i]).attr('href');
				var eventParts = eventString.split("|");
				var region = eventParts[0];

				//Determine date parts
				var date = eventParts[1];
				dates[i] = eventParts[1];
				date = eventParts[1].replace(/\-/g, "/");
				console.log("Date: " + date);
				if (date.indexOf("/") >= 0) {
					date = date.split("/");
					day = parseInt(date[0], 10);
					month = parseInt(date[1], 10);

					if (month > 12) {
						day = parseInt(date[1], 10);
						month = parseInt(date[0], 10);
					}

					year = date[2];
					var yearFirstChar = year.charAt(0);

					if (yearFirstChar != "2") {
						year = "20" + year;
					}

					year = parseInt(year, 10);

					var monthCurrentEpoch = Date.now();
					var monthAheadEpoch = (monthCurrentEpoch + 2678400000)/1000;
					var eventEpoch = Date.UTC(year,month-1,day,12,0)/1000;
					console.log("Date Epochs: " + monthAheadEpoch + " / " + eventEpoch);

					if (eventEpoch > monthAheadEpoch) {
						day = parseInt(date[1], 10);
						month = parseInt(date[0], 10);
					}

				}

				if ((date.indexOf("/") < 0) && (date.indexOf("2015") >= 0)) {
					getBadDate(date.toLowerCase());
				}

				//var title = toTitleCase(eventParts[2]); //Convert to lowercast starting with 2nd character of each word
				var title = eventParts[2];
				var titleShort;

				//Log original time and timezone
				console.log(title + " - " + eventParts[4] + " - " + day + "/" + month + "/" + year + " - " + eventParts[3]);

				//Convert to four-digit military time and UTC time zone.
				var time = eventParts[4];
				if (time.indexOf(":") < 0) {
					if (time.toLowerCase().indexOf("am") >= 0) {
						time = time.replace(/AM/g, "");
						time = time.replace(/am/g, "");
					}
					if (time.toLowerCase().indexOf("pm") >= 0) {
						time = time.replace(/PM/g, "");
						time = time.replace(/pm/g, "");
					}
					time = time.replace(/ /g, "");
					if (time.length == 1) {
						time = time + ":00";
						console.log("Converted Time " + eventParts[4] + " To: " + time);
					} else if (time.length == 2) {
						time = time + ":00";
						console.log("Converted Time " + eventParts[4] + " To: " + time);
					} else if (time.length == 3) {
						var time1 = time.charAt(0);
						var time2 = time.replace(time1, "");
						time = time1 + ":" + time2;
						console.log("Converted Time " + eventParts[4] + " To: " + time);
					} else if (time.length == 4) {
						var time1 = time.substring(0, 2);
						var time2 = time.substring(2, 4);
						time = time1 + ":" + time2;
						console.log("Converted Time " + eventParts[4] + " To: " + time);
					}
				}
				time = time.split(":");
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

				/*
				if (title.length > 25) {
					titleShort = title.substring(0,22) + "...";
				} else {
					titleShort = title;
				}
				*/

				if (!isNaN(countdowns[i])) {
					var localDate = new Date(epochFuture*1000);
					localDate = localDate.toString().substring(0,21);
					eventsString = eventsString + '<div id="event-block-' + i + '" class="event-block"><p id="timer' + i + '" class="event-timer"></p><p class="event-title"><a title="Link to: ' + title + '" href="' + href + '">' + title + '</a></p><p class="event-local-date">' + localDate + '</p><a class="block-link" a title="Link to: ' + title + '" href="' + href + '"></a></div>';
				} else {
					eventsString = eventsString + '<p><a title="No Countdown Timer - Bad Date - Should be day/month/year. err_code:id10t" href="' + href + '">' + title + '</a></p><p style="float: right"><span class="event-timer' + i + '"></span></p><p align="center"><img src="https://lh3.googleusercontent.com/6Evhp9jZ4ocalVFkHdRWgLkG9XkPrrKT0ATrQN0ruLnQ=w699-h9-no" border=0 width="100%"></p>';
				}
			}
		}

		var eventModuleFinalHTML = '<blockquote class="events-module"><h3><a href="' + upcomingEventsLink + '">' + events.length + ' Cruises Found</a></h3>' + eventsString + '<div class="event-footer"><p>Local time detected as ' + currentLocation.replace(/\+/g, " ") + '<br />Report Widget Bugs to <a title="All your base are belong to PapaSyntax" href="https://www.reddit.com/user/PapaSyntax/">PapaSyntax</a></p></div></blockquote>';

		$("#eventsWidget").html(eventModuleFinalHTML);

		for (var i=0; i < events.length; i++) {
			timerUpdate(i);
		}
	})
})