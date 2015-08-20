# Events sidebar module for r/GTAV_Cruises

Tampermonkey/Greasemonkey userscript that lists upcoming and recent online events for the GTAV subredit [r/GTAV_Cruises](https://www.reddit.com/r/GTAV_Cruises/)

Coded by [u/PapaSyntax](https://www.reddit.com/user/PapaSyntax).

---

> Hi all,
>
> I just deployed a tampermonkey/greasemonkey userscript that I created to display our upcoming cruises/events in a much better way. Tired of reading through all posts to find events, then convert them to your own timezone and figure out when it is? This script does that for you and adds a countdown timer in-line with the title of the event, all conveniently on the right sidebar (as well as a link to go to the full event, and a converted time for when the event is, in your timezone). Just bring up our subreddit page and you'll see all upcoming events quickly and with their own countdown timers.

[See original post on reddit](https://www.reddit.com/r/GTAV_Cruises/comments/3hkafk/events_magic_show_upcoming_cruises_wcountdown/).


**Here is a screenshot of what it looks like:**

![screenshot](http://i.imgur.com/JkF2itF.png)

## Installation

1. First install **[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)** (Google Chrome) or **[Greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/)** (Firefox).

2. Then go to the following address and click the `install` button:

**Userscript Link:**
> https://github.com/JustinHowe/userscripts/raw/master/GTAV_Cruises%20Events%20Magic.user.js


That's it! Just reload the subreddit page and you'll see the cruises/events box appear on the sidebar after a couple of seconds.


## Notes for event hosts

**NOTE - If you are hosting an event, your event title MUST follow this pattern:**

**[Region] | [Date] | [Title] | [GMT] | [Time]**

* DATE: Must be in day/month/year format (ex: 17/8/2015 for August 17, 2015) **NOT** month/day/year, or written out like, "August 20th 2015".

* GMT Timezone: Please post in GMT format (ex: GMT+4). The script will also convert PST/PDT/CST/CDT/EST/EDT/AEST/AEDT, but if you use those, you MUST use the right one. If you use PST yet pacific time is currently in PDT, your event will show as 1-hour off.

* TIME: Please use 24 hour time. The script will do its best to convert 12 hour format to 24, but just use 24 hour to mitigate edge case issues.

* The script does have other fixes to attempt to resolve human formatting errors, but the most important thing is to always use day/month/year for your date.


## How it works

For those who are interested, the script does the following (and ONLY the following):

1. Load our upcoming events search page in a hidden iFrame.

2. Parse through the iFrame page and regex for appropriate capture groups for titles flared with "event".

3. For each event found, break up the title line for all necessary information, then perform calculations on the dates/times/etc to convert the event time(s) and date(s) to true UTC time.

4. Compares the future epoch of that UTC time to the current UTC epoch, which creates a difference, and uses that as the countdown.


**[The code is fully visible on github for the analysis of whomever wishes](https://github.com/JustinHowe/userscripts).**


## Next development steps:

* Enhance counter to dynamically update every second (or more).

* Create overlay for "Create an event" page so that event hosts only need to choose the date, time, etc from dropdown boxes and input fields. This will ensure events are recorded in the correct format for this script to use, as well as ensure hosts enter what is needed but not too much and not too little.

* Create overlay for "Create an event" page so that event hosts only need to choose the date, time, etc from dropdown boxes and input fields. This will ensure events are recorded in the correct format for this script to use, as well as ensure hosts enter what is needed but not too much and not too little.
