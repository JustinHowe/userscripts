// ==UserScript==
// @name         GTAV_Cruises Events Magic
// @namespace    https://github.com/JustinHowe/userscripts/
// @version      0.5
// @description  Events block for GTAV_Cruises
// @author       Syntaximus
// @match        https://www.reddit.com/r/GTAV_Cruises/
// @grant        none
// ==/UserScript==

// Event Title Format: [Region] | [Date] | [Title] | [Timezone] | [Time]

$('<blockquote>
	<h3>Upcoming Cruises</h3>
	<p>
	<a href="http://www.google.com" target="_blank">Event 1</a>
	</p>
	</blockquote>').insertAfter('.tagline');
