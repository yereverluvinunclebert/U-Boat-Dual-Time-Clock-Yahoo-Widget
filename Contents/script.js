/*
	U Boat Clock Widget

	Created by Dean Beedell
	Original clock concept by Weissboard
	Visuals adapted from KJC66's XWidget
	Re-coded by Dean Beedell
	Visuals added to and enhanced by Dean Beedell
	Sorted by Harry Whitfield

	email: dean.beedell@lightquick.co.uk
	http//lightquick.co.uk
*/

/*jslint multivar, this */

/*property
    MouseWheelPref, altKey, busy, clockFaceSwitchPref, clockSize, ctrlKey,
    data, duration, ease, endAngle, floor, getDate, getHours, getMilliseconds,
    getMinutes, getSeconds, getTime, getTimezoneOffset, hOffset,
    hRegistrationPoint, height, kEaseOut, length, mainDLSPref, match,
    maxLength, milliseconds, minLength, onMouseDown, onMouseUp, onMouseWheel,
    opacity, option, optionListPref1, optionListPref2, platform, readFile,
    rotation, round, scrollDelta, secyDLSPref, setTime, size, soundPref, split,
    src, srcHeight, srcWidth, start, startAngle, startTime, ticks, toFixed,
    toString, tooltip, vOffset, vRegistrationPoint, value, visible, width
*/

"use strict";

var mainWindow, background, background2, surround, switchFaces, dateText, secondText,
		hourHand, hourShadow, minuteHand, minuteShadow, secondHand, secondShadow,
		swMinuteHand, swHourHand, swSecondHand, bigReflection, windowReflection,
		startButton, stopButton, pin, prefs, uboatHelp, helpbutton, tickSwitch,
		createLicence, setmenu, theDLSdelta, lprint, smallHourHand, smallMinuteHand,
		helpButton, showFace, mainScreen, settooltip, checkLockWidget;

var windowx = 745, windowy = 622;
var backxo = 0, backyo = 0, backgroundxo = 0, backgroundyo = 0;
var background2xo = 0, background2yo = 0;
var surroundxo = 0, surroundyo = 0;
var switchFacesxo = 4, switchFacesyo = 237;
var startButtonxo = 0, startButtonyo = 0;
var stopButtonxo = 0, stopButtonyo = 400;
var secondxo = 416, secondyo = 313, secondxr = 11.5, secondyr = 245.5;
var secondshadowxo = 416, secondshadowyo = 313, secondshadowxr = 22.5, secondshadowyr = 260.5;

var datetextxo = 527, datetextyo = 416;
var secondtextxo = 325, secondtextyo = 210;

var swSecondxo = 525, swSecondyo = 312, swSecondxr = 46.5, swSecondyr = 57;
var swMinutexo = 416, swMinuteyo = 204, swMinutexr = swSecondxr, swMinuteyr = swSecondyr;
var swHourxo = 416, swHouryo = 420, swHourxr = 47, swHouryr = 61;

var shadowOffset = 0;
var hourxo = 416, houryo = secondyo, hourxr = 14, houryr = 163;
var hourshadowxo = 414, hourshadowyo = 320, hourshadowxr = 14, hourshadowyr = 173;
var minshadowxo = 425, minshadowyo = 320, minshadowxr = 14, minshadowyr = 215;
var minxo = 416, minyo = secondyo, minxr = 14, minyr = 215;

var smallhourxo = 498, smallhouryo = 236, smallhourxr = swSecondxr, smallhouryr = swSecondyr;
var smallminutexo = 350, smallminuteyo = 381, smallminutexr = swSecondxr, smallminuteyr = swSecondyr;

var bigReflectionxo = 169, bigReflectionyo = 69;
var windowReflectionxo = 511, windowReflectionyo = 210;

var pinxo = 117, pinyo = 203;
var prefsxo = 117, prefsyo = 373;
var uboatHelpxo = 1, uboatHelpyo = 1;
var helpButtonxo = 595, helpButtonyo = 504;
var tickSwitchxo = 600, tickSwitchyo = 74;

var stopWatchState = 0;
var startTime, elapsedTime;
var widgetName = "UBOAT.widget";

var remoteGMTOffset1;
var remoteGMTOffset2;
var tzDelta1;
var tzDelta2;

var tzData;
var dlsData;

var debugFlg = "";

var counter = "Resources/sounds/counter.mp3";
var lock = "Resources/sounds/lock.mp3";
var till = "Resources/sounds/till01.mp3";
var ting = "Resources/sounds/ting.mp3";
var mistake = "Resources/sounds/mistake.wav";
var thhhh = "Resources/sounds/thhhh.mp3";
var winding = "Resources/sounds/winding.mp3";

include("json2.js");
include("DLScode.js");
include("functions.js");
include("Resources/Licence/licence.js");

tzData = filesystem.readFile("Resources/timezones.txt");
preferences.optionListPref1.option = tzData.split(/\r\n?|\n/);
preferences.optionListPref2.option = tzData.split(/\r\n?|\n/);

if (system.platform === "windows") {
	dlsData = filesystem.readFile("Resources/DLScodesWin.txt");
} else {
	dlsData = filesystem.readFile("Resources/DLScodesMac.txt");
}
preferences.mainDLSPref.option = dlsData.split(/\r\n?|\n/);
preferences.secyDLSPref.option = dlsData.split(/\r\n?|\n/);

function sizeClock() {
	var scale = Number(preferences.clockSize.value) / 100;

	function sc(img, hOffset, vOffset, hReg, vReg) {
		img.hOffset = Math.round(hOffset * scale);
		img.vOffset = Math.round(vOffset * scale);
		img.width = Math.round(img.srcWidth * scale);
		img.height = Math.round(img.srcHeight * scale);
		if (hReg !== undefined) {
			img.hRegistrationPoint = Math.round(hReg * scale);
		}
		if (vReg !== undefined) {
			img.vRegistrationPoint = Math.round(vReg * scale);
		}
	}

	mainWindow.width = Math.round(windowx * scale);
	mainWindow.height = Math.round(windowy * scale);

	sc(background, backgroundxo, backgroundyo);
	sc(background2, background2xo, background2yo);
	sc(surround, surroundxo, surroundyo);
	sc(switchFaces, switchFacesxo, switchFacesyo);
	sc(startButton, startButtonxo, startButtonyo);
	sc(stopButton, stopButtonxo, stopButtonyo);
	sc(hourHand, hourxo, houryo, hourxr, houryr);
	sc(hourShadow, hourshadowxo + shadowOffset, hourshadowyo + shadowOffset, hourshadowxr, hourshadowyr);
	sc(minuteHand, minxo, minyo, minxr, minyr);
	sc(minuteShadow, minshadowxo + shadowOffset, minshadowyo + shadowOffset, minshadowxr, minshadowyr);
	sc(secondHand, secondxo, secondyo, secondxr, secondyr);
	sc(secondShadow, secondshadowxo + shadowOffset, secondshadowyo + shadowOffset, secondshadowxr, secondshadowyr);

	sc(swSecondHand, swSecondxo, swSecondyo, swSecondxr, swSecondyr);
	sc(swMinuteHand, swMinutexo, swMinuteyo, swMinutexr, swMinuteyr);
	sc(swHourHand, swHourxo, swHouryo, swHourxr, swHouryr);

	sc(smallHourHand, smallhourxo, smallhouryo, smallhourxr, smallhouryr);
	sc(smallMinuteHand, smallminutexo, smallminuteyo, smallminutexr, smallminuteyr);

	sc(bigReflection, bigReflectionxo, bigReflectionyo);
	sc(windowReflection, windowReflectionxo, windowReflectionyo);
	sc(pin, pinxo, pinyo);
	sc(prefs, prefsxo, prefsyo);
	sc(uboatHelp, uboatHelpxo, uboatHelpyo);
	sc(helpButton, helpButtonxo, helpButtonyo);
	sc(tickSwitch, tickSwitchxo, tickSwitchyo);


	dateText.size = Math.round(22 * scale);
	dateText.hOffset = Math.round(datetextxo * scale);
	dateText.vOffset = Math.round(datetextyo * scale);

	secondText.size = Math.round(22 * scale);
	secondText.hOffset = Math.round(secondtextxo * scale);
	secondText.vOffset = Math.round(secondtextyo * scale);
	if (preferences.soundPref.value !== "disabled") {
		//play(thhhh, false);
	}
}

function updateDLS() {
	var dlsRule,
		getRemoteOffset = function (entry) {
			var lookFor = /GMT\ ([+\-])\ (\d\d)\:(\d\d)\ [\s\S]*/,
				found = entry.match(lookFor),
				value;

			if (found !== null) {
				value = 60 * parseInt(found[2], 10) + parseInt(found[3], 10);
				return found[1] === "-"
					? -value
					: value;
			}
			return null;
		};

	remoteGMTOffset1 = getRemoteOffset(preferences.optionListPref1.value);
	remoteGMTOffset2 = getRemoteOffset(preferences.optionListPref2.value);

	dlsRule = preferences.mainDLSPref.value.split(/\s/)[0];
	tzDelta1 = theDLSdelta(dlsRule, remoteGMTOffset1);

	dlsRule = preferences.secyDLSPref.value.split(/\s/)[0];
	tzDelta2 = theDLSdelta(dlsRule, remoteGMTOffset2);
}

function updateTime() {
	var theDate,
		theHour,
		theMinutes,
		theSeconds,
		theMilliseconds,
		useSeconds,
		monthDate,
		theDate2,
		theHour2,
		theMinutes2,
		theSeconds2,
		theMilliseconds2,
		useSeconds2,
		secs,
		mins,
		hours,
		optionListPref1,
		optionListPref2,
		localGMTOffset,
//		remoteGMTOffset,
		tzDelta,
//		dlsRule,

		displayTime = function (h, m, s) {
			var o = "";

			if (h > 0) {
				o += String(h);
				if (h === 1) {
					o += " hour ";
				} else {
					o += " hours ";
				}
			}
			if ((h > 0) || (m > 0)) {
				o += String(m);
				if (m === 1) {
					o += " minute ";
				} else {
					o += " minutes ";
				}
			}
			o += s.toFixed(1) + " seconds";
			return o;
		},

		rotateObject = function (obj, value) {
			var animationDuration,
				animationInterval = 60,

				updateMe = function () {	// called during rotateAnimation
					var now = animator.milliseconds, fraction, angle;

					if (now >= (this.startTime + this.duration)) {
						obj.rotation = this.endAngle;
						obj.busy = false;
						return false;
					}
					fraction = (now - this.startTime) / this.duration;
					angle = animator.ease(this.startAngle, this.endAngle, fraction, animator.kEaseOut);
					obj.rotation = angle;
					return true;
				},

				rotateAnimation = function (startAngle, endAngle) {
					var rotate = new CustomAnimation(animationInterval, updateMe);
					rotate.duration = animationDuration;
					rotate.startAngle = startAngle;
					rotate.endAngle = endAngle;
					animator.start(rotate);
				};

			obj.busy = true;
			animationDuration = animationInterval * Math.floor(900 / animationInterval - 1);
			rotateAnimation(obj.rotation, value);
		};

	theDate = new Date();
	optionListPref1 = preferences.optionListPref1.value;
	if (optionListPref1 !== "System Time") {
		localGMTOffset = theDate.getTimezoneOffset();	// for UK this would be 0, for India it would be -330
		if (!isNaN(remoteGMTOffset1)) {
			tzDelta = localGMTOffset + remoteGMTOffset1;
			tzDelta += tzDelta1;
			theDate.setTime(theDate.getTime() + 60000 * tzDelta);
		}
	}

	theDate2 = new Date();
	optionListPref2 = preferences.optionListPref2.value;
	if (optionListPref2 !== "System Time") {
		localGMTOffset = theDate2.getTimezoneOffset();	 // for UK this would be 0, for India it would be -330
		if (!isNaN(remoteGMTOffset2)) {
			tzDelta = localGMTOffset + remoteGMTOffset2;
			tzDelta += tzDelta2;
			theDate2.setTime(theDate2.getTime() + 60000 * tzDelta);
		}
	}

	theHour = theDate.getHours();
	theMinutes = theDate.getMinutes();
	theSeconds = theDate.getSeconds();
	theMilliseconds = theDate.getMilliseconds();
	useSeconds = Math.round(10 * (theSeconds + (theMilliseconds / 1000))) / 10;
	monthDate = theDate.getDate();

	if ((theMinutes % 15 === 0) && (theSeconds === 0) && (theMilliseconds < 100)) {
		lprint("updating DLS: " + theDate.toString());
		updateDLS();
	}

	theHour2 = theDate2.getHours();
	theMinutes2 = theDate2.getMinutes();
	theSeconds2 = theDate2.getSeconds();
	theMilliseconds2 = theDate2.getMilliseconds();
	useSeconds2 = Math.round(10 * (theSeconds2 + (theMilliseconds2 / 1000))) / 10;

                //print("theHour "+theHour);
        if (preferences.tickSwitchPref.value == "tick" ) {
             timeTicker.interval = 1;
        } else {
             timeTicker.interval = .1;
        }

	secondHand.rotation = (useSeconds * 6) % 360;
	secondShadow.rotation = secondHand.rotation;
	minuteHand.rotation = (theMinutes * 6 + useSeconds / 10) % 360;
	minuteShadow.rotation = minuteHand.rotation;
	hourHand.rotation = (theHour * 30 + theMinutes * 0.5) % 360;
	hourShadow.rotation = hourHand.rotation;

	//added rotation of the miniature hands on the dual face
	smallMinuteHand.rotation = (theMinutes2 * 6 + useSeconds2 / 10) % 360;
	smallHourHand.rotation = (theHour2 * 30 + theMinutes2 * 0.5) % 360;


	dateText.data = String(monthDate);
	if (dateText.data.length < 2) {
		dateText.data = "0" + dateText.data;
	}
	secondText.data = String(parseInt(useSeconds, 10));
	if (secondText.data.length < 2) {
		secondText.data = "0" + secondText.data;
	}

	if (swSecondHand.busy || swMinuteHand.busy || swHourHand.busy) {
		return;
	}

	switch (stopWatchState) {	// state machine to handle stopwatch functions
	case 0: // tracking main dials
		swSecondHand.rotation = (useSeconds2 * 6) % 360;
		swMinuteHand.rotation = (theMinutes2 * 6 + useSeconds2 / 10) % 360;
		swHourHand.rotation = (theHour2 * 30 + theMinutes2 * 0.5) % 360;
		break;
	case 1: // zero stopwatch dials smoothly
		rotateObject(swSecondHand, 0);
		rotateObject(swMinuteHand, 0);
		rotateObject(swHourHand, 0);
		startButton.tooltip = "Press to start a timing run.";
		stopWatchState = 2;
		if (preferences.soundPref.value !== "disabled") {
			play(counter, false);
		}
		break;
	case 2: // waiting for user to click to start a timing run
		break;
	case 3: // start timing run - store the start time
		startTime = theDate.getTime();
		startButton.tooltip = "Press to pause the stopwatch dials. The timing run continues in the background.";
		stopWatchState = 4;
		break;
	case 4: // timing - advancing the stopwatch dials
		elapsedTime = theDate.getTime() - startTime;	// mS
		swSecondHand.rotation = (elapsedTime * 0.006) % 360;
		swMinuteHand.rotation = (elapsedTime * 0.0001) % 360;
		swHourHand.rotation = (elapsedTime * 0.000001667) % 360;
		break;
	case 5: // stopwatch dials paused - display the time from start time to current time
		secs = elapsedTime / 1000;	 // seconds
		mins = Math.floor(secs / 60);
		secs = secs - 60 * mins;
		hours = Math.floor(mins / 60);
		mins = mins - 60 * hours;
		startButton.tooltip = "The elapsed time was " + displayTime(hours, mins, secs) + "." +
				"\n\nPress to exit stopwatch mode. Press the lower button to continue the timing run.";
		stopWatchState = 6;
		break;
	case 6: // waiting for user to click
		break;
	case 7: // move hands smoothly to track main hands again
		rotateObject(swSecondHand, (useSeconds2 * 6 + 5) % 360);
		rotateObject(swMinuteHand, (theMinutes2 * 6 + useSeconds2 / 10) % 360);
		rotateObject(swHourHand, (theHour2 * 30 + theMinutes2 * 0.5) % 360);
		startButton.tooltip = "Press to zero the stopwatch dials.";
		stopWatchState = 0;
		if (preferences.soundPref.value !== "disabled") {
			play(counter, false);
		}
		break;
	case 8: // continue the timing run - unpause the stopwatch dials smoothly
		elapsedTime = theDate.getTime() - startTime;	// mS
		rotateObject(swSecondHand, (elapsedTime * 0.006 + 5) % 360);
		rotateObject(swMinuteHand, (elapsedTime * 0.0001) % 360);
		rotateObject(swHourHand, (elapsedTime * 0.000001667) % 360);
		startButton.tooltip = "Press to pause the stopwatch dials. The timing run continues in the background.";
		if (preferences.soundPref.value !== "disabled") {
			play(counter, false);
		}
		stopWatchState = 4;
		break;
	default:
		if (preferences.soundPref.value !== "disabled") {
			play(mistake, false);
		}
	}
}

startButton.onMouseDown = function (event) {

	if (preferences.clockFaceSwitchPref.value === "standard") {
		preferences.clockFaceSwitchPref.value = "stopwatch";
		showFace();
	}

	if (event.altKey && (stopWatchState === 6)) {
		stopWatchState = 8;
	} else {
		stopWatchState = (stopWatchState + 1) % 8;
	}
	this.opacity = 10;
	updateTime();
	if (preferences.soundPref.value !== "disabled") {
		play(ting, false);
	}
};

startButton.onMouseUp = function () {
	this.opacity = 255;
};

prefs.onMouseDown = function () {
	prefs.src = "Resources/images/prefs02.png";
};


prefs.onMouseUp = function () {
	prefs.src = "Resources/images/prefs01.png";
	if (preferences.soundPref.value !== "disabled") {
		play(winding, false);
	}
	showWidgetPreferences();
};

helpButton.onMouseDown = function () {
	helpButton.opacity = 255;
};

helpButton.onMouseUp = function () {
	helpButton.opacity = 1;
	uboatHelp.visible = true;
	if (preferences.soundPref.value !== "disabled") {
		play(till, false);
	}
};

uboatHelp.onMouseDown = function () {
	uboatHelp.visible = false;
	if (preferences.soundPref.value !== "disabled") {
		play(ting, false);
	}
};

stopButton.onMouseDown = function () {
	if (stopWatchState === 6) {
		if (preferences.clockFaceSwitchPref.value === "standard") {
			preferences.clockFaceSwitchPref.value = "stopwatch";
			showFace();
  		}
		stopWatchState = 8;
		if (preferences.soundPref.value !== "disabled") {
			play(counter, false);
		}
		if (preferences.soundPref.value !== "disabled") {
			play(ting, false);
		}
	} else {
		if (preferences.soundPref.value !== "disabled") {
			play(mistake, false);
		}
	}
	this.opacity = 10;
};

stopButton.onMouseUp = function () {
	this.opacity = 255;
};

startButton.tooltip = "Press to zero the stopwatch dials.";
stopButton.tooltip = "Press to continue the timing run. This button is active only when a timing run has been paused";

//the following function needs to operate on both the background and background2 faces, as the ctrl event can only be caught by the
//onMouseWheel itself on one object the event cannot be referred to by the key click on another object. The function would have to be duplicated
//for the background and background2 objects. Instead I have made the background object opacity to 1 so it seems as if it is not
//visible but it still responds to keyclicks and mousewheel movements even when supposedly 'invisible' - see the showFace function.

background2.onMouseWheel = function (event) {
	var size = Number(preferences.clockSize.value),
		maxLength = Number(preferences.clockSize.maxLength),
		minLength = Number(preferences.clockSize.minLength),
		ticks = Number(preferences.clockSize.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));

	if (event.ctrlKey) {
		if (event.scrollDelta > 0) {
			if (preferences.MouseWheelPref.value === "up") {
				size -= step;
				if (size < minLength) {
					size = minLength;
				}
			} else {
				size += step;
				if (size > maxLength) {
					size = maxLength;
				}
			}
		} else if (event.scrollDelta < 0) {
			if (preferences.MouseWheelPref.value === "up") {
				size += step;
				if (size > maxLength) {
					size = maxLength;
				}
			} else {
				size -= step;
				if (size < minLength) {
					size = minLength;
				}
			}
		}
		preferences.clockSize.value = String(size);
		sizeClock();
	}
};





debugFlg = preferences.debugflgPref.value;
if (debugFlg === "1") {
    preferences.imageEditPref.hidden=false;
    preferences.imageCmdPref.hidden=false;
} else {
    preferences.imageEditPref.hidden=true;		
    preferences.imageCmdPref.hidden=true;
}	
sizeClock();
mainScreen();
updateDLS();
updateTime();
createLicence(mainWindow);
showFace();
setmenu();
settooltip();
checkLockWidget();


