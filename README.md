# Events sidebar widget for r/GTAV_Cruises

Tampermonkey/Greasemonkey userscript that lists upcoming, in progress and recent online events for the GTAV subredit [r/GTAV_Cruises](https://www.reddit.com/r/GTAV_Cruises/)

**Coded by** [u/PapaSyntax](https://www.reddit.com/user/PapaSyntax).

**GUI created by** [u/Yogensya](https://www.reddit.com/user/Yogensya).&nbsp;
---
> Hi all,
>
> Hi all, I just deployed a tampermonkey/greasemonkey userscript that I created to display our upcoming cruises/events in a much better way. Tired of reading through all posts to find events, then converting them to your own timezone and figuring out when they are? This script does that for you and adds a countdown timer in-line with the title of the event, all conveniently on the right sidebar (as well as a link to go to the full event, and a converted time for when the event is in your timezone, and more). Just bring up our subreddit page and you'll see all upcoming events quickly and with their own countdown timers.

[See original post on reddit](https://www.reddit.com/r/GTAV_Cruises/comments/3hkafk/events_magic_show_upcoming_cruises_wcountdown/).

---
## Features

* Displays ALL upcoming and in-progress events/cruises in right-sidebar above Welcome section, on all pages of our subreddit.

* Event posted time converted to your local time.

* Automatic chronological sorting of events, soonest event(s) first.

* Countdown timers for each event.

* Countdown timers automatically update ever 30 seconds.

* Your local date and time of event shown underneath countdown timer.

* Event(s) convert to "In Progress" status, with custom GUI styling, when countdown timer reaches zero.

* Event(s) convert to "Finished" status, which hides the entire event, if countdown timer has been in "In Progress" status for 2 hours.

* Error handling for invalid event titles (which are not formatted correctly). Invalid event titles are displayed at the bottom, indicating the number of events omitted as well as their title(s) and link(s) to event(s).


**Here is a screenshot of what it looks like:**

![screenshot](http://i.imgur.com/agvyvbd.png)
---
## Installation

1. First install **[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)** (Google Chrome) or **[Greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/)** (Firefox).

2. Then **[click here to open the script](https://github.com/JustinHowe/userscripts/raw/master/GTAV_Cruises%20Events%20Magic.user.js)** and click the `install` button.

That's it! Just reload the subreddit page and you'll see the cruises/events box appear on the sidebar after a couple of seconds.

---
## Notes for event hosts

**NOTE - If you are hosting an event, your event title MUST follow this pattern:**

**[Region] | [Date] | [Title] | [GMT] | [Time]**

* **DATE:** Must be in day/month/year format (ex: 17/8/2015 for August 17, 2015) **DO NOT USE** month/day/year, or written out like, "August 17th 2015".

* **GMT Timezone:** Please post in GMT format (ex: GMT4). The script will also convert PST/PDT/CST/CDT/EST/EDT/AEST/AEDT, but if you use those, you MUST use the right one. If you use PST yet pacific time is currently in PDT, your event will show as 1-hour off.

* **TIME:** Please use 24 hour time. The script will do its best to convert 12 hour format to 24, but just use 24 hour to mitigate edge case issues.

* The script does have other fixes to attempt to resolve human formatting errors, but plase follow these guideline to minimize possible issues. **The most important thing is to always use day/month/year for your date.**

---
## How it works

For those who are interested, the script does the following (and ONLY the following):

1. Load our upcoming events search page in a hidden iFrame.

2. Parse through the iFrame page and regex for appropriate capture groups for titles flared with "event".

3. For each event found, break up the title line for all necessary information, then perform calculations on the dates/times/etc to convert the event time(s) and date(s) to true UTC time.

4. Compares the future epoch of that UTC time to the current UTC epoch, which creates a difference, and uses that as the countdown.


**[The code is fully visible on github for the analysis of whomever wishes](https://github.com/JustinHowe/userscripts).**

---
## Next development steps:

* Create overlay for "Create an event" page so that event hosts only need to choose the date, time, etc from dropdown boxes and input fields. This will ensure events are recorded in the correct format for this script to use, as well as ensure hosts enter what is needed but not too much and not too little.

---
## Changelog:

* Added "In Progress" and "Finished" statuses to replace countdown if condition(s) met. In Progress will show for the first two hours of an event since starting.

* Added loading text while events are loading and changed widget to appear immediately after page load.

* Added the ability for the script to read dates that are written out (ex: August 20th 2015).

* Added the ability to check if somebody goes full-retard on their event title, completely ignoring the glaring specifications of how to post an event and just does their own thing. Those events will be fully excluded from the widget.

* Added a comparison so that if the date provided in the event title, such as 8/11/2015 (which the script reads as November 8th 2015), is greater than 31 days in the future, to switch the first two values around so it's 11/8/2015 which is the correct format (August 11th 2015). Thanks to /u/lords8n [5] for the idea on this one! This and a couple other changes I made should cut down on human error causing problems with the widget.

* Added more conditional handling for poorly formatted event titles. As human stupidity prevails when creating event titles, the script is bound to keep breaking until a fix to address the new convoluted event title is pushed. In time it will have covered everything possible I'm sure.

* Added automatic chronological sorting so that the soonest events show higher on the list.

* Added auto-hide from list if event is finished.

* Changed the way events are added to the widget so that if one fails (due to poorly formatted title by the host), it will still show the events processed up to that point instead of showing none.

* Added new GUI to widget (thanks /u/Yogensya for creating the new look!).

* Widget now shows on all pages (thanks /u/Yogensya!).

* Modified local time display of event (bottom of each event block) to 12hr format instead of 24hr format.

* v1.51 | REAL TIME UPDATING DONE! Every 30 seconds the countdown timers will auto update to the current time remaining.

* v1.56 | Bug fixes.

* v1.60 | Bug fixes.

* v1.62 | Added new GUI styling for when an event has a poorly formatted date (thanks /u/Yogensya).

* v1.73 | Added better handling for when an event title is incorrectly formatted. Such events will now be completely ignored, and a red text will show below the events blocks stating, "Omitting x cruises - Invalid title format". This should eliminate any issues with the widget not working correctly when somebody submits an event with an incorrectly formatted title.

* v1.74 | Bug fix with header "n Cruises Found" incorrectly calculating on countdown timer auto-update intervals.

* v1.76 | Added display of link(s) for events with invalid title formats, underneath "Omitting..." text.

* v1.77 | Cosmetic change in code.

* v1.78 | Cosmetic changes in code and better comment documentation.