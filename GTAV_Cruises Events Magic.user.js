// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    http://your.homepage/
// @version      0.4
// @description  enter something useful
// @author       You
// @match        https://www.reddit.com/r/GTAV_Cruises
// @grant        none
// ==/UserScript==

// Event Title Format: [Region] | [Date] | [Title] | [Timezone] | [Time]

$('<blockquote>
	<h3>Upcoming Cruises</h3>
	<p>
	<a href="http://www.google.com" target="_blank">Event 1</a>
	</p>
	</blockquote>').insertAfter('.tagline');
