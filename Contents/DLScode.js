// Version 3.1	February 5, 2016

/*property
	Apr, Aug, Dec, Feb, Fri, Jan, Jul, Jun, Mar, May, Mon, Nov, Oct, Sat, Sep,
	Sun, Thu, Tue, UTC, Wed, debug, floor, forEach, getDay, getTime,
	getUTCFullYear, getUTCMonth, indexOf, parse, readFile, some, split,
	substring, toUTCString
*/

//////////////////////////////////// Daylight Saving Time Code /////////////////////////////////////

"use strict";

var eprint = function (s) {
	if (widget.debug === "on") {
		print(s);
	}
	return;
};

var lprint = function (s) {
	if (widget.debug === "on") {
		log(s);
	}
	return;
};

function getDLSrules(path) {
	// ["US", "Apr", "Sun>=1", "120", "60", "Oct", "lastSun", "60"]
	var ruleList = filesystem.readFile(path).split(/\r\n?|\n/);
	var rules = [];

	ruleList.forEach(function (ele, i) {
		rules[i] = JSON.parse(ele);
	});
	return rules;
}

var DLSrules = getDLSrules("Resources/DLSRules.txt");

//var gTheStart = "";
//var gTheEnd = "";


function numberOfMonth(month) {
	var months = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11};
	var i;

	i = months[month];
	if (i !== undefined) {
		return i;
	}

	eprint("numberOfMonth: " + month + " is not a valid month name");
	return -1;
}

function numberOfDay(day) {
	var days = {Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6};
	var i;

	i = days[day];
	if (i !== undefined) {
		return i;
	}

	eprint("numberOfDay: " + day + " is not a valid day name");
	return -1;
}

function getDaysIn(month, year) {
	var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (month !== 1) {
		return monthDays[month];
	}
	if ((year % 4) !== 0) {
		return 28;
	}
	if ((year % 400) === 0) {
		return 29;
	}
	if ((year % 100) === 0) {
		return 28;
	}
	return 29;
}

function getDateOfFirst(dayName, date, monthName, year) {
	// get Date (1..31) Of First dayName (Sun..Sat) after date (1..31) of monthName (Jan..Dec) of year (2004..)
	// dayName:		Sun, Mon, Tue, Wed, Thu, Fr, Sat
	// monthName:	Jan, Feb, etc.

	var day = numberOfDay(dayName);
	var month = numberOfMonth(monthName);
	var last = date + 6;
	var d = new Date(year, month, last);
	var lastDay = d.getDay();

	return last - (lastDay - day + 7) % 7;
}

function getDateOfLast(dayName, monthName, year) {
	// get Date (1..31) Of Last dayName (Sun..Sat) of monthName (Jan..Dec) of year (2004..)
	// dayName:		Sun, Mon, Tue, Wed, Thu, Fr, Sat
	// monthName:	Jan, Feb, etc.

	var day = numberOfDay(dayName);
	var month = numberOfMonth(monthName);
	var last = getDaysIn(month, year);
	var d = new Date(year, month, last);
	var lastDay = d.getDay();

	return last - (lastDay - day + 7) % 7;
}

function dayOfMonth(monthName, dayRule, year) {
	var dayName;
	var date;
	var day = parseInt(dayRule, 10);

	if (!isNaN(day)) {
		return day;
	}
	// dayRule of form lastThu or Sun>=15
	if (dayRule.indexOf("last") === 0) {	// dayRule of form lastThu
		dayName = dayRule.substring(4);
		return getDateOfLast(dayName, monthName, year);
	}
	// dayRule of form Sun>=15
	dayName = dayRule.substring(0, 3);
	date = Number(dayRule.substring(5));
	return getDateOfFirst(dayName, date, monthName, year);
}

function theDLSdelta(rule, cityTimeOffset) {
	// ["US","Apr","Sun>=1","120","60","Oct","lastSun","60"];
	var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var arrayNumber;
	var startMonth;
	var startDay;
	var startTime;
	var delta;
	var endMonth;
	var endDay;
	var endTime;
	var useUTC;
	var theDate;
	var startYear;
	var endYear;
	var currentMonth;
	var newMonthNumber;
	var startDate;
	var endDate;
	var stdTime;
	var theGMTOffset;
	var startHour;
	var startMin;
	var theStart;
	var endHour;
	var endMin;
	var theEnd;
	var dlsRule;

	lprint("theDLSdelta(" + rule + ", " + cityTimeOffset + ")");

	if (rule === "NONE") {	// DLS not in operation
//		gTheStart = "";
//		gTheEnd = "";
		return 0;
	}

	if (!DLSrules.some(function (ele, idx) {
		arrayNumber = idx;
		return ele[0] === rule;
	})) {
		eprint("DLSdelta: " + rule + " is not in the list of DLS rules.");
		return 0;
	}

	dlsRule = DLSrules[arrayNumber];

	startMonth = dlsRule[1];
	startDay = dlsRule[2];
	startTime = dlsRule[3];
	delta = dlsRule[4];
	endMonth = dlsRule[5];
	endDay = dlsRule[6];
	endTime = dlsRule[7];

	useUTC = (startTime < 0) && (endTime < 0);	// negative times for UTC transitions

	if (useUTC) {
		startTime = 0 - startTime;
		endTime = 0 - endTime;
	}

	eprint("Rule:		" + rule);
	eprint("startMonth: " + startMonth);
	eprint("startDay:	" + startDay);
	eprint("startTime:	" + startTime);
	eprint("delta:		" + delta);
	eprint("endMonth:	" + endMonth);
	eprint("endDay:		" + endDay);
	eprint("endTime:	" + endTime);
	eprint("useUTC:		" + useUTC);

	theDate = new Date();
	startYear = theDate.getUTCFullYear();
	endYear = startYear;

	if (numberOfMonth(startMonth) >= 6) {			// Southern Hemisphere
		currentMonth = theDate.getUTCMonth();
		if (currentMonth >= 6) {
			endYear += 1;
		} else {
			startYear -= 1;
		}
	}

	if (startTime < 0) {
		startTime = 0 - startTime;
	}	// ignore invalid sign

	startDate = dayOfMonth(startMonth, startDay, startYear);
	if (startDate === 0) {
		return 0;
	}

	endDate = dayOfMonth(endMonth, endDay, endYear);
	if (endDate === 0) {
		return 0;
	}

	if (endTime < 0) {	// transition on previous day in standard time
		endTime = 0 - endTime;
		endDate = endDate - 1;
		endTime = 1440 - endTime;
		if (endDate === 0) {
			newMonthNumber = numberOfMonth(endMonth) - 1;
			endMonth = monthName[newMonthNumber];
			endDate = getDaysIn(newMonthNumber, endYear);
		}
	}

	eprint("startDate:	" + startMonth + " " + startDate + "," + startYear);
	eprint("startTime:	" + (startTime - startTime % 60) / 60 + ":" + startTime % 60);
	eprint("endDate:	" + endMonth + " " + endDate + "," + endYear);
	eprint("endTime:	" + (endTime - endTime % 60) / 60 + ":" + endTime % 60);

	theGMTOffset = 60000 * cityTimeOffset;	  // was preferences.cityTimeOffset.value;

	theDate = new Date();
	stdTime = theDate.getTime();
	eprint("stdTime=" + stdTime);

	startHour = Math.floor(startTime / 60);
	startMin = startTime % 60;

	eprint("----");
	eprint("startYear=" + startYear);
	eprint("numberOfMonth=" + numberOfMonth(startMonth));
	eprint("startDate=" + startDate);
	eprint("startHour=" + startHour);
	eprint("startMin=" + startMin);

	theStart = Date.UTC(startYear, numberOfMonth(startMonth), startDate, startHour, startMin, 0, 0);
	if (!useUTC) {
		theStart -= theGMTOffset;
	}

	eprint("theStart=	" + theStart);
	eprint("theStartUTC=" + (new Date(theStart)).toUTCString());

	endHour = Math.floor(endTime / 60);
	endMin = endTime % 60;

	eprint("----");
	eprint("endYear=" + endYear);
	eprint("numberOfMonth=" + numberOfMonth(endMonth));
	eprint("endDate=" + endDate);
	eprint("endHour=" + endHour);
	eprint("endMin=" + endMin);

	theEnd = Date.UTC(endYear, numberOfMonth(endMonth), endDate, endHour, endMin, 0, 0);
	if (!useUTC) {
		theEnd -= theGMTOffset;
	}

	eprint("theEnd=	  " + theEnd);
	eprint("theEndUTC=" + (new Date(theEnd)).toUTCString());

//	gTheStart = (new Date(theStart + theGMTOffset)).toUTCString().split(" ", 5).join(" ") + " LST";
//	gTheEnd = (new Date(theEnd + theGMTOffset + 60000 * delta)).toUTCString().split(" ", 5).join(" ") + " DST";

	if (stdTime < theStart) {
		eprint("DLS starts in " + Math.floor((theStart - stdTime) / 60000) + " minutes.");
	} else if (stdTime < theEnd) {
		eprint("DLS ends in	  " + Math.floor((theEnd - stdTime) / 60000) + " minutes.");
	}

	if ((theStart <= stdTime) && (stdTime < theEnd)) {
		eprint("----DLSdelta=" + delta);
		return Number(delta);
	} else {
		eprint("----DLSdelta=0");
		return 0;
	}
}

///////////////////////////////// End of Daylight Saving Time Code /////////////////////////////////

/*
eprint("Denver, Colorado");
eprint(theDLSdelta("US", -420));	 // Denver, Colorado
eprint("--");

eprint("Sydney, New South Wales");
eprint(theDLSdelta("AU-NSW", 600));	 // Sydney, New South Wales
eprint("--");

eprint("Wellington, New Zealand");
eprint(theDLSdelta("NZ", 720));	  // Wellington, New Zealand
*/