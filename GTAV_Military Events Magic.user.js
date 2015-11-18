// ==UserScript==
// @name         GTAV_Military Events Magic
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      2.01
// @description  Events block for GTAV_Military
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Military
// @match        https://www.reddit.com/r/gtav_military
// @match        https://www.reddit.com/r/Gtav_military
// @match        https://www.reddit.com/r/GTAV_Military/*
// @match        https://www.reddit.com/r/gtav_military/*
// @match        https://www.reddit.com/r/Gtav_military/*
// @grant        none
// @require      https://github.com/JustinHowe/userscripts/raw/master/jstz.min.js
// ==/UserScript==

// Event Title Format: [Region] | [Date] | [Title] | [GMT] | [Time]

var countdowns = [];
var dates = [];
var times = [];
var zones = [];
var epochFuture = [];
var day = "d";
var month = "m";
var year = "y";
var continueLoading = false;
var eventData = [];
var goodEvents = [];
var goodEventsCounter = 0;
var badEventsCounter = 0;
var badEventUrl = [];
var events, epochNow;
var updateCounter = 0;
var finishedCounter = 0;
var noEvents = false;

// Comment to enable console logging.
console.log = function() {}

// Image Preload
function preload(arrayOfImages) {
	$(arrayOfImages).each(function(){
		$('<img/>')[0].src = this;
	});
}
preload(['https://raw.githubusercontent.com/JustinHowe/userscripts/master/military-background.jpg']);

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Update the countdown timer on the selected event
function timerUpdate(n) {
	var timerString = "timer" + n;
	epochNow = Math.floor(Date.now()/1000);
	countdowns[n] = epochFuture[n] - epochNow;
	if (!isNaN(countdowns[n])) {
		s = countdowns[n]%60;
		m = (countdowns[n]-s)/60%60;
		h = ((countdowns[n]-s)/60 - m)/60%24;
		d = (((countdowns[n]-s)/60 - m)/60 - h)/24;
		var txt;
		var inProgress = false;
		if (d == 1) {
			var textDays = " Day, ";
		} else {
			var textDays = " Days, ";
		}
		if (h == 1) {
			var textHours = " Hr";
		} else {
			var textHours = " Hrs";
		}
		// DAYS HRS MIN
		if (d > 0) {
			txt = "Starts in " + d + textDays + h + textHours + ", " + m + " Min";
			$("#event-block-" + n).addClass("state-upcoming");
		}
		// HRS MIN
		if ((d == 0) && (h > 0) && (m > 0)) {
			txt = "Starts in " + h + textHours + ", " + m + " Min";
			$("#event-block-" + n).addClass("state-upcoming");
		}
		// HRS
		if ((d == 0) && (h > 0) && (m == 0)) {
			txt = "Starts in " + h + textHours;
			$("#event-block-" + n).addClass("state-upcoming");
		}
		// MIN
		if ((d == 0) &&(h == 0) && (m > 0)) {
			txt = "Starts in " + m + " Min";
			$("#event-block-" + n).addClass("state-upcoming");
		}
		// DAYS MIN
		if ((d > 0) &&(h == 0) && (m > 0)) {
			txt = "Starts in " + d + textDays + m + " Min";
			$("#event-block-" + n).addClass("state-upcoming");
		}
		// DAYS HRS
		if ((d > 0) &&(h > 0) && (m == 0)) {
			txt = "Starts in " + d + textDays + h + textHours;
			$("#event-block-" + n).addClass("state-upcoming");
		}
		// IN PROGRESS
		if ((d == 0) && ((h >= -1) && (h <= 0)) && (m <= 0)) {
			txt = 'Just Started';
			if ((h == 0) && (m < 0)) {
				m = m.toString().replace(/\-/, "");
				txt = 'Started ' + m + " Min ago";
			}
			if (h == -1) {
				h = h.toString().replace(/\-/, "");
				if (m == 0) {
					txt = 'Started ' + h + " Hr ago";
				} else {
					m = m.toString().replace(/\-/, "");
					txt = 'Started ' + h + " Hr, " + m + " Min ago";
				}
			}
			$("#event-block-" + n).addClass("state-progress");
			inProgress = true;
		}
		// FINISHED
		if ((m < 0) && !inProgress) {
			txt = 'Finished';
			$("#event-block-" + n).removeClass("state-progress").addClass("state-finished");
			$("#event-block-" + n).hide();
		}
		document.getElementById(timerString).innerHTML = "<strong>" + txt + "</strong>";
		console.log("Updated Timer #" + n + " Value to: " + txt);
	} else {
		$("#event-block-" + n).removeClass("state-progress, state-upcoming").addClass("state-warning");
		var badDateTxt = dates[n] + ' @ ' + times[n] + ' ' + zones[n];
		document.getElementById(timerString).innerHTML = badDateTxt;
		console.log("Updated Timer #" + n + " Value with BAD date: " + badDateTxt);
	}
}

// Refresh countdown loop and run checkFinished()
function refreshTimer() {
	updateCounter++;
	console.log("Timer refresh iteration #" + updateCounter);
	for (var i=0; i < goodEvents.length; i++) {
		timerUpdate(i);
	}
	checkFinished();
}

// Check number of events finished and update Header string
function checkFinished() {
	var finishedCounter = 0;
	for (var n = 0; n < goodEvents.length; n++) {
		if ($('#timer' + n + ':contains("Finished")').length > 0) {
			finishedCounter++;
		}
	}
    
    var newHeaderCounter = goodEvents.length - finishedCounter;

	if (finishedCounter != 0) {
		console.log(finishedCounter + " Events Finished, Changing Header to " + newHeaderCounter + " Events");
		$("#eventsHeader").text(newHeaderCounter + ' Events Found');
	}
    
    if (finishedCounter == goodEvents.length) {
    	noEvents = true;
         $("#eventsHeader").text("At Ease, Soldier!");
         $("#topBodyText").text("");
		 $("#eventsContent").replaceWith('<div id="eventsContent"><p align="center"><strong><span style="color:#48a948; font-size:150%">No Events Found.</span> <br /><br /><span style="color:#48a948; font-size:100%">Liven things up and create one!</span></strong></p></div>');
    }
    
    if ((newHeaderCounter == 1) && !noEvents) {
        $("#eventsHeader").text(newHeaderCounter + ' Event Found');
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

	var jstzTimezone = jstz.determine();
	var currentTimezone = jstzTimezone.name();
	var currentLocation = currentTimezone.split("/");
	currentLocation = currentLocation[1].replace(/\_/g, "+");
	var upcomingEventsLink = "https://www.reddit.com/r/GTAV_Military/search?q=flair%3A%22event%22&restrict_sr=on&sort=new&t=all#res-hide-options";

	var eventOpenSansCSS = '<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700italic,700" rel="stylesheet" type="text/css">';
	var eventModuleCSS = '<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/JustinHowe/userscripts/master/event-module-military.css" media="all">';
	var eventAttendanceCSS = '<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/JustinHowe/userscripts/master/event-attendance-military.css" media="all">';
	var eventModuleHTML = '<div id="eventsWidget"><h2><strong><a id="eventsHeader" href="' + upcomingEventsLink + '">Events loading...</a></strong></h2><div class="events-module" style="text-align:center; width:285px;"><p id="topBodyText"><strong>Countdown timers auto-update</strong></p><div id="eventsContent"></div><div id="footer"><strong>Local time detected as ' + currentLocation.replace(/\+/g, " ") + '<br />Report widget bugs to <a title="All your base are belong to PapaSyntax" href="https://www.reddit.com/user/PapaSyntax/" target="_blank">PapaSyntax</a></strong></div></div></div>';

	$("head").append(eventOpenSansCSS + eventModuleCSS + eventAttendanceCSS);
	$(".side .md").prepend(eventModuleHTML);

	var countdownHref;
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

		// Get events from iframe
		events = $("#eventsiFrame").contents().find("header.search-result-header > span").filter(function() { return ($(this).text() === 'Event') }).next();
		console.log("Events Found: " + events.length);

		// Do initial format check and store found events
		for (var j = 0; j < events.length; j++) {
			var tempEvent = events[j].innerHTML;
			tempEvent = tempEvent.replace(/[^\|]/g, "").length;
			if (tempEvent == 4) {
				goodEvents[goodEventsCounter] = events[j];
				goodEventsCounter++;
			} else {
				badEventsCounter++;
				var badEventIndex = badEventsCounter - 1;
				badEventUrl[badEventIndex] = [$(events[j]).text(), $(events[j]).attr('href')];
			}
		}

		// Check for bad formated events and print them separately
		if (badEventsCounter > 0) {
			var errorCruise = "Events";
			if (badEventsCounter == 1) {
				errorCruise = "Event";
			}

			for (var k = 0; k < badEventUrl.length; k++) {
				$("#footer").prepend('<p class="event-block state-warning"><a href="' + badEventUrl[k][1] + '" target="_blank">' + badEventUrl[k][0] + '</a><a class="block-link" href="' + badEventUrl[k][1] + '" target="_blank"></a></p>');
			}

			$("#footer").prepend('<p class="events-error">Omitting ' + badEventsCounter + ' ' + errorCruise + ' - Invalid title format:</p>');
		}

		console.log("Good Events Found: " + goodEvents.length);
		console.log("Bad Events Found: " + badEventsCounter);

		if (goodEvents.length < 1) {
            $("#eventsHeader").text("At Ease, Soldier!");
            $("#topBodyText").text("");
			$("#eventsContent").replaceWith('<div id="eventsContent"><p align="center"><strong><span style="color:#48a948; font-size:150%">No Events Found.</span> <br /><br /><span style="color:#48a948; font-size:100%">Liven things up and create one!</span></strong></p></div>');
		} else {
            if (goodEvents.length == 1) {
                $("#eventsHeader").text(goodEvents.length + ' Event Found');
            } else {
                $("#eventsHeader").text(goodEvents.length + ' Events Found');
            }
			continueLoading = true;
		}

		// Date and time conversion wizardry
		if (continueLoading) {
			for (var i=0; i < goodEvents.length; i++) {
				var eventString = goodEvents[i].innerHTML;
				var wellFormedEvent = eventString.replace(/[^\|]/g, "").length;
				if (wellFormedEvent == 4) {
					eventString = eventString.replace(/\[/g, "");
					eventString = eventString.replace(/\]/g, "");
					console.log("Event String: " + eventString);
					var href = $(goodEvents[i]).attr('href');
					var eventParts = eventString.split("|");
					var region = eventParts[0];

					//Determine date parts
					var date = eventParts[1];
					dates[i] = eventParts[1];
					date = eventParts[1].replace(/\-/g, "/");
					console.log("Date: " + date);
					if (date.indexOf("/") >= 0) {
						date = date.split("/");
						day = parseInt(date[1], 10);
						month = parseInt(date[0], 10);

						if (month > 12) {
							day = parseInt(date[0], 10);
							month = parseInt(date[1], 10);
						}

						if (!date[2]) {
							year = new Date().getFullYear();
						} else {
							year = date[2];
                            var yearFirstChar = year.charAt(0);

                            if (yearFirstChar != "2") {
                                year = "20" + year;
                            }
                            year = parseInt(year, 10);
						}
                        
						

						var monthCurrentEpoch = Date.now();
						var monthAheadEpoch = (monthCurrentEpoch + 2678400000)/1000;
						var eventEpoch = Date.UTC(year,month-1,day,12,0)/1000;
						console.log("Date Epochs: " + monthAheadEpoch + " / " + eventEpoch);

						if (eventEpoch > monthAheadEpoch) {
							day = parseInt(date[0], 10);
							month = parseInt(date[1], 10);
						}

					}

					if ((date.indexOf("/") < 0) && (date.indexOf("2015") >= 0)) {
						getBadDate(date.toLowerCase());
					}

					//var title = toTitleCase(eventParts[2]); //Convert to lowercast starting with 2nd character of each word
					var title = eventParts[2];
					var titleShort;

					//Log original time and timezone
					console.log("Event title: " + title + " - " + eventParts[4] + " - " + day + "/" + month + "/" + year + " - " + eventParts[3]);

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
						if (hour < 12) {
							hour = hour + 12;
						}
					}

					console.log("24hr Hour: " + hour);

					var timezone = eventParts[3];
					zones[i] = timezone;

					//Get daylight savings time epochs
					var dayDSTStart;
					var monthDSTStart;
					var dayDSTStop;
					var monthDSTStop;

					if (year == 2015) {
						dayDSTStart = 8;
						monthDSTStart = 3;
						dayDSTStop = 1;
						monthDSTStop = 11;
					}

					if (year == 2016) {
						dayDSTStart = 13;
						monthDSTStart = 3;
						dayDSTStop = 6;
						monthDSTStop = 11;
					}

					if (year == 2017) {
						dayDSTStart = 12;
						monthDSTStart = 3;
						dayDSTStop = 5;
						monthDSTStop = 11;
					}

					if (year == 2018) {
						dayDSTStart = 11;
						monthDSTStart = 3;
						dayDSTStop = 4;
						monthDSTStop = 11;
					}

					if (year == 2019) {
						dayDSTStart = 10;
						monthDSTStart = 3;
						dayDSTStop = 3;
						monthDSTStop = 11;
					}

					if (year == 2020) {
						dayDSTStart = 8;
						monthDSTStart = 3;
						dayDSTStop = 1;
						monthDSTStop = 11;
					}

					var epochDSTStart;
					var epochDSTStop;
					epochNow = Date.now();
					console.log("Epoch Now: " + epochNow);

					if ((timezone.toLowerCase().indexOf("pst") >= 0) || (timezone.toLowerCase().indexOf("pdt") >= 0)) {
						epochDSTStart = Date.UTC(year,monthDSTStart-1,dayDSTStart,09,00);
						epochDSTStop = Date.UTC(year,monthDSTStop-1,dayDSTStop,09,00);
						console.log("Epoch DST Start: " + epochDSTStart);
						console.log("Epoch DST Stop: " + epochDSTStop);
						if ((epochNow >= epochDSTStart) && (epochNow <= epochDSTStop)) {
							timezone = "UTC-7";
						} else {
							timezone = "UTC-8";
						}
						console.log("Timezone Converted: ")
					}

					if ((timezone.toLowerCase().indexOf("edt") >= 0) || (timezone.toLowerCase().indexOf("est") >= 0)) {
						epochDSTStart = Date.UTC(year,monthDSTStart-1,dayDSTStart,12,00);
						epochDSTStop = Date.UTC(year,monthDSTStop-1,dayDSTStop,12,00);
						console.log("Epoch DST Start: " + epochDSTStart);
						console.log("Epoch DST Stop: " + epochDSTStop);
						if ((epochNow >= epochDSTStart) && (epochNow <= epochDSTStop)) {
							timezone = "UTC-4";
						} else {
							timezone = "UTC-5";
						}
					}

					if ((timezone.toLowerCase().indexOf("cdt") >= 0) || (timezone.toLowerCase().indexOf("cst") >= 0)) {
						epochDSTStart = Date.UTC(year,monthDSTStart-1,dayDSTStart,11,00);
						epochDSTStop = Date.UTC(year,monthDSTStop-1,dayDSTStop,11,00);
						console.log("Epoch DST Start: " + epochDSTStart);
						console.log("Epoch DST Stop: " + epochDSTStop);
						if ((epochNow >= epochDSTStart) && (epochNow <= epochDSTStop)) {
							timezone = "UTC-5";
						} else {
							timezone = "UTC-6";
						}
					}

					if ((timezone.toLowerCase().indexOf("aedt") >= 0) || (timezone.toLowerCase().indexOf("aest") >= 0)) {
						epochDSTStart = Date.UTC(year,monthDSTStart-1,dayDSTStart,20,00);
						epochDSTStop = Date.UTC(year,monthDSTStop-1,dayDSTStop,20,00);
						console.log("Epoch DST Start: " + epochDSTStart);
						console.log("Epoch DST Stop: " + epochDSTStop);
						if ((epochNow >= epochDSTStart) && (epochNow <= epochDSTStop)) {
							timezone = "UTC+11";
						} else {
							timezone = "UTC+10";
						}
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

					epochFuture[i] = Date.UTC(year,month-1,day,convertedHour,minute);
					console.log("Future Epoch Before MS: " + epochFuture[i]);
					epochFuture[i] = Math.floor(epochFuture[i]/1000);
					//epochFuture = 1440050400;
					epochNow = Math.floor(Date.now()/1000);
					countdowns[i] = epochFuture[i] - epochNow;

					if (!isNaN(countdowns[i])) {
						var localDate = new Date(epochFuture[i]*1000);
						var localDateString = localDate.toString().substring(0,21);
						localDateString = localDateString.split(" ");
						var localDayString = localDateString[0];
						var localMonth = localDateString[1];
						var localDay = localDateString[2];
						var localTimeHr = localDate.getHours();
						console.log("Local Hour: " + localTimeHr);
						var localTimeMin = localDate.getMinutes();
						var amPm;
						if (localTimeHr < 12) {
							amPm = " AM";
						}
						if (localTimeHr > 12) {
							localTimeHr = localTimeHr - 12;
							amPm = " PM";
						}
						if (localTimeHr == 12) {
							amPm = " PM";
						}
						if (localTimeHr == 0) {
							localTimeHr = "12";
						}
						if (localTimeMin < 10) {
							localTimeMin = "0" + localTimeMin;
						}
						localDate = localDayString + " " + localMonth + " " + localDay + " @ " + localTimeHr + ":" + localTimeMin + "" + amPm;
						console.log(localDate);
						eventData[i] = [epochFuture[i], '<div id="event-block-' + i + '" class="event-block"><p class="event-title"><a title="Link to: ' + title + '" href="' + href + '">' + title + '</a></p><p id="timer' + i + '" class="event-timer"></p><p class="event-local-date">' + localDate + '</p><a class="block-link" a title="Link to: ' + title + '" href="' + href + '"></a></div>'];
					} else {
						eventData[i] = [9999999999, '<div id="event-block-' + i + '" class="event-block"><p class="event-title"><a title="No Countdown Timer - Bad Date - Should be day/month/year. err_code:id10t" href="' + href + '">' + title + '</a></p><p id="timer' + i + '" class="event-timer"></p><p class="event-local-date">' + localDate + '</p><a class="block-link" a title="No Countdown Timer - Bad Date - Should be day/month/year. err_code:id10t" href="' + href + '"></a></div>'];
					}
				}
			}

			eventData.sort(function(a,b) {
				return b[0]-a[0]
			});

			for (var n = 0; n < goodEvents.length; n++) {
				$("#eventsContent").prepend(eventData[n][1]);
			}

			refreshTimer();
			checkFinished();

			setInterval(refreshTimer, 30000);
		}
	})
})
